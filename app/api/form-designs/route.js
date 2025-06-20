import { getData, insertData, deleteData, updateData } from "@/lib/mysqldb";

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
        const params = await checkPayload("get", req);
        const { data } = await getData("form_designs", params);

        if (data) {
            const parsed = data.map((item) => ({
                ...item,
                fields: item.fields_data ? JSON.parse(item.fields_data) : [],
                settings: item.settings_data ? JSON.parse(item.settings_data) : {},
                crud_options: item.crud_options_data
                    ? JSON.parse(item.crud_options_data)
                    : {},
            }));

            return new Response(
                JSON.stringify({ success: true, data: parsed, total: parsed.length }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ success: false, message: "No form_designs data found" }),
            { status: 404 }
        );
    } catch (error) {
        console.error("❌ Error fetching form_designs data:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Internal Server Error" }),
            { status: 500 }
        );
    }
};

/**
 * POST - Create new form_designs data
 * Endpoint to create a new form_designs record
 */
export const POST = async (req) => {
    try {
        // Parse request body
        const params = await checkPayload('post', req);
        const insertParams = { ...params };
        if (insertParams.fields_data && typeof insertParams.fields_data !== "string") {
            insertParams.fields_data = JSON.stringify(insertParams.fields_data);
        }
        if (insertParams.settings_data && typeof insertParams.settings_data !== "string") {
            insertParams.settings_data = JSON.stringify(insertParams.settings_data);
        }
        if (insertParams.crud_options_data && typeof insertParams.crud_options_data !== "string") {
            insertParams.crud_options_data = JSON.stringify(insertParams.crud_options_data);
        }
        const data = await insertData('form_designs', insertParams)
        console.log(data)
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Form design created successfully',
                data: {...params, id: data.id}
            }), { status: 201 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: data.message || 'Failed to create form design'
            }), { status: 400 });
        }
    } catch (error) {
        console.error('❌ Error creating form design:', error);
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
        const { body, where } = await checkPayload('put', req);
        const updateBody = { ...body };
        if (updateBody.fields_data && typeof updateBody.fields_data !== "string") {
            updateBody.fields_data = JSON.stringify(updateBody.fields_data);
        }
        if (updateBody.settings_data && typeof updateBody.settings_data !== "string") {
            updateBody.settings_data = JSON.stringify(updateBody.settings_data);
        }
        if (updateBody.crud_options_data && typeof updateBody.crud_options_data !== "string") {
            updateBody.crud_options_data = JSON.stringify(updateBody.crud_options_data);
        }
        const data = await updateData('form_designs', updateBody, where);
        console.log(data)
        
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Form design updated successfully',
                data: body
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'Form design not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error updating form design:', error);
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
                message: 'Form design deleted successfully',
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'Form design not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error deleting form design:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

