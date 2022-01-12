import React from 'react'
import { List, Map } from 'immutable'
import { PROGRESS_CONTEXT } from 'react-progress-state/useProgress'

export type ProgressControlContextDataScope = Map<string, List<PROGRESS_CONTEXT | any>>
export type ProgressControlContextData = Map<string, ProgressControlContextDataScope>

export type setProgressControl = React.Dispatch<React.SetStateAction<ProgressControlContextData>>

// @ts-ignore
export const ProgressControlContextState = React.createContext<ProgressControlContextData>(undefined)
// @ts-ignore
export const ProgressControlContextSet = React.createContext<setProgressControl>(undefined)

export const progressControlInitial = Map() as ProgressControlContextData
export const ProgressControlProvider = ({children}: React.PropsWithChildren<any>) => {
    const state = React.useState<ProgressControlContextData>(progressControlInitial)

    return <ProgressControlContextSet.Provider value={state[1]}>
        <ProgressControlContextState.Provider value={state[0]}>
            {children}
        </ProgressControlContextState.Provider>
    </ProgressControlContextSet.Provider>
}
