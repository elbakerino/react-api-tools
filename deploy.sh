#!/bin/bash

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}
      registry=https://registry.npmjs.org/
      always-auth=true" >.npmrc

echo "Token length: ${#NPM_TOKEN}"

# todo: not manual resetting the file here
git checkout -- packages/webpackPartialConfig.js

cd ./packages

cd react-api-fetch
cp README.md build/
cd ../

cd react-progress-state
cp README.md build/
cd ../

cd react-use-immutable
cp README.md build/
cd ../

cd ../

#npm run release
npm run release -- --yes

rm .npmrc
