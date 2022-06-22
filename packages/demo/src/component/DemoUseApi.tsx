import React from 'react'
import { useApi, useApiCancellable } from 'react-api-fetch/useApi'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { extractHeaders } from 'react-api-fetch/extractHeaders'
import { headersJson } from 'react-api-fetch/headersJson'
import { ps, useProgress } from 'react-progress-state'

export const DemoUseApi = () => {
    const fetch = useApi({extractHeaders, headers: headersJson})
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
            Result: {uuid || '-'}
        </Typography>
    </>
}

export const DemoUseApiCancellable = () => {
    const fetchBuild = useApiCancellable({extractHeaders, headers: headersJson})
    const [uuid, setUuid] = React.useState<string | undefined>(undefined)
    const cancelRef = React.useRef<undefined | (() => void)>(undefined)
    return <>
        <Button
            onClick={() => {
                if(cancelRef.current) cancelRef.current()
                const {cancel, fetch} = fetchBuild<{ uuid: string }>('https://httpbin.org/uuid', 'GET')
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
            Result: {uuid || '-'}
        </Typography>
    </>
}

export const DemoUseApiProgress = () => {
    const fetch = useApi({extractHeaders, headers: headersJson})
    const [p, setP, startP] = useProgress()
    const [fid, setFid] = React.useState<number | undefined>(undefined)
    const [uuid, setUuid] = React.useState<string | undefined>(undefined)
    return <>
        <Button
            onClick={() => {
                const fid = startP()
                setFid(fid)
                fetch<{ uuid: string }>('https://httpbin.org/uuid', 'GET')
                    .then(r => {
                        const isPid = setP(ps.done, undefined, fid)
                        console.log(r, isPid)
                        if(!isPid) return
                        setUuid(r.data.uuid)
                    })
                    .catch(r => {
                        const isPid = setP(ps.error, r, fid)
                        console.error(r, isPid)
                    })
            }}
        >
            Send
        </Button>
        <Typography gutterBottom>
            fid: {JSON.stringify(fid)}
        </Typography>
        <Typography gutterBottom>
            Progress: {JSON.stringify(p)}
        </Typography>
        <Typography gutterBottom>
            Result: {uuid || '-'}
        </Typography>
    </>
}
