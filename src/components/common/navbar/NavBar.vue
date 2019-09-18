<template lang="html">
  <div class='nav-bar'>
    <div class='left'><slot name='left'></slot></div>
    <div class='center'><slot name='center'></slot></div>
    <div class='right'><slot name='right'></slot></div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      msg: 'Welcome to your vueApp'
    }
  }
}
</script>

<style lang="css">
  .nav-bar{
    display: flex;
    height: 44px;
    line-height: 44px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(100, 100, 100, 0.3);
    /* z-index: 999; */
  }

  .left, .right {
    width: 60px;

  }

  .center {
    flex: 1;

  }
</style>
