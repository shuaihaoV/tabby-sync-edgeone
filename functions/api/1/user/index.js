import { checkToken, generateToken, sha512 } from "../../../utils";

// Get 请求
export async function onRequestGet(context) {
    const token = context.request.headers.get('Authorization').replace(/^Bearer\s/, '');
    const user_info = await checkToken(token);

    // 检查授权令牌是否有效
    if (!user_info) {
        return new Response('Unauthorized', { status: 403 });
    }

    const res_json = JSON.stringify({
        id: 1,
        username: user_info.username,
        active_config_id: user_info.active_config_id,
        custom_connection_gateway: null,
        custom_connection_gateway_token: null,
        config_sync_token: token,
        is_pro: true,
        is_sponsor: false,
        github_username: user_info.username,
    });
    return new Response(res_json, {
        headers: {
            'content-type': 'application/json'
        },
    });
}

// Post 请求
export async function onRequestPost(context) {
    const isSignupDisabled = String(context.env.DISABLE_SIGNUP || 'false').toLowerCase() === 'true';
    if (isSignupDisabled) {
        return new Response('Signup is disabled', { status: 403 });
    }

    let req_json;
    try {
        req_json = await context.request.json();
    } catch (e) {
        console.error("Failed to parse request JSON:", e);
        return new Response('Invalid JSON format', { status: 400 });
    }
    const username = req_json.username;
    if (!username && username.length < 1) {
        return new Response('Invalid username', { status: 400 });
    }
    let token = await generateToken();
    if (token.length < 1) {
        return new Response('INTERNAL SERVER ERROR : Generate Token Error', { status: 500 });
    }
    const expectedToken = await sha512(token);
    await kv_users.put(expectedToken, {
        username: username,
        active_config_id: null,
        max_id: 0
    });

    const res_json = JSON.stringify({
        id: 1,
        username: username,
        active_config_id: null,
        custom_connection_gateway: null,
        custom_connection_gateway_token: null,
        config_sync_token: token,
        is_pro: true,
        is_sponsor: false,
        github_username: username,
    });
    return new Response(res_json, {
        status: 201,
        headers: {
            'content-type': 'application/json'
        },
    });
}

// Delete 请求
export async function onRequestDelete(context) {
    const token = context.request.headers.get('Authorization').replace(/^Bearer\s/, '');
    const user_info = await checkToken(token);

    // 检查授权令牌是否有效
    if (!user_info) {
        return new Response('Unauthorized', { status: 403 });
    }
    await kv_users.delete(user_info.token_hash);

    // 通过 list 遍历所有数据,并删除
    let keys_list = [];
    let list_options = {
        prefix: `${user_info.token_hash}:`,
        limit: 255
    };
    do {
        const list_result = await kv_configs.list(list_options);
        keys_list.push(...list_result.keys);
        list_options.cursor = list_result.cursor;
    } while (list_result.complete !== true);
    for (const key_name of keys_list.keys) {
        await kv_configs.delete(key_name);
    }
    return new Response(null, { status: 204 });
}

// Patch 请求
export async function onRequestPatch(context) {
    const token = context.request.headers.get('Authorization').replace(/^Bearer\s/, '');
    const user_info = await checkToken(token);

    // 检查授权令牌是否有效
    if (!user_info) {
        return new Response('Unauthorized', { status: 403 });
    }

    let new_token = await generateToken();
    if (new_token.length < 1) {
        return new Response('INTERNAL SERVER ERROR : Generate Token Error', { status: 500 });
    }
    const expectedToken = await sha512(token);
    const expectedNewToken = await sha512(new_token);
    await kv_users.put(expectedNewToken, user_info);    // 添加新数据
    await kv_users.delete(expectedToken);       // 移除旧数据
    const res_json = JSON.stringify({
        id: 1,
        username: user_info.username,
        active_config_id: user_info.active_config_id,
        custom_connection_gateway: null,
        custom_connection_gateway_token: null,
        config_sync_token: new_token,
        is_pro: true,
        is_sponsor: false,
        github_username: user_info.username,
    });

    return new Response(res_json, {
        status: 201,
        headers: {
            'content-type': 'application/json'
        },
    });
}

