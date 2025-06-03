const { createProxyMiddleware } = require('http-proxy-middleware');

const apiPort = process.env.REACT_APP_API_PORT || 5001;

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: `https://localhost:${apiPort}`,
            secure: false,
            changeOrigin: true,
        })
    );
};
