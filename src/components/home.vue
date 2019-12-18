<template>
    <el-container>
        <el-header>
        
            <el-menu :router=true :default-active="activeIndex" class="el-menu-demo" active-text-color="#409EFF" mode="horizontal" @select="handleSelect">
                <el-menu-item index="/home/homePagePromote" >首页推广</el-menu-item>
                <el-menu-item index="/home/personalInformation">个人信息</el-menu-item>
                <el-menu-item index="/home/competitionInform">竞赛通知</el-menu-item>
                <el-menu-item index="4">系统公告</el-menu-item>
                <el-menu-item index="5">组队参赛</el-menu-item>
                <el-menu-item index="6">竞赛交流</el-menu-item>
                <el-menu-item index="7">获奖通告</el-menu-item>
            </el-menu>
        </el-header>
    <el-main>
        <router-view></router-view>
    </el-main>

</el-container>

</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    },




  }

  
</script>