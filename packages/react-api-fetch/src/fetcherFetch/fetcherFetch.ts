import { FetcherConfig, FetcherFetchMethod, FetcherHooks } from 'react-api-fetch/fetcher'

export const fetcherFetch = <D = {}, HR = {}>(
    url: string,
    method: FetcherFetchMethod,
    data?: any,
    reqHeaders?: HeadersInit,
    config?: FetcherConfig,
    hooks?: FetcherHooks<HR>,
) => {
    let status = 0
    let headerData: HR
    return fetch(
        url,
        {
            method,
            headers: {
                ...(reqHeaders || {}),
                ...(config?.bearer ? {'Authorization': config?.bearer} : {}),
                ...(config?.audience ? {'Audience': config?.audience} : {}),
            },
            body: data ? JSON.stringify(data) : undefined,
            signal: hooks?.signal,
        },
    )
        .then(res => {
            status = res.status
            headerData = ((hooks?.extractHeaders ? hooks.extractHeaders(res.headers) : {}) as unknown as HR)
            return res.text()
        })
        .then(
            text => {
                let d
                try {
                    d = JSON.parse(text)
                } catch(e) {
                    console.error('JSON parse error of api result', e, text)
                }
                return d
            },
        )
        .then(
            data => ({
                data,
                ...(headerData || {}),
                code: status,
            }),
        )
        .then(
            data =>
                data.code !== 200 ?
                    Promise.reject(data) :
                    data as unknown as {
                        data: D
                        code: number
                    } & HR & any,
        )
}
