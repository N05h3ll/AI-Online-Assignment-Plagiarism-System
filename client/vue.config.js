module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api/',
      },
      '/userapi': {
        target: 'http://localhost:3070/',
        pathRewrite: { '^/userapi': '/api2' },
      },
    },
  },
};
