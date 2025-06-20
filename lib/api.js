import axios from "axios";
import {encrypt} from "@/lib/utils";

// Base URL for all API requests. This can be overridden via environment
// variable so that the front‑end can communicate with any back‑end host.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
});
// 🔸 ฟังก์ชันกลาง
const request = async (method, path, data = {}, headers = {}) => {
    try {
        let fullUrl = `${API_BASE_URL}/api/${path}`;
        let requestBody = {};
        if (method.toUpperCase() === "GET") {
            const queryString = new URLSearchParams(data).toString();
            fullUrl += `?${queryString}`;
        } else {
            requestBody = data;
        }
        const bodyToEncrypt = {
            url: fullUrl,
            method: method.toUpperCase(),
            ...(method.toUpperCase() === "GET" ? {} : { body: requestBody })
        };
        const encryptedBody = encrypt(JSON.stringify(bodyToEncrypt));
        const response = await api.post("", encryptedBody, { headers });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 🔸 ฟังก์ชันใช้งาน
const apiService = {
    get: (path, params = {}, headers = {}) => request("GET", path, params, headers),
    post: (path, body = {}, headers = {}) => request("POST", path, body, headers),
    put: (path, body = {}, headers = {}) => request("PUT", path, body, headers),
    delete: (path, params = {}, headers = {}) => request("DELETE", path, params, headers)
};

export default apiService;
