const semver = require('semver')
const chalk = require('chalk')

function checkNodeVer(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.redBright(`当前Node版本是${process.version}, 但是${id}需要的版本是${wanted}`))
    process.exit(1)
  }
}

module.exports = {
  checkNodeVer
}