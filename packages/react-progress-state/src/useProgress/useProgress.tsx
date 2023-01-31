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
export type resetProgress<CX = any> = (context?: CX) => void

export function useProgress<CX = any>(reset?: any, initial: ProgressStateValues = ps.none): [
    ProgressStateWithContext<CX>,
    setProgress<CX>,
    startProgress<CX>,
    resetProgress<CX>,
] {
    const refReset = React.useRef(reset)
    const pidRef = React.useRef(0)
    const mountedRef = React.useRef(true)

    const [progress, setP] = React.useState<ProgressStateWithContext<CX>>({
        progress: initial,
        context: undefined,
    })

    React.useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [mountedRef])

    React.useEffect(() => {
        if(reset !== refReset.current) {
            pidRef.current = pidRef.current + 1
        }
        setP({
            progress: ps.none,
            context: undefined,
        })
    }, [pidRef, reset, setP])

    const startProgress: startProgress = React.useCallback((context) => {
        setP({
            progress: ps.start,
            context,
        })
        return pidRef.current = pidRef.current + 1
    }, [setP, pidRef])

    const setProgress: setProgress = React.useCallback((progress, context, pid) => {
        if(!mountedRef.current || (typeof pid === 'number' && pidRef.current !== pid)) {
            return false
        }
        setP({
            progress, context,
        })
        return true
    }, [setP, pidRef, mountedRef])

    const resetProgress: resetProgress = React.useCallback((context) => {
        pidRef.current = pidRef.current + 1
        if(!mountedRef.current) {
            return
        }
        setP({
            progress: ps.none,
            context: context,
        })
    }, [setP, pidRef, mountedRef])

    return [progress, setProgress, startProgress, resetProgress]
}
