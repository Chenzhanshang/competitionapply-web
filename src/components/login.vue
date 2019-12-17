<template>
  <el-container>
    <el-header>
    </el-header>
    <el-main class="main">
      <el-row type="flex" align="middle" justify="center" >
        
        <el-col  :xs="18" :sm="14" :md="10" :lg="8" :xl="8"  >
          <!--
          <p class="login-title">竞赛报名系统</p>
          -->
          <el-form  ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="login-form" >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码" autocomplete="off"></el-input>
          </el-form-item>
          
          <el-form-item class="form-item-button">
              <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')" class="form-button">{{loading==false?'登录':'登录中'}}</el-button>
              <el-button @click="resetForm('ruleForm')" class="form-button">重置</el-button>
          </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        ruleForm: {
          password: '',
          username: ''
        },
        rules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
           {required: true, message: '密码不可为空', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      //提交登录
      submitForm(formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post("/user/login",{
              userName: this.ruleForm.username,
              password: this.ruleForm.password
            })
            .then((res)=>{
              this.loading = false
              console.log(res.data.msg)
              console.log(res.data.status)
              this.$message({
                type: 'success',
                message:res.data.msg
              });
              if(res.data.status == 0){
                this.$router.push({name:'home'})
              }

            })
            .catch((res)=>{
              this.loading = false
              this.$message({
                type: 'error',
                message:res.data.msg
              });
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
/*
  .login-form {
    border: 1px solid #DCDFE6;
    width: 120%;
    height: 100%;
    margin:  15px 15px;
    padding: 40px 40px 20px 40px;
    box-shadow: 0 0 25px #7e8aa0;
  }
  */

  .login-title {
    font-size: 40px;
    letter-spacing: 20px;
    text-align: center;
    margin: 0 auto 30px auto;
    color: #292c31;
  }
  .main{
    margin-top: calc(5vh);
  }
  .form-button{
    margin-right: 17%;
  }

  .col{
    text-align: center
  }



</style>