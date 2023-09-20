import { isEqual } from 'react-use-immutable/memo'
import { createMap } from 'react-use-immutable/createImmutable'
import { List } from 'immutable'

describe('isEqual', () => {
    test.each([
        [{a: 'name'}, {a: 'name'}, true],
        [{a: 'name'}, {a: 'names'}, false],
        [{a: 'name'}, {b: 'name'}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({c: 'name'})}, true],
        [{a: {c: 'name'}}, {a: createMap({c: 'name'})}, false],
        [{a: createMap({c: 'name'})}, {a: {c: 'name'}}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({c: 'names'})}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({b: 'name'})}, false],
        [{a: List(['name'])}, {a: List(['name'])}, true],
        [{a: ['name']}, {a: List(['name'])}, false],
        [{a: List(['name'])}, {a: ['name']}, false],
        [{a: List(['name'])}, {a: List(['names'])}, false],
        [{a: List(['name'])}, {a: List(['name', 'street'])}, false],
        [{a: List(['name']), b: true}, {a: List(['name']), b: true}, true],
        [{a: List(['name']), b: true}, {a: List(['name']), b: false}, false],
    ])(
        'isEqual(%j, %s)',
        (prevProps, nextProps, expectedValid) => {
            expect(isEqual(prevProps, nextProps)).toBe(expectedValid)
        },
    )
})
