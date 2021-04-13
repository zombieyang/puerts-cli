const findNpmPrefix = require('./find-npm-prefix');
const fs = require('fs');
const path = require('path');

const cache = {};

module.exports = async function findEngineProjectRoot(dir) {
    const original = dir;
    let nextdir = null;
    while (
        (nextdir = await findNpmPrefix(dir)) != ''
    ) {
        const packageJSON = JSON.parse(fs.readFileSync(`${nextdir}/package.json`, 'utf-8'))
        if (typeof packageJSON.puerts == 'object' && packageJSON.puerts.project) {
            cache[original] = nextdir;
            return nextdir;
        }
        dir = path.join(nextdir, '..')
    }

    throw new Error('could not find unity/ue-puerts project');
};