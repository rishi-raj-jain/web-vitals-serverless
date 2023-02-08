// This file was automatically added by edgio init.
// You should commit this file to source control.
const { join } = require('path')

module.exports = {
  connector: '@edgio/express',
  express: {
    appPath: join(process.cwd(), 'server.js'),
    bundler: '@vercel/nft',
  },
}
