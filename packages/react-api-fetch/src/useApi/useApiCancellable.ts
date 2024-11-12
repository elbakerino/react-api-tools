import { useCallback } from 'react'
import { fetcherFetch } from 'react-api-fetch/fetcherFetch'
import { FetcherFetchMethod } from 'react-api-fetch/fetcher'
import { UseApiOptions } from 'react-api-fetch/useApi'

/**
 * @deprecated will be removed, use `useApi` with signal instead
 */
export const useApiCancellable = <HR = {}>(
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
    // todo: the return type should use `fetcherInterface`
): <D = {}>(
    url: string,
    method?: FetcherFetchMethod,
    data?: any,
    reqHeaders?: HeadersInit,
    abortController?: AbortController,
) => {
    fetch: Promise<{
        data: D
        code: number
        cancelled?: boolean
    } & HR>
    cancel: () => void
} => {
    return useCallback(<D = {}>(
        url: string,
        method: FetcherFetchMethod = 'GET',
        data?: any,
        reqHeaders?: HeadersInit,
        abortController?: AbortController,
    ) => {
        let cancelled = false
        const fetch = fetcherFetch<D, HR>(
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
                signal: abortController?.signal,
            },
        ).then((r) => ({
            ...r,
            cancelled: cancelled,
        }))
        const cancel = () => {
            cancelled = true
            abortController?.abort()
        }

        return {fetch, cancel}
    }, [audience, authorization, bearer, dataConvert, extractHeaders, headers, responseConvert])
}
