<template>
    <el-container>
        <!-- 头部导航栏 -->
        <el-header>
            <el-menu :router=true :default-active="activeIndex" class="el-menu-demo" active-text-color="#409EFF" mode="horizontal" @select="handleSelect">
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
                <el-menu-item @click="dialogFormVisible = true">投诉建议</el-menu-item>
              </el-submenu>

            <el-dialog title="请填写投诉建议信息" :visible.sync="dialogFormVisible" center>
              <el-form ref="couplBackForm" :rules="rules" :model="couplBackForm" label-width="120px" size="mini">
              <el-form-item label="反馈类型：" prop="type">
                <el-radio-group v-model="couplBackForm.type" size="small" >
                  <el-radio border label="投诉"></el-radio>
                  <el-radio border label="建议"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="反馈内容：" prop="content" >
                <el-input v-model="couplBackForm.content"></el-input>
              </el-form-item>
              <el-form-item label="验证码：" prop="verifycode">
              <el-row :span="24">
                <el-col :span="12">
                  <el-input v-model="couplBackForm.verifycode" auto-complete="off" placeholder="请输入验证码" size="small"></el-input>
                </el-col>
                <el-col :span="12">
                  <div class="login-code" @click="refreshCode">
                    <!--验证码组件-->
                    <s-identify :identifyCode="identifyCode"></s-identify>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
              <el-form-item size="large" style="text-align:center;padding-right:120px">
                <el-button type="primary" @click="onSubmit('couplBackForm')">提交</el-button>
              </el-form-item>
            </el-form>
            </el-dialog>
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
    <div id="footer" ><span>作者：CZS</span><p>QQ:642125256</p><span>e-mail:642125256@qq.com</span></div>
</el-container>

</template>

<script>
import SIdentify from '@/components/SIdentify'
  export default {
    components: { SIdentify },
    data() {
      // 验证码自定义验证规则
      const validateVerifycode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } 
        else if (value !== this.identifyCode) {
          console.log('validateVerifycode:', value)
          callback(new Error('验证码不正确!'))
        } 
        else {
          callback()
        }
      }
      return {
        identifyCode:'',
        identifyCodes:'1234567890',
        role: '',
        user: '',
        activeIndex: '/home/homePagePromote',
        index: '',
        table: false,
        dialogFormVisible:false,
        couplBackForm: {
          content: '',
          type: '',
          verifycode:'',
        },
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
        ],
        rules: {
          content: [
           {required: true, message: '请输入反馈内容', trigger: 'blur'}
          ],
          type: [
           {required: true, message: '请选择反馈类型', trigger: 'blur'}
          ],
          verifycode: [
            { required: true, trigger: 'blur', validator: validateVerifycode }
          ]
        }
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
          if(res.data.status == 1){
            this.$message({
              type:'success',
              message:res.data.msg
            })
          }
          else{
            this.$message({
              type:'warning',
              message:"修改密码失败"
            })
          }
          
        })
        .catch()
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
          this.$router.push({path:'/'})
        }
        else{
          this.$message({
            type:'warning',
            message:"安全退出失败"
          })
        }
          
      })
      .catch()
    },
    //提交反馈建议
    onSubmit(couplBackForm){
      this.$refs[couplBackForm].validate((valid) => {
        this.refreshCode()
        if (valid) {
          this.axios.post("/advice/submitAdvice",{adviceType:this.couplBackForm.type,adviceContent:this.couplBackForm.content})
          .then((res)=>{
            if(res.data.status == 1){
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message:res.data.msg 
              });
            }
            else{
              this.$message({
                type: 'error',
                message:res.data.msg 
              });
            }
            
          })
          .catch()
        }
      })

    },
    // 生成随机数
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机数字验证码
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
        this.randomNum(0, this.identifyCodes.length)
        ]
      }
    },
    //切换导航栏
    handleSelect(key, keyPath) {
      this.activeIndex = key
      console.log(this.activeIndex)
    }
  },
  created(){
    //加载验证码
    this.refreshCode ()
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
    this.$router.push('/home/homePagePromote')
  }
}

  
</script>
<style>
  #footer {
    height: 70px;
    padding-top: 10px;
    line-height: 11px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    background: #F5F6F5;
    color: #282928;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
    }
</style>