import { sha512, checkToken, decrypt, encrypt, getFormattedDate, importKey, parseKVValue } from "../../../utils";

// Get 请求
export async function onRequestGet(context) {
    const auth_header = context.request.headers.get('Authorization')
    const token = auth_header !== null ? auth_header.replace(/^Bearer\s/, '') : null;
    const user_info = await checkToken(token);
    if (!user_info) {
        return new Response('Unauthorized', { status: 403 });
    }

    const expectedToken = await sha512(token);
    let encrypt_key = await importKey(token);
    const config_id = context.params.id;

    let config_value = await kv_configs.get(`${expectedToken}_${config_id}`, "json");
    config_value = parseKVValue(config_value);
    if (!config_value) {
        return new Response('Config not found', { status: 404 });
    }

    config_value.content = await decrypt(encrypt_key, config_value.content);

    return new Response(JSON.stringify(config_value), {
        headers: {
            'content-type': 'application/json',
        },
    });
}


// Patch 请求
export async function onRequestPatch(context) {
    const auth_header = context.request.headers.get('Authorization')
    const token = auth_header !== null ? auth_header.replace(/^Bearer\s/, '') : null;
    const user_info = await checkToken(token);
    if (!user_info) {
        return new Response('Unauthorized', { status: 403 });
    }

    const expectedToken = await sha512(token);
    let encrypt_key = await importKey(token);
    const config_id = context.params.id;

    let config_value = await kv_configs.get(`${expectedToken}_${config_id}`, "json");
    config_value = parseKVValue(config_value);
    if (!config_value) {
        return new Response('Config not found', { status: 404 });
    }
    let req_json = await context.request.json();
    config_value.last_used_with_version = req_json.last_used_with_version;
    config_value.content = await encrypt(encrypt_key, req_json.content);
    config_value.modified_at = new Date().toISOString();
    await kv_configs.put(`${expectedToken}_${config_id}`, JSON.stringify(config_value));
    config_value.content = await decrypt(encrypt_key, config_value.content);
    return new Response(JSON.stringify(config_value), {
        status: 200,
        headers: {
            'content-type': 'application/json'
        },
    });
}

// Delete 请求
export async function onRequestDelete(context) {
    const auth_header = context.request.headers.get('Authorization')
    const token = auth_header !== null ? auth_header.replace(/^Bearer\s/, '') : null;
    const user_info = await checkToken(token);
    if (!user_info) {
        return new Response('Unauthorized', { status: 403 });
    }

    await kv_configs.delete(`${await sha512(token)}_${context.params.id}`);

    return new Response(null, {
        status: 204,
        headers: {
            'content-type': 'application/json'
        },
    });
}

