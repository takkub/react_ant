import {getData,insertData,deleteData,updateData} from "@/lib/mysqldb";
const checkPayload = async (method, req) => {
    let body;
    if (method !== 'get') {
        body = await req.json();
    } else {
        const url = new URL(req.url);
        const params = url.searchParams
        body = Object.fromEntries(params.entries());
    }
    return body
}

/**
 * GET - Retrieve user data
 * Endpoint to fetch all user data
 */
export const GET = async (req) => {
    try {
        // Parse request parameters
        const params = await checkPayload('get', req);
        const {data} = await getData('users',params);
        if (data) {
            return new Response(JSON.stringify({
                success: true,
                data: data,
                total: data.length,
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'No user data found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error fetching user data:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * POST - Create new user data
 * Endpoint to create a new user record
 */
export const POST = async (req) => {
    try {
        // Parse request body
        const params = await checkPayload('post', req);
        const data = await insertData('users',params)
        console.log(data)
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'User created successfully',
                data: {...params, id: data.id}
            }), { status: 201 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: data.message || 'Failed to create user'
            }), { status: 400 });
        }
    } catch (error) {
        console.error('❌ Error creating user:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * PUT - Update existing user data
 * Endpoint to update a user record by ID
 */
export const PUT = async (req) => {
    try {
        // Parse request body
        const {body,where} = await checkPayload('put', req);
        const data = await updateData('users', body, where);
        console.log(data)
        // Update user (implementation needed)
        const result = updateData; // Placeholder for actual implementation
        
        if (result) {
            return new Response(JSON.stringify({
                success: true,
                message: 'User updated successfully',
                data: result
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error updating user:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * DELETE - Remove user data
 * Endpoint to delete a user record by ID
 */
export const DELETE = async (req) => {
    try {
        const params = await checkPayload('delete', req);
        const data = await deleteData('users',params)
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'User deleted successfully',
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}
