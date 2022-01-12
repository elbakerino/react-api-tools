import React from 'react'
import { isImmutable, List, Map } from 'immutable'

/*
 * If the value passed in is structurally equal to the one saved in the ref,
 * it will return the one saved in the ref to preserve reference equality
 */
export function useImmutable<T extends List<any> | Map<any, any> | any = List<any> | Map<any, any> | any>(value: T): T {
    const currentState = React.useRef(value)
    if(
        !isImmutable(currentState.current) ||
        (
            typeof currentState.current !== 'object' ||
            // @ts-ignore
            !('equals' in currentState.current) ||
            // @ts-ignore
            !currentState.current?.equals(value)
        )
    ) {
        // update the referenced immutable when:
        // - value is not an immutable (Map/List)
        // - the current state doesn't equal the next value - what must only be done when not an immutable data type
        currentState.current = value
    }
    return currentState.current
}
