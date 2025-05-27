import {getData, insertData, deleteData, updateData} from "@/lib/mysqldb";
import {checkPayload} from "@/lib/utils";

/**
 * GET - Retrieve product_catalog data
 * Endpoint to fetch all product_catalog data
 */
export const GET = async (req) => {
    try {
        // Parse request parameters
        const params = await checkPayload('get', req);
        const {data} = await getData(params.table);
        if (data) {
            return new Response(JSON.stringify({
                success: true,
                data: data,
                total: data.length,
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'No product_catalog data found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error fetching product_catalog data:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * POST - Create new product_catalog data
 * Endpoint to create a new product_catalog record
 */
export const POST = async (req) => {
    try {
        // Parse request body
        const params = await checkPayload('post', req);
        const data = await insertData(params.table, params.body)
        console.log(data);
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Product Catalog created successfully',
                data: {...params.body, id: data.id}
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
 * PUT - Update existing product_catalog data
 * Endpoint to update a product_catalog record by ID
 */
export const PUT = async (req) => {
    try {
        // Parse request body
        const {body, where,table} = await checkPayload('put', req);
        console.log(body, where);
        const data = await updateData(table, body, where);
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
 * DELETE - Remove product_catalog data
 * Endpoint to delete a product_catalog record by ID
 */
export const DELETE = async (req) => {
    try {
        const {id,table} = await checkPayload('delete', req);
        const data = await deleteData(table, {id: id});
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