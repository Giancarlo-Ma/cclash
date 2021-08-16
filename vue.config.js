module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      mainProcessWatch: ['src/background', 'src/native-support/subscription-updater.js', 'src/native-support/configs-manager.js']
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}