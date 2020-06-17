const Spinner = require('clui').Spinner
const exec = require('child_process').exec
const fs = require('fs')
const commandExistsSync = require('command-exists').sync

module.exports = {
  installPackages: (yarn) => {
    return new Promise((resolve, reject) => {
      const status = new Spinner('Installing packages... (this can take a moment)')
      status.start()

      exec(yarn ? 'yarn install' : 'npm install', error => {
        if (error) {
          reject(error)
        }

        status.stop()
        resolve()
      })
    })
  },

  env: () => {
    return new Promise((resolve, reject) => {
      const status = new Spinner('Creating .env file...')
      status.start()
  
      fs.copyFile('.env.example', '.env', (err) => {
        if (err) {
          reject(err)
        }

        status.stop()
        resolve()
      })  
    })
  },

  runMigrations: () => {
    return new Promise((resolve, reject) => {
      const status = new Spinner('Running database migrations...')
      status.start()
  
      exec('node ace migration:run --force', (error) => {
        if (error) {
          reject(error)
        }

        status.stop()
        resolve()
      })
    })
  },

  build: () => {
    return new Promise((resolve, reject) => {
      const status = new Spinner('Building app...')
      status.start()
      
      exec('npm run-script build', (error) => {
        if (error) {
          reject(error)
        }

        status.stop()
        resolve()
      })
    })
  },

  checkGit: () => {
    return commandExistsSync('git')
  }
}