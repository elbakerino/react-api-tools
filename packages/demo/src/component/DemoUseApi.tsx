import React, { useEffect } from 'react'
import { useApi, useApiCancellable } from 'react-api-fetch/useApi'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { extractHeaders } from 'react-api-fetch/extractHeaders'
import { headersJson } from 'react-api-fetch/headersJson'
import { ps, useProgress } from 'react-progress-state'
import { ps as psNext, useProgress as useProgressNext } from 'react-progress-state/useProgressNext'
import { dataConverterJson, responseConverterJson } from 'react-api-fetch/fetcher'

export const DemoUseApi = () => {
    const fetch = useApi({extractHeaders, dataConvert: dataConverterJson, responseConvert: responseConverterJson, headers: headersJson})
    const [uuid, setUuid] = React.useState<string | undefined>(undefined)
    return <>
        <Button
            onClick={() => {
                fetch<{ uuid: string }>('https://httpbin.org/uuid', 'GET')
                    .then(r => {
                        setUuid(r.data.uuid)
                        console.log(r)
                    })
            }}
        >
            Send
        </Button>
        <Typography>
            result: {uuid || '-'}
        </Typography>
    </>
}

export const DemoUseApiCancellableDeprecated = () => {
    // eslint-disable-next-line deprecation/deprecation
    const fetchBuild = useApiCancellable({extractHeaders, dataConvert: dataConverterJson, headers: headersJson})
    const [uuid, setUuid] = React.useState<string | undefined>(undefined)
    const cancelRef = React.useRef<undefined | (() => void)>(undefined)
    return <>
        <Button
            onClick={() => {
                if(cancelRef.current) cancelRef.current()
                const controller = new AbortController()
                const {cancel, fetch} = fetchBuild<{ uuid: string }>('https://httpbin.org/uuid', 'GET', undefined, undefined, controller)
                cancelRef.current = cancel
                window.setTimeout(() => {
                    fetch.then(({data, cancelled}) => {
                        if(cancelled) return
                        setUuid(data.uuid)
                    })
                }, 200)
            }}
        >
            Send
        </Button>
        <Typography gutterBottom>
            result: {uuid || '-'}
        </Typography>
    </>
}

export const DemoUseApiCancellable = () => {
    const fetch = useApi({extractHeaders, dataConvert: dataConverterJson, headers: headersJson})
    const [uuid, setUuid] = React.useState<string | undefined>(undefined)
    const cancelRef = React.useRef<undefined | (() => void)>(undefined)
    useEffect(() => {
        return () => cancelRef.current?.()
    }, [])
    return <>
        <Button
            onClick={() => {
                cancelRef.current?.()
                const controller = new AbortController()
                cancelRef.current = () => controller.abort()
                window.setTimeout(() => {
                    fetch<{ uuid: string }>('https://httpbin.org/uuid', 'GET', undefined, undefined, controller.signal)
                        .then(({data}) => {
                            if(controller.signal.aborted) return
                            setUuid(data.uuid)
                        })
                        .catch((e) => {
                            if(controller.signal.aborted) return
                            return Promise.reject(e)
                        })
                }, 200)
            }}
        >
            Send
        </Button>
        <Typography gutterBottom>
            result: {uuid || '-'}
        </Typography>
    </>
}

export const DemoUseApiProgress: React.FC<{ loadInitial?: boolean }> = ({loadInitial}) => {
    const fetch = useApi({extractHeaders, dataConvert: dataConverterJson, headers: headersJson})
    const [p, setP, startP] = useProgress<{ abort?: AbortController }>()
    const [fid, setFid] = React.useState<number | undefined>(undefined)
    const [uuid, setUuid] = React.useState<string | undefined>(undefined)

    const load = React.useCallback(() => {
        const controller = new AbortController()
        const fid = startP({abort: controller})
        setFid(fid)
        fetch<{ uuid: string }>('https://httpbin.org/uuid', 'GET', undefined, undefined, controller.signal)
            .then(r => {
                if(controller.signal.aborted) {
                    setP(ps.none, undefined, fid)
                    return
                }
                const isPid = setP(ps.done, undefined, fid)
                console.log(r, isPid)
                if(!isPid) return
                setUuid(r.data.uuid)
            })
            .catch(r => {
                if(controller.signal.aborted) {
                    setP(ps.none, undefined, fid)
                    return
                }
                const isPid = setP(ps.error, r, fid)
                console.error(r, isPid)
            })
        return {abort: controller.abort.bind(controller)}
    }, [fetch, setP, startP])

    React.useEffect(() => {
        if(!loadInitial) return
        const {abort} = load()
        return abort
    }, [loadInitial, load])

    return <>
        <Button
            onClick={() => {
                p.context?.abort?.abort()
                load()
            }}
        >
            Send
        </Button>
        <Typography gutterBottom>
            fid: {JSON.stringify(fid)}
        </Typography>
        <Typography gutterBottom>
            progress: {JSON.stringify(p)}
        </Typography>
        <Typography gutterBottom>
            result: {uuid || '-'}
        </Typography>
    </>
}

export const DemoUseApiProgressNext: React.FC<{ loadInitial?: boolean }> = ({loadInitial}) => {
    const fetch = useApi({extractHeaders, dataConvert: dataConverterJson, headers: headersJson})
    const [p, setP, startP] = useProgressNext<{ abort?: AbortController }>()
    const [fid, setFid] = React.useState<number | undefined>(undefined)
    const [uuid, setUuid] = React.useState<string | undefined>(undefined)

    const load = React.useCallback(() => {
        const controller = new AbortController()
        const fid = startP({abort: controller})
        setFid(fid)
        fetch<{ uuid: string }>('https://httpbin.org/uuid', 'GET', undefined, undefined, controller.signal)
            .then(r => {
                if(controller.signal.aborted) {
                    setP(psNext.none, undefined, fid)
                    return
                }
                const isPid = setP(psNext.success, undefined, fid)
                console.log(r, isPid)
                if(!isPid) return
                setUuid(r.data.uuid)
            })
            .catch(r => {
                if(controller.signal.aborted) {
                    setP(psNext.none, undefined, fid)
                    return
                }
                const isPid = setP(psNext.error, r, fid)
                console.error(r, isPid)
            })
        return {abort: controller.abort.bind(controller)}
    }, [fetch, setP, startP])

    React.useEffect(() => {
        if(!loadInitial) return
        const {abort} = load()
        return abort
    }, [loadInitial, load])

    return <>
        <Button
            onClick={() => {
                p.context?.abort?.abort()
                load()
            }}
        >
            Send
        </Button>
        <Typography gutterBottom>
            fid: {JSON.stringify(fid)}
        </Typography>
        <Typography gutterBottom>
            progress: {JSON.stringify(p)}
        </Typography>
        <Typography gutterBottom>
            result: {uuid || '-'}
        </Typography>
    </>
}
