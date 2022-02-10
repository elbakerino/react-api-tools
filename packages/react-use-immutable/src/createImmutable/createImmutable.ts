import { Seq, List, Map, OrderedMap, fromJS } from 'immutable'

export function fromJSOrdered<P extends { [k: string]: any } | any[] = { [k: string]: any } | any[]>(js?: P): OrderedMap<keyof P, any> | List<any> | P {
    if(Map.isMap(js) || OrderedMap.isOrderedMap(js) || List.isList(js)) {
        if(process.env.NODE_ENV === 'development') {
            console.warn('converting immutable to immutable may lead to wrong types')
        }
    }

    // @ts-ignore
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            // @ts-ignore
            Seq(js).map(fromJSOrdered).toList() :
            // @ts-ignore
            Seq(js).map(fromJSOrdered).toOrderedMap()
}

export const createOrderedMap = <P extends { [k: string]: any } = { [k: string]: any }>(data?: P): OrderedMap<keyof P, any> => OrderedMap(fromJSOrdered(data)) as OrderedMap<keyof P, any>

export const createMap = <P extends { [k: string]: any } = { [k: string]: any }>(data?: P): Map<keyof P, any> => Map(fromJS(data)) as Map<keyof P, any>

export const createList = <I>(data?: I[]): List<I> => List(fromJS(data)) as List<any>

export const createListOrdered = <I>(data?: I[]): List<I> => List(fromJSOrdered(data)) as List<any>
