const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/static/dist/"
      : "http://127.0.0.1:8080",
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: "Numan Ibn Mazid's Portfolio",
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  },
  // Webpack configuration
  devServer: {
    host: "0.0.0.0",
    port: "8080",
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    devMiddleware: {
      publicPath: "http://127.0.0.1:8080",
      writeToDisk: (filePath) => filePath.endsWith("index.html"),
    },
    static: {
      watch: {
        ignored: "/node_modules/",
        usePolling: true,
      },

    },
    client: {
      webSocketURL: {
        /* You need to config this option, otherwise the below error will occur
           in your browser console when trying to connect to development server
           from another Docker container:
           WebSocket connection to 'ws://127.0.0.1:<port-number>/ws' failed
        */
        hostname: "0.0.0.0",
        pathname: "/ws",
        port: 8080,
      },
    },
  },
  lintOnSave: true,
})
