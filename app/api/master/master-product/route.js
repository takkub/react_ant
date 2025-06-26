import { getData, insertData, deleteData, updateData } from '@/lib/mysqldb';

const checkPayload = async (method, req) => {
  let body;
  if (method !== 'get') {
    body = await req.json();
  } else {
    const url = new URL(req.url);
    const params = url.searchParams;
    body = Object.fromEntries(params.entries());
  }
  return body;
};

/**
 * GET - Retrieve master_branch_detail data
 * Endpoint to fetch all master_branch_detail data
 */
export const GET = async req => {
  try {
    // Parse request parameters
    const params = await checkPayload('get', req);
    const { data } = await getData('master_product', params);
    console.log(data);
    if (data) {
      return new Response(
        JSON.stringify({
          success: true,
          data: data,
          total: data.length,
        }),
        { status: 200 },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No master_product data found',
        }),
        { status: 404 },
      );
    }
  } catch (error) {
    console.error('❌ Error fetching master_product data:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal Server Error',
      }),
      { status: 500 },
    );
  }
};

/**
 * POST - Create new master_branch_detail data
 * Endpoint to create a new master_branch_detail record
 */
export const POST = async req => {
  try {
    // Parse request body
    const params = await checkPayload('post', req);
    const data = await insertData('master_product', params);
    console.log(data);
    if (data.status) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Master Product created successfully',
          data: { ...params, id: data.id },
        }),
        { status: 201 },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: data.message || 'Failed to create Master Product',
        }),
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('❌ Error creating Master Product:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal Server Error',
      }),
      { status: 500 },
    );
  }
};

/**
 * PUT - Update existing master_branch_detail data
 * Endpoint to update a master_branch_detail record by ID
 */
export const PUT = async req => {
  try {
    // Parse request body
    const { body, where } = await checkPayload('put', req);
    const data = await updateData('master_product', body, where);
    console.log(data);

    if (data.status) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Master Product updated successfully',
          data: body,
        }),
        { status: 200 },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Master Product not found',
        }),
        { status: 404 },
      );
    }
  } catch (error) {
    console.error('❌ Error updating Master Product:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal Server Error',
      }),
      { status: 500 },
    );
  }
};

/**
 * DELETE - Remove master_branch_detail data
 * Endpoint to delete a master_branch_detail record by ID
 */
export const DELETE = async req => {
  try {
    const params = await checkPayload('delete', req);
    const data = await deleteData('master_product', params);
    if (data.status) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Master Product deleted successfully',
        }),
        { status: 200 },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Master Product not found',
        }),
        { status: 404 },
      );
    }
  } catch (error) {
    console.error('❌ Error deleting Master Product:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal Server Error',
      }),
      { status: 500 },
    );
  }
};
