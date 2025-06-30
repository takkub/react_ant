import {checkPayload} from "@/lib/utils";
import axios from "axios";
/**
 * POST - User authentication
 * Endpoint to authenticate user login credentials
 */
export async function POST(req) {
    try {
        const body = await checkPayload('post', req);
        const result = { user: body.username || 'user' };
        const {data} = await axios.post(`${process.env.AUTH_API}/v1/token`, {
            "grant_type": "client_credentials",
            "client_id": "sbt_support",
            "client_secret": "x"
        })
        const params = {
            domain: 'sbt_support',
            user: body.username,
            password: body.password,
        }
        const dataLogin = await axios.post(`${process.env.RBAC_API_URL}/v1/users/login`,{...params},{
            headers: {
                authorization: `Bearer ${data.access_token}`,
                contentType: 'application/json',
            }
        })
        let [record] = dataLogin.data.result || [];
        if (result) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Login successful',
                data: record,
                cookies: data.access_token,
                token: 'username' // Placeholder for actual token
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid credentials'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('❌ Error during login:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
