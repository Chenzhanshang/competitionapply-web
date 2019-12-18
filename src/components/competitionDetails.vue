 <template>
    <el-container direction="vertical" >
        <div class="comp">
            竞赛名：{{this.competition.competitionName}}
        </div>
        <div class="comp">
            竞赛内容：{{this.competition.competitionContent}}
        </div>
        <div class="comp">
            竞赛地点：{{this.competition.competitionName}}
        </div>
        <div class="comp">
            竞赛时间：{{this.competition.competitionName}}
        </div>
        <div class="comp">
            竞赛状态：{{this.competition.competitionState==1?'已结束':'进行中'}}
        </div>
        <div class="comp">
            <el-button
                size="small"
                type="primary"
                :loading="loading"
                plain
                :disabled = this.buttonState
                @click="apply()">{{buttonState == false ? "报名" : "已报名"}}</el-button>
        </div>
         
        
    </el-container>
</template>

<script>
export default {
    data() {
    return {
        competition: '',
        loading: false,
        //按钮状态，可点击，不可点击
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
        console.log(res.data.data.competition)
        //将res中的比赛信息解析放入this.competition
        this.competition = res.data.data.competition
        console.log(this.competition.competitionName)
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
</style>