import React from 'react'
import {render} from 'react-dom'
import {unstable_trace as trace} from 'scheduler/tracing';
import {AppLoader} from '@control-ui/app/AppLoader'
import {themes} from './theme';

const onError = (error) => console.log(error)
const App = AppLoader(
    {themes},
    () => import('./App'),
    'Loading',
    'Error loading App component',
    onError,
)

trace('initial render', performance.now(), () =>
    render(
        <React.Profiler id="Demo App" onRender={() => null}>
            <App/>
        </React.Profiler>,
        document.querySelector('#root'),
    ),
)
