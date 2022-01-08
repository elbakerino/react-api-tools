import React from 'react'
import { useApi } from 'react-api-fetch/useApi'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { extractHeaders } from 'react-api-fetch/extractHeaders'
import { headersJson } from 'react-api-fetch/headersJson'

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
