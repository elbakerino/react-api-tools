import React from 'react'
import { ProgressStateValues } from 'react-progress-state/useProgress'

export type ProgressControlContextDataScope = { [id: string]: [ProgressStateValues, any] }
export type ProgressControlContextData = { [scope: string]: ProgressControlContextDataScope }
export type ProgressControlContextSet = {
    set: setProgressControl
    ref: React.MutableRefObject<{ [p: string]: { [p: string]: ProgressStateValues } }>
}

export type setProgressControl = React.Dispatch<React.SetStateAction<ProgressControlContextData>>

// @ts-ignore
export const ProgressControlContextState = React.createContext<ProgressControlContextData>(undefined)
// @ts-ignore
export const ProgressControlContextSet = React.createContext<ProgressControlContextSet>()

export const progressControlInitial = {} as ProgressControlContextData
export const ProgressControlProvider = ({children}: React.PropsWithChildren<any>) => {
    const state = React.useState<ProgressControlContextData>(() => ({...progressControlInitial}))
    const stateRef = React.useRef<{
        [key: string]: { [key: string]: ProgressStateValues }
    }>({})
    const set = state[1]
    const ctxSet: ProgressControlContextSet = React.useMemo(() => ({
        set: set,
        ref: stateRef,
    }), [set, stateRef])

    return <ProgressControlContextSet.Provider value={ctxSet}>
        <ProgressControlContextState.Provider value={state[0]}>
            {children}
        </ProgressControlContextState.Provider>
    </ProgressControlContextSet.Provider>
}
