import React from 'react'
import Typography from '@mui/material/Typography'
import { HeadMeta } from '@control-ui/kit/HeadMeta'
import { Box, Container } from '@mui/material'
import { DemoUseApi, DemoUseApiCancellable, DemoUseApiCancellableDeprecated, DemoUseApiProgress } from '../component/DemoUseApi'
import { DemoUseProgress, DemoUseProgressNext } from '../component/DemoUseProgress'

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
                <Typography variant={'h2'}>React `useApi` cancellable</Typography>
                <DemoUseApiCancellable/>
            </Box>
            <Box my={2} mx={1}>
                <Typography variant={'h2'}>React `useApiCancellable`</Typography>
                <DemoUseApiCancellableDeprecated/>
            </Box>
            <Box my={2} mx={1}>
                <Typography variant={'h2'}>React `useApi`+`useProgress`</Typography>
                <DemoUseApiProgress/>
            </Box>
            <Box my={2} mx={1}>
                <Typography variant={'h2'}>React `useApi`+`useProgress` w/ initial</Typography>
                <DemoUseApiProgress loadInitial/>
            </Box>
            <Box my={2} mx={1}>
                <Typography variant={'h2'}>React `useProgress`</Typography>
                <DemoUseProgress/>
            </Box>
            <Box my={2} mx={1}>
                <Typography variant={'h2'}>React `useProgressNext`</Typography>
                <DemoUseProgressNext/>
            </Box>
        </Container>
    </>)
}
export default PageMain
