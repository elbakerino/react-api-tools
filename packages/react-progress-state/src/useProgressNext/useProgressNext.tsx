import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Next state values, differences to deprecated:
 * - false to none
 * - start to loading
 * - done/true to success
 */
export type ProgressStateValues = 'none' | 'loading' | 'success' | 'error'

export type ProgressStates = {
    readonly [K in ProgressStateValues]: ProgressStateValues
}

export const ps: ProgressStates = {
    none: 'none',
    loading: 'loading',
    success: 'success',
    error: 'error',
}

export interface ProgressStateWithContext<CX = any> {
    progress: ProgressStateValues
    context: CX | undefined
}

export type setProgress<CX = unknown> = (progress: ProgressStateValues, context?: CX, pid?: number) => boolean
export type startProgress<CX = unknown> = (context?: CX) => number
export type resetProgress<CX = unknown> = (context?: CX) => void

export function useProgress<CX = unknown>(reset?: any, initial: ProgressStateValues = ps.none): [
    ProgressStateWithContext<CX>,
    setProgress<CX>,
    startProgress<CX>,
    resetProgress<CX>,
] {
    const refReset = useRef(reset)
    const pidRef = useRef(0)
    const mountedRef = useRef(true)

    const [progress, setP] = useState<ProgressStateWithContext<CX>>({
        progress: initial,
        context: undefined,
    })

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [mountedRef])

    useEffect(() => {
        if(reset !== refReset.current) {
            refReset.current = reset
            pidRef.current = pidRef.current + 1
        }
        setP({
            progress: ps.none,
            context: undefined,
        })
    }, [pidRef, reset, setP])

    const startProgress: startProgress<CX> = useCallback((context) => {
        setP({
            progress: ps.loading,
            context,
        })
        return pidRef.current = pidRef.current + 1
    }, [setP, pidRef])

    const setProgress: setProgress<CX> = useCallback((progress, context, pid) => {
        if(!mountedRef.current || (typeof pid === 'number' && pidRef.current !== pid)) {
            return false
        }
        setP({
            progress, context,
        })
        return true
    }, [setP, pidRef, mountedRef])

    const resetProgress: resetProgress<CX> = useCallback((context) => {
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
