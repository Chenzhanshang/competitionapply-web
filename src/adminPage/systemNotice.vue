<template> 
  <el-container>
    <el-aside>
      <el-menu >
          <el-menu-item-group>
            <el-menu-item v-for="(notification,index) in notificationList" :key="notification.notificationId" @click="select(notification.notificationId)">
              <el-badge value="新" class="item" type="danger" v-if="index == 0">{{notification.notificationTitle}}</el-badge>
              <span v-if="index != 0">{{notification.notificationTitle}}</span>
            </el-menu-item>
          </el-menu-item-group>
      </el-menu>
    </el-aside>
    <el-container>  
      <el-main width:150px v-if="notification != ''">
        <el-dialog title="公告信息" :visible.sync="dialogFormVisible" width="60%" center>
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
            :on-remove="handleRemove"
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
                <el-button type="primary" @click="submitUpdateForm('ruleForm')" >提交修改</el-button>
                <el-button @click="closeForm()">取消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>
        
        <h3 style="text-align:center">{{notification.notificationTitle}}</h3>
        <div style="text-align:center">
          发布时间：
          <template>
            <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
            {{notification.notificationTime==null?new Date():notification.notificationTime | dateFormart}}
          </template>
        </div>
        <el-divider></el-divider>
        <div>
          公告内容：{{this.notification.notificationContent}}
        </div>
        <el-divider v-if="notification.files.length != 0"></el-divider>
        <div class="comp" v-if="notification.files.length != 0">公告附件：</div>
        <el-card class="box-card" v-if="notification.files.length != 0">
            <div v-for="(file) in this.notification.files" :key="file.fileId" style="padding:10px">
              <el-link  target="_blank">{{file.fileName}}</el-link>
              <el-button @click="downloadFile(file.fileId,file.fileName)" size="mini" icon="el-icon-download" id="download">下载</el-button>
            </div>
        </el-card>
        <div style="float:right; padding: 20px 10px 0px 0px">
          <el-button type="danger" plain @click="handleDelete()" icon="el-icon-remove" size="small">删除</el-button>
        </div>
        <div style="float:right; padding: 20px 20px 0px 0px">
          <el-button type="warning" plain @click="update()" icon="el-icon-s-tools" size="small">修改</el-button>
        </div>
        
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      notificationList: [],
      notification: '',
      //控制表单显示
      dialogFormVisible: false,
      //当前的公告id
      notificationId: '',
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
    }
  },

  methods:{
    select(data){
      console.log(data)
      this.notificationId = data
      try{
        this.notificationList.forEach(item=>{
          if(item.notificationId === data){
            this.notification = item
            console.log(this.notification)
            //已找到对应数据，抛异常跳出循环
            throw new Error("已找到公告对应数据")
          }
        })  
      }
      catch{
      }
    },

    //取消按钮
    closeForm(){
      this.dialogFormVisible = false
    },

    //修改公告表单控制
    update(){
    //清空原有文件列表
    this.fileList = []
    this.dialogFormVisible = true
    try{
      this.notificationList.forEach(item=>{
        if(item.notificationId === this.notificationId){
          this.ruleForm.notificationTitle = item.notificationTitle
          this.ruleForm.notificationContent = item.notificationContent
          //若存在文件，回显
          if(item.files.length > 0){
            item.files.forEach(file => {
              var json = {name: file.fileName, url: file.filePath, fileId: file.fileId}
              this.fileList.push(json)
            });
          }
          //已找到对应数据，抛异常跳出循环
          throw new Error("已找到公告对应数据")
        }
      })  
    }
    catch{  
    }
    },

    //提交修改
    //提交添加修改比赛通知的表单
    submitUpdateForm(ruleForm){
      console.log(this.ruleForm)
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          //保存修改表单的比赛，通知，文件信息
          this.axios.post("/notice/updateNotice",{
          notificationTitle: this.ruleForm.notificationTitle,
          notificationContent: this.ruleForm.notificationContent,
          notificationId: this.notificationId
          })
          .then((res)=>{
            if(res.data.status == 1){
              //保存上传文件
              this.$refs.upload.submit()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message:res.data.msg
              });
              this.getSystemList()
              this.notification = ''
            }
            else{
              this.dialogFormVisible = false
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

    //删除公告
    handleDelete(){
      this.axios.get("/notice/deleteNotice",{params:{notificationId:this.notificationId}})
      .then((res)=>{
        if(res.data.status == 1){
          this.$message({
            type: 'success',
            message:res.data.msg
          });
          this.getSystemList()
          this.notification = ''
        }
        else{
          this.$message({
            type: 'error',
            message:res.data.msg
          });
        }
        
      })
      .catch()
    },


    //下载文件
      downloadFile(fileId,fileName){
        console.log(fileId)
        this.axios.post('/file/downloadFile/',{fileId:fileId},{
          responseType: 'blob'
        })
        .then((res)=>{
          console.log(res)
          if (window.navigator.msSaveBlob) {
            try {
            const blobObject = new Blob([res.data]);
            window.navigator.msSaveBlob(blobObject, fileName);
            } catch (e) {
            console.log(e);
            }
          } else {
              const blob = res.data;
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onload = (e) => {
              const a = document.createElement('a');
              a.download = fileName;
              a.href = e.target.result;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              }
            }

          })
          .catch()

      },

    //上传文件相关方法
    handleRemove(file, fileList) {
      
      this.axios.get("/file/deleteFile", {params:{fileId:file.fileId}})
      .then((res)=>{
        if(res.data.status == 1){
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
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？不可逆操作`);
    }, 
    
    //获取公告列表
    getSystemList(){
      this.axios.get("/notice/findAll")
      .then((res)=>{
        this.notificationList = res.data.data.notifications
        console.log(this.notificationList)
        if(res.data.status == 1){
          this.notification = this.notificationList[0]
        }
      })
      .catch()
    }
  },
  created(){
    this.getSystemList()
  }
}
</script>

<style>
  .box-card{
    margin-top: 15px;
  }
  .el-aside {
    color: #333;
  }
  #download{
    margin-left: 10px;
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
</style>