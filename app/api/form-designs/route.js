import {getData, insertData, deleteData, updateData} from "@/lib/mysqldb";

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
 * GET - Retrieve form_designs data
 * Endpoint to fetch all form_designs data
 */
export const GET = async (req) => {
    try {
        // Parse request parameters
        const params = await checkPayload('get', req);
        const {data} = await getData('form_designs', params);
        if (data) {
            return new Response(JSON.stringify({
                success: true,
                data: data,
                total: data.length,
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'No form_designs data found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error fetching form_designs data:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * POST - Create new form_designs data
 * Endpoint to create a new form_designs record
 */
export const POST = async (req) => {
    try {
        // Parse request body
        const params = await checkPayload('post', req);
        const data = await insertData('form_designs', params)
        console.log(data)
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Product Catalog created successfully',
                data: {...params, id: data.id}
            }), { status: 201 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: data.message || 'Failed to create Product Catalog'
            }), { status: 400 });
        }
    } catch (error) {
        console.error('❌ Error creating Product Catalog:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * PUT - Update existing form_designs data
 * Endpoint to update a form_designs record by ID
 */
export const PUT = async (req) => {
    try {
        // Parse request body
        const {body, where} = await checkPayload('put', req);
        const data = await updateData('form_designs', body, where);
        console.log(data)
        
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Product Catalog updated successfully',
                data: body
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'Product Catalog not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error updating Product Catalog:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * DELETE - Remove form_designs data
 * Endpoint to delete a form_designs record by ID
 */
export const DELETE = async (req) => {
    try {
        const params = await checkPayload('delete', req);
        const data = await deleteData('form_designs', params)
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Product Catalog deleted successfully',
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'Product Catalog not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error deleting Product Catalog:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}