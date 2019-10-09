<template>
  <div class='CartList'>
    <scroll class="wrapper" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList" :key="index" :itemInfo="item"></cart-list-item>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem'

import { mapGetters } from 'vuex'

export default {
  name: 'CartList',
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated () {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
  .CartList {
    /*height: 100vh;*/
    height: calc(100% - 44px - 49px - 40px);
  }

.wrapper {
  overflow: hidden;
  height: 100%;
}
</style>
