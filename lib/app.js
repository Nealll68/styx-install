const Spinner = require('clui').Spinner
const exec = require('child_process').exec
const fs = require('fs')
const commandExistsSync = require('command-exists').sync

module.exports = {
  env: () => {
    return new Promise((resolve) => {
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

  key: () => {
    return new Promise((resolve, reject) => {
      const status = new Spinner('Generating app key...')
      status.start()
  
      exec('node ace key:generate', (error) => {
        if (error) {
          reject(error)
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
  
      exec('node ace migration:run', (error) => {
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