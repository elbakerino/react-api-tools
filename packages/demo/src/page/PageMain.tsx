import React from 'react'
import Typography from '@material-ui/core/Typography'
import { HeadMeta } from '@control-ui/kit/HeadMeta'
import { Box, Container } from '@material-ui/core'
import { DemoUseApi } from '../component/DemoUseApi'
import { DemoUseProgress } from '../component/DemoUseProgress'

const PageMain: React.ComponentType<{ match: any }> = () => {
    return (<>
        <HeadMeta title={'React Api Tools'}/>
        <Container maxWidth={false} disableGutters style={{
            //paddingBottom: spacing(8),
            width: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            height: '100%',
        }}>
            <Box my={2} mx={1}>
                <Typography variant={'h1'}>React Api Tools</Typography>
            </Box>
            <Box my={2} mx={1}>
                <Typography variant={'h2'}>React `useApi`</Typography>
                <DemoUseApi/>
            </Box>
            <Box my={2} mx={1}>
                <Typography variant={'h2'}>React `useProgress`</Typography>
                <DemoUseProgress/>
            </Box>
        </Container>
    </>)
}
export default PageMain
