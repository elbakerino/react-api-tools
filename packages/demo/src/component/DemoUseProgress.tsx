import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { PROGRESS_DONE, PROGRESS_ERROR, PROGRESS_NONE, PROGRESS_START, useProgress } from 'react-progress-state'

export const DemoUseProgress = () => {
    const [p, setP] = useProgress()
    return <>
        <Box>
            <Button
                onClick={() => {
                    switch(p.progress) {
                        case PROGRESS_ERROR:
                        case PROGRESS_NONE:
                            setP(PROGRESS_START)
                            break
                        case PROGRESS_START:
                            setP(PROGRESS_DONE)
                            break
                        case PROGRESS_DONE:
                            setP(PROGRESS_NONE)
                            break
                    }
                }}
            >
                {
                    p.progress === PROGRESS_NONE ||
                    p.progress === PROGRESS_ERROR ?
                        'Load' :
                        p.progress === PROGRESS_DONE ?
                            'Reset' :
                            'Done'
                }
            </Button>

            <Button
                onClick={() => {
                    setP(
                        PROGRESS_ERROR,
                        {
                            error: 'Something is wrong',
                        },
                    )
                }}
            >
                is-error!
            </Button>
        </Box>

        <Typography component={'div'}>
            <pre><code>{JSON.stringify(p, undefined, 4)}</code></pre>
        </Typography>
    </>
}
