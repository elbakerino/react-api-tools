import React from 'react'

export const PROGRESS_NONE = false
export const PROGRESS_START = 'start'
export const PROGRESS_DONE = true
export const PROGRESS_ERROR = 'error'

export type PROGRESS = false | 'start' | true | 'error'

export interface ApiErrorData {
    code: number
    data: ({
        error: string | { [k: string]: any } | any
    } | {
        errors: string | { [k: string]: any } | any
    }) & {
        code?: number
        message?: string | any
        reason?: string | any
    }
}

export interface PROGRESS_CONTEXT {
    progress: PROGRESS
    context: ApiErrorData | any
}

export type setProgress = (progress: PROGRESS, context?: ApiErrorData | any, pid?: number) => boolean
export type startProgress = (context?: ApiErrorData | any) => number

export function useProgress(reset?: any): [
    PROGRESS_CONTEXT,
    setProgress,
    startProgress,
] {
    const pidRef = React.useRef(0)
    const mountedRef = React.useRef(true)

    const [progress, setP] = React.useState<PROGRESS_CONTEXT>({
        progress: PROGRESS_NONE,
        context: undefined,
    })

    React.useEffect(() => {
        return () => {
            pidRef.current = 0
            mountedRef.current = false
        }
    }, [pidRef, setP, mountedRef])

    React.useEffect(() => {
        setP({
            progress: PROGRESS_NONE,
            context: undefined,
        })
        return () => {
            pidRef.current = pidRef.current + 1
        }
    }, [pidRef, reset, setP])

    const startProgress: startProgress = React.useCallback((context) => {
        setP({
            progress: PROGRESS_START,
            context,
        })
        return pidRef.current = pidRef.current + 1
    }, [setP, pidRef])

    const setProgress: setProgress = React.useCallback((progress, context, pid = 0) => {
        if(!mountedRef.current || pidRef.current !== pid) {
            // todo: maybe setting to PROGRESS_NONE when still mounted?
            return false
        }
        setP({
            progress, context,
        })
        return true
    }, [setP, pidRef, mountedRef])

    return [progress, setProgress, startProgress]
}
