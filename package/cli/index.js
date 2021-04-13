const path = require('path');
const fs = require('fs');
const gulp = require('gulp')
const findEngineProjectRoot = require('./find-engine-project-prefix')
/**
 * 
 * @param {*} packageFilePath the csharp file absolute path in your npm package
 */
exports.installProjectNativeFile =
  async function installProjectNativeFile(packageFilePath) {
    const projectFilePath = await findEngineProjectRoot(process.cwd());

    const packageJSON = JSON.parse(fs.readFileSync(path.join(packageFilePath, 'package.json'), 'utf-8'));
    if (!packageJSON.puerts || !packageJSON.puerts.nativeFile) {
      throw new Error('could not find config: nativeFile');
    }
    if (typeof packageJSON.puerts.nativeFile != 'object') {
      throw new Error('invalid value for: nativeFile');
    }

    await Promise.all(
      packageJSON.puerts.nativeFile.map((file) => {
        const { src, dest } = file

        return new Promise((resolve, reject) => {
          gulp
            .src(path.join(packageFilePath, src))
            .pipe(gulp.dest(path.join(projectFilePath, dest)))
            .on('end', resolve)
            .on('error', reject)
        })
      })
    )
  }
