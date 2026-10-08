#include <stdbool.h>
#include <stdio.h>
#include <string.h>
#include <strings.h>

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
#define NONCE_BYTES 32
#define SIGNATURE_BYTES crypto_sign_BYTES

static const char *TAG = "trailguard_ble";
static const char *NVS_NAMESPACE = "tg_device";
static const char *NVS_DEVICE_ID = "device_id";
static const char *NVS_SECRET_KEY = "ed25519_sk";
static const char *NVS_PUBLIC_KEY = "ed25519_pk";

static uint8_t secret_key[crypto_sign_SECRETKEYBYTES];
static uint8_t public_key[crypto_sign_PUBLICKEYBYTES];
static char device_id[37];
static char info_json[INFO_MAX_BYTES];
static char command_response[COMMAND_MAX_BYTES];
static size_t command_response_length;
static int64_t pairing_window_deadline_us;
static uint16_t connection_handle = BLE_HS_CONN_HANDLE_NONE;
static uint16_t command_value_handle;
static uint16_t status_value_handle;
static bool advertising;
static bool ble_synced;
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

    char canonical[COMMAND_MAX_BYTES];
    const int canonical_length = snprintf(
        canonical, sizeof(canonical),
        "{\"challengeId\":\"%s\",\"deviceId\":\"%s\",\"userId\":\"%s\","
        "\"nonce\":\"%s\",\"expiresAt\":\"%s\"}",
        challenge_value, device_id, user_value, nonce_value, expiry_value);
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
        sodium_memzero(canonical, sizeof(canonical));
        cJSON_Delete(root);
        return BLE_ATT_ERR_UNLIKELY;
    }

    char signature_encoded[88];
    if (sodium_bin2base64(signature_encoded, sizeof(signature_encoded), signature,
                          sizeof(signature),
                          sodium_base64_VARIANT_URLSAFE_NO_PADDING) == NULL) {
        sodium_memzero(signature, sizeof(signature));
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
    sodium_memzero(canonical, sizeof(canonical));
    cJSON_Delete(root);
    if (response_length <= 0 || (size_t)response_length >= sizeof(command_response)) {
        return BLE_ATT_ERR_UNLIKELY;
    }
    command_response_length = (size_t)response_length;
    return 0;
}

static int gatt_access(uint16_t conn_handle, uint16_t attr_handle,
                       struct ble_gatt_access_ctxt *context, void *argument)
{
    (void)conn_handle;
    (void)attr_handle;
    const uintptr_t characteristic = (uintptr_t)argument;

    if (context->op == BLE_GATT_ACCESS_OP_READ_CHR) {
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

    return BLE_ATT_ERR_UNLIKELY;
}

static const struct ble_gatt_chr_def characteristics[] = {
    {
        .uuid = &telemetry_uuid.u,
        .access_cb = gatt_access,
        .arg = (void *)0,
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
        } else {
            start_advertising();
        }
        return 0;
    case BLE_GAP_EVENT_DISCONNECT:
        connection_handle = BLE_HS_CONN_HANDLE_NONE;
        if (pairing_window_open()) {
            start_advertising();
        }
        return 0;
    case BLE_GAP_EVENT_ADV_COMPLETE:
        advertising = false;
        return 0;
    default:
        return 0;
    }
}

static void start_advertising(void)
{
    if (!ble_synced || advertising || connection_handle != BLE_HS_CONN_HANDLE_NONE ||
        !pairing_window_open()) {
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
        if (!pairing_window_open() && advertising) {
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
    ESP_ERROR_CHECK(nvs_flash_init());
    ESP_ERROR_CHECK(load_or_create_identity());
    ESP_ERROR_CHECK(build_device_info());

    ESP_ERROR_CHECK(nimble_port_init());
    ESP_ERROR_CHECK(ble_att_set_preferred_mtu(COMMAND_MAX_BYTES + 3));
    ble_hs_cfg.sync_cb = on_sync;
    ble_hs_cfg.sm_sc = 1;
    ble_hs_cfg.sm_bonding = 1;
    ble_hs_cfg.sm_mitm = 1;
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
    ESP_LOGI(TAG, "Device identity ready; press pairing button to advertise");
}
