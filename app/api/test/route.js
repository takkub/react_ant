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
 * GET - Retrieve test data
 * Endpoint to fetch all test data
 */
export const GET = async (req) => {
    try {
        // Parse request parameters
        const params = await checkPayload('get', req);
        // const {data} = await getData('test', params);
        const data = [
            {
                "id": 1,
                "type": "main_branch",
                "status": "active",
                "branch_code": "001",
                "code_revenue": "REV001",
                "branch_name_th": "สำนักงานใหญ่",
                "tax_number": "0105537001234",
                "branch_name_en": "Head Office",
                "branch_detail": "สำนักงานใหญ่ ตั้งอยู่ที่กรุงเทพฯ ให้บริการลูกค้าทั่วประเทศ",
                "open_date": "2010-05-01",
                "close_date": null,
                "manager": "นายสมชาย ใจดี",
                "phone": "02-123-4567",
                "region": "กรุงเทพมหานคร",
                "system_shutdown": "manual",
                "cross_branch": "yes",
                "time_system_shutdown": "2025-05-20T18:00:00",
                "tax_register": "จดทะเบียนภาษีมูลค่าเพิ่ม",
                "company_name": "บริษัท เอ บี ซี จำกัด",
                "slip_header_name": "บริษัท เอ บี ซี จำกัด (สำนักงานใหญ่)",
                "invoice_address": "123 ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
                "slip_text_th": "ขอบคุณที่ใช้บริการ",
                "slip_text_en": "Thank you for your business"
            }

        ]
        if (data) {
            return new Response(JSON.stringify({
                success: true,
                data: data,
                total: data.length,
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'No test data found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error fetching test data:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * POST - Create new test data
 * Endpoint to create a new test record
 */
export const POST = async (req) => {
    try {
        // Parse request body
        const params = await checkPayload('post', req);
        const data = await insertData('test', params)
        console.log(data)
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'test created successfully',
                data: { ...params, id: data.id }
            }), { status: 201 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: data.message || 'Failed to create test'
            }), { status: 400 });
        }
    } catch (error) {
        console.error('❌ Error creating test:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * PUT - Update existing test data
 * Endpoint to update a test record by ID
 */
export const PUT = async (req) => {
    try {
        // Parse request body
        const { body, where } = await checkPayload('put', req);
        const data = await updateData('test', body, where);
        console.log(data)

        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'test updated successfully',
                data: body
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'test not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error updating test:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * DELETE - Remove test data
 * Endpoint to delete a test record by ID
 */
export const DELETE = async (req) => {
    try {
        const params = await checkPayload('delete', req);
        const data = await deleteData('test', params)
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: 'test deleted successfully',
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'test not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error deleting test:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}