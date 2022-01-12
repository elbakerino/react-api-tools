import React from 'react'
import { fetcherFetch } from 'react-api-fetch/fetcherFetch'
import { dataConverterJson, FetcherFetchMethod, FetcherHooks } from 'react-api-fetch/fetcher'

export const useApi = <HR = {}>(
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
                dataConvert: dataConverterJson,
            },
        )
    }, [
        audience, bearer,
    ])
}
