import React from 'react'
import { App } from '@control-ui/app/App'
import { CustomLayout } from './component/Layout'
import { BrowserRouter } from 'react-router-dom'
import { I18nProviderContext } from '@control-ui/app'
import { routes } from './routes'
import { loading } from './component/Loading'

const Provider: React.ComponentType<React.PropsWithChildren<{}>> = ({children}) => {
    return <BrowserRouter>
        {children}
    </BrowserRouter>
}

const i18n: I18nProviderContext = {
    allLanguages: {
        en: '0.1',
    },
    detection: ['localStorage'],
    defaultLanguage: 'en',
    loader: (url) => import ('./locales/' + url + '.json'),
    expiration: 1000,
}

const CustomApp: React.ComponentType<{}> = () =>
    <BrowserRouter basename={'/'}>
        <App
            routes={routes(loading)}
            Layout={CustomLayout}
            i18n={i18n}
            Provider={Provider}
        />
    </BrowserRouter>

export default CustomApp
