#!/usr/bin/env node

const clear = require('clear')
const chalk = require('chalk')
const figlet = require('figlet')
const Spinner = require('clui').Spinner

const shell = require('shelljs')
const simpleGit = require('simple-git')
const argv = require('minimist')(process.argv.slice(2))

const run = async () => {
  const isUpdate = argv.update
  const git = simpleGit()

  clear()  

  if (!shell.which('git')) {
    console.log(chalk.bgRed('This script requires git'))
    process.exit()
  }

  console.log(chalk.green(figlet.textSync('Styx', { horizontalLayout: 'full' })))
  const status = new Spinner()
   
  if (!isUpdate) {
    /*
      CLONE STYX REPO
      https://github.com/Nealll68/styx
    */

    status.message('Cloning Styx github repository...')
    status.start()
  
    try {
      await git.clone('https://github.com/Nealll68/styx', process.cwd())
    } catch (e) {
      console.log(chalk.bgRed('An error happened while cloning github repository'))
      console.log(chalk.red(e))
      process.exit()
    } finally {
      status.stop()
      console.log(chalk.green('Github repository cloned'))
    }
  } else {
    /*
      PULL STYX REPO
    */
   
   status.message('Pulling Styx github repository...')
   status.start()
 
   try {
     await git.pull()
   } catch (e) {
     console.log(chalk.bgRed('An error happened while pulling github repository'))
     console.log(chalk.red(e))
     process.exit()
   } finally {
     status.stop()
     console.log(chalk.green('Github repository pulled'))
   }
  }

  /*
    INSTALLING PACKAGES
  */

  status.message('Installing packages...')
  status.start()

  const npmExec = shell.exec('npm install', { silent: true })

  if (npmExec.code !== 0) {
    console.log(chalk.bgRed('An error happened while installing packages'))
    console.log(chalk.red(`Exit code : ${npmExec.code}`))
    console.log(chalk.red(`Stderr : ${npmExec.stderr}`))
    process.exit()
  }

  status.stop()
  console.log(chalk.green('Packages installed'))

  if (!isUpdate) {

    /*
      CREATE .ENV FILE
    */

    status.message('Creating .env file...')
    status.start()

    const cpExec = shell.cp('.env.example', '.env')

    if (cpExec.code !== 0) {
      console.log(chalk.bgRed('An error happened while creating .env file'))
      console.log(chalk.red(`Exit code : ${cpExec.code}`))
      console.log(chalk.red(`Stderr : ${cpExec.stderr}`))
      process.exit()
    }

    status.stop()
    console.log(chalk.green('.env file created'))

    /*
      GENERATE APP KEY
    */

    status.message('Generating app key...')
    status.start()

    const keyExec = shell.exec('node ace key:generate', { silent: true })

    if (keyExec.code !== 0) {
      console.log(chalk.bgRed('An error happened while generating app key'))
      console.log(chalk.red(`Exit code : ${keyExec.code}`))
      console.log(chalk.red(`Stderr : ${keyExec.stderr}`))
      process.exit()
    }

    status.stop()
    console.log(chalk.green('App key generated'))

  }

  /*
    RUN DATABASE MIGRATIONS
  */

  status.message('Running database migrations...')
  status.start()

  const migrationExec = shell.exec('node ace migration:run', { silent: true })

  if (migrationExec.code !== 0) {
    console.log(chalk.bgRed('An error happened while running database migrations'))
    console.log(chalk.red(`Exit code : ${migrationExec.code}`))
    console.log(chalk.red(`Stderr : ${migrationExec.stderr}`))
    process.exit()
  }

  status.stop()
  console.log(chalk.green('Database migrations runned'))

  /*
    BUILD APP
  */

  status.message('Building app...')
  status.start()

  const buildExec = shell.exec('npm run-script build', { silent: true })

  if (buildExec.code !== 0) {
    console.log(chalk.bgRed('An error happened while building app'))
    console.log(chalk.red(`Exit code : ${buildExec.code}`))
    console.log(chalk.red(`Stderr : ${buildExec.stderr}`))
    process.exit()
  }

  status.stop()
  console.log(chalk.green('App builded'))

  console.log(chalk.bgGreen())
  console.log(chalk.red('Styx has been successfully installed'))
}

run()