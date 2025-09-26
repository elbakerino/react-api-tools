import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ps, useProgress } from 'react-progress-state'

export const DemoUseProgress = () => {
    const [p, setP] = useProgress()
    return <>
        <Box>
            <Button
                onClick={() => {
                    switch(p.progress) {
                        case ps.error:
                        case ps.none:
                            setP(ps.loading)
                            break
                        case ps.loading:
                            setP(ps.success)
                            break
                        case ps.success:
                            setP(ps.none)
                            break
                    }
                }}
            >
                {
                    p.progress === ps.none ||
                    p.progress === ps.error ?
                        'Load' :
                        p.progress === ps.success ?
                            'Reset' :
                            'Done'
                }
            </Button>

            <Button
                onClick={() => {
                    setP(
                        ps.error,
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
