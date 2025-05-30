import CryptoJS from "crypto-js";
const secretKey = process.env.SECRET_KEY || "1234567890123456"; // 16, 24 หรือ 32 ตัว

export const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const checkPayload = async (method, req) => {
    let body;
    if (method !== 'get') {
        body = await req.json();
    } else {
        const url = new URL(req.url);
        const params = url.searchParams;
        body = Object.fromEntries(params.entries());
    }
    return body;
}
