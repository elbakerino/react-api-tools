import React from 'react'
import { fetcherFetch } from 'react-api-fetch/fetcherFetch'
import { dataConverterJson, FetcherFetchMethod, FetcherHooks } from 'react-api-fetch/fetcher'

export const useApiCancellable = <HR = {}>(
    {bearer, audience, extractHeaders, headers}: {
        bearer?: string
        audience?: string
        extractHeaders?: FetcherHooks<HR>['extractHeaders']
        headers?: HeadersInit
    } = {},
    // todo: the return type should use `fetcherInterface`
): <D = {}>(
    url: string,
    method?: FetcherFetchMethod,
    data?: any,
    reqHeaders?: HeadersInit,
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
    ) => {
        // todo: for true "cancel request/uploads" it must use `xhr` instead of `fetch`, like in the media uploader
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
                dataConvert: dataConverterJson,
            },
        ).then((r) => ({
            ...r,
            cancelled: cancelled,
        }))
        const cancel = () => cancelled = true

        return {fetch, cancel}
    }, [audience, bearer, extractHeaders, headers])
}
