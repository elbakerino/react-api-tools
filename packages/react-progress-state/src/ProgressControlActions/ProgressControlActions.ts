import React from 'react'
import { List, Map } from 'immutable'
import {
    PROGRESS,
    PROGRESS_CONTEXT,
    PROGRESS_DONE, PROGRESS_ERROR, PROGRESS_START,
} from 'react-progress-state/useProgress'
import {
    ProgressControlContextDataScope,
    ProgressControlContextSet, ProgressControlContextState,
    progressControlInitial, setProgressControl,
} from 'react-progress-state/ProgressControlProvider'
import { useImmutable } from 'react-use-immutable'

// todo: refactor so it isn't a "global" module data object / more something with `refs`
const progressControlState: {
    [key: string]: { [key: string]: PROGRESS }
} = {}

export type getProgress<T = string | number> = (id?: T) => PROGRESS_CONTEXT

export function useProgressControlReset() {
    const setProgressControl = React.useContext(ProgressControlContextSet)
    const resetScopes = React.useCallback((scopes: string[]): void => {
        setProgressControl(pc => {
            scopes.forEach((scope) => {
                pc = pc.delete(scope)
                delete progressControlState[scope]
            })
            return pc
        })
    }, [setProgressControl])

    const resetAll = React.useCallback((): void => {
        Object.keys(progressControlState).forEach((scope) =>
            delete progressControlState[scope],
        )
        setProgressControl(progressControlInitial)
    }, [setProgressControl])

    return {resetScopes, resetAll}
}

export interface UseProgressControlActionsStateLess {
    /**
     * static function, does not trigger rerender
     */
    isStarted: (id: string | number) => boolean
    /**
     * static function, does not trigger rerender
     */
    isAlreadyDone: (id: string | number) => boolean
    setStart: (id: string | number, context?: any) => number
    setDone: (id: string | number, context?: any, pid?: number) => boolean
    setError: (id: string | number, context?: any, pid?: number) => boolean
}

export interface UseProgressControlGlobalActionsStateLess {
    /**
     * static function, does not trigger rerender
     */
    isStarted: (scope: string, id: string | number) => boolean
    /**
     * static function, does not trigger rerender
     */
    isAlreadyDone: (scope: string, id: string | number) => boolean
    setStart: (scope: string, id: string | number, context?: any) => number
    setDone: (scope: string, id: string | number, context?: any, pid?: number) => boolean
    setError: (scope: string, id: string | number, context?: any, pid?: number) => boolean
}

export interface UseProgressControlActions extends UseProgressControlActionsStateLess {
    scopeProgress: ProgressControlContextDataScope
    getProgress: getProgress
    resetScope: () => void
}

const scopeSetterDispatcher = (scope: string, id: string | number, progress: PROGRESS, context: any, updater: setProgressControl) => {
    if(!progressControlState[scope]) {
        progressControlState[scope] = {}
    }
    progressControlState[scope][String(id)] = progress
    updater(pc => pc.setIn([scope, String(id)], List([progress, context])))
}

export function useProgressControl(scope: string): UseProgressControlActions {
    const pidsRef = React.useRef<{ [k: string]: number }>({})
    const setProgressControl = React.useContext(ProgressControlContextSet)
    const progressControl = React.useContext(ProgressControlContextState)

    const scopeProgress = progressControl.get(scope)
    const currentProgress = useImmutable(scopeProgress)

    const scopeSetter = React.useCallback((id: string | number, progress: PROGRESS, context: any) => {
        scopeSetterDispatcher(scope, id, progress, context, setProgressControl)
    }, [scope, setProgressControl])

    React.useEffect(() => {
        return () => {
            pidsRef.current = {}
        }
    }, [pidsRef])

    const isAlreadyDone = React.useCallback((id: string | number): boolean => {
        return progressControlState[scope]?.[String(id)] === PROGRESS_START || progressControlState[scope]?.[String(id)] === PROGRESS_DONE
    }, [scope])

    const isStarted = React.useCallback((id: string | number): boolean => {
        return progressControlState[scope]?.[String(id)] === PROGRESS_START
    }, [scope])

    const setStart = React.useCallback((id: string | number, context?: any): number => {
        scopeSetter(id, PROGRESS_START, context)
        return pidsRef.current[String(id)] = (pidsRef.current[String(id)] || 0) + 1
    }, [scopeSetter, pidsRef])

    const setDone = React.useCallback((id: string | number, context?: any, pid?: number): boolean => {
        if(typeof pid === 'number' && pidsRef.current?.[id] !== pid) {
            return false
        }
        scopeSetter(id, PROGRESS_DONE, context)
        return true
    }, [scopeSetter])

    const setError = React.useCallback((id: string | number, context?: any, pid?: number): boolean => {
        if(typeof pid === 'number' && pidsRef.current?.[id] !== pid) {
            return false
        }
        scopeSetter(id, PROGRESS_ERROR, context)
        return true
    }, [scopeSetter])

    const resetScope = React.useCallback((): void => {
        setProgressControl(pc => pc.setIn([scope], Map()))
        progressControlState[scope] = {}
    }, [scope, setProgressControl])

    const getProgress = React.useCallback<getProgress>((id) => {
        const progress = (id && currentProgress?.get(String(id))) || List([false])
        return {progress: progress.get(0), context: progress.get(1)}
    }, [currentProgress])

    return {
        scopeProgress: currentProgress as ProgressControlContextDataScope,
        isStarted, isAlreadyDone,
        setStart, setDone, setError, getProgress,
        resetScope,
    }
}

export function useProgressActions(): UseProgressControlGlobalActionsStateLess {
    const pidsRef = React.useRef<{ [k: string]: { [k: string]: number } }>({})
    const setProgressControl = React.useContext(ProgressControlContextSet)

    React.useEffect(() => {
        return () => {
            pidsRef.current = {}
        }
    }, [pidsRef])

    const isAlreadyDone = React.useCallback((scope: string, id: string | number): boolean => {
        return progressControlState[scope]?.[String(id)] === PROGRESS_START || progressControlState[scope]?.[String(id)] === PROGRESS_DONE
    }, [])

    const isStarted = React.useCallback((scope: string, id: string | number): boolean => {
        return progressControlState[scope]?.[String(id)] === PROGRESS_START
    }, [])

    const scopeSetter = React.useCallback((scope: string, id: string | number, progress: PROGRESS, context: any) => {
        scopeSetterDispatcher(scope, id, progress, context, setProgressControl)
    }, [setProgressControl])

    const setStart = React.useCallback((scope: string, id: string | number, context?: any): number => {
        scopeSetter(scope, id, PROGRESS_START, context)
        if(!pidsRef.current?.[scope]) {
            pidsRef.current[scope] = {}
        }
        return pidsRef.current[scope][String(id)] = (pidsRef.current[scope][String(id)] || 0) + 1
    }, [scopeSetter, pidsRef])

    const setDone = React.useCallback((scope: string, id: string | number, context?: any, pid?: number): boolean => {
        if(typeof pid === 'number' && pidsRef.current?.[scope]?.[id] !== pid) {
            return false
        }
        scopeSetter(scope, id, PROGRESS_DONE, context)
        return true
    }, [scopeSetter, pidsRef])

    const setError = React.useCallback((scope: string, id: string | number, context?: any, pid?: number): boolean => {
        if(typeof pid === 'number' && pidsRef.current?.[scope]?.[id] !== pid) {
            return false
        }
        scopeSetter(scope, id, PROGRESS_ERROR, context)
        return true
    }, [scopeSetter, pidsRef])

    return {
        isStarted, isAlreadyDone,
        setStart, setDone, setError,
    }
}
