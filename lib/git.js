const Spinner = require('clui').Spinner
const simpleGit = require('simple-git')
const git = simpleGit()

module.exports = {
    clone: async (path) => {
      const status = new Spinner('Cloning Styx github repository...')
      status.start()

      try {
        await git.clone('https://github.com/Nealll68/styx', path)
        status.stop()        
      } catch (e) {
        throw e
      }    
    },
    
    pull: async () => {
      const status = new Spinner('Pulling Styx github repository...')
      status.start()

      try {
        await git.pull()
        status.stop()
      } catch (e) {
        throw e
      }  
    }
}
