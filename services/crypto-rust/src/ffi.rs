use crate::packet::TelemetryFrame;
use crate::verifier::verify_canonical_request;
use std::ffi::{CStr, CString};
use std::os::raw::c_char;

/// C-ABI: Verifies a canonical SWAAS Ed25519 request signature.
/// Returns 1 on success, 0 on invalid signature, -1 on invalid arguments / error.
#[no_mangle]
pub extern "C" fn trailguard_verify_canonical_signature(
    public_key_ptr: *const c_char,
    method_ptr: *const c_char,
    path_ptr: *const c_char,
    device_id_ptr: *const c_char,
    timestamp_ptr: *const c_char,
    nonce_ptr: *const c_char,
    body_hash_ptr: *const c_char,
    signature_ptr: *const c_char,
) -> i32 {
    if public_key_ptr.is_null()
        || method_ptr.is_null()
        || path_ptr.is_null()
        || device_id_ptr.is_null()
        || timestamp_ptr.is_null()
        || nonce_ptr.is_null()
        || body_hash_ptr.is_null()
        || signature_ptr.is_null()
    {
        return -1;
    }

    unsafe {
        let pk_str = match CStr::from_ptr(public_key_ptr).to_str() {
            Ok(s) => s,
            Err(_) => return -1,
        };
        let method = match CStr::from_ptr(method_ptr).to_str() {
            Ok(s) => s,
            Err(_) => return -1,
        };
        let path = match CStr::from_ptr(path_ptr).to_str() {
            Ok(s) => s,
            Err(_) => return -1,
        };
        let device_id = match CStr::from_ptr(device_id_ptr).to_str() {
            Ok(s) => s,
            Err(_) => return -1,
        };
        let timestamp = match CStr::from_ptr(timestamp_ptr).to_str() {
            Ok(s) => s,
            Err(_) => return -1,
        };
        let nonce = match CStr::from_ptr(nonce_ptr).to_str() {
            Ok(s) => s,
            Err(_) => return -1,
        };
        let body_hash = match CStr::from_ptr(body_hash_ptr).to_str() {
            Ok(s) => s,
            Err(_) => return -1,
        };
        let sig_str = match CStr::from_ptr(signature_ptr).to_str() {
            Ok(s) => s,
            Err(_) => return -1,
        };

        match verify_canonical_request(
            pk_str.as_bytes(),
            method,
            path,
            device_id,
            timestamp,
            nonce,
            body_hash,
            sig_str.as_bytes(),
        ) {
            Ok(true) => 1,
            _ => 0,
        }
    }
}

/// C-ABI: Unpacks a 56-byte compact binary telemetry packet and returns allocated JSON C-string.
/// On failure returns null pointer. The caller must free with `trailguard_free_string`.
#[no_mangle]
pub extern "C" fn trailguard_unpack_telemetry_packet(
    buffer_ptr: *const u8,
    buffer_len: usize,
) -> *mut c_char {
    if buffer_ptr.is_null() || buffer_len < 56 {
        return std::ptr::null_mut();
    }

    let slice = unsafe { std::slice::from_raw_parts(buffer_ptr, buffer_len) };
    match TelemetryFrame::unpack(slice) {
        Ok(frame) => match frame.to_json() {
            Ok(json) => match CString::new(json) {
                Ok(c_str) => c_str.into_raw(),
                Err(_) => std::ptr::null_mut(),
            },
            Err(_) => std::ptr::null_mut(),
        },
        Err(_) => std::ptr::null_mut(),
    }
}

/// C-ABI: Frees a string allocated by `trailguard_unpack_telemetry_packet`.
#[no_mangle]
pub extern "C" fn trailguard_free_string(ptr: *mut c_char) {
    if !ptr.is_null() {
        unsafe {
            let _ = CString::from_raw(ptr);
        }
    }
}
