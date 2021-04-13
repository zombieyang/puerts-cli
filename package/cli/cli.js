#!/usr/bin/env node

const { program } = require('commander');

program
  .command('init [engine]')
  .description('init a puerts project in current directory.')
  .option('-i --install [number]', 'install latest version of puerts', true)
  .action(require('./command/init'))

program
  .command("list")
  .action(() => {
    console.log('list')
  })

program
  .command("install [version]")
  .action(require('./command/install'))

program
  .command('update')
  .action(() => {
    console.log('update')
  })

program
  .command("import [package]")
  .action(require('./command/import'))

program
  .command("unimport")
  .action(() => {
    console.log('unimport')
  })


program.parse(process.argv);