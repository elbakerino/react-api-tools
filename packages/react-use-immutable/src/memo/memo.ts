import React from 'react'
import { List, Map, Record } from 'immutable'
import { getDisplayName } from './getDisplayName'

const compare = (prev: any, next: any) => {
    if(List.isList(next) || Map.isMap(next) || Record.isRecord(next)) {
        return next.equals(prev)
    } else if(Array.isArray(next)) {
        return prev === next
    } else if(typeof next === 'object') {
        return Object.is(prev, next)
    }

    // these should be any scalar values, except `null`, which is handled correctly by `Object.is`
    return prev === next
}

export const isEqual = (prevProps: { [k: string]: any }, nextProps: { [k: string]: any }): boolean => {
    const prevKeys = Object.keys(prevProps)
    const nextKeys = Object.keys(nextProps)
    if(
        prevKeys.length !== nextKeys.length ||
        !prevKeys.every(v => nextKeys.includes(v))
    ) {
        return false
    }

    for(const next in nextProps) {
        if(!compare(prevProps[next], nextProps[next])) {
            return false
        }
    }

    return true
}

/**
 * Immutable compatible `React.memo` comparison
 */
export const memo = <P extends {} = {}>(Component: React.ComponentType<P>): React.ComponentType<P> => {
    const Memoized = React.memo(Component, isEqual)
    Memoized.displayName = getDisplayName(Component as React.ComponentType)
    return Memoized as unknown as React.ComponentType<P>
}
