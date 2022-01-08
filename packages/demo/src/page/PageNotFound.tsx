import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { PageTitle } from '@control-ui/kit/PageContent'
import React from 'react'
import { HeadMeta } from '@control-ui/kit/HeadMeta'
import { Link } from '@control-ui/kit/Link'

function PageNotFound(): React.ReactElement {
    return (
        <>
            <HeadMeta
                title={'Page Not Found · Schema Registry'}
            />
            <Container maxWidth={'md'} fixed style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                <PageTitle title={'404 Not Found'}/>

                <Paper style={{margin: 12, padding: 24}}>
                    <Typography component={'p'} variant={'body1'}>
                        <span role={'img'} aria-label={'Home Icon'}>🏠</span>
                        {/* @ts-ignore */}
                        <Link to={'/'} primary={'Home'} style={{display: 'inline-block'}}/>
                    </Typography>
                </Paper>
            </Container>
        </>
    )
}

export default PageNotFound
