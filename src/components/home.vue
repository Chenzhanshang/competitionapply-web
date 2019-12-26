<template>
    <el-container>
        <el-header>
        
            <el-menu :router=true :default-active="activeIndex" class="el-menu-demo" active-text-color="#409EFF" mode="horizontal" @select="handleSelect">
              <el-menu-item v-if="student" index="/home/homePagePromote" >首页推广</el-menu-item>
              <el-menu-item v-if="admin" index="/home/adminHomePagePromote" >首页推广</el-menu-item>
              <el-menu-item index="/home/personalInformation">个人信息</el-menu-item>
              <el-menu-item v-if="student" index="/home/competitionInform">竞赛通知</el-menu-item>
              <el-menu-item v-if="admin" index="/home/adminCompetitionInform">竞赛通知管理</el-menu-item>
              <el-menu-item v-if="student" index="/home/systemNotice">系统公告</el-menu-item>
              <el-menu-item v-if="admin" index="/home/adminSystemNotice">系统公告管理</el-menu-item>
              <el-menu-item index="5">组队参赛</el-menu-item>
              <el-menu-item index="6">竞赛交流</el-menu-item>
              <el-menu-item index="/home/winningNotification" v-if="student">获奖通告</el-menu-item>
              <el-menu-item index="/home/adminWinningNotification" v-if="admin">获奖通告管理</el-menu-item>
              <el-submenu index="8" style="position:absolute;right:10px">
                <template slot="title">{{user.userName}}</template>
                <el-menu-item index="8-1">修改密码</el-menu-item>
                <el-menu-item index="8-2">注销登录</el-menu-item>
              </el-submenu>

              <el-submenu :router=false index="9" style="position:absolute;right:150px">
                <template slot="title">当前角色：{{nowRole == '1' ? '管理员' : nowRole == '2' ? '学生' : '教师'}}</template>
                <el-menu-item @click="selectRole('2')"  :disabled = roleStudent>学生</el-menu-item>
                <el-menu-item index="9-2" :disabled = roleTeacher>教师</el-menu-item>
                <el-menu-item @click="selectRole('1')" :disabled = roleAdmin>管理员</el-menu-item>
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
        admin: false,
        student: false,
        teacher: false,
        roleStudent: true,
        roleTeacher: true,
        roleAdmin: true,
        competitionInform: this.nowRole == '1' ? "/home/competitionInform" : "/home/adminCompetitionInform",
        nowRole: '',
        role: '',
        user: '',
        activeIndex: '',
        index: ''
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      selectRole(res){
        this.nowRole = res
        this.admin = false
        this.student = false
        this.teacher = false
        this.nowRole == '1' ? this.admin=true : this.nowRole == '2' ? this.student=true : this.teacher=true
        if(this.nowRole == '1'){
          this.$router.push("/home/adminHomePagePromote")
        }else{
          this.$router.push("/home/homePagePromote")
        }
      }
    },
    created(){
        //页面加载调用方法,查询个人信息封装至res
        this.axios.get("/user/findUserByUsername")
        .then((res)=>{
            //解析json渲染页面
            this.user = res.data
            if(res.data.roles.length > 0 ){
              res.data.roles.forEach(role => {
                role.roleId == '1' ? this.roleAdmin = false : role.roleId == '2' ? this.roleStudent = false : this.roleTeacher = false
              });
              this.nowRole = res.data.roles[0].roleId
              this.nowRole == '1' ? this.admin=true : this.nowRole == '2' ? this.student=true : this.teacher=true
            }
          if(this.nowRole == '1'){
            this.$router.push("/home/adminHomePagePromote")
          }else{
            this.$router.push("/home/homePagePromote")
          }
        })
        .catch((res)=>{
            console.log(res);
        })
    }




  }

  
</script>