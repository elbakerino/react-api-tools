const packages = ['react-api-fetch', 'react-progress-state', 'react-use-immutable'];

const testMatches = []
const testMatchesLint = []

packages.forEach(pkg => {
    testMatches.push(...[
        '<rootDir>/' + pkg + '/src/**/*.(test|spec).(js|ts|tsx)',
        '<rootDir>/' + pkg + '/tests/**/*.(test|spec).(js|ts|tsx)',
    ])
    testMatchesLint.push(...[
        '<rootDir>/' + pkg + '/src/**/*.(js|ts|tsx)',
        // '<rootDir>/' + pkg + '/src/**/*.(test|spec|d).(js|ts|tsx)',
        '<rootDir>/' + pkg + '/tests/**/*.(test|spec|d).(js|ts|tsx)',
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
        '^react-api-fetch(.*)$': '<rootDir>/react-api-fetch/src$1',
        '^react-progress-state(.*)$': '<rootDir>/react-progress-state/src$1',
        '^react-use-immutable(.*)$': '<rootDir>/react-use-immutable/src$1',
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
        '(tests/.*.mock).(jsx?|tsx?)$',
    ],
};

export default {
    ...base,
    projects: [
        {
            displayName: 'test',
            ...base,
            testMatch: testMatches,
        },
        {
            displayName: 'lint',
            runner: 'jest-runner-eslint',
            ...base,
            testMatch: testMatchesLint,
        },
    ],
    coverageDirectory: '<rootDir>/../coverage',
};
