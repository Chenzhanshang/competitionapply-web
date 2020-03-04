 <template>
    <el-container direction="vertical" >
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="竞赛名：" prop="competitionName">
    <el-input v-model="ruleForm.competitionName"></el-input>
  </el-form-item>
  <el-form-item label="竞赛内容：" prop="competitionContent">
    <el-input type="textarea" v-model="ruleForm.competitionContent"></el-input>
  </el-form-item>
  <el-form-item label="竞赛地点：" prop="competitionSite">
    <el-input v-model="ruleForm.competitionSite"></el-input>
  </el-form-item>
  <el-form-item label="竞赛时间：" required>
    <el-col :span="11">
      <el-form-item prop="date1">
        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col class="line" :span="2">-</el-col>
    <el-col :span="11">
      <el-form-item prop="date2">
        <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
      </el-form-item>
    </el-col>
  </el-form-item>

  <el-form-item label="竞赛状态：" prop="competitionState">
    <el-radio-group v-model="ruleForm.competitionState">
      <el-radio label="1">进行中</el-radio>
      <el-radio label="0">已结束</el-radio>
    </el-radio-group>
  </el-form-item>

    <el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>    
  
  
  
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>

        
    </el-container>
</template>

<script>
export default {
    data() {
    return {
        
        ruleForm:{
            competitionName: '',
            competitionContent: '',
            competitionState: '',
            competitionSite: '',
            date1: '',
            date2: '',


        },
        competition: '',
        loading: false,
        cancelLoding: false,
        //按钮状态，报名false可点击，true不可点击，取消报名反之
        buttonState: false,


    
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
         {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]

    }
    },

    methods: {
        handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    
    },

    created(){
    

    //页面加载调用方法,查询个人信息封装至res
    this.axios.get("/competition/findCompetitionById",{params:{competitionId:this.$route.query.competitionId}})
    .then((res)=>{
        //将res中的比赛信息解析放入this.competition
        this.competition = res.data.data.competition
        console.log(this.competition)
        this.ruleForm.competitionName = this.competition.competitionName
        this.ruleForm.competitionContent = this.competition.competitionContent
        this.ruleForm.competitionSite = this.competition.competitionSite
        //this.ruleForm.competitionState = this.competition.competitionState
    })
    .catch()
},
}
</script>

<style scoped>
    .comp{
        margin-top: 30px;
        
    }
    
    .item {
        padding: 8px 0;
    }

    .box-card {
        width: 100%;
    }
</style>