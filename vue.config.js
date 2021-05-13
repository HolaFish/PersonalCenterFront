module.exports = {
  transpileDependencies: [
    'vuetify',
    'resize-detector'
  ],
  publicPath: '/pc/',
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Personal Center';
        return args;
      });
  }
}
