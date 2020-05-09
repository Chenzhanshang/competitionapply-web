<template>
  <el-container>
    <el-main>
      <el-dialog title="比赛-通知信息" :visible.sync="dialogFormVisible" width="60%" center>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="通知标题：" prop="notificationTitle">
            <el-input v-model="ruleForm.notificationTitle"></el-input>
          </el-form-item>
          <el-form-item label="竞赛名称：" prop="competitionName">
            <el-input v-model="ruleForm.competitionName"></el-input>
          </el-form-item>
          <el-form-item label="竞赛内容：" prop="competitionContent">
            <el-input type="textarea" v-model="ruleForm.competitionContent"></el-input>
          </el-form-item>
          <el-form-item  label="参赛人数：" prop="competitionPeopleSum">
            <el-input-number v-model="ruleForm.competitionPeopleSum" :min="1" label="参赛人数："></el-input-number>
          </el-form-item>
          <el-form-item label="竞赛地点：" prop="competitionSite">
            <el-input v-model="ruleForm.competitionSite"></el-input>
          </el-form-item>
          <el-form-item label="竞赛时间：">
            <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker 
              type="date" 
              placeholder="选择日期（不选为待定）" 
              v-model="ruleForm.competitionTime" 
              value-format="yyyy 年 M 月 d 日"
              style="width: 100%;"></el-date-picker>
            </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="比赛级别：">
            <el-select v-model="ruleForm.competitionLevel" placeholder="请选择比赛级别">
              <el-option label="院级" value="1"></el-option>
              <el-option label="校级" value="2"></el-option>
              <el-option label="省级" value="3"></el-option>
              <el-option label="国家级" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="比赛学院："  v-if="selectCollegeShow">
            <el-select v-model="ruleForm.collegeId" placeholder="请选择比赛学院" >
                <el-option v-for="college in collegeList" :key="college.id" :label="college.name" :value="college.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="竞赛状态：" prop="competitionState" v-if="!isAdd">
            <el-radio-group v-model="ruleForm.competitionState">
              <el-radio  :label="1">进行中</el-radio>
              <el-radio  :label="0">已结束</el-radio>
              <el-radio  :label="2">维护中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="通知状态：" prop="notificationState" v-if="!isAdd">
            <el-radio-group v-model="ruleForm.notificationState">
              <el-radio  :label="1">进行中</el-radio>
              <el-radio  :label="0">已结束</el-radio>
              <el-radio  :label="2">维护中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="比赛类型：">
            <el-select v-model="ruleForm.competitionType" placeholder="请选择比赛类型">
              <el-option v-for="types in competitionTypes" :key="types.id" :label="types.name" :value="types.name"></el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item style="margin-top:20px">
            <div id="submit-button">
              <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')" v-show="isAdd">提交</el-button>
              <el-button type="primary" :loading="loading" @click="submitUpdateForm('ruleForm')" v-show="!isAdd">提交修改</el-button>
              <el-button @click="closeForm()">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :header-cell-style="{background:'#DCDFE6'}"
      border
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
        property="competition.competitionType"
        label="竞赛类型"
        width="120"
        align="center">
        </el-table-column>
        <el-table-column
        property="competition.competitionPeopleSum"
        label="个人赛·组队赛"
        width="120"
        align="center">
        </el-table-column>
        <el-table-column
        property="competition.competitionLevel"
        label="竞赛等级"
        width="120"
        align="center">
        </el-table-column>
        <el-table-column
        property="notificationTime"
        label="发布时间"
        align="center">
          <template slot-scope="scope">
            <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
            <i class="el-icon-time"></i>{{scope.row.notificationTime==null? new Date() : scope.row.notificationTime | dateFormart}}
          </template>
        </el-table-column>
        <el-table-column
        property="notificationState"
        label="状态"
        width="90"
        align="center">
        </el-table-column>
        <el-table-column
        align="center">
          <template slot="header" slot-scope="scope">
            <el-input
              prefix-icon="el-icon-search"
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索" 
              width="120"/>   
          </template>
          <template slot-scope="scope" >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-tools"
              plain
              @click="update(scope.row.notificationId)"
              >修改</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-remove"
              plain
              @click="openDeleteWindow(scope.row)"
            >删除</el-button>    
          </template>
        </el-table-column>
        <el-table-column >
          <template slot="header">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-circle-plus"
              plain
              @click="add()"
              >新增比赛通知</el-button>  
          </template>
          <template slot-scope="scope" >
            <el-button
              size="mini"
              icon="el-icon-more"
              type="primary"
              plain
              @click="showReportList(scope.row.competition)"
              >查看报名名单</el-button>  
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="notificationList.length"
      prev-text="上一页"
      next-text="下一页"
      style="text-align:center;
        letter-spacing:4px;
        margin-top:30px">
      </el-pagination>
    </el-main>
  </el-container>
</template>
<script>
export default {
    //计算函数，处理查询到的通知数据
    computed:{
      //控制学院下拉框的显示
      selectCollegeShow:function(){
        if(this.ruleForm.competitionLevel == 1 || this.ruleForm.competitionLevel === "院级"){
          return true;
        }
        return false;

      },
      tableData:function(){
        return this.notificationList.filter((item)=>{
          //解析比赛级别
          item.competition.competitionLevel = this.analysisLevel(item.competition.competitionLevel)
          //解析通知状态
          item.notificationState = this.analysisNotificationState(item.notificationState)
          if(item.notificationTitle.includes(this.search)||item.notificationState.includes(this.search)||
            item.competition.competitionType.includes(this.search) || item.competition.competitionLevel.includes(this.search)||
            item.competition.competitionPeopleSum.includes(this.search)){
              item.competition.competitionPeopleSum == 1 || item.competition.competitionPeopleSum == "个人赛" ? 
              item.competition.competitionPeopleSum = "个人赛" :item.competition.competitionPeopleSum = "组队赛"
              return item;
          }
        })
      }
    },
    data() {
      return {
        //当前页
        currentPage: 1,
        //每页条数
        pageSize: 5,
        //当前行
        currentRow: null,
        loading: false,
        //通知列表
        notificationList: [],

        search: '',
        competitionId: '',
        competitionTypes: [],
        collegeList: [],
        isAdd: true,
        dialogFormVisible:false,
        ruleForm:{
          competitionName: '',
          notificationTitle: '',
          competitionContent: '',
          competitionState: '',
          competitionSite: '',
          competitionTime: '',
          competitionType: '',
          competitionLevel: '',
          collegeId: '',
          competitionId:'',
          notificationId: '',
          notificationState: '',
          competitionPeopleSum: 1,         
        },
        competition: '',
        loading: false,
        cancelLoding: false,
        //按钮状态，报名false可点击，true不可点击，取消报名反之
        buttonState: false,


    
        fileList: [],

        //表单校验
        rules: {
          notificationTitle: [
            { required: true, message: '请输入通知标题', trigger: 'blur' },
             { max: 48, message: '长度最多为48个字符', trigger: 'blur' }
          ],
          competitionName: [
            { required: true, message: '请输入竞赛名称', trigger: 'blur' },
            { max: 96, message: '长度最多为96个字符', trigger: 'blur' }
          ],

          competitionContent: [
            { required: true, message: '请输入竞赛内容', trigger: 'blur' },
            { max: 255, message: '长度最多为255个字符', trigger: 'blur' }
          ],
          competitionSite: [
            { required: true, message: '请输入竞赛地点', trigger: 'blur' },
            { max: 64, message: '长度最多为64个字符', trigger: 'blur' }
          ],
          competitionType: {required: true, message: "请选择比赛类型", trigger: "blur"
          },
          competitionLevel: {required: true, message: "请选择比赛级别", trigger: "blur"
          },

        }
    };

    },

    methods: {
      //修改比赛,data == notificationId
      update(data){
        //清空原有文件列表
        this.fileList = []
        this.dialogFormVisible = true
        this.isAdd = false
        //查询比赛信息封装至res
       this.axios.get("/notification/findDataByNotificationId",{params:{notificationId:data}})
      .then((res)=>{
        console.log(res)
        //将res中的比赛信息解析放入表单回显
        this.ruleForm.notificationTitle = res.data.data.notification.notificationTitle
        this.ruleForm.competitionName = res.data.data.notification.competition.competitionName
        this.ruleForm.competitionContent = res.data.data.notification.competition.competitionContent
        this.ruleForm.competitionSite = res.data.data.notification.competition.competitionSite
        this.ruleForm.competitionPeopleSum = res.data.data.notification.competition.competitionPeopleSum
        if(res.data.data.notification.competition.competitionTime != "待定"){
          this.ruleForm.competitionTime = res.data.data.notification.competition.competitionTime
        }
        //解析比赛级别
        this.ruleForm.competitionLevel = this.analysisLevel(res.data.data.notification.competition.competitionLevel)
        this.ruleForm.competitionType = res.data.data.notification.competition.competitionType
        this.ruleForm.competitionState = res.data.data.notification.competition.competitionState
        this.ruleForm.notificationState = res.data.data.notification.notificationState
        this.ruleForm.competitionId = res.data.data.notification.competition.competitionId
        this.ruleForm.notificationId = res.data.data.notification.notificationId
        //如果有竞赛文件，回显
        if(res.data.data.notification.competition.files.length != null 
        && res.data.data.notification.competition.files.length > 0){
          res.data.data.notification.competition.files.forEach(file => {
            var json = {name: file.fileName, url: file.filePath, fileId: file.fileId}
            this.fileList.push(json)
          });
        }

        //如果为院级比赛，回显院名称
        if(res.data.data.notification.competition.college != null ){
          this.ruleForm.collegeId = res.data.data.notification.competition.college.collegeId
        }
        //this.ruleForm.competitionState = this.competition.competitionState
    })
    .catch()
      },

      //提交添加新比赛通知的表单
      submitForm(ruleForm){
        this.loading = true
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            //保存表单的比赛，通知，文件信息
            this.axios.post("/notification/insertCompetition",{
            competitionName: this.ruleForm.competitionName,
            notificationTitle: this.ruleForm.notificationTitle,
            competitionContent: this.ruleForm.competitionContent,
            competitionSite: this.ruleForm.competitionSite,
            competitionType: this.ruleForm.competitionType,
            competitionLevel: this.ruleForm.competitionLevel,
            competitionTime: this.ruleForm.competitionTime,
            collegeId: this.ruleForm.collegeId,
            competitionPeopleSum: this.ruleForm.competitionPeopleSum
            })
            .then((res)=>{
              //保存上传文件
              this.$refs.upload.submit()
              this.dialogFormVisible = false
              if(res.data.status == 1){
                this.$message({
                  type: 'success',
                  message:res.data.msg
                });
                this.getCompetitionList()
              }
              else{
                this.$message({
                  type: 'error',
                  message:res.data.msg            
                });
              }
              this.loading = false
            })
            .catch()
          } else {
            this.loading = false
            return false;
          }
        });
      },

      //提交修改比赛通知的表单
      submitUpdateForm(ruleForm){
        console.log(this.ruleForm)
        this.loading = true
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            //保存修改表单的比赛，通知，文件信息
            this.axios.post("/notification/updateNotification",{
            competitionId: this.ruleForm.competitionId,
            notificationId: this.ruleForm.notificationId,
            competitionName: this.ruleForm.competitionName,
            notificationTitle: this.ruleForm.notificationTitle,
            competitionState:this.ruleForm.competitionState,
            competitionContent: this.ruleForm.competitionContent,
            competitionSite: this.ruleForm.competitionSite,
            competitionType: this.ruleForm.competitionType,
            competitionLevel: this.reAnalysisLevel(this.ruleForm.competitionLevel),
            competitionTime: this.ruleForm.competitionTime,
            collegeId: this.ruleForm.collegeId,
            notificationState: this.ruleForm.notificationState,
            competitionId: this.ruleForm.competitionId,
            competitionPeopleSum: this.ruleForm.competitionPeopleSum
            })
            .then((res)=>{
              //保存上传文件
              this.$refs.upload.submit()
              this.dialogFormVisible = false
              if(res.data.status == 1){
                this.$message({
                  type: 'success',
                  message:res.data.msg
                });
                this.getCompetitionList()
              }
              else{
                this.$message({
                  type: 'error',
                  message:res.data.msg            
                });
              }
              this.loading = false
            })
            .catch()
          } else {
            this.loading = false
            return false;
          }
        });
      },

      //添加新比赛通知
      add(){
        this.dialogFormVisible = true
        //若为添加,则控制显示添加表单项
        this.isAdd = true
        //清空表单之前调用修改的回显数据
        this.ruleForm.notificationState = '',
        this.ruleForm.collegeName = ''
        this.ruleForm.competitionName = ''
        this.ruleForm.competitionContent = ''
        this.ruleForm.competitionSite = ''
        this.ruleForm.notificationTitle = ''
        this.ruleForm.competitionTime = ''
        this.ruleForm.competitionLevel = ''
        this.ruleForm.competitionType = ''
        this.ruleForm.competitionState = ''
        this.ruleForm.competitionPeopleSum = 1
        this.fileList = []
      },

      //删除对话框
        openDeleteWindow(data) {
          console.log(data)
          this.$confirm('此操作将永久删除该比赛通知及对应比赛内容和文件数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.get("/notification/deleteByNotificationId", {params:{notificationId: data.notificationId,competitionId: data.competition.competitionId}})
            .then((res)=>{
              if(res.data.status == 1){
                this.$message({
                  type: 'success',
                  message:res.data.msg 
                });
                this.getCompetitionList()
              }
              else{
                this.$message({
                  type: 'error',
                  message:res.data.msg 
                });
              }
            })
            .catch()
          }).catch(() => {  
        });
        },

      //解析比赛级别
      analysisLevel(data){
        data == 1 ||  data == "院级" ? data = "院级" 
        :data == 2 ||  data == "校级" ? data = "校级" 
        :data == 3 ||  data == "省级" ? data = "省级"
        :data = "国家级"
        return data;
      },

      //逆解析比赛级别
      reAnalysisLevel(data){
        data == "院级" ||  data == 1 ? data = 1 
        :data == "校级" ||  data == 2 ? data = 2 
        :data == "省级" ||  data == 3 ? data = 3
        :data = 4
        return data;
      },

      //解析通知状态
      analysisNotificationState(data){
        data == 0 ||  data == "已结束" ? data = "已结束" 
        :data == 1 ||  data == "进行中" ? data = "进行中" 
        :data = "维护中"
        return data;
      },

      //监听页数改变
        handleSizeChange: function(size){
      
          this.pageSize = size

        },

        //监听当前页码
        handleCurrentChange: function(currentPage){
            this.currentPage = currentPage
        },

      //关闭表单
      closeForm(){
        this.dialogFormVisible = false
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

      //显示报名成员列表
      showReportList(data){
        //更新路由，将竞赛信息带入新路由
        this.$router.push({
          path: '/adminHome/reportList',
          query: {
            competitionId: data.competitionId
          }
        })
      },

      //获取比赛通知列表
      getCompetitionList(){
        this.axios.get("/notification/findNotificationByType",{params:{notificationType: 0}})
        .then((res)=>{
          console.log(res)
          this.notificationList = res.data.data.notifications
        })
        .catch()
      }
    

    },
    created(){
      this.getCompetitionList()
      //加载所有比赛类型
      this.axios.get("/notification/findAllType")
      .then((res)=>{
        res.data.data.competitionTypes.forEach(types => {
            var json = {id: types.competitionTypeId, name: types.competitionTypeName}
            this.competitionTypes.push(json)
          });

        })
        .catch()

      //加载管理员学校的所有二级学院列表
      this.axios.get("/notification/findCollege")
      .then((res)=>{
        res.data.data.colleges.forEach(college => {
            var json = {id: college.collegeId, name: college.collegeName}
            this.collegeList.push(json)
          });

        })
        .catch()
    }

  

  }
</script>

<style>
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