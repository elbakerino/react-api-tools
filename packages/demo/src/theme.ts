import { createTheme as createMuiTheme } from '@mui/material/styles'

const universal = {
    breakpoints: {
        values: {
            xs: 0,
            sm: 335,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    typography: {
        fontSize: 14,
        h1: {
            fontSize: '2.3rem',
        },
        h2: {
            fontSize: '2.015rem',
        },
        h3: {
            fontSize: '1.85rem',
        },
        h4: {
            fontSize: '1.65rem',
        },
        h5: {
            fontSize: '1.415rem',
        },
        h6: {
            fontSize: '1.125rem',
        },
        body1: {
            letterSpacing: '0.0185em',
        },
        body2: {
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 0,
    },
}

const themeDark = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#0ed292',
        },
        secondary: {
            light: '#d8eed4',
            main: '#8fbb87',
            dark: '#002634',
        },
        background: {
            paper: '#13181c',
            default: '#010203',
        },
        text: {
            primary: '#c6c4c4',
            secondary: '#acc9c5',
        },
        action: {
            hoverOpacity: 0.2,
        },
    },
    ...universal,
})

const themeLight = createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#10845e',
        },
        secondary: {
            light: '#d8eed4',
            main: '#37936c',
            dark: '#002634',
        },
        background: {
            //paper: '#e8e8e8',
            paper: '#f7f7f7',
            //default: '#d2d2d2',
            //default: '#e3e3e3',
            default: '#ececec',
        },
        text: {
            primary: '#001f29',
            secondary: '#001820',
        },
        action: {
            hoverOpacity: 0.2,
        },
    },
    ...universal,
})

export const themes = {
    dark: themeDark,
    light: themeLight,
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const customTheme = (primary: string) => {
    const themeDark = createMuiTheme({
        palette: {
            type: 'dark',
            primary: {
                //light: '#43c0d5',
                main: primary,
                //dark: '#033944',
            },
            secondary: {
                light: '#d8eed4',
                main: '#8fbb87',
                dark: '#002634',
            },
            background: {
                paper: '#13181c',
                default: '#010203',
            },
            text: {
                primary: '#c6c4c4',
                secondary: '#acc9c5',
            },
            action: {
                hoverOpacity: 0.2,
            },
        },
        ...universal,
    })

    const themeLight = createMuiTheme({
        palette: {
            type: 'light',
            primary: {
                main: primary,
                //dark: '#033944',
            },
            secondary: {
                light: '#d8eed4',
                main: '#37936c',
                dark: '#002634',
            },
            background: {
                //paper: '#e8e8e8',
                paper: '#f7f7f7',
                //default: '#d2d2d2',
                //default: '#e3e3e3',
                default: '#ececec',
            },
            text: {
                primary: '#001f29',
                secondary: '#001820',
            },
            action: {
                hoverOpacity: 0.2,
            },
        },
        ...universal,
    })

    return {
        dark: themeDark,
        light: themeLight,
    }
}
