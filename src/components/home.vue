<template>
    <el-container>
        <el-header>
        
            <el-menu :router=true :default-active="activeIndex" class="el-menu-demo" active-text-color="#409EFF" mode="horizontal">
              <el-menu-item index="/home/homePagePromote" >首页推广</el-menu-item>
              <el-menu-item index="/home/competitionInform">竞赛通知</el-menu-item>
              <el-menu-item index="/home/myCompetitionAndTeam">我的比赛·队伍</el-menu-item>
              <el-menu-item index="/home/recruit">组队·招募(原竞赛交流)</el-menu-item>
              <el-menu-item index="/home/winningNotification">获奖通告</el-menu-item>
              <el-menu-item index="/home/systemNotice">系统公告</el-menu-item>
              <el-submenu index="8" style="position:absolute;right:10px">
                <template slot="title">{{user.userName}}</template>
                <el-menu-item @click="updatePassword">修改密码</el-menu-item>
                <el-menu-item @click="logout">注销登录</el-menu-item>
                <el-menu-item @click="table = true">个人信息</el-menu-item>
              </el-submenu>

            </el-menu>
            <!--个人信息抽屉 direction，抽屉打开的方向-->
            <el-drawer
            title="个人信息"
            :visible.sync="table"
            direction="rtl"
            size="50%">
            <el-table :data="tableData">
              <el-table-column prop="key" label align="center"></el-table-column>
              <el-table-column prop="value" label></el-table-column>
            </el-table>
          </el-drawer>
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
        role: '',
        user: '',
        activeIndex: '',
        index: '',
        table: false,
        tableData: [
          {
            key: "用户名",
            value: ""
          },
          {
            key: "姓名",
            value: ""
          },
          {
            key: "性别",
            value: ""
          },
          {
            key: "学校",
            value: ""
          },
          {
            key: "二级学院",
            value: ""
          },

          {
            key: "年级",
            value: ""
          },

          {
            key: "班级",
            value: ""
          },

          {
            key: "身份",
            value: ""
          },
          {
            key: "电话",
            value: ""
          },
          {
            key: "邮箱",
            value: ""
          }
        ]
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
          console.log(res);
          this.tableData[0].value = res.data.userName;
          this.tableData[1].value = res.data.name;
          this.tableData[2].value = res.data.sex;
          this.tableData[3].value = res.data.college.university.universityName;
          this.tableData[4].value = res.data.college.collegeName;
          this.tableData[5].value = res.data.period;
          this.tableData[6].value = res.data.userClassName;
          //获取所有角色，逗号分隔
          res.data.roles.forEach(role => {
            this.tableData[7].value += role.roleName;
            this.tableData[7].value += "，";
          });
          //去除最后一个字符（，）
          this.tableData[7].value = this.tableData[7].value.substr(0, this.tableData[7].value.length - 1);
          this.tableData[8].value = res.data.phone;
          this.tableData[9].value = res.data.email;
          this.user = res.data
        })
        .catch()
    }




  }

  
</script>