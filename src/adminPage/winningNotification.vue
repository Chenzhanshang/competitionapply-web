<template>
  <el-container>
    <el-dialog title="获奖-通知信息" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="通知标题：" prop="notificationTitle">
          <el-input v-model="ruleForm.notificationTitle"></el-input>
        </el-form-item>
        <el-form-item label="竞赛名：" prop="competitionId">
          <el-select v-model="ruleForm.competitionId" placeholder="请选择比赛" @change="selectCompetition">
            <el-option v-for="competition in competitionList" :key="competition.competitionId" :label="competition.competitionName" :value="competition.competitionId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知方式：" prop="type">
          <el-select v-model="ruleForm.type" placeholder="填写获奖信息或上传文件" >
            <el-option label="上传获奖文件" value="file"></el-option>
            <el-option label="填写获奖信息" value="message" :disabled="isTeam"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="ruleForm.type == 'file'?false:true">
          获奖名单：
          <el-select
          v-model="ruleForm.selectWin"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="姓名顺序即为排名">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.name"
              :value="item.userId">
            </el-option>
          </el-select>
        </div>
        <!-- name:后端接收时的参数名 -->
        <el-upload
        v-if="ruleForm.type == 'file'?true:false"
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
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
      label="序号"
      type="index"
      width="70"
      align="center">
      </el-table-column>
      <el-table-column
      property="notificationTitle"
      label="标题"
      align="center">
      </el-table-column>
      <el-table-column
      property="notificationTime"
      label="发布时间"
      align="center">
        <template slot-scope="scope">
          <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
          {{scope.row.notificationTime==null?new Date():scope.row.notificationTime | dateFormart}}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-button
          size="mini"
          type="success"
          plain
          @click="addWinList()"
          >发布获奖通知</el-button>  
          <el-input
          v-model="search"
          size="mini"
          placeholder="输入通知关键字搜索" 
          width="50"/>   
        </template>
        <template slot-scope="scope">
          <el-button
          size="small"
          type="primary"
          plain
          @click="update(scope.row)"
          >编辑</el-button>

          <el-button
          size="mini"
          type="danger"
          plain
          @click="openDeleteWindow(scope.row)"
          >删除</el-button>    
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>
<script>
  export default {
    //计算属性，处理查询到的通知数据
    computed:{
      tableData:function(){
          return this.notificationList.filter((item)=>{
            console.log(this.notificationList)
              if(item.notificationTitle.includes(this.search)){
                  return item;
              }
          })
      },
    },
    data() {
      return {
        //暂存通知Id供修改通知时使用
        notificationId: '',
        isAdd: true,
        dialogFormVisible:false,
        ruleForm:{
          competitionId: '',
          notificationTitle: '',
          winList: [],
          type: 'file',
          selectWin:[],
        },
        notificationList: [],
        competitionList: [],
        fileList: [],
        search: '',
        hasWinLevel: false,
        isFile: false,
        winList: [],
        userList:[],
        //是否为组队赛
        isTeam: false,
        //表单校验
        rules: {
          notificationTitle: [
          { required: true, message: '请输入通知标题', trigger: 'blur' },
          { max: 48, message: '长度最多为48个字符', trigger: 'blur' }
          ],
          competitionId: [
          { required: true, message: '请输入竞赛名称', trigger: 'blur' },
          { max: 96, message: '长度最多为96个字符', trigger: 'blur' }
          ],
        }
      }
    },

    methods: {
      //加载获奖名单
      loadWinList(data){
        this.axios.get("/win/findWinByCompetitionId", {params:{competitionId: data}})
        .then((res)=>{
          this.dialogTableVisible = true
          if(res.data.data.userCompetitions != null && res.data.data.userCompetitions.length > 0){
            this.winList = res.data.data.userCompetitions
            if(res.data.data.userCompetitions[0].winLevelName != null && res.data.data.userCompetitions[0].winLevelName != ''){
              this.hasWinLevel = true
            }
          }
          else{
            this.winList = []
          } 
        })
        .catch((res)=>{
        })
      },

      //新增获奖通知
      addWinList(){
        this.ruleForm.type = "file"
        this.ruleForm.selectWin = []
        this.ruleForm.notificationTitle = ''
        this.ruleForm.competitionId = ''
        //清空原有文件列表
        this.fileList = []
        this.dialogFormVisible = true
        this.isAdd = true
      },

      //修改获奖通知表单控制
      update(data){
        this.ruleForm.type = "file"
        this.ruleForm.selectWin = []
        this.ruleForm.notificationTitle = ''
        this.ruleForm.competitionId = ''
        //清空原有文件列表
        this.fileList = []
        this.dialogFormVisible = true
        this.isAdd = false
        this.axios.get("/win/findWinForm",{params:{notificationId: data.notificationId,competitionId: data.competition.competitionId}})
        .then((res)=>{
          console.log(res)
          if(res.data.data.userCompetitions != null && res.data.data.userCompetitions.length > 0){
            this.notificationId = data.notificationId
            try{
              this.notificationList.forEach(item=>{
                if(item.notificationId == data.notificationId){
                  this.ruleForm.notificationTitle = item.notificationTitle
                  //已找到对应数据，抛异常跳出循环
                  throw new Error("已找到通知标题对应数据")
                }
              })
            }
            catch{
            }
            this.ruleForm.competitionId = res.data.data.userCompetitions[0].competition.competitionId

            //判断为文件获奖信息还是录入的数据获奖信息
            if(res.data.data.files != null && res.data.data.files.length > 0){
              this.ruleForm.type = "file"
              res.data.data.files.forEach(file => {
                var json = {name: file.fileName, url: file.filePath, fileId: file.fileId}
                this.fileList.push(json)
              });
            }
            else{
              this.ruleForm.type = "message"
              //加载选手名单
              this.selectCompetition()
              res.data.data.userCompetitions.forEach(item=>{
                if(item.winRanking != null){
                  this.ruleForm.selectWin.push(item.user.userId)
                }
              })
            }
            console.log(this.notificationId)
          } 
        })
        .catch((res)=>{
        })
      },

      //提交修改
      //提交添加修改比赛通知的表单
      submitUpdateForm(ruleForm){
        if(this.ruleForm.type == "file"){
          this.axios.post("/win/updateWinNotification",{notificationTitle:this.ruleForm.notificationTitle,
          notificationId: this.notificationId,
          competition:{competitionId:this.ruleForm.competitionId}})
          .then((res)=>{
          //保存上传文件
          this.$refs.upload.submit()
          this.dialogFormVisible = false
          })
          .catch((res)=>{
            console.log(res)
          })
        }
        else if(this.ruleForm.type == "message") {
          this.axios.post("/win/updateWinNotification",{notificationTitle:this.ruleForm.notificationTitle,
          notificationId: this.notificationId,
          competition:{competitionId:this.ruleForm.competitionId},
          userIds:this.ruleForm.selectWin
          })
          .then((res)=>{
          console.log(res)
          this.dialogFormVisible = false
          })
          .catch((res)=>{
            console.log(res)
          })
        }
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

      //删除对话框
      openDeleteWindow(data) {
        console.log(data)
        this.$confirm('此操作将永久删除该比赛通知及对应比赛内容和文件数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get("/win/deleteWinNotification", {params:{notificationId: data.notificationId,competitionId: data.competition.competitionId}})
          .then((res)=>{
            //删除前端数据 
            this.winList.forEach((notification,index) => {
              if(notification.notificationId == data.notificationId){
                //删除索引后的一个元素
                this.winList.splice(index,1)
              }
            });
            this.$message({
            type: 'success',
            message:res.data.msg
            });
          })
          .catch((res)=>{
          })
        }).catch(() => {  
        });
      },

      //关闭表单
      closeForm(){
        this.dialogFormVisible = false
      },

      selectCompetition(){
        try{
          this.competitionList.forEach(item=>{
            if(item.competitionId == this.ruleForm.competitionId){
              if(item.competitionPeopleSum > 1){
                this.isTeam = true
              }
              else{
                this.isTeam = false
              }
              //抛异常跳出循环
              throw new Error("找到相应数据")
            }
          })
          
        }
        catch{

        }
        this.axios.get("/competition/findUserByCompetitionId",{params:{competitionId:this.ruleForm.competitionId}})
        .then((res)=>{
          console.log(res)
          this.userList = res.data.data.users
        })
        .catch((res)=>{
        })
      },

       //提交表单
      submitForm(ruleForm){
        console.log(this.ruleForm.competitionId)
        if(this.ruleForm.type == "file"){
          this.axios.post("/win/insertWinNotification",{notificationTitle:this.ruleForm.notificationTitle,
          competition:{competitionId:this.ruleForm.competitionId}})
          .then((res)=>{
          //保存上传文件
          this.$refs.upload.submit()
          this.dialogFormVisible = false
          })
          .catch((res)=>{
            console.log(res)
          })
        }
        else if(this.ruleForm.type == "message") {
            this.axios.post("/win/insertWinNotification",{notificationTitle:this.ruleForm.notificationTitle,
            competition:{competitionId:this.ruleForm.competitionId},
            userIds:this.ruleForm.selectWin
          })
          .then((res)=>{
          console.log(res)
          this.dialogFormVisible = false
          })
          .catch((res)=>{
            console.log(res)
          })
        }
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
      //查询获奖通知数据列表
      this.axios.get("/win/findAllWinNotification")
      .then((res)=>{
        this.notificationList = res.data.data.notifications
      })
      .catch((res)=>{
          console.log(res)
      })

      //查询所有比赛
      this.axios.get("/competition/findAllCompetition")
      .then((res)=>{
        this.competitionList = res.data.data.competitions
      })
      .catch((res)=>{
      })
    }
  }
</script>

<style>
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
</style>