<template>
  <div class="cart-list">
      <Scroll class="content" ref="scroll">
      <CartListItem 
            v-for="(item,index) in cartList" 
            :key="index" 
            :item-info="item"/>
      </Scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem.vue'

import {mapGetters} from 'vuex'

export default {
    name:"CartList",
    components:{
        Scroll,
        CartListItem
    },
    computed:{
        ...mapGetters(['cartList'])
    },
    activated(){
        this.$refs.scroll.refresh()
    }
}
</script>

<style scoped>
.cart-list{
   position: absolute;
    top: 44px;
    bottom: 89px;
    width: 100%;
}

.content{
   height: 100%;
    overflow: hidden;
}
</style>