<template>
  <el-container>
    <div class="background">
        <img :src="imgSrc" width="100%" height="100%" />
    </div>
    <el-header>
    </el-header>
    <el-main class="main">
      <el-row type="flex" align="middle" justify="center" >
        <el-col  :xs="18" :sm="14" :md="10" :lg="8" :xl="8"  :pull="1" >
          
          <el-form  ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="login-form" >
            <p class="login-title">竞赛报名系统</p>
            <el-form-item label="用户名" prop="username">
              <el-input prefix-icon="el-icon-user" v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input prefix-icon="el-icon-lock" type="password" v-model="ruleForm.password" placeholder="请输入密码" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-radio v-model="ruleForm.role" label="2">学生</el-radio>
              <el-radio v-model="ruleForm.role" label="1">管理员</el-radio>
            </el-form-item>
            <el-form-item label="验证码" prop="verifycode">
              <el-row :span="24">
                <el-col :span="16">
                  <el-input v-model="ruleForm.verifycode" auto-complete="off" placeholder="请输入验证码" size=""></el-input>
                </el-col>
                <el-col :span="8">
                  <div class="login-code" @click="refreshCode">
                    <!--验证码组件-->
                    <s-identify :identifyCode="identifyCode"></s-identify>
                  </div>
                </el-col>
              </el-row>
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
        loading: false,
        //背景图
        imgSrc:require('../assets/backgroundImage.jpg'),
        //当前验证码
        identifyCode:'',
        //验证码包含随机内容
        identifyCodes:'1234567890',
        ruleForm: {
          password: '',
          username: '',
          role: '2',
          //表单验证码
          verifycode:'',
        },
        rules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
           {required: true, message: '密码不可为空', trigger: 'blur'}
          ],
          role: [
           {required: true, message: '请选择角色', trigger: 'change'}
          ],
          verifycode: [
            { required: true, trigger: 'blur', validator: validateVerifycode }
          ]
        }
      };
    },
    methods: {
      //提交登录
      submitForm(formName) {
        console.log(this.ruleForm.role)
        this.loading = true
        this.$refs[formName].validate((valid) => {
          this.refreshCode()
          if (valid) {
            this.axios.post("/user/login",{
              userName: this.ruleForm.username,
              password: this.ruleForm.password,
              roles: [{roleId: this.ruleForm.role}]
            })
            .then((res)=>{
              console.log(res)
              this.loading = false
              if(res.data.status == 1){
                this.$message({
                  type: 'success',
                  message:res.data.msg
                });
                if(this.ruleForm.role == '2'){
                  this.$router.push({name:'home'})
                }
                else if(this.ruleForm.role == '1'){
                  this.$router.push({name:'adminHome'})
                }
                
              }
              else{
                this.loading = false
                this.$message({
                  type: 'error',
                  message:res.data.msg
                });
              }

            })
            .catch()
          } else {
            console.log('error submit!!');
            this.loading = false
            this.refreshCode()
            this.ruleForm.verifycode = ''
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.refreshCode()
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
      }
    },
    created(){
      this.refreshCode ()
    }
  }
</script>

<style scoped>

  .login-form {
    border: 1px solid #DCDFE6;
    width: 100%;
    height: 100%;
    margin:  8px 15px 15px 15px;
    padding: 30px 40px 10px 20px;
    box-shadow: 0 0 10px #7e8aa0;
    background-color: #FFFFFF;
  }

  .login-title {
    font-size: 25px;
    letter-spacing: 30px;
    text-align: center;
    margin: 0px 0px 25px 37px;
    color: #292c31;
  }
  .main{
    margin-top: calc(5vh);
  }

  .form-button{
    margin-right: 15%;
  }

  .form-button{
    margin-left: 8%;
  }

  .col{
    text-align: center
  }

  .background{
    width:99%;  
    height:98%;  /**宽高98-99%，图片铺满屏幕，且不出现滚动条 */
    z-index:-1;
    position: absolute;
    }
</style>