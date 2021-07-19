const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(createProxyMiddleware("/api/", {
        target: "https://collegemanagementapp.herokuapp.com/",
        secure: true,
        ws: true,
        changeOrigin: true}));
}