import { createTable, alterTable } from "@/lib/mysqldb";
import { checkPayload } from "@/lib/utils";

export const POST = async (req) => {
    try {
        const { tableName, schema } = await checkPayload('post', req);
        if (!tableName || !schema) {
            return new Response(JSON.stringify({ success: false, message: 'Missing tableName or schema' }), { status: 400 });
        }
        const createResult = await createTable(tableName, schema);
        if (!createResult.status) {
            return new Response(JSON.stringify({ success: false, message: createResult.message }), { status: 400 });
        }

        const updateResult = await alterTable(tableName, schema);
        const statusCode = updateResult.status ? 200 : 400;
        return new Response(JSON.stringify({ success: updateResult.status, message: updateResult.message }), { status: statusCode });
    } catch (error) {
        console.error('❌ Error creating table API:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
    }
};
