import React from 'react'

/**
 * @deprecated use `ps.none` instead
 */
export const PROGRESS_NONE = false
/**
 * @deprecated use `ps.start` instead
 */
export const PROGRESS_START = 'start'
/**
 * @deprecated use `ps.done` instead
 */
export const PROGRESS_DONE = true
/**
 * @deprecated use `ps.error` instead
 */
export const PROGRESS_ERROR = 'error'

export type ProgressStateValues = false | 'start' | true | 'error'

export interface ProgressStates {
    none: false
    start: 'start'
    done: true
    error: 'error'
}

export const ps: ProgressStates = {
    none: false,
    start: 'start',
    done: true,
    error: 'error',
}

/**
 * @deprecated
 */
export type PROGRESS = ProgressStateValues

export interface ProgressStateWithContext<CX = any> {
    progress: ProgressStateValues
    context: CX | undefined
}

/**
 * @deprecated
 */
export type PROGRESS_CONTEXT = ProgressStateWithContext

export type setProgress<CX = any> = (progress: ProgressStateValues, context?: CX, pid?: number) => boolean
export type startProgress<CX = any> = (context?: CX) => number

export function useProgress<CX = any>(reset?: any): [
    ProgressStateWithContext<CX>,
    setProgress<CX>,
    startProgress<CX>,
] {
    const pidRef = React.useRef(0)
    const mountedRef = React.useRef(true)

    const [progress, setP] = React.useState<ProgressStateWithContext<CX>>({
        progress: ps.none,
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
            progress: ps.none,
            context: undefined,
        })
        return () => {
            pidRef.current = pidRef.current + 1
        }
    }, [pidRef, reset, setP])

    const startProgress: startProgress = React.useCallback((context) => {
        setP({
            progress: ps.start,
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
