#include <stdbool.h>
#include <stdio.h>
#include <string.h>
#include <strings.h>
#include <time.h>

#include "cJSON.h"
#include "esp_check.h"
#include "esp_flash_encrypt.h"
#include "esp_log.h"
#include "esp_secure_boot.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "host/ble_gap.h"
#include "host/ble_gatt.h"
#include "host/ble_hs.h"
#include "host/ble_uuid.h"
#include "host/ble_att.h"
#include "nimble/nimble_port.h"
#include "nimble/nimble_port_freertos.h"
#include "services/gap/ble_svc_gap.h"
#include "services/gatt/ble_svc_gatt.h"
#include "nvs.h"
#include "nvs_flash.h"
#include "sodium.h"

#define PAIRING_WINDOW_US ((int64_t)CONFIG_TRAILGUARD_PAIRING_WINDOW_SECONDS * 1000000)
#define COMMAND_MAX_BYTES 512
#define INFO_MAX_BYTES 256
#define AUTH_MAX_BYTES 512
#define TELEMETRY_MAX_BYTES 512
#define TELEMETRY_INTERVAL_MS 5000
#define TELEMETRY_LEASE_MAX_SECONDS (15 * 60)
#define NONCE_BYTES 32
#define SIGNATURE_BYTES crypto_sign_BYTES

static const char *TAG = "trailguard_ble";
static const char *NVS_NAMESPACE = "tg_device";
static const char *NVS_DEVICE_ID = "device_id";
static const char *NVS_SECRET_KEY = "ed25519_sk";
static const char *NVS_PUBLIC_KEY = "ed25519_pk";
static const char *NVS_OWNER_ID = "owner_id";

static uint8_t secret_key[crypto_sign_SECRETKEYBYTES];
static uint8_t public_key[crypto_sign_PUBLICKEYBYTES];
static char device_id[37];
static char info_json[INFO_MAX_BYTES];
static char command_response[COMMAND_MAX_BYTES];
static size_t command_response_length;
static char owner_user_id[25];
static char boot_id[37];
static char session_challenge_id[37];
static char session_nonce[44];
static char pending_pair_challenge_id[37];
static char pending_pair_nonce[44];
static int64_t telemetry_lease_deadline_us;
static int64_t telemetry_time_anchor_us;
static uint64_t telemetry_time_anchor_unix_ms;
static uint32_t telemetry_sequence;
static int64_t pairing_window_deadline_us;
static uint16_t connection_handle = BLE_HS_CONN_HANDLE_NONE;
static uint16_t command_value_handle;
static uint16_t status_value_handle;
static uint16_t telemetry_value_handle;
static uint16_t authorization_value_handle;
static bool advertising;
static bool ble_synced;
static bool device_paired;
static bool link_encrypted;
static bool telemetry_subscribed;
static bool session_receipt_consumed;
static uint8_t own_address_type;

static const ble_uuid128_t service_uuid =
    BLE_UUID128_INIT(0x01, 0x00, 0x6a, 0x3f, 0x1d, 0x8c, 0xe2, 0xa5,
                     0x90, 0x4d, 0x1c, 0x7b, 0x01, 0x00, 0x2a, 0x6f);
static const ble_uuid128_t telemetry_uuid =
    BLE_UUID128_INIT(0x01, 0x00, 0x6a, 0x3f, 0x1d, 0x8c, 0xe2, 0xa5,
                     0x90, 0x4d, 0x1c, 0x7b, 0x02, 0x00, 0x2a, 0x6f);
static const ble_uuid128_t command_uuid =
    BLE_UUID128_INIT(0x01, 0x00, 0x6a, 0x3f, 0x1d, 0x8c, 0xe2, 0xa5,
                     0x90, 0x4d, 0x1c, 0x7b, 0x03, 0x00, 0x2a, 0x6f);
static const ble_uuid128_t status_uuid =
    BLE_UUID128_INIT(0x01, 0x00, 0x6a, 0x3f, 0x1d, 0x8c, 0xe2, 0xa5,
                     0x90, 0x4d, 0x1c, 0x7b, 0x04, 0x00, 0x2a, 0x6f);
static const ble_uuid128_t battery_uuid =
    BLE_UUID128_INIT(0x01, 0x00, 0x6a, 0x3f, 0x1d, 0x8c, 0xe2, 0xa5,
                     0x90, 0x4d, 0x1c, 0x7b, 0x05, 0x00, 0x2a, 0x6f);
static const ble_uuid128_t info_uuid =
    BLE_UUID128_INIT(0x01, 0x00, 0x6a, 0x3f, 0x1d, 0x8c, 0xe2, 0xa5,
                     0x90, 0x4d, 0x1c, 0x7b, 0x06, 0x00, 0x2a, 0x6f);
static const ble_uuid128_t authorization_uuid =
    BLE_UUID128_INIT(0x01, 0x00, 0x6a, 0x3f, 0x1d, 0x8c, 0xe2, 0xa5,
                     0x90, 0x4d, 0x1c, 0x7b, 0x07, 0x00, 0x2a, 0x6f);

static bool pairing_window_open(void)
{
    return pairing_window_deadline_us > esp_timer_get_time();
}

static bool is_hex_string(const char *value, size_t expected_length)
{
    if (value == NULL || strlen(value) != expected_length) {
        return false;
    }
    for (size_t i = 0; i < expected_length; i++) {
        const char c = value[i];
        if (!((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') ||
              (c >= 'A' && c <= 'F'))) {
            return false;
        }
    }
    return true;
}

static bool is_uuid_string(const char *value)
{
    if (value == NULL || strlen(value) != 36) {
        return false;
    }
    for (size_t i = 0; i < 36; i++) {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
            if (value[i] != '-') {
                return false;
            }
        } else if (!((value[i] >= '0' && value[i] <= '9') ||
                     (value[i] >= 'a' && value[i] <= 'f') ||
                     (value[i] >= 'A' && value[i] <= 'F'))) {
            return false;
        }
    }
    return true;
}

static void get_canonical_device_id(char output[37])
{
    for (size_t i = 0; i < sizeof(device_id); i++) {
        const char value = device_id[i];
        output[i] = value >= 'a' && value <= 'z'
                        ? (char)(value - ('a' - 'A'))
                        : value;
    }
}

static bool is_base64url_string(const char *value, size_t expected_length)
{
    if (value == NULL || strlen(value) != expected_length) {
        return false;
    }
    for (size_t i = 0; i < expected_length; i++) {
        const char c = value[i];
        if (!((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') ||
              (c >= '0' && c <= '9') || c == '_' || c == '-')) {
            return false;
        }
    }
    return true;
}

static void uuid_from_random_bytes(uint8_t bytes[16])
{
    randombytes_buf(bytes, 16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
}

static void format_uuid(const uint8_t bytes[16], char output[37])
{
    snprintf(output, 37,
             "%02x%02x%02x%02x-%02x%02x-%02x%02x-%02x%02x-%02x%02x%02x%02x%02x%02x",
             bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5],
             bytes[6], bytes[7], bytes[8], bytes[9], bytes[10], bytes[11],
             bytes[12], bytes[13], bytes[14], bytes[15]);
}

static esp_err_t make_public_key_pem(char *output, size_t output_size)
{
    static const uint8_t der_prefix[] = {
        0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
    };
    uint8_t der[sizeof(der_prefix) + crypto_sign_PUBLICKEYBYTES];
    char encoded[64];
    size_t encoded_length = 0;
    memcpy(der, der_prefix, sizeof(der_prefix));
    memcpy(der + sizeof(der_prefix), public_key, crypto_sign_PUBLICKEYBYTES);
    if (sodium_bin2base64(encoded, sizeof(encoded), der, sizeof(der),
                          sodium_base64_VARIANT_ORIGINAL) == NULL) {
        return ESP_FAIL;
    }
    encoded_length = strlen(encoded);
    if (encoded_length + sizeof("-----BEGIN PUBLIC KEY-----\n\n-----END PUBLIC KEY-----\n") >
        output_size) {
        return ESP_ERR_INVALID_SIZE;
    }
    snprintf(output, output_size, "-----BEGIN PUBLIC KEY-----\n%.*s\n-----END PUBLIC KEY-----\n",
             (int)encoded_length, encoded);
    sodium_memzero(der, sizeof(der));
    sodium_memzero(encoded, sizeof(encoded));
    return ESP_OK;
}

static esp_err_t load_or_create_identity(void)
{
    nvs_handle_t handle;
    esp_err_t error = nvs_open(NVS_NAMESPACE, NVS_READWRITE, &handle);
    if (error != ESP_OK) {
        return error;
    }

    size_t id_length = sizeof(device_id);
    size_t public_length = sizeof(public_key);
    size_t secret_length = sizeof(secret_key);
    const esp_err_t id_error = nvs_get_str(handle, NVS_DEVICE_ID, device_id, &id_length);
    const esp_err_t public_error =
        nvs_get_blob(handle, NVS_PUBLIC_KEY, public_key, &public_length);
    const esp_err_t secret_error =
        nvs_get_blob(handle, NVS_SECRET_KEY, secret_key, &secret_length);

    if (id_error == ESP_ERR_NVS_NOT_FOUND &&
        public_error == ESP_ERR_NVS_NOT_FOUND &&
        secret_error == ESP_ERR_NVS_NOT_FOUND) {
        uint8_t id_bytes[16];
        uuid_from_random_bytes(id_bytes);
        format_uuid(id_bytes, device_id);
        sodium_memzero(id_bytes, sizeof(id_bytes));

        if (crypto_sign_keypair(public_key, secret_key) != 0) {
            nvs_close(handle);
            return ESP_FAIL;
        }
        ESP_GOTO_ON_ERROR(nvs_set_str(handle, NVS_DEVICE_ID, device_id), fail, TAG,
                          "store device identity");
        ESP_GOTO_ON_ERROR(nvs_set_blob(handle, NVS_PUBLIC_KEY, public_key,
                                       sizeof(public_key)),
                          fail, TAG, "store public key");
        ESP_GOTO_ON_ERROR(nvs_set_blob(handle, NVS_SECRET_KEY, secret_key,
                                       sizeof(secret_key)),
                          fail, TAG, "store private key");
        ESP_GOTO_ON_ERROR(nvs_commit(handle), fail, TAG, "commit device identity");
    } else if (id_error != ESP_OK || public_error != ESP_OK || secret_error != ESP_OK ||
               id_length != sizeof(device_id) ||
               public_length != sizeof(public_key) ||
               secret_length != sizeof(secret_key)) {
        nvs_close(handle);
        return ESP_ERR_INVALID_STATE;
    } else {
        uint8_t derived_public_key[crypto_sign_PUBLICKEYBYTES];
        if (!is_uuid_string(device_id) ||
            crypto_sign_ed25519_sk_to_pk(derived_public_key, secret_key) != 0 ||
            sodium_memcmp(derived_public_key, public_key, sizeof(public_key)) != 0) {
            sodium_memzero(derived_public_key, sizeof(derived_public_key));
            nvs_close(handle);
            sodium_memzero(secret_key, sizeof(secret_key));
            return ESP_ERR_INVALID_STATE;
        }
        sodium_memzero(derived_public_key, sizeof(derived_public_key));
    }

    size_t owner_length = sizeof(owner_user_id);
    const esp_err_t owner_error =
        nvs_get_str(handle, NVS_OWNER_ID, owner_user_id, &owner_length);
    if (owner_error == ESP_OK) {
        if (owner_length != sizeof(owner_user_id) ||
            !is_hex_string(owner_user_id, 24)) {
            nvs_close(handle);
            memset(owner_user_id, 0, sizeof(owner_user_id));
            return ESP_ERR_INVALID_STATE;
        }
        device_paired = true;
    } else if (owner_error != ESP_ERR_NVS_NOT_FOUND) {
        nvs_close(handle);
        return owner_error;
    }

    nvs_close(handle);
    return ESP_OK;

fail:
    nvs_close(handle);
    sodium_memzero(secret_key, sizeof(secret_key));
    return error;
}

static esp_err_t build_device_info(void)
{
    char public_key_pem[160];
    ESP_RETURN_ON_ERROR(make_public_key_pem(public_key_pem, sizeof(public_key_pem)),
                        TAG, "encode device public key");
    const int written = snprintf(
        info_json, sizeof(info_json),
        "{\"deviceId\":\"%s\",\"publicKeyPem\":\"%s\",\"protocolVersion\":1}",
        device_id, public_key_pem);
    sodium_memzero(public_key_pem, sizeof(public_key_pem));
    return (written > 0 && (size_t)written < sizeof(info_json)) ? ESP_OK
                                                                : ESP_ERR_INVALID_SIZE;
}

static int sign_pairing_challenge(const uint8_t *data, size_t length)
{
    if (!pairing_window_open() || length == 0 || length > COMMAND_MAX_BYTES) {
        return BLE_ATT_ERR_UNLIKELY;
    }
    cJSON *root = cJSON_ParseWithLength((const char *)data, length);
    if (root == NULL) {
        return BLE_ATT_ERR_UNLIKELY;
    }

    const cJSON *challenge_id = cJSON_GetObjectItemCaseSensitive(root, "challengeId");
    const cJSON *incoming_device_id = cJSON_GetObjectItemCaseSensitive(root, "deviceId");
    const cJSON *user_id = cJSON_GetObjectItemCaseSensitive(root, "userId");
    const cJSON *nonce = cJSON_GetObjectItemCaseSensitive(root, "nonce");
    const cJSON *expires_at = cJSON_GetObjectItemCaseSensitive(root, "expiresAt");
    const char *challenge_value = cJSON_IsString(challenge_id) ? challenge_id->valuestring : NULL;
    const char *device_value =
        cJSON_IsString(incoming_device_id) ? incoming_device_id->valuestring : NULL;
    const char *user_value = cJSON_IsString(user_id) ? user_id->valuestring : NULL;
    const char *nonce_value = cJSON_IsString(nonce) ? nonce->valuestring : NULL;
    const char *expiry_value =
        cJSON_IsString(expires_at) ? expires_at->valuestring : NULL;

    if (!is_uuid_string(challenge_value) ||
        device_value == NULL || strcasecmp(device_value, device_id) != 0 ||
        !is_hex_string(user_value, 24) ||
        !is_base64url_string(nonce_value, 43) ||
        expiry_value == NULL || strlen(expiry_value) != 24 ||
        expiry_value[4] != '-' || expiry_value[7] != '-' ||
        expiry_value[10] != 'T' || expiry_value[13] != ':' ||
        expiry_value[16] != ':' || expiry_value[19] != '.' ||
        expiry_value[23] != 'Z') {
        cJSON_Delete(root);
        return BLE_ATT_ERR_UNLIKELY;
    }

    strlcpy(pending_pair_challenge_id, challenge_value,
            sizeof(pending_pair_challenge_id));
    strlcpy(pending_pair_nonce, nonce_value, sizeof(pending_pair_nonce));
    char canonical_device[37];
    get_canonical_device_id(canonical_device);
    char canonical[COMMAND_MAX_BYTES];
    const int canonical_length = snprintf(
        canonical, sizeof(canonical),
        "{\"challengeId\":\"%s\",\"deviceId\":\"%s\",\"userId\":\"%s\","
        "\"nonce\":\"%s\",\"expiresAt\":\"%s\"}",
        challenge_value, canonical_device, user_value, nonce_value, expiry_value);
    if (canonical_length <= 0 || (size_t)canonical_length >= sizeof(canonical)) {
        cJSON_Delete(root);
        return BLE_ATT_ERR_UNLIKELY;
    }

    uint8_t decoded_nonce[NONCE_BYTES];
    size_t decoded_nonce_length = 0;
    if (sodium_base642bin(decoded_nonce, sizeof(decoded_nonce), nonce_value,
                          strlen(nonce_value), NULL, &decoded_nonce_length, NULL,
                          sodium_base64_VARIANT_URLSAFE_NO_PADDING) != 0 ||
        decoded_nonce_length != sizeof(decoded_nonce)) {
        sodium_memzero(canonical_device, sizeof(canonical_device));
        sodium_memzero(canonical, sizeof(canonical));
        cJSON_Delete(root);
        return BLE_ATT_ERR_UNLIKELY;
    }
    sodium_memzero(decoded_nonce, sizeof(decoded_nonce));

    uint8_t signature[SIGNATURE_BYTES];
    unsigned long long signature_length = 0;
    if (crypto_sign_detached(signature, &signature_length,
                             (const unsigned char *)canonical,
                             (unsigned long long)canonical_length,
                             secret_key) != 0 ||
        signature_length != SIGNATURE_BYTES) {
        sodium_memzero(canonical_device, sizeof(canonical_device));
        sodium_memzero(canonical, sizeof(canonical));
        cJSON_Delete(root);
        return BLE_ATT_ERR_UNLIKELY;
    }

    char signature_encoded[88];
    if (sodium_bin2base64(signature_encoded, sizeof(signature_encoded), signature,
                          sizeof(signature),
                          sodium_base64_VARIANT_URLSAFE_NO_PADDING) == NULL) {
        sodium_memzero(signature, sizeof(signature));
        sodium_memzero(canonical_device, sizeof(canonical_device));
        sodium_memzero(canonical, sizeof(canonical));
        cJSON_Delete(root);
        return BLE_ATT_ERR_UNLIKELY;
    }
    const int response_length = snprintf(
        command_response, sizeof(command_response),
        "{\"nonce\":\"%s\",\"signature\":\"%s\"}", nonce_value,
        signature_encoded);
    sodium_memzero(signature, sizeof(signature));
    sodium_memzero(signature_encoded, sizeof(signature_encoded));
    sodium_memzero(canonical_device, sizeof(canonical_device));
    sodium_memzero(canonical, sizeof(canonical));
    cJSON_Delete(root);
    if (response_length <= 0 || (size_t)response_length >= sizeof(command_response)) {
        return BLE_ATT_ERR_UNLIKELY;
    }
    command_response_length = (size_t)response_length;
    return 0;
}

static bool make_connection_challenge(void)
{
    uint8_t nonce[NONCE_BYTES];
    uint8_t challenge_bytes[16];
    randombytes_buf(nonce, sizeof(nonce));
    uuid_from_random_bytes(challenge_bytes);
    format_uuid(challenge_bytes, session_challenge_id);
    sodium_memzero(challenge_bytes, sizeof(challenge_bytes));
    if (sodium_bin2base64(session_nonce, sizeof(session_nonce), nonce,
                          sizeof(nonce),
                          sodium_base64_VARIANT_URLSAFE_NO_PADDING) == NULL) {
        sodium_memzero(nonce, sizeof(nonce));
        return false;
    }
    sodium_memzero(nonce, sizeof(nonce));
    return true;
}

static bool authority_public_key_available(void)
{
    uint8_t authority_public_key[crypto_sign_PUBLICKEYBYTES];
    size_t authority_length = 0;
    const char *configured_authority =
        CONFIG_TRAILGUARD_AUTHORITY_PUBLIC_KEY_B64URL;
    const bool available =
        configured_authority[0] != '\0' &&
        sodium_base642bin(authority_public_key, sizeof(authority_public_key),
                          configured_authority, strlen(configured_authority),
                          NULL, &authority_length, NULL,
                          sodium_base64_VARIANT_URLSAFE_NO_PADDING) == 0 &&
        authority_length == sizeof(authority_public_key);
    sodium_memzero(authority_public_key, sizeof(authority_public_key));
    return available;
}

static bool verify_authorization_receipt(const uint8_t *data, size_t length)
{
    if (!link_encrypted || connection_handle == BLE_HS_CONN_HANDLE_NONE ||
        data == NULL || length == 0 || length > AUTH_MAX_BYTES) {
        return false;
    }
    cJSON *root = cJSON_ParseWithLength((const char *)data, length);
    if (root == NULL || !cJSON_IsObject(root) || cJSON_GetArraySize(root) != 9) {
        cJSON_Delete(root);
        return false;
    }

    const cJSON *version = cJSON_GetObjectItemCaseSensitive(root, "receiptVersion");
    const cJSON *scope = cJSON_GetObjectItemCaseSensitive(root, "scope");
    const cJSON *receipt_device =
        cJSON_GetObjectItemCaseSensitive(root, "deviceId");
    const cJSON *receipt_user = cJSON_GetObjectItemCaseSensitive(root, "userId");
    const cJSON *challenge =
        cJSON_GetObjectItemCaseSensitive(root, "challengeId");
    const cJSON *nonce = cJSON_GetObjectItemCaseSensitive(root, "nonce");
    const cJSON *issued_at =
        cJSON_GetObjectItemCaseSensitive(root, "issuedAtUnixMs");
    const cJSON *lease =
        cJSON_GetObjectItemCaseSensitive(root, "leaseSeconds");
    const cJSON *signature =
        cJSON_GetObjectItemCaseSensitive(root, "signature");
    const char *scope_value = cJSON_IsString(scope) ? scope->valuestring : NULL;
    const char *device_value =
        cJSON_IsString(receipt_device) ? receipt_device->valuestring : NULL;
    const char *user_value = cJSON_IsString(receipt_user)
                                 ? receipt_user->valuestring
                                 : NULL;
    const char *challenge_value =
        cJSON_IsString(challenge) ? challenge->valuestring : NULL;
    const char *nonce_value = cJSON_IsString(nonce) ? nonce->valuestring : NULL;
    const char *signature_value =
        cJSON_IsString(signature) ? signature->valuestring : NULL;
    if (!cJSON_IsNumber(version) || version->valueint != 1 ||
        (strcmp(scope_value == NULL ? "" : scope_value, "PAIR") != 0 &&
         strcmp(scope_value == NULL ? "" : scope_value, "TELEMETRY") != 0) ||
        device_value == NULL || strcasecmp(device_value, device_id) != 0 ||
        !is_hex_string(user_value, 24) || !is_uuid_string(challenge_value) ||
        !is_base64url_string(nonce_value, 43) ||
        !cJSON_IsNumber(issued_at) || issued_at->valuedouble < 1 ||
        issued_at->valuedouble > 9007199254740991.0 ||
        !cJSON_IsNumber(lease) || lease->valueint < 0 ||
        lease->valueint > TELEMETRY_LEASE_MAX_SECONDS ||
        !is_base64url_string(signature_value, 86)) {
        cJSON_Delete(root);
        return false;
    }

    const bool is_pair_receipt = strcmp(scope_value, "PAIR") == 0;
    const bool challenge_matches =
        is_pair_receipt
            ? (strcmp(challenge_value, pending_pair_challenge_id) == 0 &&
               strcmp(nonce_value, pending_pair_nonce) == 0 &&
               lease->valueint == 0)
            : (device_paired && !session_receipt_consumed &&
               strcmp(user_value, owner_user_id) == 0 &&
               strcmp(challenge_value, session_challenge_id) == 0 &&
               strcmp(nonce_value, session_nonce) == 0 &&
               lease->valueint > 0);
    if (!challenge_matches) {
        cJSON_Delete(root);
        return false;
    }

    char canonical_device[37];
    get_canonical_device_id(canonical_device);
    char canonical[AUTH_MAX_BYTES];
    const int canonical_length = snprintf(
        canonical, sizeof(canonical),
        "{\"receiptVersion\":1,\"scope\":\"%s\",\"deviceId\":\"%s\","
        "\"userId\":\"%s\",\"challengeId\":\"%s\",\"nonce\":\"%s\","
        "\"issuedAtUnixMs\":%.0f,\"leaseSeconds\":%d}",
        scope_value, canonical_device, user_value, challenge_value, nonce_value,
        issued_at->valuedouble, lease->valueint);
    uint8_t authority_public_key[crypto_sign_PUBLICKEYBYTES];
    size_t authority_length = 0;
    uint8_t decoded_signature[SIGNATURE_BYTES];
    size_t signature_length = 0;
    const char *configured_authority =
        CONFIG_TRAILGUARD_AUTHORITY_PUBLIC_KEY_B64URL;
    const bool authority_decoded =
        sodium_base642bin(authority_public_key, sizeof(authority_public_key),
                          configured_authority, strlen(configured_authority),
                          NULL, &authority_length, NULL,
                          sodium_base64_VARIANT_URLSAFE_NO_PADDING) == 0 &&
        authority_length == sizeof(authority_public_key);
    const bool signature_decoded =
        sodium_base642bin(decoded_signature, sizeof(decoded_signature),
                          signature_value, strlen(signature_value), NULL,
                          &signature_length, NULL,
                          sodium_base64_VARIANT_URLSAFE_NO_PADDING) == 0 &&
        signature_length == sizeof(decoded_signature);
    const bool valid =
        canonical_length > 0 && (size_t)canonical_length < sizeof(canonical) &&
        authority_decoded && signature_decoded &&
        crypto_sign_verify_detached(
            decoded_signature, (const unsigned char *)canonical,
            (unsigned long long)canonical_length, authority_public_key) == 0;
    sodium_memzero(authority_public_key, sizeof(authority_public_key));
    sodium_memzero(decoded_signature, sizeof(decoded_signature));
    sodium_memzero(canonical_device, sizeof(canonical_device));
    sodium_memzero(canonical, sizeof(canonical));
    if (!valid) {
        cJSON_Delete(root);
        return false;
    }

    if (is_pair_receipt) {
        nvs_handle_t handle;
        esp_err_t error = nvs_open(NVS_NAMESPACE, NVS_READWRITE, &handle);
        if (error == ESP_OK) {
            error = nvs_set_str(handle, NVS_OWNER_ID, user_value);
            if (error == ESP_OK) {
                error = nvs_commit(handle);
            }
            nvs_close(handle);
        }
        if (error != ESP_OK) {
            cJSON_Delete(root);
            return false;
        }
        strlcpy(owner_user_id, user_value, sizeof(owner_user_id));
        device_paired = true;
        memset(pending_pair_challenge_id, 0, sizeof(pending_pair_challenge_id));
        memset(pending_pair_nonce, 0, sizeof(pending_pair_nonce));
    } else {
        telemetry_time_anchor_unix_ms = (uint64_t)issued_at->valuedouble;
        telemetry_time_anchor_us = esp_timer_get_time();
        telemetry_lease_deadline_us =
            telemetry_time_anchor_us + (int64_t)lease->valueint * 1000000;
        telemetry_sequence = 0;
        session_receipt_consumed = true;
    }
    cJSON_Delete(root);
    return true;
}

static int append_authorization_challenge(struct os_mbuf *output)
{
    if (!link_encrypted || !device_paired || session_receipt_consumed ||
        connection_handle == BLE_HS_CONN_HANDLE_NONE ||
        !make_connection_challenge()) {
        return BLE_ATT_ERR_READ_NOT_PERMITTED;
    }
    char challenge[160];
    const int length = snprintf(challenge, sizeof(challenge),
                                "{\"deviceId\":\"%s\",\"challengeId\":\"%s\","
                                "\"nonce\":\"%s\"}",
                                device_id, session_challenge_id, session_nonce);
    if (length <= 0 || (size_t)length >= sizeof(challenge)) {
        return BLE_ATT_ERR_UNLIKELY;
    }
    return os_mbuf_append(output, challenge, (uint16_t)length) == 0
               ? 0
               : BLE_ATT_ERR_INSUFFICIENT_RES;
}

static bool build_telemetry_frame(char output[TELEMETRY_MAX_BYTES],
                                  size_t *output_length)
{
    const int64_t now_us = esp_timer_get_time();
    if (!device_paired || !link_encrypted || !telemetry_subscribed ||
        connection_handle == BLE_HS_CONN_HANDLE_NONE ||
        now_us >= telemetry_lease_deadline_us ||
        telemetry_time_anchor_us <= 0 ||
        telemetry_sequence == UINT32_MAX) {
        return false;
    }
    const uint64_t timestamp_ms =
        telemetry_time_anchor_unix_ms +
        (uint64_t)((now_us - telemetry_time_anchor_us) / 1000);
    const time_t timestamp_seconds = (time_t)(timestamp_ms / 1000);
    struct tm utc_time;
    if (gmtime_r(&timestamp_seconds, &utc_time) == NULL) {
        return false;
    }
    char timestamp[25];
    if (strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%S", &utc_time) != 19) {
        return false;
    }
    char exact_timestamp[25];
    snprintf(exact_timestamp, sizeof(exact_timestamp), "%s.%03uZ", timestamp,
             (unsigned)(timestamp_ms % 1000));

    cJSON *root = cJSON_CreateObject();
    cJSON *payload = cJSON_CreateObject();
    cJSON *sensor_health = cJSON_CreateObject();
    if (root == NULL || payload == NULL || sensor_health == NULL) {
        cJSON_Delete(root);
        cJSON_Delete(payload);
        cJSON_Delete(sensor_health);
        return false;
    }
    cJSON_AddNumberToObject(root, "schemaVersion", 1);
    cJSON_AddStringToObject(root, "messageType", "telemetry");
    cJSON_AddStringToObject(root, "deviceId", device_id);
    cJSON_AddStringToObject(root, "bootId", boot_id);
    cJSON_AddNumberToObject(root, "sequence", telemetry_sequence);
    cJSON_AddStringToObject(root, "timestamp", exact_timestamp);
    cJSON_AddNullToObject(payload, "heartRateBpm");
    cJSON_AddNullToObject(payload, "spo2Percent");
    cJSON_AddNullToObject(payload, "temperatureC");
    cJSON_AddNullToObject(payload, "batteryPercent");
    cJSON_AddNullToObject(payload, "charging");
    cJSON_AddStringToObject(sensor_health, "heartRate", "not_integrated");
    cJSON_AddStringToObject(sensor_health, "spo2", "not_integrated");
    cJSON_AddStringToObject(sensor_health, "temperature", "not_integrated");
    cJSON_AddItemToObject(payload, "sensorHealth", sensor_health);
    cJSON_AddStringToObject(payload, "riskEngineStatus", "not_integrated");
    cJSON_AddItemToObject(root, "payload", payload);
    char *serialized = cJSON_PrintUnformatted(root);
    cJSON_Delete(root);
    if (serialized == NULL) {
        return false;
    }
    const size_t serialized_length = strlen(serialized);
    const bool fits = serialized_length <= TELEMETRY_MAX_BYTES;
    if (fits) {
        memcpy(output, serialized, serialized_length + 1);
        *output_length = serialized_length;
        telemetry_sequence += 1;
    }
    cJSON_free(serialized);
    return fits;
}

static void telemetry_task(void *argument)
{
    (void)argument;
    while (true) {
        char frame[TELEMETRY_MAX_BYTES + 1];
        size_t frame_length = 0;
        if (build_telemetry_frame(frame, &frame_length)) {
            struct os_mbuf *notification =
                ble_hs_mbuf_from_flat(frame, (uint16_t)frame_length);
            if (notification != NULL) {
                const int result = ble_gatts_notify_custom(
                    connection_handle, telemetry_value_handle, notification);
                if (result != 0) {
                    ESP_LOGW(TAG, "Telemetry notification send failed: %d", result);
                }
            }
            sodium_memzero(frame, sizeof(frame));
        }
        vTaskDelay(pdMS_TO_TICKS(TELEMETRY_INTERVAL_MS));
    }
}

static int gatt_access(uint16_t conn_handle, uint16_t attr_handle,
                       struct ble_gatt_access_ctxt *context, void *argument)
{
    (void)attr_handle;
    const uintptr_t characteristic = (uintptr_t)argument;
    if (conn_handle != connection_handle || !link_encrypted) {
        return BLE_ATT_ERR_INSUFFICIENT_AUTHEN;
    }

    if (context->op == BLE_GATT_ACCESS_OP_READ_CHR) {
        if (characteristic == 7) {
            return append_authorization_challenge(context->om);
        }
        const char *value = NULL;
        size_t value_length = 0;
        switch (characteristic) {
        case 1:
            if (!pairing_window_open()) {
                return BLE_ATT_ERR_READ_NOT_PERMITTED;
            }
            value = info_json;
            value_length = strlen(info_json);
            break;
        case 2:
            value = "{\"deviceState\":\"KEY_READY\",\"firmwareVersion\":\"0.1.0\","
                    "\"sensorHealth\":\"not_integrated\","
                    "\"riskEngineStatus\":\"not_integrated\"}";
            value_length = strlen(value);
            break;
        case 3:
            value = command_response;
            value_length = command_response_length;
            break;
        case 4:
            value = "{\"batteryPercent\":null,\"charging\":null,"
                    "\"batteryHealth\":\"not_integrated\"}";
            value_length = strlen(value);
            break;
        default:
            return BLE_ATT_ERR_READ_NOT_PERMITTED;
        }
        return os_mbuf_append(context->om, value, value_length) == 0
                   ? 0
                   : BLE_ATT_ERR_INSUFFICIENT_RES;
    }

    if (context->op == BLE_GATT_ACCESS_OP_WRITE_CHR && characteristic == 3) {
        if (!pairing_window_open()) {
            return BLE_ATT_ERR_WRITE_NOT_PERMITTED;
        }
        uint8_t buffer[COMMAND_MAX_BYTES];
        uint16_t length = OS_MBUF_PKTLEN(context->om);
        if (length == 0 || length > sizeof(buffer) ||
            os_mbuf_copydata(context->om, 0, length, buffer) != 0) {
            return BLE_ATT_ERR_INVALID_ATTR_VALUE_LEN;
        }
        const int result = sign_pairing_challenge(buffer, length);
        sodium_memzero(buffer, sizeof(buffer));
        return result;
    }

    if (context->op == BLE_GATT_ACCESS_OP_WRITE_CHR && characteristic == 7) {
        uint8_t buffer[AUTH_MAX_BYTES];
        const uint16_t length = OS_MBUF_PKTLEN(context->om);
        if (length == 0 || length > sizeof(buffer) ||
            os_mbuf_copydata(context->om, 0, length, buffer) != 0) {
            return BLE_ATT_ERR_INVALID_ATTR_VALUE_LEN;
        }
        const bool valid = verify_authorization_receipt(buffer, length);
        sodium_memzero(buffer, sizeof(buffer));
        return valid ? 0 : BLE_ATT_ERR_INSUFFICIENT_AUTHEN;
    }

    return BLE_ATT_ERR_UNLIKELY;
}

static const struct ble_gatt_chr_def characteristics[] = {
    {
        .uuid = &telemetry_uuid.u,
        .access_cb = gatt_access,
        .arg = (void *)0,
        .val_handle = &telemetry_value_handle,
        .flags = BLE_GATT_CHR_F_NOTIFY,
    },
    {
        .uuid = &command_uuid.u,
        .access_cb = gatt_access,
        .arg = (void *)3,
        .val_handle = &command_value_handle,
        .flags = BLE_GATT_CHR_F_READ | BLE_GATT_CHR_F_WRITE,
    },
    {
        .uuid = &status_uuid.u,
        .access_cb = gatt_access,
        .arg = (void *)2,
        .val_handle = &status_value_handle,
        .flags = BLE_GATT_CHR_F_READ | BLE_GATT_CHR_F_NOTIFY,
    },
    {
        .uuid = &battery_uuid.u,
        .access_cb = gatt_access,
        .arg = (void *)4,
        .flags = BLE_GATT_CHR_F_READ,
    },
    {
        .uuid = &info_uuid.u,
        .access_cb = gatt_access,
        .arg = (void *)1,
        .flags = BLE_GATT_CHR_F_READ,
    },
    {
        .uuid = &authorization_uuid.u,
        .access_cb = gatt_access,
        .arg = (void *)7,
        .val_handle = &authorization_value_handle,
        .flags = BLE_GATT_CHR_F_READ_ENC | BLE_GATT_CHR_F_WRITE_ENC,
    },
    {0},
};

static const struct ble_gatt_svc_def services[] = {
    {
        .type = BLE_GATT_SVC_TYPE_PRIMARY,
        .uuid = &service_uuid.u,
        .characteristics = characteristics,
    },
    {0},
};

static void start_advertising(void);

static int gap_event(struct ble_gap_event *event, void *argument)
{
    (void)argument;
    switch (event->type) {
    case BLE_GAP_EVENT_CONNECT:
        if (event->connect.status == 0) {
            connection_handle = event->connect.conn_handle;
            advertising = false;
            link_encrypted = false;
            telemetry_subscribed = false;
            session_receipt_consumed = false;
            telemetry_lease_deadline_us = 0;
            telemetry_time_anchor_us = 0;
            if (!make_connection_challenge()) {
                ESP_LOGE(TAG, "Failed to create connection authorization challenge");
                ble_gap_terminate(connection_handle, BLE_ERR_REM_USER_CONN_TERM);
                return 0;
            }
            const int security_result =
                ble_gap_security_initiate(connection_handle);
            if (security_result != 0) {
                ESP_LOGE(TAG, "Failed to start BLE link security: %d",
                         security_result);
                ble_gap_terminate(connection_handle, BLE_ERR_REM_USER_CONN_TERM);
            }
        } else {
            start_advertising();
        }
        return 0;
    case BLE_GAP_EVENT_DISCONNECT:
        connection_handle = BLE_HS_CONN_HANDLE_NONE;
        link_encrypted = false;
        telemetry_subscribed = false;
        session_receipt_consumed = false;
        telemetry_lease_deadline_us = 0;
        telemetry_time_anchor_us = 0;
        memset(session_challenge_id, 0, sizeof(session_challenge_id));
        sodium_memzero(session_nonce, sizeof(session_nonce));
        if (pairing_window_open() || device_paired) {
            start_advertising();
        }
        return 0;
    case BLE_GAP_EVENT_ADV_COMPLETE:
        advertising = false;
        return 0;
    case BLE_GAP_EVENT_ENC_CHANGE: {
        struct ble_gap_conn_desc descriptor;
        if (event->enc_change.status == 0 &&
            ble_gap_conn_find(event->enc_change.conn_handle, &descriptor) == 0) {
            link_encrypted = descriptor.sec_state.encrypted;
        } else {
            link_encrypted = false;
            ble_gap_terminate(event->enc_change.conn_handle, BLE_ERR_AUTH_FAIL);
        }
        return 0;
    }
    case BLE_GAP_EVENT_SUBSCRIBE:
        if (event->subscribe.attr_handle == telemetry_value_handle) {
            telemetry_subscribed = event->subscribe.cur_notify;
        }
        return 0;
    default:
        return 0;
    }
}

static void start_advertising(void)
{
    if (!ble_synced || advertising || connection_handle != BLE_HS_CONN_HANDLE_NONE ||
        (!pairing_window_open() && !device_paired)) {
        return;
    }

    struct ble_hs_adv_fields fields;
    memset(&fields, 0, sizeof(fields));
    fields.flags = BLE_HS_ADV_F_DISC_GEN | BLE_HS_ADV_F_BREDR_UNSUP;
    fields.name = (const uint8_t *)"TG";
    fields.name_len = strlen("TG");
    fields.name_is_complete = 0;
    fields.uuids128 = (ble_uuid128_t *)&service_uuid;
    fields.num_uuids128 = 1;
    fields.uuids128_is_complete = 1;
    if (ble_gap_adv_set_fields(&fields) != 0) {
        ESP_LOGE(TAG, "Failed to configure pairing advertisement");
        return;
    }

    struct ble_gap_adv_params parameters;
    memset(&parameters, 0, sizeof(parameters));
    parameters.conn_mode = BLE_GAP_CONN_MODE_UND;
    parameters.disc_mode = BLE_GAP_DISC_MODE_GEN;
    if (ble_gap_adv_start(own_address_type, NULL, BLE_HS_FOREVER,
                          &parameters, gap_event, NULL) == 0) {
        advertising = true;
    }
}

static void on_sync(void)
{
    if (ble_hs_id_infer_auto(0, &own_address_type) != 0) {
        ESP_LOGE(TAG, "Failed to infer BLE address type");
        return;
    }
    ble_synced = true;
    start_advertising();
}

static void ble_host_task(void *argument)
{
    (void)argument;
    nimble_port_run();
    nimble_port_freertos_deinit();
}

static void pairing_button_task(void *argument)
{
    (void)argument;
    bool was_pressed = false;
    while (true) {
        const bool pressed = gpio_get_level(CONFIG_TRAILGUARD_PAIRING_BUTTON_GPIO) == 0;
        if (pressed && !was_pressed) {
            pairing_window_deadline_us =
                esp_timer_get_time() + PAIRING_WINDOW_US;
            ESP_LOGI(TAG, "Physical pairing window opened");
            start_advertising();
            if (status_value_handle != 0) {
                ble_gatts_chr_updated(status_value_handle);
            }
        }
        was_pressed = pressed;
        if (!pairing_window_open() && !device_paired && advertising) {
            ble_gap_adv_stop();
            advertising = false;
        }
        vTaskDelay(pdMS_TO_TICKS(40));
    }
}

void app_main(void)
{
#if CONFIG_TRAILGUARD_PAIRING_BUTTON_GPIO < 0
    ESP_LOGE(TAG, "Configure the physical pairing button GPIO before building");
    return;
#endif
    ESP_ERROR_CHECK(gpio_set_direction(CONFIG_TRAILGUARD_PAIRING_BUTTON_GPIO,
                                       GPIO_MODE_INPUT));
    ESP_ERROR_CHECK(gpio_set_pull_mode(CONFIG_TRAILGUARD_PAIRING_BUTTON_GPIO,
                                       GPIO_PULLUP_ONLY));

    if (!esp_flash_encryption_enabled() || !esp_secure_boot_enabled()) {
        ESP_LOGE(TAG, "Refusing to store device keys without flash encryption and secure boot");
        return;
    }
    if (sodium_init() < 0) {
        ESP_LOGE(TAG, "libsodium initialization failed");
        return;
    }
    if (!authority_public_key_available()) {
        ESP_LOGE(TAG, "Configure the backend authorization public key before building");
        return;
    }
    uint8_t boot_bytes[16];
    uuid_from_random_bytes(boot_bytes);
    format_uuid(boot_bytes, boot_id);
    sodium_memzero(boot_bytes, sizeof(boot_bytes));
    ESP_ERROR_CHECK(nvs_flash_init());
    ESP_ERROR_CHECK(load_or_create_identity());
    ESP_ERROR_CHECK(build_device_info());

    ESP_ERROR_CHECK(nimble_port_init());
    ESP_ERROR_CHECK(ble_att_set_preferred_mtu(COMMAND_MAX_BYTES + 3));
    ble_hs_cfg.sync_cb = on_sync;
    ble_hs_cfg.sm_sc = 1;
    ble_hs_cfg.sm_bonding = 1;
    ble_hs_cfg.sm_mitm = 0;
    ble_hs_cfg.sm_io_cap = BLE_SM_IO_CAP_NO_IO;
    ESP_ERROR_CHECK(ble_svc_gap_init());
    ESP_ERROR_CHECK(ble_svc_gatt_init());
    ESP_ERROR_CHECK(ble_gatts_count_cfg(services));
    ESP_ERROR_CHECK(ble_gatts_add_svcs(services));

    nimble_port_freertos_init(ble_host_task);
    if (xTaskCreate(pairing_button_task, "pairing_button", 3072, NULL, 5, NULL) != pdPASS) {
        ESP_LOGE(TAG, "Failed to start pairing-button task");
        return;
    }
    if (xTaskCreate(telemetry_task, "telemetry", 4096, NULL, 4, NULL) != pdPASS) {
        ESP_LOGE(TAG, "Failed to start telemetry task");
        return;
    }
    ESP_LOGI(TAG, "Device identity ready; press pairing button to advertise");
}
