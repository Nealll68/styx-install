const Spinner = require('clui').Spinner
const exec = require('child_process').exec

module.exports = {
  install: () => {
    return new Promise((resolve, reject) => {
      const status = new Spinner('Installing packages...')
      status.start()

      exec('npm install', error => {
        if (error) {
          reject(error)
        }

        status.stop()
        resolve()
      })
    })
  }
}