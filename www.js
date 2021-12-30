const buffer = new ArrayBuffer(10 * 1000 ** 2);

addEventListener("fetch", evt => {
    evt.respondWith(handleRequest(evt.request));
});

function handleRequest(req) {
    const {
        searchParams: params
    } = new URL(req.url);

    let bytes = parseInt(params.get("bytes"), 10);
    if (Number.isInteger(bytes) && bytes <= 0) {
        return new Response("bytes must be positive.", {
            status: 400
        });
    }

    const {
        readable,
        writable
    } = new TransformStream();

    const writer = writable.getWriter();
    while (true) {
        const isFinalWrite = bytes < buffer.byteLength;
        if (isFinalWrite) {
            writer.write(buffer.slice(0, bytes));
            break;
        }

        writer.write(buffer);
        bytes -= buffer.byteLength;
    }

    return new Response(readable);
}
