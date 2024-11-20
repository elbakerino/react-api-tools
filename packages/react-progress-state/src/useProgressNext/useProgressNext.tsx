import { useEffect, useRef, useState } from 'react'
import { ProgressStateValues as ProgressStateValuesLegacy } from 'react-progress-state'

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
export type resetProgress<CX = unknown> = (context?: CX, pid?: number) => void

/**
 * @deprecated will be removed when legacy is removed
 */
export const legacyToNext = (progress: ProgressStateValuesLegacy): ProgressStateValues =>
    progress === false
        ? 'none'
        : progress === 'start'
            ? 'loading'
            : progress === true
                ? 'success'
                : 'error'

export function useProgress<CX = unknown>(reset?: any, initial: ProgressStateValues = ps.none): [
    ProgressStateWithContext<CX>,
    setProgress<CX>,
    startProgress<CX>,
    resetProgress<CX>,
] {
    const pidRef = useRef(0)
    const mountedRef = useRef(false)

    const [progress, setP] = useState<ProgressStateWithContext<CX>>({
        progress: initial,
        context: undefined,
    })

    useEffect(() => {
        if(!mountedRef.current) return

        pidRef.current = pidRef.current + 1
        setP({
            progress: ps.none,
            context: undefined,
        })
    }, [reset])

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [])

    const {current: [setProgress, startProgress, resetProgress]} = useRef<[
        setProgress: setProgress<CX>,
        startProgress: startProgress<CX>,
        resetProgress: resetProgress<CX>,
    ]>([
        // setProgress
        (progress, context, pid) => {
            if(!mountedRef.current || (typeof pid === 'number' && pidRef.current !== pid)) {
                return false
            }

            setP({
                progress,
                context,
            })

            return true
        },
        // startProgress
        (context) => {
            if(!mountedRef.current) {
                return -1
            }

            setP({
                progress: ps.loading,
                context,
            })
            return pidRef.current = pidRef.current + 1
        },
        // resetProgress
        (context, pid) => {
            if(!mountedRef.current || (typeof pid === 'number' && pidRef.current !== pid)) {
                return false
            }

            pidRef.current += 1
            setP({
                progress: ps.none,
                context,
            })

            return true
        },
    ])

    return [progress, setProgress, startProgress, resetProgress]
}
