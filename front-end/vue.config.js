const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery'
      })]
  },
  devServer: {
    proxy: {
      '/api': {
       //  target: 'http://127.0.0.0:8080',
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure:false,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}