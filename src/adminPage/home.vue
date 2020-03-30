<template>
    <el-container>
        <el-header>
          <div class="menu">
            <el-menu :router=true :default-active="activeIndex" class="el-menu-demo" active-text-color="#409EFF" mode="horizontal">
              <el-menu-item index="/adminHome/adminCompetitionInform">竞赛通知管理</el-menu-item>
              <el-menu-item index="/adminHome/adminWinningNotification">获奖通告管理</el-menu-item>
              <el-submenu index="3">
                <template slot="title">系统公告管理</template>
                <el-menu-item @click="newSystemNotice = true" >新增公告</el-menu-item>
                <el-menu-item index="/adminHome/adminSystemNotice" >管理公告</el-menu-item>
              </el-submenu>
              
              
              <el-submenu index="7">
                <template slot="title">反馈建议管理</template>
                <el-menu-item index="/adminHome/advice" >待处理反馈</el-menu-item>
                <el-menu-item index="/adminHome/disposeAdvice" >已处理反馈</el-menu-item>
              </el-submenu>
              <el-submenu index="8" style="position:absolute;right:10px">
                <template slot="title"><i class="el-icon-s-custom"></i><span>{{user.userName}}</span></template>
                <el-menu-item @click="updatePassword">修改密码</el-menu-item>
                <el-menu-item @click="logout">注销登录</el-menu-item>
              </el-submenu>

            </el-menu>
          </div>
        </el-header>
        <el-dialog title="公告信息" :visible.sync="newSystemNotice" width="60%" center>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="公告标题：" prop="notificationTitle">
              <el-input v-model="ruleForm.notificationTitle"></el-input>
            </el-form-item>
            <el-form-item label="公告内容：" prop="notificationContent" style="height:150px">
              <el-input type="textarea" :rows="7" v-model="ruleForm.notificationContent"></el-input>
            </el-form-item>
            <!-- name:后端接收时的参数名 -->
            <el-upload
            :action="this.$global.uploadFileUrl"
            name="multipartFiles" 
            :auto-upload=false
            :on-preview="handlePreview"
            :before-remove="beforeRemove"
            :limit="3"
            ref="upload"
            :on-exceed="handleExceed"
            :file-list="fileList">
              <span style="margin-left:15px">公告文件：</span><el-button size="small" type="primary" icon="el-icon-upload2" id="select-button">选择文件</el-button>
              <div slot="tip" class="tip">已选文件：</div>
            </el-upload>    
            <el-form-item>
              <div id="submit-button">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="closeForm()">取消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>
    <el-main>
        <router-view></router-view>
    </el-main>

    <div id="footer" ><span>作者：CZS, QQ:642125256, e-mail:642125256@qq.com</span></div>

</el-container>

</template>

<script>

  export default {

    data() {
      return {
        newSystemNotice:false,
        role: '',
        user: '',
        activeIndex: '/adminHome/adminCompetitionInform',
        index: '',
        ruleForm:{
        notificationTitle: '',
        notificationContent: '',
      },
      fileList: [],
      //表单校验
      rules: {
        notificationTitle: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { max: 48, message: '长度最多为48个字符', trigger: 'blur' }
        ],

        notificationContent: [
          { required: true, message: '请输入公告内容', trigger: 'blur' },
          { max: 255, message: '长度最多为255个字符', trigger: 'blur' }
        ],
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
            if(res.data.status){
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
      //新增系统公告
    //ruleForm参数需要进行校验时必须，否则this.$refs[ruleForm].validate((valid)报空指针
    submitForm(ruleForm){
      console.log(this.ruleForm)
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          //保存表单的比赛，通知，文件信息
          this.axios.post("/notice/insertNotice",{
          notificationContent: this.ruleForm.notificationContent,
          notificationTitle: this.ruleForm.notificationTitle,
          })
          .then((res)=>{
            
            if(res.data.status == 1){
              //保存上传文件
              this.$refs.upload.submit()
              this.newSystemNotice = false
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
        } else {
          return false;
        }
      });
    },
    //上传文件相关方法
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }, 
    
    //获取公告列表
    getSystemList(){
      this.axios.get("/notice/findAll")
      .then((res)=>{
        this.notificationList = res.data.data.notifications
        console.log(this.notificationList)
      })
      .catch()
    }
    },
    created(){
        //页面加载调用方法,查询个人信息封装至res
        this.axios.get("/user/findUserByUsername")
        .then((res)=>{
            //解析json渲染页面
            this.user = res.data
        })
        .catch()
        //更新路由
        this.$router.push('/adminHome/adminCompetitionInform')
    }




  }

  
</script>

<style>
  #footer {
    height: 20px;
    padding-top: 2px;
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

  #submit-button{
    text-align: center;
    margin-right:13% ;
    margin-top: 20px;
    
  }

  .tip{
    margin: 8px 0 5px 15px;
  }

  #select-button{
    margin-left: 16px;
  }
  .menu{
      padding-top: 10px;
    }
</style>