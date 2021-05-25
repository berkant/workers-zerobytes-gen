const buffer = new ArrayBuffer(1000 ** 2);
const multiplesOf = 10;

addEventListener("fetch", evt => {
    evt.respondWith(handleRequest(evt.request));
});

function handleRequest(req) {
    const params = new URL(req.url).searchParams;

    let bytes = parseInt(params.get("bytes"), 10);
    if (bytes < buffer.byteLength || bytes % multiplesOf != 0) {
        return new Response(`Ensure bytes >= ${buffer.byteLength} AND bytes % ${multiplesOf} == 0.`, {
            status: 400
        });
    }

    const {
        readable,
        writable
    } = new TransformStream();

    const writer = writable.getWriter();
    while (bytes > 0) {
        writer.write(buffer);
        bytes -= buffer.byteLength;
    }

    return new Response(readable);
}
