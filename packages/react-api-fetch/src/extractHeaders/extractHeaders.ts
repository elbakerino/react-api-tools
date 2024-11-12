export const extractHeaders = (headers: Headers) => {
    return {
        traceId: headers.get('x-trace-id') || headers.get('x-cloud-trace-context') || undefined,
        traceLb: headers.get('x-trace-lb') || undefined,
        contentType: headers.get('content-type'),
    }
}
