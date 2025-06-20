import { createTable } from "@/lib/mysqldb";
import { checkPayload } from "@/lib/utils";

export const POST = async (req) => {
    try {
        const { tableName, schema } = await checkPayload('post', req);
        if (!tableName || !schema) {
            return new Response(JSON.stringify({ success: false, message: 'Missing tableName or schema' }), { status: 400 });
        }
        const result = await createTable(tableName, schema);
        const statusCode = result.status ? 200 : 400;
        return new Response(JSON.stringify({ success: result.status, message: result.message }), { status: statusCode });
    } catch (error) {
        console.error('❌ Error creating table API:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
    }
};
