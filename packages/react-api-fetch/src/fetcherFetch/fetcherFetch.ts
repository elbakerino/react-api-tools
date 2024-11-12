import { FetcherConfig, FetcherFetchMethod, FetcherHooks } from 'react-api-fetch/fetcher'

export const fetcherFetch = <D = unknown, HR = {}>(
    url: string,
    method: FetcherFetchMethod,
    data?: unknown,
    reqHeaders?: HeadersInit,
    config?: FetcherConfig,
    hooks?: FetcherHooks<HR>,
): Promise<{
    data: D
    code: number
} & HR> => {
    const headers = {
        ...(
            config?.authorization
                ? {'Authorization': config?.authorization} :
                // eslint-disable-next-line deprecation/deprecation
                config?.bearer ? {'Authorization': config?.bearer} : {}
        ),
        ...(config?.audience ? {'Audience': config?.audience} : {}),
        ...(reqHeaders || {}),
    }
    return fetch(
        url,
        {
            method,
            headers: headers,
            body:
                data ?
                    hooks?.dataConvert
                        ? hooks?.dataConvert(data, headers)
                        : JSON.stringify(data)
                    : undefined,
            signal: hooks?.signal,
        },
    )
        .then(res => {
            const status = res.status
            const headerData = ((hooks?.extractHeaders ? hooks.extractHeaders(res.headers) : {}) as unknown as HR)
            return res.text()
                .then(
                    text => ({
                        ...(headerData || {}),
                        data:
                            text
                                ? hooks?.responseConvert
                                    ? hooks?.responseConvert(text, headerData)
                                    : JSON.parse(text)
                                : undefined,
                        code: status,
                    }) as {
                        data: D
                        code: number
                    } & HR,
                )
        })
        .then(
            data =>
                data.code >= 200 && data.code < 300 ?
                    data :
                    Promise.reject(data),
        )
}
