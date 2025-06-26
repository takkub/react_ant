import { getTables } from "@/lib/mysqldb";
export const dynamic = 'force-dynamic';
export const GET = async (req) => {
    try {
        const result = await getTables();
        if (result.status) {
            return new Response(JSON.stringify({
                success: true,
                data: result.data,
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: result.message || 'No tables found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error fetching tables:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}
