import { getColumns } from "@/lib/mysqldb";
import { checkPayload } from "@/lib/utils";
export const dynamic = 'force-dynamic';
export const GET = async (req) => {
    try {
        const { table } = await checkPayload('get', req);
        if (!table) {
            return new Response(JSON.stringify({
                success: false,
                message: 'tableName parameter is required'
            }), { status: 400 });
        }

        const result = await getColumns(table);
        if (result.status) {
            return new Response(JSON.stringify({
                success: true,
                data: result.data,
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: result.message || 'No columns found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error fetching columns:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

