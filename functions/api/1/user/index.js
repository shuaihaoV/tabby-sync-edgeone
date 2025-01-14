import { sha512 } from "../../../utils";


// Get 请求
export async function onRequestGet(context) {
    const token = context.request.headers.get('Authorization');
    const expectedToken = await sha512(token);
  
    // 检查授权令牌是否有效
    if (!token || token !== expectedToken) {
      return new Response('Unauthorized', { status: 403 });
    }
  
    const json = JSON.stringify({
        "code": 0,
        "message": "Get User"
    });
    return new Response(json, {
        headers: {
            'content-type': 'text/html; charset=UTF-8',
            'x-edgefunctions-test': 'Welcome to use Pages Functions.',
        },
    });
}

// Post 请求
export async function onRequestPost(context) {
    const json = JSON.stringify({
        "code": 0,
        "message": "Post User"
    });
    return new Response(json, {
        headers: {
            'content-type': 'text/html; charset=UTF-8',
            'x-edgefunctions-test': 'Welcome to use Pages Functions.',
        },
    });
}

// Delete 请求
export async function onRequestDelete(context) {
    const json = JSON.stringify({
        "code": 0,
        "message": "Delete User"
    });
    return new Response(json, {
        headers: {
            'content-type': 'text/html; charset=UTF-8',
            'x-edgefunctions-test': 'Welcome to use Pages Functions.',
        },
    });
}

// Patch 请求
export async function onRequestPatch(context) {
    const json = JSON.stringify({
        "code": 0,
        "message": "Patch User"
    });
    return new Response(json, {
        headers: {
            'content-type': 'text/html; charset=UTF-8',
            'x-edgefunctions-test': 'Welcome to use Pages Functions.',
        },
    });
}

