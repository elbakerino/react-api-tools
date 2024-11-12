import { useCallback } from 'react'
import { fetcherFetch } from 'react-api-fetch/fetcherFetch'
import { FetcherConfig, FetcherFetchMethod, FetcherHooks } from 'react-api-fetch/fetcher'

export interface UseApiOptions<HR = {}> extends Pick<FetcherHooks<HR>, 'extractHeaders' | 'dataConvert' | 'responseConvert'>,
    FetcherConfig {
    headers?: HeadersInit
}

export type ApiConnect<HR = {}> =
    <D = unknown>(
        url: string,
        method?: FetcherFetchMethod,
        data?: unknown,
        reqHeaders?: HeadersInit,
        signal?: AbortSignal,
    ) => Promise<{
        data: D
        code: number
    } & HR>

export const useApi = <HR = {}>(
    {
        // eslint-disable-next-line deprecation/deprecation
        bearer,
        authorization,
        audience,
        extractHeaders,
        dataConvert,
        responseConvert,
        headers,
    }: UseApiOptions<HR> = {},
): ApiConnect<HR> => {
    return useCallback(<D = {}>(
        url: string,
        method: FetcherFetchMethod = 'GET',
        data?: unknown,
        reqHeaders?: HeadersInit,
        signal?: AbortSignal,
    ) => {
        return fetcherFetch<D, HR>(
            url, method, data,
            headers ? {
                ...headers,
                ...(reqHeaders || {}),
            } : reqHeaders,
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
    }, [audience, authorization, bearer, dataConvert, extractHeaders, headers, responseConvert])
}
