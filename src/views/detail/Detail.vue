<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="wrapper" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />

    <detail-bottom-bar @addCart="addToCart" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
// import { debounce } from 'common/utils'
import { itemListenerMixin, backTopMixin } from 'common/mixin'
import { debounce } from 'common/utils'

import { mapActions } from 'vuex'

export default {
  name: 'Detail',
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    }
  },
  mixins: [itemListenerMixin, backTopMixin],
  methods: {
    ...mapActions(['addCart']),
    imageLoad () {
      this.refresh()
      this.getThemeTopY()
    },
    titleClick (index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 250)
    },
    contentScroll (position) {
      // console.log(position)
      const positionY = -position.y
      let length = this.themeTopYs.length - 1
      // for (let i = 0; i < length; i++) {
      //   if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
      //     this.currentIndex = i
      //     this.$refs.nav.currentIndex = this.currentIndex
      //   }
      // }
      for (let i = 0; i < length; i++) {
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      this.isShowBackTop = (-position.y) > 1000
    },
    addToCart () {
      // 获取购物车商品信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      // console.log(product)
      // this.$store.commit('addCart', product)
      this.addCart(product).then(res => {
        console.log(res)
      })
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res)
      // })
    }
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,

    GoodsList,
    Scroll
  },
  created () {
    this.iid = this.$route.params.iid

    getDetail(this.iid).then(res => {
      // console.log(res)
      // 获取数据
      const data = res.result
      // 获取顶部图片
      this.topImages = data.itemInfo.topImages
      // 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 获取店铺信息
      this.shop = new Shop(data.shopInfo)
      // 获取商品详细信息
      this.detailInfo = data.detailInfo
      // 获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    })

    getRecommend().then(res => {
      // console.log(res)
      this.recommends = res.data.list
    })

    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

      this.themeTopYs.push(Number.MAX_SAFE_INTEGER)
    }, 100)
  },
  mounted () {
  },
  updated () {
  },
  // 本组件没缓存不是keep-alive，deactivated勾子不能用，所以调用destroyed
  destroyed () {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 19;
  background-color: #FFF;
  height: 100vh;
}

.detail-nav {
position: relative;
z-index: 20;
background-color: #fff;
}

.wrapper {
height: calc(100% - 93px);
}

</style>
