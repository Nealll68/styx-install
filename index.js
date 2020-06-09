#!/usr/bin/env node

const clear = require('clear')
const chalk = require('chalk')
const figlet = require('figlet')

const argv = require('minimist')(process.argv.slice(2))

const git = require('./lib/git')
const npm = require('./lib/npm')
const app = require('./lib/app')

const run = async () => {
  const isUpdate = argv.update

  clear()  

  if (!app.checkGit()) {
    console.log(chalk.bgRed('This script requires git'))
    process.exit()
  }

  console.log(chalk.green(figlet.textSync('Styx', { horizontalLayout: 'full' })))

  if (!isUpdate) {
    /*
      CLONE STYX REPO
      https://github.com/Nealll68/styx
    */
    try {
      await git.clone(process.cwd())
      console.log(chalk.green('Github repository cloned'))
    } catch (e) {
      console.log(chalk.bgRed('An error happened while cloning github repository'))
      console.log(chalk.red(e))
      process.exit()
    }    
  } else {
    /*
      PULL STYX REPO
    */
    try {
      await git.pull()
      console.log(chalk.green('Github repository pulled'))
    } catch (e) {
      console.log(chalk.bgRed('An error happened while pulling github repository'))
      console.log(chalk.red(e))
      process.exit()
    }
  }

  /*
    INSTALLING PACKAGES
  */

  try {
    await npm.install()
    console.log(chalk.green('Packages installed'))
  } catch (e) {
    console.log(chalk.bgRed('An error happened while installing packages'))
    console.log(chalk.red(`Exit code : ${e.code}`))
    console.log(chalk.red(`Stderr : ${e.stderr}`))
    process.exit()
  }

  if (!isUpdate) {
    /*
      CREATE .ENV FILE
    */

    await app.env()
    console.log(chalk.green('.env file created'))

    /*
      GENERATE APP KEY
    */

    await app.key()
    console.log(chalk.green('App key generated'))
  }

  /*
    RUN DATABASE MIGRATIONS
  */


  await app.runMigrations()
  console.log(chalk.green('Database migrations runned'))

  /*
    BUILD APP
  */

  await app.build()
  console.log(chalk.green('App builded'))

  console.log(chalk.bgGreen('Styx has been successfully installed'))
}

run()