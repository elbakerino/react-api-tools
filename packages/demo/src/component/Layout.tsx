import React from 'react'
import { LoadingCircular } from '@control-ui/kit/Loading'
import { RouteCascade } from '@control-ui/routes/RouteCascade'
import IconButton from '@mui/material/IconButton'
import InvertColorsIcon from '@mui/icons-material/InvertColors'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Header } from '@control-ui/app/Header'
import { useSwitchTheme } from '@control-ui/app/AppTheme'
import { Layout, LayoutProps } from '@control-ui/app/Layout'
import Loadable from 'react-loadable'
import { RouteComponentProps } from 'react-router'

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

const PageNotFound: React.ComponentType<RouteComponentProps> = Loadable({
    loader: () => import('../page/PageNotFound'),
    loading: () => <LoadingCircular title={'Not Found'}/>,
})

const RoutingBase: LayoutProps['Content'] = (p) =>
    // @ts-ignore
    <RouteCascade routeId={'content'} childProps={p} Fallback={PageNotFound}/>
export const Routing: LayoutProps['Content'] = React.memo(RoutingBase)

export const CustomLayout: React.ComponentType<{}> = () => {
    const location = useLocation()
    return <>
        <Layout
            Header={CustomHeader}
            // Drawer={CustomDrawer}
            Content={Routing}
            mainContentStyle={{position: 'relative'}}
            locationPath={location.pathname}
        />
    </>
}
