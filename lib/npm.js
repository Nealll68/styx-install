const Spinner = require('clui').Spinner
const spawn = require('child_process').spawn

module.exports = {
  install: () => {
    return new Promise((resolve, reject) => {
      const status = new Spinner('Installing packages...')
      status.start()

      const npm = spawn('npm install')

      npm.stderr.on('data', data => {
        reject(data)
      })

      npm.on('close', () => {
        status.stop()
        resolve()
      })

      /*const npmExec = shell.exec('npm install', { silent: true })

      if (npmExec.code !== 0) {
        reject({
          code: npmExec.code,
          stderr: npmExec.stderr
        })
      }

      status.stop()
      resolve()*/
    })
  }
}