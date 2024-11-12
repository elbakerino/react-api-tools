import React from 'react'
import {
    ps,
    ProgressStateValues,
    ProgressStateWithContext,
} from 'react-progress-state/useProgress'
import {
    ProgressControlContextDataScope,
    ProgressControlContextSet, ProgressControlContextState,
    progressControlInitial, setProgressControl,
} from 'react-progress-state/ProgressControlProvider'

/**
 * @deprecated will be removed without replacement
 */
export type getProgress<T = string | number> = (id?: T) => ProgressStateWithContext

/**
 * @deprecated will be removed without replacement
 */
export function useProgressControlReset() {
    // eslint-disable-next-line deprecation/deprecation
    const {set, ref} = React.useContext(ProgressControlContextSet)
    const resetScopes = React.useCallback((scopes: string[]): void => {
        set(pc => {
            scopes.forEach((scope) => {
                if(pc[scope]) {
                    delete pc[scope]
                }
                if(ref.current[scope]) {
                    delete ref.current[scope]
                }
            })
            return pc
        })
    }, [set, ref])

    const resetAll = React.useCallback((): void => {
        Object.keys(ref.current).forEach((scope) =>
            delete ref.current[scope],
        )
        // eslint-disable-next-line deprecation/deprecation
        set({...progressControlInitial})
    }, [set, ref])

    return {resetScopes, resetAll}
}

/**
 * @deprecated will be removed without replacement
 */
export interface UseProgressControlActionsStateLess {
    /**
     * static function, does not trigger rerender
     */
    isStarted: (id: string | number) => boolean
    /**
     * static function, does not trigger rerender
     */
    isDone: (id: string | number) => boolean
    /**
     * static function, does not trigger rerender
     * @deprecated
     */
    isAlreadyDone: (id: string | number) => boolean
    setStart: (id: string | number, context?: any) => number
    setDone: (id: string | number, context?: any, pid?: number) => boolean
    setError: (id: string | number, context?: any, pid?: number) => boolean
}

/**
 * @deprecated will be removed without replacement
 */
// eslint-disable-next-line deprecation/deprecation
export interface UseProgressControlActions extends UseProgressControlActionsStateLess {
    scopeProgress: ProgressControlContextDataScope
    // eslint-disable-next-line deprecation/deprecation
    getProgress: getProgress
    resetScope: () => void
}

const scopeSetterDispatcher = (
    scope: string,
    id: string | number,
    progress: ProgressStateValues,
    context: any,
    updater: setProgressControl,
    // eslint-disable-next-line deprecation/deprecation
    ref: ProgressControlContextSet['ref'],
) => {
    if(!ref.current[scope]) {
        ref.current[scope] = {}
    }
    ref.current[scope][String(id)] = progress
    updater(pc => ({
        ...pc,
        [scope]: {
            ...(pc[scope] || {}),
            [String(id)]: [progress, context],
        },
    }))
}

/**
 * @deprecated will be removed without replacement
 */
// eslint-disable-next-line deprecation/deprecation
export function useProgressControl(scope: string): UseProgressControlActions {
    const pidsRef = React.useRef<{ [k: string]: number }>({})
    // eslint-disable-next-line deprecation/deprecation
    const {set, ref} = React.useContext(ProgressControlContextSet)
    // eslint-disable-next-line deprecation/deprecation
    const progressControl = React.useContext(ProgressControlContextState)

    const currentProgress = progressControl?.[scope]

    const scopeSetter = React.useCallback((id: string | number, progress: ProgressStateValues, context: any) => {
        scopeSetterDispatcher(scope, id, progress, context, set, ref)
    }, [scope, set, ref])

    React.useEffect(() => {
        return () => {
            pidsRef.current = {}
        }
    }, [pidsRef])

    const isAlreadyDone = React.useCallback((id: string | number): boolean => {
        // todo: it is safer to only check for done - and maybe load multiple times initially when mounting multiple with the same loader
        return ref.current[scope]?.[String(id)] === ps.start || ref.current[scope]?.[String(id)] === ps.done
    }, [scope, ref])

    const isDone = React.useCallback((id: string | number): boolean => {
        return ref.current[scope]?.[String(id)] === ps.done
    }, [scope, ref])

    const isStarted = React.useCallback((id: string | number): boolean => {
        return ref.current[scope]?.[String(id)] === ps.start
    }, [scope, ref])

    const setStart = React.useCallback((id: string | number, context?: any): number => {
        scopeSetter(id, ps.start, context)
        return pidsRef.current[String(id)] = (pidsRef.current[String(id)] || 0) + 1
    }, [scopeSetter, pidsRef])

    const setDone = React.useCallback((id: string | number, context?: any, pid?: number): boolean => {
        if(typeof pid === 'number' && pidsRef.current?.[id] !== pid) {
            return false
        }
        scopeSetter(id, ps.done, context)
        return true
    }, [scopeSetter])

    const setError = React.useCallback((id: string | number, context?: any, pid?: number): boolean => {
        if(typeof pid === 'number' && pidsRef.current?.[id] !== pid) {
            return false
        }
        scopeSetter(id, ps.error, context)
        return true
    }, [scopeSetter])

    const resetScope = React.useCallback((): void => {
        set(pc => {
            const p2 = {...pc}
            p2[scope] = {}
            return p2
        })
        ref.current[scope] = {}
    }, [scope, set, ref])

    // eslint-disable-next-line deprecation/deprecation
    const getProgress = React.useCallback<getProgress>((id) => {
        if(typeof id === 'undefined') return {progress: ps.none, context: undefined}
        const progress = (id && currentProgress?.[String(id)]) || [ps.none]
        return {progress: progress[0], context: progress[1]}
    }, [currentProgress])

    return {
        scopeProgress: currentProgress as ProgressControlContextDataScope,
        isStarted, isAlreadyDone, isDone,
        setStart, setDone, setError, getProgress,
        resetScope,
    }
}
