export const dataConverterJson: FetcherHooks['dataConvert'] = (data) => data ? JSON.stringify(data) : undefined

export type FetcherHooks<HR = {}> = {
    extractHeaders?: (headers: Headers) => HR
    dataConvert?: (data: any | undefined) => string | undefined
    signal?: AbortSignal
}

export type FetcherFetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type FetcherConfig = {
    bearer?: string
    audience?: string
}
export type fetcherInterface<D = {}, HR = {}> = (
    url: string,
    method?: FetcherFetchMethod,
    data?: any,
    reqHeaders?: HeadersInit,
) => Promise<{
    data: D
    code: number
} & HR>

export type fetcherType<D = {}, HR = {}> = (
    url: string,
    method?: FetcherFetchMethod,
    data?: any,
    reqHeaders?: HeadersInit,
    config?: FetcherConfig,
    hooks?: FetcherHooks<HR>
) => Promise<{
    data: D
    code: number
} & HR>
