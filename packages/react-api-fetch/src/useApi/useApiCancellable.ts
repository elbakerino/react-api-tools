import React from 'react'
import { fetcherFetch } from 'react-api-fetch/fetcherFetch'
import { FetcherFetchMethod } from 'react-api-fetch/fetcher'
import { UseApiOptions } from 'react-api-fetch/useApi'

export const useApiCancellable = <HR = {}>(
    {bearer, audience, extractHeaders, dataConvert, headers}: UseApiOptions<HR> = {},
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
    return React.useCallback(<D = {}>(
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
                audience: audience,
            }, {
                extractHeaders: extractHeaders,
                dataConvert: dataConvert,
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
    }, [audience, bearer, dataConvert, extractHeaders, headers])
}
