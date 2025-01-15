import { checkToken, decrypt, encrypt, getFormattedDate, importKey } from "../../../utils";

// Get 请求
export async function onRequestGet(context) {
    const token = context.request.headers.get('Authorization').replace(/^Bearer\s/, '');
    const user_info = await checkToken(token);

    // 检查授权令牌是否有效
    if (!user_info) {
        return new Response('Unauthorized', { status: 403 });
    }
    let encrypt_key = await importKey(token);
    // 通过 list 遍历所有数据
    let keys_list = [];
    let list_result;
    let list_options = {
        prefix: `${user_info.token_hash}:`,
        limit: 255
    };
    do {
        list_result = await kv_configs.list(list_options);
        if (list_result.keys === undefined) {
            break;
        }
        keys_list.push(...list_result.keys);
        list_options.cursor = list_result.cursor;
    } while (list_result.complete !== true);

    let configs = [];
    for (const item of keys_list) {
        let config_value = await kv_configs.get(item.key,"json");
        console.log("config_value: ", config_value);
        config_value.content = await decrypt(encrypt_key, config_value.content);
        configs.push(config_value);
    }
    return new Response(JSON.stringify(configs), {
        headers: {
            'content-type': 'application/json'
        },
    });
}

// Post 请求
export async function onRequestPost(context) {
    const token = context.request.headers.get('Authorization').replace(/^Bearer\s/, '');
    const user_info = await checkToken(token);

    // 检查授权令牌是否有效
    if (!user_info) {
        return new Response('Unauthorized', { status: 403 });
    }
    let encrypt_key = await importKey(token);

    // 解析请求体
    let req_json = await context.request.json();
    let name = req_json.name;
    if (req_json.name.length < 1) {
        name = "Unnamed config (" + getFormattedDate() + ")";
    }
    const enc_content = await encrypt(encrypt_key,"{}");
    const config = JSON.stringify({
        id: user_info.max_id + 1,
        name,
        content: enc_content,
        last_used_with_version: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 1
    });
    console.log("config: ", config);
    await kv_configs.put(`${user_info.token_hash}:${user_info.max_id + 1}`, config);
    console.log("iuser");
    await kv_users.put(user_info.token_hash, {
        username: user_info.username,
        active_config_id: user_info.max_id + 1,
        max_id: user_info.max_id + 1
    });
    return new Response(config, {
        headers: {
            'content-type': 'application/json'
        },
    });
}