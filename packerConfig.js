const path = require('path');
const { packer, webpack} = require('lerna-packer');

packer(
    {
        apps: {
            demo: {
                root: path.resolve(__dirname, 'packages', 'demo'),
                template: path.resolve(__dirname, 'packages', 'demo/public/index.html'),
                contentBase: path.resolve(__dirname, 'packages', 'demo/public'),// dev-server
                port: 3000,
                main: path.resolve(__dirname, 'packages', 'demo/src/index.js'),
                dist: path.resolve(__dirname, 'dist', 'demo'),
                servedPath: '/',// todo: make package.json homepage dependent,
                vendors: [],
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
                        'process.env.REACT_APP_ORB_BRIDGE_API': JSON.stringify('https://api.bridge.orbiter.cloud'),
                        //'process.env.REACT_APP_ID_API': JSON.stringify('https://id.bemit.eu'),
                        'process.env.REACT_APP_ID_API': JSON.stringify('http://localhost:4033'),
                        /*'process.env.REACT_APP_AUTH0_CLIENT': JSON.stringify('r2RuwOr44mmtoUa6N6NjHbzGk5jNAeYz'),
                        'process.env.REACT_APP_AUTH0_DOMAIN': JSON.stringify('bemit.eu.auth0.com'),
                        'process.env.REACT_APP_AUTH0_AUDIENCE': JSON.stringify('https://orbiter.cloud'),*/
                    }),
                ],
            },
        },
        packages: {
            // the keys are the commonjs names that is applied to externals
            // this is the same as `@babel/plugin-transform-modules-commonjs` applies
            reactApiFetch: {
                name: 'react-api-fetch',
                root: path.resolve(__dirname, 'packages', 'react-api-fetch'),
                entry: path.resolve(__dirname, 'packages', 'react-api-fetch/src/'),
            },
            reactProgressState: {
                name: 'react-progress-state',
                root: path.resolve(__dirname, 'packages', 'react-progress-state'),
                entry: path.resolve(__dirname, 'packages', 'react-progress-state/src/'),
            },
        },
    },
    __dirname,
);
