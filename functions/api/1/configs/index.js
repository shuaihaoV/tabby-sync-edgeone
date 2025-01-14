
// Get 请求
export async function onRequestGet(context) {
    const json = JSON.stringify({
        "code": 0,
        "message": "Get configs"
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
        "message": "Post configs"
    });
    return new Response(json, {
        headers: {
            'content-type': 'text/html; charset=UTF-8',
            'x-edgefunctions-test': 'Welcome to use Pages Functions.',
        },
    });
}

