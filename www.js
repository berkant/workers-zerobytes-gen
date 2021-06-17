const buffer = new ArrayBuffer(10 * 1000 ** 2);
const minBytes = 1;

addEventListener("fetch", evt => {
    evt.respondWith(handleRequest(evt.request));
});

function handleRequest(req) {
    const params = new URL(req.url).searchParams;

    let bytes = parseInt(params.get("bytes"), 10);
    if (bytes < minBytes) {
        return new Response(`Ensure bytes >= ${minBytes}.`, {
            status: 400
        });
    }

    const {
        readable,
        writable
    } = new TransformStream();

    const writer = writable.getWriter();
    while (bytes > 0) {
        const isFinalWrite = bytes < buffer.byteLength;
        if (isFinalWrite) {
            writer.write(buffer.slice(0, bytes));
            bytes = 0;
        } else {
            writer.write(buffer);
            bytes -= buffer.byteLength;
        }
    }

    return new Response(readable);
}
