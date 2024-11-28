import { useCallback } from 'react'
import { fetcherFetch } from 'react-api-fetch/fetcherFetch'
import { FetcherConfig, FetcherFetchMethod, FetcherHooks } from 'react-api-fetch/fetcher'

export interface UseApiOptions<HR = {}> extends Pick<FetcherHooks<HR>, 'extractHeaders' | 'dataConvert' | 'responseConvert'>,
    FetcherConfig {
    headers?: HeadersInit
}

export type ApiConnect<HR = {}> = {
    <D = unknown>(
        url: string,
        method?: FetcherFetchMethod,
        data?: unknown,
        headers?: HeadersInit,
        signal?: AbortSignal,
    ): Promise<{
        data: D
        code: number
    } & HR>

    <D = unknown>(
        url: string,
        options: {
            method?: FetcherFetchMethod
            data?: unknown
            headers?: HeadersInit
            signal?: AbortSignal
        },
    ): Promise<{
        data: D
        code: number
    } & HR>
}

export const useApi = <HR = {}>(
    {
        // eslint-disable-next-line deprecation/deprecation
        bearer,
        authorization,
        audience,
        extractHeaders,
        dataConvert,
        responseConvert,
        headers: defaultHeaders,
    }: UseApiOptions<HR> = {},
): ApiConnect<HR> => {
    return useCallback(<D = {}>(
        url: string,
        ...args:
            [
                method?: FetcherFetchMethod,
                data?: unknown,
                headers?: HeadersInit,
                signal?: AbortSignal,
            ] |
            [{
                method?: FetcherFetchMethod
                data?: unknown
                headers?: HeadersInit
                signal?: AbortSignal
            }]
    ) => {
        const [optionsOrMethod, ...rest] = args
        let method: FetcherFetchMethod
        let data: unknown
        let headers: HeadersInit | undefined
        let signal: AbortSignal | undefined
        if(typeof optionsOrMethod === 'object') {
            method = optionsOrMethod.method || 'GET'
            data = optionsOrMethod.data
            headers = optionsOrMethod.headers
            signal = optionsOrMethod.signal
        } else {
            method = optionsOrMethod || 'GET'
            data = rest[0]
            headers = rest[1]
            signal = rest[2]
        }
        return fetcherFetch<D, HR>(
            url, method, data,
            defaultHeaders ? {
                ...defaultHeaders,
                ...(headers || {}),
            } : headers,
            {
                bearer: bearer,
                authorization: authorization,
                audience: audience,
            }, {
                extractHeaders: extractHeaders,
                dataConvert: dataConvert,
                responseConvert: responseConvert,
                signal: signal,
            },
        )
    }, [audience, authorization, bearer, dataConvert, extractHeaders, defaultHeaders, responseConvert])
}
