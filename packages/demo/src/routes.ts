import React from 'react'
import Loadable, { LoadableComponent, LoadingComponentProps } from 'react-loadable'
import { Route } from '@control-ui/app/RouterProvider'

export type makeLoaderComponent = (title: string) => React.ComponentType<LoadingComponentProps>

export interface CustomRoute extends Route {
    nav?: Route['nav'] & { initialOpen?: boolean }
    content?: {
        exact?: boolean
        component: React.ComponentType<any> & LoadableComponent
    }
    routes?: CustomRoute[]
    doc?: string
}

export const routes = (loading: makeLoaderComponent): CustomRoute => ({
    routes: [
        {
            path: '/',
            content: {
                exact: true,
                component: Loadable({
                    loader: () => import('./page/PageMain'),
                    loading: loading('Loading Home'),
                }),
            },
        },
    ],
})
