import { createTable, dropTable } from "@/lib/mysqldb";
import { checkPayload } from "@/lib/utils";

export const POST = async (req) => {
    try {
        const { tableName, schema } = await checkPayload('post', req);
        if (!tableName || !schema) {
            return new Response(JSON.stringify({ success: false, message: 'Missing tableName or schema' }), { status: 400 });
        }
        await dropTable(tableName);

        const createResult = await createTable(tableName, schema);
        const statusCode = createResult.status ? 200 : 400;
        return new Response(JSON.stringify({ success: createResult.status, message: createResult.message }), { status: statusCode });
    } catch (error) {
        console.error('❌ Error creating table API:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
    }
};
