import { debounce } from './utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data () {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted () {
    // 刷新防抖
    this.refresh = debounce(this.$refs.scroll.refresh, 100)
    // 监听事件总线刷新图片高度
    this.itemImgListener = () => { this.refresh() }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  data () {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick () {
      this.$refs.scroll.scrollTo(0, 0, 300)
    }
  }
}
