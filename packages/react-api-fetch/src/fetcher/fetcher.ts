export const dataConverterJson: FetcherHooks['dataConvert'] = (data) => data ? JSON.stringify(data) : undefined
export const responseConverterJson: FetcherHooks['responseConvert'] = (data) => data ? JSON.parse(data) : undefined

export type FetcherHooks<HR = {}> = {
    extractHeaders?: (headers: Headers) => HR
    dataConvert?: (data: unknown, reqHeaders: HeadersInit) => string | undefined
    responseConvert?: (data: string, headerData: HR) => string | undefined
    signal?: AbortSignal
}

export type FetcherFetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type FetcherConfig = {
    /**
     * @deprecated use `authorization` instead
     */
    bearer?: string
    authorization?: string
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
    hooks?: FetcherHooks<HR>,
) => Promise<{
    data: D
    code: number
} & HR>
