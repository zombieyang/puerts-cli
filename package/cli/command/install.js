const cp = require('child_process');
const findEngineProjectRoot = require('../find-engine-project-prefix');
const path = require('path');
const fs = require('fs');

async function doInstall(dir, engine, version) {
    let execProcess = null;
    if (version) {
        execProcess = cp.exec(`cd ${dir} && npm install @puerts/${engine}-v8@${version} --verbose`)

    } else {
        execProcess = cp.exec(`cd ${dir} && npm install @puerts/${engine}-v8 --verbose`)

    }

    execProcess.stdout.on('data', buffer => {
        console.log(buffer.toString('utf-8'))
    })
    execProcess.stderr.on('data', buffer => {
        console.error(buffer.toString('utf-8'))
    })

    return await new Promise(resolve => {
        execProcess.on('close', resolve)
    })
}

module.exports = async (version) => {
    const engineProjectPrefix = await findEngineProjectRoot(process.cwd());
    const packageJSONContext = JSON.parse(fs.readFileSync(path.join(engineProjectPrefix, 'package.json')))
    const engine = packageJSONContext.puerts.engine;

    if (['unreal', 'unity'].indexOf(engine) === -1) {
        console.log(`invalid engine field value: ${engine}`);
    }

    return await doInstall(engineProjectPrefix, engine, version);
}

module.exports.doInstall = doInstall