const core = require('../index');
const findNpmPrefix = require('../find-npm-prefix');
const findEngineProjectRoot = require('../find-engine-project-prefix');
const path = require('path');

module.exports = (package) => {
    const npmPrefix = findNpmPrefix(process.cwd());
    const enginePrefix = (() => {
        try {
            return findEngineProjectRoot(process.cwd());
        } catch (e) {
            return ''
        }
    })();

    if (enginePrefix == '') {
        // npmPrefix和unityPrefix算是父子集关系，因此判断unityPrefix即可，它不为空npmPrefix一定不为空
        console.error("not a valid import location: could not find puerts project");
        return;

    } else if (enginePrefix == npmPrefix) {
        // 导入project下所有包或者某个包

    } else {
        if (package) {
            // 把package参数当作路径处理
            core.installProjectNativeFile(path.join(process.cwd(), package))
                .catch(console.error);

        } else {
            // 把当前目录最近的npm包作为puerts包导入到项目。
            core.installProjectNativeFile(npmPrefix)
                .catch(console.error);
        }
    }
}