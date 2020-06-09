const Spinner = require('clui').Spinner
const shell = require('shelljs')

module.exports = {
  install: () => {
    return new Promise((resolve, reject) => {
      const status = new Spinner('Installing packages...')
      status.start()

      const npmExec = shell.exec('npm install', { silent: true })

      if (npmExec.code !== 0) {
        reject({
          code: npmExec.code,
          stderr: npmExec.stderr
        })
      }

      status.stop()
      resolve()
    })
  }
}