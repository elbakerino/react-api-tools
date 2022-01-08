import React from 'react'

export const useApi = <HR = {}>(
    {bearer, audience, extractHeaders, headers}: {
        bearer?: string
        audience?: string
        extractHeaders?: (headers: Headers) => HR
        headers?: HeadersInit
    } = {},
): <D = {}>(
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    data?: any,
    reqHeaders?: HeadersInit,
) => Promise<{
    data: any
    code: number
} & HR & D> => {
    return React.useCallback((
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
        data?: any,
        reqHeaders?: HeadersInit,
    ) => {
        let status = 0
        let headerData: HR
        return fetch(
            url,
            {
                method,
                headers: {
                    ...(headers || {}),
                    ...(bearer ? {'Authorization': bearer} : {}),
                    ...(audience ? {'Audience': audience} : {}),
                    ...(reqHeaders || {}),
                },
                body: data ? JSON.stringify(data) : undefined,
            },
        )
            .then(res => {
                status = res.status
                headerData = ((extractHeaders ? extractHeaders(res.headers) : {}) as unknown as HR)
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
                            data: any
                            code: number
                        } & HR & any,
            )
    }, [
        audience, bearer,
    ])
}
