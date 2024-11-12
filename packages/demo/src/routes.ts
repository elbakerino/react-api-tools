import React, { lazy } from 'react'
import { Route } from '@control-ui/routes/Route'

export interface CustomRoute extends Route {
    nav?: Route['nav'] & { initialOpen?: boolean }
    content?: {
        exact?: boolean
        component: React.ComponentType<any>
    }
    routes?: CustomRoute[]
    doc?: string
}

export const routes = (): CustomRoute => ({
    routes: [
        {
            path: '/',
            config: {
                content: {
                    exact: true,
                    component: lazy(() => import('./page/PageMain')),
                },
            },
        },
    ],
})
