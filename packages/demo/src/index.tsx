import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppLoader } from '@control-ui/app/AppLoader'
import { themes } from './theme'

const onError = (error: any) => console.log(error)
const App = AppLoader(
    {themes},
    () => import('./App'),
    'Loading',
    'Error loading App component',
    onError,
)

createRoot(document.querySelector('#root') as HTMLElement)
    .render(
        <React.StrictMode>
            <React.Profiler id="Demo App" onRender={() => null}>
                <App/>
            </React.Profiler>
        </React.StrictMode>,
    )
