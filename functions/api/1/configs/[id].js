
// Get 请求
export async function onRequestGet(context) {
    const json = JSON.stringify({
        "code": 0,
        "message": `Get Config id is ${context.params.id}`
    });
    return new Response(json, {
        headers: {
            'content-type': 'application/json',
            'x-edgefunctions-test': 'Welcome to use Pages Functions.',
        },
    });
}


// Patch 请求
export async function onRequestPatch(context) {
    const token = context.request.headers.get('Authorization');
    const expectedToken = await sha512(token);

    // 检查授权令牌是否有效
    if (!token || token !== expectedToken) {
        return new Response('Unauthorized', { status: 403 });
    }

    const json = JSON.stringify({
        "code": 0,
        "message": `Patch Config id is ${context.params.id}`
    });
    return new Response(json, {
        headers: {
            'content-type': 'application/json'
        },
    });
}

// Delete 请求
export async function onRequestDelete(context) {
    const token = context.request.headers.get('Authorization');
    const expectedToken = await sha512(token);

    // 检查授权令牌是否有效
    if (!token || token !== expectedToken) {
        return new Response('Unauthorized', { status: 403 });
    }

    const json = JSON.stringify({
        "code": 0,
        "message": `Delete Config id is ${context.params.id}`
    });
    return new Response(json, {
        headers: {
            'content-type': 'application/json'
        },
    });
}

