
module.exports = {
    plugins: {
      autoprefixer: {},
      "postcss-px-to-viewport":{
        viewportWidth:375,
        viewportUnit:'vw',
        selectorBlackList:['ignore','tab-bar','tab-bar-item'],
        minPixelValue:1,
        mediaQuery:false,
        exclude:[/TabBar/]
      },
    }
  }
  