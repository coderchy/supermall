<template>
  <div id="home">
    <NavBar class="home-nav"><div slot="center">购物街</div></NavBar>
    <TabControl :titles="['流行','新款','精选']" 
                @tabClick="tabClick"
                ref="topTabControl" 
                class="tab-control" v-show="isTabFixed"/>
    <Scroll class="content" 
    ref="scroll" 
    :probe-type="3" 
    @scroll="contentScroll"
    :pull-up-load="true"
    @pullingUp="loadMore">
       <!-- v-bind:banners将数据从Home父组件动态传递到HomeSwiper子组件，子组件中使用props接收数据 -->
    <HomeSwiper :banners="banners" @swiperImageLoad="swiperImageLoad"/> 
    <RecommendView :recommends="recommends"/> 
    <FeatureView/>
    <TabControl :titles="['流行','新款','精选']" 
                @tabClick="tabClick"
                ref="tabControl"/>
    <GoodsList :goods="showGoods"/>
    </Scroll>
    
    <BackTop @click.native="backClick" v-show="isShowBackTop"/>
    
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper.vue'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from 'components/common/navBar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'

export default {
  name:"Home",
  components:{
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
   mixins:[itemListenerMixin],

  data(){
    return{
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]}
      },
      currentType:'pop',
      isShowBackTop:false,
      tabOffsetTop:0,
      isTabFixed:false,
      saveY:0,
  }
  },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      //1.保存Y值
      this.saveY=this.$refs.scroll.getScrollY()

      // 2.取消全局事件的监听
      this.$bus.$off('itemImageLoad',this.ItemImgListener)
    },
  created(){
    // 1.请求多个数据
   this.getHomeMultidata()
  
  //2.请求商品数据
  this.getHomeGoods('pop')
  this.getHomeGoods('new')
  this.getHomeGoods('sell')

},
mounted(){
//   //1.图片加载完成的事件监听
//   const refresh=debounce(this.$refs.scroll.refresh,50)

// //对监听的事件进行保存
// this.ItemImgListener=()=>{
//     refresh()
// }
//   this.$bus.$on('itemImageLoad',this.ItemImgListener)

//   // 2.获取tabControl的offsetTop
//   //所有的组件都有一个属性$el:用于获取组件中的元素

},
  methods:{
/**
 * 事件监听相关的方法
 */
   

    tabClick(index){
      switch(index){
        case 0:
          this.currentType='pop'
          break
        case 1:
          this.currentType='new'
          break
        case 2:
          this.currentType='sell'
      }
      
      //让两个TabControl的currentIndex保持一致
      this.$refs.topTabControl.currentIndex=index;
      this.$refs.tabControl.currentIndex=index;

  },
    backClick(){
      this.$refs.scroll.scrollTo(0,0)
      },
    contentScroll(position){
      // 1.判断BackTop是否显示
        this.isShowBackTop=(-position.y)>1000

        // 2.决定tabControl是否吸顶(position:fixed)
        this.isTabFixed=(-position.y)>this.tabOffsetTop
      },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
  this.tabOffsetTop=this.$refs.tabControl.$el.offsetTop
    },
/**
 * 网络请求相关的方法
 */
    getHomeMultidata(){
      getHomeMultidata().then(res=>{
      this.banners=res.data.banner.list;
      this.recommends=res.data.recommend.list;
    })
    },
    getHomeGoods(type){
        const page=this.goods[type].page+1
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page+=1

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
    })
    }
  }
}
</script>
  
<style scoped>

  #home{
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
   
   /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }


  .content{
    /* height: 300px; */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /* .content{
    height: calc(100%-93px);
    overflow: hidden;
    margin-top: 44px;

  } */

  .tab-control{
    position: relative;
    z-index: 9;
  }
</style>