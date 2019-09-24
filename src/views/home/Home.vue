<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">老神经老婆大折腾的店</div>
    </nav-bar>
    <tab-control @tabClick='tabClick'
                  :titles="['流行','新款','精选']"
                  ref="tabControl1"
                  v-show="isTabFixed"/>
    <scroll class="wrapper"
            ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @scroll="contentScroll"
            @pullingUp="loadMore">
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
        <recommend-view :recommends="recommends"/>
        <feature-view/>
        <tab-control @tabClick='tabClick'
                      :titles="['流行','新款','精选']"
                      ref="tabControl2"/>
        <goods-list :goods="goods[currentType].list"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop" />

  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import { getHomeMultidata, getHomeGoods } from 'network/home'
// import { debounce } from 'common/utils'
import { itemListenerMixin, backTopMixin } from 'common/mixin'

export default {
  name: 'Home',
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      popY: 0,
      newY: 0,
      sellY: 0
    }
  },
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin, backTopMixin],
  created () {
    this.getHomeMultidata()
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted () {
  },
  activated () {
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
  },
  deactivated () {
    this.saveY = this.$refs.scroll.getScrollY()

    // 取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    /**
     * 事件监听
     */

    tabClick (index) {
      // console.log(this.currentType)
      switch (this.currentType) {
        case 'pop':
          this.popY = this.$refs.scroll.getScrollY()
          break
        case 'new':
          this.newY = this.$refs.scroll.getScrollY()
          break
        case 'sell':
          this.sellY = this.$refs.scroll.getScrollY()
          break
      }

      switch (index) {
        case 0:
          this.currentType = 'pop'
          this.$refs.scroll.refresh()
          this.$refs.scroll.scrollTo(0, this.popY, 500)
          break
        case 1:
          this.currentType = 'new'
          this.$refs.scroll.refresh()
          this.$refs.scroll.scrollTo(0, this.newY, 500)
          break
        case 2:
          this.currentType = 'sell'
          this.$refs.scroll.refresh()
          this.$refs.scroll.scrollTo(0, this.sellY, 500)
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    contentScroll (position) {
      this.isShowBackTop = (-position.y) > 1000

      // 决定tabControl是否吸顶 position: fixed
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore () {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad () {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      this.popY = -this.tabOffsetTop
      this.newY = -this.tabOffsetTop
      this.sellY = -this.tabOffsetTop
    },

    /**
      * 网络请求
      */
    getHomeMultidata () {
      getHomeMultidata().then(res => {
      // console.log(res)
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page++

        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

/*   position: fixed;
  left: 0;
  right: 0;
  top: 0; */
  z-index: 999;
}
.tab-control {
  position: relative;
  /* top: 44px; */
  z-index: 8;
}
.wrapper{
  /* height: calc(100% - 93px); */
  overflow: hidden;
  /* margin-top: 44px; */
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

</style>
