import React from 'react'
import {render} from 'react-dom'
import {unstable_trace as trace} from 'scheduler/tracing';
import {AppLoader} from '@control-ui/app/AppLoader'
import {themes} from './theme';

const App = AppLoader(
    {themes},
    () => import('./App'),
    'Loading',
)

trace('initial render', performance.now(), () =>
    render(
        <React.Profiler id="Demo App" onRender={() => null}>
            <App/>
        </React.Profiler>,
        document.querySelector('#root'),
    ),
)
