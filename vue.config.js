const path = require("path")
// const Timestamp = new Date().getTime();
// const isProduction = process.env.NODE_ENV === 'production';//判断当前环境
// const staticSite = '//static1.egou.com/p/m_egou/hd/2020/invite2020_mammon/'

module.exports = {


    //跨域的配置  仅在开发环境生效
    // devServer:{
    //     proxy:{
    //         "/rest":{//把 '/rest' 前面的换成 'http://api.egou.com'
    //             target:"https://union.egou.com",
    //             changeOrigin:true,
    //             pathRewrite: {
    //                 '^/api': '' // 在请求的时候 凡是/api开头的地址都可以使用这个跨域，并且会把 /api ---> /
    //             }
    //         },
    //         "/activity":{
    //             target:"https://m.gouwubang.com",
    //             changeOrigin:true,
    //         },
    //         "/phone":{
    //             target:"https://m.gouwubang.com",
    //             changeOrigin:true,
    //         },
    //     }
    // },


    // filenameHashing:false, //关闭文件名哈希。

    // publicPath:isProduction? staticSite:'/',//打包后文件引用
    // publicPath:'./',

    productionSourceMap: false,//取消打包的map文件
    configureWebpack:  config =>{
        // console.log(config.module);
        // console.log(JSON.stringify(config.module.rules));
        // if(config.module.rules[1].use[0].options.fallback.options.name.startsWith('img')){
            // config.module.rules[1].use[0].options.fallback.options.name="img/[name].[ext]"
        // }else{
        //     console.log('图片打包 包含hash 无法预加载 请查看！！！');
        // }
        return{
            resolve: {
                alias: {
                    "@": path.join(__dirname, "./src"),
                    "@api": path.join(__dirname, "./src/api"),
                    "@common": path.join(__dirname, "./src/common"),
                    "@components": path.join(__dirname, "./src/components"),
                    "@lib": path.join(__dirname, "./src/lib"),
                    "@pages": path.join(__dirname, "./src/pages"),
                    "@router": path.join(__dirname, "./src/router"),
                    "@static": path.join(__dirname, "./../static"),
                    "@store": path.join(__dirname, "./src/store"),
                    "@utils": path.join(__dirname, "./src/utils"),
                    "@assets": path.join(__dirname, "./src/assets"),
                }
            }
        }

    }
}

