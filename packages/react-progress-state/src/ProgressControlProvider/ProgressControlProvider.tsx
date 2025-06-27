import React from 'react'
import { ProgressStateValues } from 'react-progress-state/useProgress'

export type ProgressControlContextDataScope = { [id: string]: [ProgressStateValues, any] }
export type ProgressControlContextData = { [scope: string]: ProgressControlContextDataScope }
export type ProgressControlContextSet = {
    set: setProgressControl
    ref: React.RefObject<{ [p: string]: { [p: string]: ProgressStateValues } }>
}

export type setProgressControl = React.Dispatch<React.SetStateAction<ProgressControlContextData>>

/**
 * @deprecated will be removed without replacement
 */
export const ProgressControlContextState = React.createContext<ProgressControlContextData>(undefined as any)
/**
 * @deprecated will be removed without replacement
 */
// eslint-disable-next-line deprecation/deprecation
export const ProgressControlContextSet = React.createContext<ProgressControlContextSet>(undefined as any)
/**
 * @deprecated will be removed without replacement
 */
export const progressControlInitial = {} as ProgressControlContextData
/**
 * @deprecated will be removed without replacement
 */
export const ProgressControlProvider = ({children}: React.PropsWithChildren<any>) => {
    // eslint-disable-next-line deprecation/deprecation
    const state = React.useState<ProgressControlContextData>(() => ({...progressControlInitial}))
    const stateRef = React.useRef<{
        [key: string]: { [key: string]: ProgressStateValues }
    }>({})
    const set = state[1]

    // eslint-disable-next-line deprecation/deprecation
    const ctxSet: ProgressControlContextSet = React.useMemo(() => ({
        set: set,
        ref: stateRef,
    }), [set, stateRef])


    // eslint-disable-next-line deprecation/deprecation
    return <ProgressControlContextSet.Provider value={ctxSet}>
        {/* eslint-disable-next-line deprecation/deprecation */}
        <ProgressControlContextState.Provider value={state[0]}>
            {children}
            {/* eslint-disable-next-line deprecation/deprecation */}
        </ProgressControlContextState.Provider>
        {/* eslint-disable-next-line deprecation/deprecation */}
    </ProgressControlContextSet.Provider>
}
