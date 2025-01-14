export async function sha512(str) {
    // 编码
    const encodeContent = new TextEncoder().encode(str);
    // 使用 crypto，生成 SHA-512 哈希值 Promise<ArrayBuffer>
    const sha256Content = await crypto.subtle.digest(
        { name: 'SHA-512' },
        encodeContent
    );
    // 将 ArrayBuffer 转换为 Uint8Array
    const result = new Uint8Array(sha256Content);
    // 将 Uint8Array 转换为 Hex 字符串
    const hexString = Array.from(result)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return hexString;
}

export async function checkToken(token){
    if (!token || token.length < 1){
        return false;
    }
    const expectedToken = await sha512(token);
    const user_info = kv_users.get(expectedToken);
    console.log("user_info", user_info);
    return user_info;
}