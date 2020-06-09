const Spinner = require('clui').Spinner
const shell = require('shelljs')

module.exports = {
  env: () => {
    return new Promise((resolve) => {
      const status = new Spinner('Creating .env file...')
      status.start()
  
      shell.cp('.env.example', '.env')
  
      status.stop()
      resolve()
    })
  },

  key: () => {
    return new Promise((resolve) => {
      const status = new Spinner('Generating app key...')
      status.start()
  
      shell.exec('node ace key:generate', { silent: true })
  
      status.stop()
      resolve()
    })
  },

  runMigrations: () => {
    return new Promise((resolve) => {
      const status = new Spinner('Running database migrations...')
      status.start()
  
      shell.exec('node ace migration:run', { silent: true })
  
      status.stop()
      resolve()
    })
  },

  build: () => {
    return new Promise((resolve) => {
      const status = new Spinner('Building app...')
      status.start()
  
      shell.exec('npm run-script build', { silent: true })
  
      status.stop()
      resolve()
    })
  },

  checkGit: () => {
    return shell.which('git')
  }
}