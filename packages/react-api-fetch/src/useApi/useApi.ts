import React from 'react'
import { fetcherFetch } from 'react-api-fetch/fetcherFetch'
import { FetcherFetchMethod, FetcherHooks } from 'react-api-fetch/fetcher'

export interface UseApiOptions<HR = {}> {
    bearer?: string
    audience?: string
    extractHeaders?: FetcherHooks<HR>['extractHeaders']
    dataConvert?: FetcherHooks<HR>['dataConvert']
    headers?: HeadersInit
}

export type ApiConnect<D = {}, HR = {}> =
    <D1 extends D = D>(
        url: string,
        method?: FetcherFetchMethod,
        data?: any,
        reqHeaders?: HeadersInit,
        signal?: AbortSignal,
    ) => Promise<{
        data: D1
        code: number
    } & HR>

export const useApi = <HR = {}>(
    {bearer, audience, extractHeaders, dataConvert, headers}: UseApiOptions<HR> = {},
    // todo: the return type should use `fetcherInterface`
): ApiConnect<{}, HR> => {
    return React.useCallback(<D = {}>(
        url: string,
        method: FetcherFetchMethod = 'GET',
        data?: any,
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
                audience: audience,
            }, {
                extractHeaders: extractHeaders,
                dataConvert: dataConvert,
                signal: signal,
            },
        )
    }, [audience, bearer, dataConvert, extractHeaders, headers])
}
