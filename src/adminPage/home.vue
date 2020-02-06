<template>
    <el-container>
        <el-header>
        
            <el-menu :router=true :default-active="activeIndex" class="el-menu-demo" active-text-color="#409EFF" mode="horizontal">
              <el-menu-item index="/adminHome/personalInformation">个人信息</el-menu-item>
              <el-menu-item index="/adminHome/adminCompetitionInform">竞赛通知管理</el-menu-item>
              <el-menu-item index="/adminHome/adminSystemNotice">系统公告管理</el-menu-item>
              <el-menu-item index="/adminHome/adminWinningNotification">获奖通告管理</el-menu-item>
              <el-submenu index="8" style="position:absolute;right:10px">
                <template slot="title">{{user.userName}}</template>
                <el-menu-item @click="updatePassword">修改密码</el-menu-item>
                <el-menu-item @click="logout">注销登录</el-menu-item>
              </el-submenu>

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
        competitionInform: this.nowRole == '1' ? "/home/competitionInform" : "/home/adminCompetitionInform",
        role: '',
        user: '',
        activeIndex: '',
        index: ''
      };
    },
    methods: {
      updatePassword(){
        this.$prompt('请输入您的新密码', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          inputPlaceholder:'密码'
          }).then(({ value }) => {
            console.log(value)
            this.axios.post("/user/updatePassword",{password: value})
          .then((res)=>{
            this.$message({
              type:'success',
              message:res.data.msg
            })
          })
          .catch((res)=>{
            this.$message({
              type:'warning',
              message:"修改密码失败"
            })
          })
        })
        .catch(() => {
         });
      },
      logout(){
            this.axios.get('/user/logout')
            .then((res)=>{
                console.log(res)
                if(res.data.status == 1){
                    this.$message({
                        type:'success',
                        message:res.data.msg
                    })
                }
                this.$router.push({path:'/'})
            })
            .catch((res)=>[
                this.$message({
                        type:'warning',
                        message:"安全退出失败"
                    })
            ])
        },
    },
    created(){
        //页面加载调用方法,查询个人信息封装至res
        this.axios.get("/user/findUserByUsername")
        .then((res)=>{
            //解析json渲染页面
            this.user = res.data

            //this.$router.push("/home/adminHomePagePromote")
        })
        .catch((res)=>{
            console.log(res);
        })
    }




  }

  
</script>