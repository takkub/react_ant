
export async function POST(req) {
    const body = await req.json();
    
    return new Response(JSON.stringify({ok:true,cookies:'username'}), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}
