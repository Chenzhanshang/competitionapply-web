<template>
  <el-carousel :interval="5000" type="card" height="450px">
    <el-carousel-item v-for="imageUrl in imgList" :key="imageUrl">
      <img :src="imageUrl" width="100%" height="100%" />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  data(){
    return{
      imgList:[require('../assets/1.jpg'),require('../assets/5.jpg'),require('../assets/3.jpg'),require('../assets/6.jpg')],
    }
  },

  methods:{}
}
</script>

<style>
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-carousel{
    padding: 5% 0 0 0 ;
  }
</style>