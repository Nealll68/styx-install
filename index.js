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
    console.log(chalk.red(`Stderr : ${e}`))
    process.exit()
  }

  if (!isUpdate) {
    /*
      CREATE .ENV FILE
    */

    try {
      await app.env()
      console.log(chalk.green('.env file created'))
    } catch (e) {
      console.log(chalk.bgRed('An error happened while creating .env file'))
      console.log(chalk.red(`Stderr : ${e}`))
      process.exit()
    }

    /*
      GENERATE APP KEY
    */

    /*try {
      await app.key()
      console.log(chalk.green('App key generated'))
    } catch (e) {
      console.log(chalk.bgRed('An error happened while generating app key'))
      console.log(chalk.red(`Stderr : ${e}`))
      process.exit()
    }*/
  }

  /*
    RUN DATABASE MIGRATIONS
  */

  try {
    await app.runMigrations()
    console.log(chalk.green('Database migrations runned'))
  } catch (e) {
    console.log(chalk.bgRed('An error happened while running database migrations'))
    console.log(chalk.red(`Stderr : ${e}`))
    process.exit()
  }

  /*
    BUILD APP
  */

  try {
    await app.build()
    console.log(chalk.green('App builded'))
  } catch (e) {
    console.log(chalk.bgRed('An error happened while building app'))
    console.log(chalk.red(`Stderr : ${e}`))
    process.exit()
  }

  console.log(chalk.bgGreen('Styx has been successfully installed'))
}

run()