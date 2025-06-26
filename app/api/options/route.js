import { getData } from "@/lib/mysqldb";
import { checkPayload } from "@/lib/utils";
export const dynamic = 'force-dynamic';

export const GET = async (req) => {
  try {
    const { table, labelField, valueField } = await checkPayload('get', req);
    console.log('Fetching options for table:', table, 'labelField:', labelField, 'valueField:', valueField);
    if (!table || !labelField || !valueField) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required parameters' }),
        { status: 400 },
      );
    }

    const result = await getData(table, { all: true });
    if (result.status) {
      const options = result.data.map(row => ({ label: row[labelField], value: row[valueField] }));
      return new Response(
        JSON.stringify({ success: true, data: options }),
        { status: 200 },
      );
    }
    return new Response(
      JSON.stringify({ success: false, message: result.message || 'No data found' }),
      { status: 404 },
    );
  } catch (error) {
    console.error('❌ Error fetching options:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error' }),
      { status: 500 },
    );
  }
};
