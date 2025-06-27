import { PropsWithChildren } from 'react'
import { App } from '@control-ui/app/App'
import { CustomLayout } from './component/Layout'
import { BrowserRouter } from 'react-router-dom'
import { I18nProviderContext } from '@control-ui/app'
import { routes } from './routes'

const Provider = ({children}: PropsWithChildren<{}>) => {
    return <BrowserRouter>
        {/* @ts-expect-error */}
        {children}
    </BrowserRouter>
}

const i18n: I18nProviderContext = {
    allLanguages: {
        en: '0.1',
    },
    detection: ['localStorage'],
    loader: (url) => import ('./locales/' + url + '.json'),
    expiration: 1000,
}

const CustomApp = () =>
    <BrowserRouter basename={'/'}>
        <App
            routes={routes()}
            Layout={CustomLayout}
            i18n={i18n}
            Provider={Provider}
        />
    </BrowserRouter>

export default CustomApp
