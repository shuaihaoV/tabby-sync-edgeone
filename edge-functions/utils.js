export async function sha512(str) {
    // 编码
    const encodeContent = new TextEncoder().encode(str);
    // 使用 crypto，生成 SHA-512 哈希值 Promise<ArrayBuffer>
    const sha256Content = await crypto.subtle.digest(
        { name: 'SHA-512' },
        encodeContent
    );
    const result = new Uint8Array(sha256Content);
    const hexString = Array.from(result)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return hexString;
}

export async function checkToken(token) {
    if (!token || token.length !== 64 ) {
        return false;
    }
    const expectedToken = await sha512(token);
    let user_info = await kv_users.get(expectedToken, "json");
    return user_info;
}

export async function generateKey() {
    let keyPair = await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );
    const exportedKey = await crypto.subtle.exportKey('raw', keyPair);
    const keyHex = Array.from(new Uint8Array(exportedKey))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return keyHex;
}

export async function generateToken() {
    const MAX_RETRIES = 5; // 最大重试次数
    let retries = 0;
    let token;

    do {
        token = await generateKey();
        retries++;
    } while (retries < MAX_RETRIES && await checkToken(token));

    if (retries === MAX_RETRIES) {
        token = "";
    }
    return token;
}

export async function importKey(keyHex) {
    // Convert hex string back to raw binary format
    const rawKey = new Uint8Array(
        keyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );
    
    // Import the key for encryption and decryption purposes
    return await crypto.subtle.importKey(
        'raw',
        rawKey,
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function encrypt(key, plaintext) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        data
    );
    const encryptedDataHex = Array.from(new Uint8Array(encryptedData))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    const ivHex = Array.from(new Uint8Array(iv))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return `${ivHex}.${encryptedDataHex}`;
}

export async function decrypt(key, ciphertext) {
    const [ivHex, encryptedDataHex] = ciphertext.split('.');
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const encryptedData = new Uint8Array(encryptedDataHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encryptedData
    );
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}

export function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 补齐两位数字
    const day = date.getDate().toString().padStart(2, '0'); // 补齐两位数字

    return `${year}-${month}-${day}`;
}


// 错误响应函数
export function errorResponse(detail, status = 500) {
    return new Response(JSON.stringify({ detail, status }), { 
        status,
        headers: {
            'content-type': 'application/json'
        }
    });
}