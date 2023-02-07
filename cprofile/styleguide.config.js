const path = require('path')

module.exports = {
  require: [
    '@babel/polyfill',
    path.join(__dirname, 'public/reset.css'),
    path.join(__dirname, 'public/font.css')
  ],
  components: [
    'src/components/**/*.{js,jsx}',
    'src/containers/**/*.{js,jsx}',
    'src/share/**/*.{js,jsx}',
    'src/templates/**/*.{js,jsx}',
  ],
  title: 'C Profile UI Docs',
  serverHost: 'local.plus.104-dev.com.tw',
  template: {
    favicon: path.join(__dirname, 'public/favicon.ico'),
    head: {
      scripts: [
        {
          src: 'https://static.104.com.tw/category-tool/js/category-picker-1.0.0.js'
        }
      ],
      links: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        },
        {
          rel: 'stylesheet',
          href: 'https://static.104.com.tw/category-tool/css/category-picker-1.0.0.css'
        },
        {
          rel: 'prefetch',
          href: 'https://static.104.com.tw/category-tool/json/Indust.json'
        },
      ]
    }
  },
  // skipComponentsWithoutExample: true,
  webpackConfig(env) {
    if (env === 'production' || env === 'test') {
      return require('./config/webpack.config.prod.js')
    } else {
      return require('./config/webpack.config.dev.js')
    }
  },
  // for fix build issue: https://github.com/styleguidist/react-styleguidist/issues/1247
  dangerouslyUpdateWebpackConfig(webpackConfig, env) {
    webpackConfig.output = {
        ...webpackConfig.output,
        publicPath: process.env.PUBLIC_URL || ''
    };
    return webpackConfig;
  }
}