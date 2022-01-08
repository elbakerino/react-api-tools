export const extractHeaders = (headers: Headers) => {
    return {
        traceId: headers.get('x-trace-id') || '',
        traceLb: headers.get('x-trace-lb') || '',
    }
}
