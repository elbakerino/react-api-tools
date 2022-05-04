import React from 'react'
import { LoadingCircular } from '@control-ui/kit/Loading/LoadingCircular'
import { TypographyTypeMap } from '@mui/material/Typography'
import { LoadingComponentProps } from 'react-loadable'

export const loading = (title: string): React.ComponentType<LoadingComponentProps & {
    textColor?: TypographyTypeMap<{}>['props']['color']
    width?: string | undefined
// eslint-disable-next-line react/display-name
}> => (props): React.ReactElement => <LoadingCircular {...props} title={title}/>
