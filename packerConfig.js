import path, {dirname} from 'path'
import {packer, webpack} from 'lerna-packer'
import {copyRootPackageJson} from 'lerna-packer/packer/modulePackages.js'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const babelTargetsEsmCjs = [
    {
        distSuffix: '',
        args: [
            '--env-name', 'cjs', '--no-comments',
            '--out-file-extension', '.cjs',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
            '--ignore', '**/*.mock.ts', '--ignore', '**/*.mock.js',
        ],
    },
    {
        distSuffix: '',
        args: [
            '--no-comments',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
            '--ignore', '**/*.mock.ts', '--ignore', '**/*.mock.js',
        ],
    },
]

packer({
    apps: {
        demo: {
            root: path.resolve(__dirname, 'packages', 'demo'),
            template: path.resolve(__dirname, 'packages', 'demo/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'demo/public'),// dev-server
            port: 3000,
            main: path.resolve(__dirname, 'packages', 'demo/src/index.tsx'),
            dist: path.resolve(__dirname, 'dist', 'demo'),
            publicPath: '/',
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_ENV),
                }),
            ],
            aliasPackagesBuild: 'production',
        },
    },
    packages: {
        reactApiFetch: {
            name: 'react-api-fetch',
            root: path.resolve(__dirname, 'packages', 'react-api-fetch'),
            entry: path.resolve(__dirname, 'packages', 'react-api-fetch/src/'),
            babelTargets: babelTargetsEsmCjs,
        },
        reactProgressState: {
            name: 'react-progress-state',
            root: path.resolve(__dirname, 'packages', 'react-progress-state'),
            entry: path.resolve(__dirname, 'packages', 'react-progress-state/src/'),
            babelTargets: babelTargetsEsmCjs,
        },
        reactUseImmutable: {
            name: 'react-use-immutable',
            root: path.resolve(__dirname, 'packages', 'react-use-immutable'),
            entry: path.resolve(__dirname, 'packages', 'react-use-immutable/src/'),
            babelTargets: babelTargetsEsmCjs,
        },
    },
}, __dirname, {
    afterEsModules: (packages, pathBuild, isServing) => {
        return Promise.all([
            ...(isServing ? [] : [copyRootPackageJson()(packages, pathBuild)]),
        ]).then(() => undefined).catch((e) => {
            console.error('ERROR after-es-mod', e)
            return Promise.reject(e)
        })
    },
})
    .then(([execs, elapsed]) => {
        if(execs.indexOf('doServe') !== -1) {
            console.log('[packer] is now serving (after ' + elapsed + 'ms)')
        } else {
            console.log('[packer] finished successfully (after ' + elapsed + 'ms)', execs)
            process.exit(0)
        }
    })
    .catch((e) => {
        console.error('[packer] finished with error(s)', e)
        process.exit(1)
    })
