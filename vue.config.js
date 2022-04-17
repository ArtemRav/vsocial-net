const serverUrl = 'http://localhost/'
// const serverUrl = 'http://dev.websoft.ru:11371/'
// const serverUrl = 'https://skin1.websoft.ru/'

module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/_wt/default': { target: serverUrl },
      '/fonts': { target: serverUrl },
      '/images/': { target: serverUrl },
      '/sn/img/': { target: serverUrl },
      '/vsocialnet.css': { target: serverUrl },
      '/custom_web_template.html': { target: serverUrl },
      '/social_api.xml': { target: serverUrl },
      '/person_icon.html': { target: serverUrl },
      '/download_file.html': { target: serverUrl },
      '/view_doc.html': { target: serverUrl },
      '/scripts/': { target: serverUrl },
      '/oapi/social_net_library/': { target: serverUrl }
    }
  },
  publicPath: './/vsn/',
  outputDir: '../../WebSoftServer/wt/web/vsn',
  assetsDir: './assets',
  transpileDependencies: ['vue-router']
}
