import { decrypt } from "@/lib/utils";
import axios from "axios";

export async function POST(req) {
    try {
        const decode = await req.json();
        const dataBody = JSON.parse(decrypt(decode));
        const { url, method = "GET", headers = {}, body } = dataBody;
        const response = await axios({
            url,
            method,
            data: method === "GET" ? undefined : body,
            headers,
        });
        return new Response(JSON.stringify(response.data), { status: response.status });
        
    } catch (error) {
        const status = error.response?.status || 500;
        
        return new Response(JSON.stringify({ error: error.response?.data || "Something went wrong" }),{ status });
    }
}
