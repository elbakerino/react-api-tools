const packages = ['react-api-fetch', 'react-progress-state', 'react-use-immutable']

const testMatches: string[] = []

packages.forEach(pkg => {
    testMatches.push(...[
        '<rootDir>/packages/' + pkg + '/src/**/*.(test|spec).(js|ts|tsx)',
        '<rootDir>/packages/' + pkg + '/tests/**/*.(test|spec).(js|ts|tsx)',
    ])
})

const base = {
    transformIgnorePatterns: [
        'node_modules',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.tsx$': 'ts-jest',
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^react-api-fetch(.*)$': '<rootDir>/packages/react-api-fetch/src$1',
        '^react-progress-state(.*)$': '<rootDir>/packages/react-progress-state/src$1',
        '^react-use-immutable(.*)$': '<rootDir>/packages/react-use-immutable/src$1',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],

    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?|ts?|js?)$',
        '.*.(test|spec).(js|ts|tsx)$',
        '<rootDir>/packages/demo',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/packages/.+/build',
    ],
    watchPathIgnorePatterns: [
        '<rootDir>/.idea',
        '<rootDir>/.git',
        '<rootDir>/dist',
        '<rootDir>/node_modules',
        '<rootDir>/packages/.+/node_modules',
        '<rootDir>/packages/.+/build',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/packages/.+/build',
    ],
}

export default {
    ...base,
    collectCoverage: true,
    verbose: true,
    projects: [
        {
            displayName: 'test',
            ...base,
            testMatch: testMatches,
        },
    ],
    coverageDirectory: '<rootDir>/coverage',
}
