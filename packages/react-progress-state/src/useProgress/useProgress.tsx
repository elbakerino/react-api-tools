import React from 'react'

export const PROGRESS_NONE = false
export const PROGRESS_START = 'start'
export const PROGRESS_DONE = true
export const PROGRESS_ERROR = 'error'

export type PROGRESS = false | 'start' | true | 'error'

export interface ApiErrorData {
    code: number
    data: { error: string } & Object
}

export interface PROGRESS_CONTEXT {
    progress: PROGRESS
    context: ApiErrorData | any
}

export function useProgress(): [PROGRESS_CONTEXT, (progress: PROGRESS, context?: ApiErrorData | any) => void] {
    const [progress, setP] = React.useState<PROGRESS_CONTEXT>({
        progress: PROGRESS_NONE,
        context: undefined,
    })
    const setProgress = React.useCallback((progress, context) => {
        setP({
            progress, context,
        })
    }, [setP])
    return [progress, setProgress]
}
