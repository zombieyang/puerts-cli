const fs = require('fs');
const glob = require('glob');
const path = require('path');
const inquirer = require('inquirer');
const {doInstall} = require('./install')

module.exports = async (engine, options) => {
    const cwd = process.cwd();
    const { install } = options;

    const expectUE = glob.sync(path.join(cwd, '*.uproject')).length > 0;
    const expectUnity = (() => {
        try {
            return fs.statSync(path.join(cwd, 'Assets')).isDirectory();
        } catch (e) {
            return false
        }
    })()

    const packageJSONExist = (() => {
        try {
            fs.statSync(path.join(cwd, `package.json`))
            return true;

        } catch (e) {
            return false;

        }
    })();
    let packageJSONContent = packageJSONExist ? JSON.parse(fs.readFileSync(path.join(cwd, `package.json`), 'utf-8')) : null;

    // step0
    if (packageJSONExist && packageJSONContent.puerts && packageJSONContent.puerts.project) {
        throw new Error('there is already a puerts project in this directory')
    }

    // step1
    await (async function () {
        if (engine == 'ue' || engine == 'unreal') {
            if (expectUnity) {
                const { sure } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'sure',
                        message: "looks like this is a unity project, are you sure?",
                        default: true,
                    }
                ])

                if (!sure) {
                    throw new Error('aborted')
                }
            }

            return init('unreal')
        }

        if (engine == 'unity') {
            if (expectUE) {
                const { sure } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'sure',
                        message: "looks like this project is a unreal project, are you sure?",
                        default: true,
                    }
                ])

                if (!sure) {
                    throw new Error('aborted');
                }
            }

            return init('unity')
        }
        if (expectUE) {
            return init('unreal')
        }
        if (expectUnity) {
            return init('unity')
        }
        throw new Error('auto detect the engine type failed');

        function init(_engine) {
            if (!packageJSONExist) {
                packageJSONContent = {
                    "name": path.basename(cwd),
                    "version": "1.0.0"
                };
            }

            engine = _engine;
            packageJSONContent.puerts = {
                backend: 'v8',
                engine,
                project: true
            }
            fs.writeFileSync(path.join(cwd, `package.json`), JSON.stringify(packageJSONContent));
        }
    })()

    // step2
    if (install !== 'false') {
        if (install === true || install === 'true' || install == void 0) {
            await doInstall(process.cwd(), engine);

        } else {
            await doInstall(process.cwd(), engine, install);

        }
    }
}