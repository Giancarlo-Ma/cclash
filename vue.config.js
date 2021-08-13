module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}