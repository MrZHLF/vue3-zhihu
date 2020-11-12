module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    open: true,
    proxy: {
      '/api': { //代理api
				target: 'http://api.vikingship.xyz/api', //服务器api地址
				ws: true, // proxy websockets
				changeOrigin: true, //是否跨域
				pathRewrite: { //重写路径
					'^/api': ''
				}
			}
    }
  }
}