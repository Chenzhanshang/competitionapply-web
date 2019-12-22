 <template>
    <el-container direction="vertical" >
        <div class="comp">
            竞赛名：{{this.competition.competitionName}}
        </div>
        <div class="comp">
            竞赛内容：{{this.competition.competitionContent}}
        </div>
        <div class="comp">
            竞赛地点：{{this.competition.competitionSite}}
        </div>
        <div class="comp">
            竞赛时间：{{this.competition.competitionName}}
        </div>
        <div class="comp">
            竞赛状态：{{this.competition.competitionState==1  ?'进行中':'已结束'}}
        </div>
        <div class="comp">
            竞赛时间：{{this.competition.competitionTime}}
        </div>
        <!-- <el-divider>文件列表</el-divider>
            <el-card class="box-card">
                <div v-for="(item,index) in applyInfo.files" :key="item.fileId" class="text item">
                    文件{{index}}:<el-link  target="_blank">{{item.fileName}} </el-link><el-button @click="downloadFile(item.fileId,item.fileName)" size="mini" >下载</el-button>
                </div>
            </el-card>
            -->
        <div class="comp">
            <el-button
                size="small"
                type="primary"
                :loading="loading"
                plain
                :disabled = "buttonState"
                @click="apply()">{{buttonState == false ? "报名" : "已报名"}}</el-button>
                <el-button
                size="small"
                type="primary"
                :loading="cancelLoding"
                plain
                :disabled = "!buttonState"
                @click="cancelApply()">取消报名</el-button>
        </div>
         
        
    </el-container>
</template>

<script>
export default {
    data() {
    return {
        competition: '',
        loading: false,
        cancelLoding: false,
        //按钮状态，报名false可点击，true不可点击，取消报名反之
        buttonState: false
        
    }
    },

    methods: {
        //报名
        apply(){
            this.loading = true
            this.axios.get("/apply/doApply",{params:{competitionId:this.competition.competitionId}})
            .then((res)=>{
                this.loading = false
                this.buttonState = true
                console.log(res)
                this.$message({
                type: 'success',
                message:res.data.msg
              });
            })
            .catch((res)=>{
                this.loading = false
            })
        },

        //取消报名
        cancelApply(){
            this.cancelLoding = true
            this.axios.get("/apply/cancelApply",{params:{competitionId:this.competition.competitionId}})
            .then((res)=>{
                this.cancelLoding = false
                this.buttonState = false
                console.log(res)
                this.$message({
                type: 'success',
                message:res.data.msg
              });
            })
            .catch((res)=>{
                this.cancelLoding = false
            })
        }
    },

    created(){
    
    this.axios.get("/apply/loadApplyState",{params:{competitionId:this.$route.query.competitionId}})
    .then((res)=>{
        if(res.data.data.userCompetition != null){
            this.buttonState = true
        }

    }).catch((res)=>{
        console.log(res)
    })

    //页面加载调用方法,查询个人信息封装至res
    this.axios.get("/competition/findCompetitionById",{params:{competitionId:this.$route.query.competitionId}})
    .then((res)=>{
        //将res中的比赛信息解析放入this.competition
        this.competition = res.data.data.competition
        console.log(this.competition)
    })
    .catch((res)=>{
        console.log(res);
    })
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