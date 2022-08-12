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

export const useApi = <HR = {}>(
    {bearer, audience, extractHeaders, dataConvert, headers}: UseApiOptions<HR> = {},
    // todo: the return type should use `fetcherInterface`
): <D = {}>(
    url: string,
    method?: FetcherFetchMethod,
    data?: any,
    reqHeaders?: HeadersInit,
) => Promise<{
    data: D
    code: number
} & HR> => {
    return React.useCallback(<D = {}>(
        url: string,
        method: FetcherFetchMethod = 'GET',
        data?: any,
        reqHeaders?: HeadersInit,
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
            },
        )
    }, [audience, bearer, dataConvert, extractHeaders, headers])
}
