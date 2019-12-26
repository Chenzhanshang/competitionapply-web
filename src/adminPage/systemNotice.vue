<template> 
  <el-container>
    <el-aside>
      <el-menu >
          <el-menu-item-group >
            <el-menu-item v-for="notification in notificationList" :key="notification.notificationId" @click="select(notification.notificationId)">
              {{notification.notificationTitle}}
            </el-menu-item>
          </el-menu-item-group>
      </el-menu>
    </el-aside>
    <el-container>  
      <el-main width:150px>
        <el-dialog title="公告信息" :visible.sync="dialogFormVisible" width="60%">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="公告标题：" prop="notificationTitle">
              <el-input v-model="ruleForm.notificationTitle"></el-input>
            </el-form-item>
            <el-form-item label="公告内容：" prop="notificationContent" style="height:150px">
              <el-input type="textarea" :rows="7" v-model="ruleForm.notificationContent"></el-input>
            </el-form-item>
            <!-- name:后端接收时的参数名 -->
            <el-upload
            :action="'http://localhost:8999/competition/file/uploadNoticeFile/'"
            name="multipartFiles" 
            :auto-upload=false
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="3"
            ref="upload"
            :on-exceed="handleExceed"
            :file-list="fileList">
              <el-button size="small" type="primary">选择文件</el-button>
              <div slot="tip" class="el-upload__tip">已选文件列表：</div>
            </el-upload>    
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" v-show="isAdd">提交</el-button>
              <el-button type="primary" @click="submitUpdateForm('ruleForm')" v-show="!isAdd">提交修改</el-button>
              <el-button @click="closeForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <div style="text-align:right">
          <el-button type="success" plain @click="add()">新增公告</el-button>
        </div>
        <p>公告详情：</p>
        <div>
          {{this.notification.notificationContent}}
        </div>
        <p>日期：</p>
        <div>
          {{notification.notificationTime}}
        </div>
        <div class="comp">附件：</div>
        <el-card class="box-card">
          <div v-for="(file,index) in this.notification.files" :key="file.fileId" class="text file">
              文件{{index+1}}:
              <el-link  target="_blank">{{file.fileName}}</el-link>
              <el-button @click="downloadFile(file.fileId,file.fileName)" size="mini" >下载</el-button>
          </div>
        </el-card>
        <div>
          <el-button type="success" plain @click="update()">修改该公告</el-button>
        </div>
        <div>
          <el-button type="success" plain @click="handleDelete()">删除该公告</el-button>
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
      //是否为添加操作
      isAdd: false,
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

    //新增公告表单回显控制
    add(){
      this.dialogFormVisible = true
      this.isAdd = true
      //清空原有文件列表
      this.fileList = []
      this.ruleForm.notificationTitle = ''
      this.ruleForm.notificationContent = ''
    },

    //修改公告表单控制
    update(){
    //清空原有文件列表
    this.fileList = []
    this.dialogFormVisible = true
    this.isAdd = false
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
          notificationContext: this.ruleForm.notificationContext,
          notificationId: this.notificationId
          })
          .then((res)=>{
            //保存上传文件
            this.$refs.upload.submit()
            this.dialogFormVisible = false
            this.$message({
                  type: 'success',
                  message:res.data.msg
                  
                });
          })
          .catch((res)=>{
            this.dialogFormVisible = false
            this.$message({
              type: 'error',
              message:res.data.msg            
            });
          })
        } else {
          return false;
        }
      });
    },

    //删除公告
    handleDelete(){
      this.axios.get("/notice/deleteNotice",{params:{notificationId:this.notificationId}})
      .then((res)=>{
        this.$message({
          type: 'success',
          message:res.data.msg
        });
      })
      .catch((res)=>{
        this.$message({
          type: 'error',
          message:res.data.msg
        });
      })
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
            //保存上传文件
            this.$refs.upload.submit()
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message:res.data.msg
            });
          })
          .catch((res)=>{
            this.dialogFormVisible = false
            this.$message({
              type: 'error',
              message:res.data.msg            
            });
          })
        } else {
          return false;
        }
      });
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
          .catch((res)=>{
              console.log(res)
          })

      },

      //上传文件相关方法
    handleRemove(file, fileList) {
      
      this.axios.get("/file/deleteFile", {params:{fileId:file.fileId}})
      .then((res)=>{
        this.$message({
            type: 'success',
            message:res.data.msg 
          });
      })
      .catch((res)=>{
        this.$message({
            type: 'error',
            message:res.data.msg
            
          });
      })
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
  },
  created(){
    this.axios.get("/notice/findAll")
    .then((res)=>{
      this.notificationList = res.data.data.notifications
      console.log(this.notificationList)
    })
    .catch((res)=>{
      console.log(res)
    })
  }
}
</script>

<style>
  
  .el-aside {
    color: #333;
  }
</style>