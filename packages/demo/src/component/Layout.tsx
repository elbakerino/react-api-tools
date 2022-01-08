import React from 'react'
import { LoadingCircular } from '@control-ui/kit/Loading'
import IconButton from '@material-ui/core/IconButton'
import InvertColorsIcon from '@material-ui/icons/InvertColors'
import { Link as RouterLink } from 'react-router-dom'
import { Header } from '@control-ui/app/Header'
import { useSwitchTheme } from '@control-ui/app/AppTheme'
import { Layout } from '@control-ui/app/Layout'
import Loadable from 'react-loadable'

const CustomHeader: React.ComponentType<{}> = () => {
    const {switchTheme} = useSwitchTheme()
    return <Header noDrawerToggle>
        <RouterLink
            to={'/'}
            style={{
                display: 'flex',
                marginLeft: -12,
                color: 'inherit',
                flexDirection: 'column',
                textDecoration: 'none',
                alignItems: 'flex-start',
                marginRight: 'auto',
            }}
        >
            React Api Tools
        </RouterLink>

        <IconButton color={'inherit'} onClick={() => switchTheme()} style={{marginRight: 3}}>
            <InvertColorsIcon/>
        </IconButton>
    </Header>
}

const PageNotFound = Loadable({
    loader: () => import('../page/PageNotFound'),
    loading: () => <LoadingCircular title={'Not Found'}/>,
})

export const CustomLayout: React.ComponentType<{}> = () => {
    return <>
        <Layout
            Header={CustomHeader}
            NotFound={PageNotFound}
        />
    </>
}
