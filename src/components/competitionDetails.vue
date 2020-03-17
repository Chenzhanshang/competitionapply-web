 <template>
    <el-container direction="vertical" >
        <div class="comp">
            竞赛名：{{competition.competitionName}}
        </div>
        <div class="comp">
            竞赛内容：{{competition.competitionContent}}
        </div>
        <div class="comp">
            竞赛地点：{{competition.competitionSite}}
        </div>
        <div class="comp">
            竞赛时间：{{competition.competitionTime}}
        </div>
        <div class="comp">
            竞赛状态：{{competition.competitionState==1  ?'进行中':'已结束'}}
        </div>
        <div class="comp">竞赛文件列表：</div>
        <el-card class="box-card">
            <div v-for="(file,index) in this.competition.files" :key="file.fileId" class="text file">
                文件{{index+1}}:
                <el-link  target="_blank">{{file.fileName}}</el-link>
                <el-button @click="downloadFile(file.fileId,file.fileName)" size="mini" >下载</el-button>
            </div>
        </el-card>
        <!--@click.native绑定select点击事件 -->
        <div class="comp" v-if="competition.competitionPeopleSum != 1">报名队伍：</div>
        <el-select v-model="teamName" :rules="rules" placeholder="请选择队伍" @click.native="onClick" @change="handleChange" v-if="competition.competitionPeopleSum != 1">
            <el-option v-for="team in teamList" :key="team.teamId" :label="team.teamName" :value="team"></el-option>
        </el-select>
        <div class="comp">
            <el-button
                size="small"
                type="primary"
                :loading="loading"
                plain
                :disabled = "buttonState || over"
                @click="apply()">{{buttonState == false ? "报名" : "已报名"}}</el-button>
                <el-button
                size="small"
                type="primary"
                :loading="cancelLoding"
                plain
                :disabled = "!buttonState || over"
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
            teamList: [],
            //竞赛已结束标识
            over:false,
            team: '',
            teamName: '',
            cancelLoding: false,
            //按钮状态，报名false可点击，true不可点击，取消报名反之
            buttonState: false,
            rules:{
                teamName: {required: true, message: "请选择队伍",trigger: "blur"},
            }   
        }
        
    },

    methods: {
        //报名
        apply(){
            if(this.competition.competitionPeopleSum == 1){
                this.loading = true
                this.axios.get("/apply/doApply", {params:{competitionId:this.competition.competitionId}})
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
            else{
                if(this.team == ''){
                    this.$message({
                        type: 'error',
                        message: '请选择队伍'
                    });
                }
                else{
                    if(this.team.teamState == 2){
                        this.loading = true
                        this.axios.get("/apply/doApplyByTeam", {params:{teamId: this.team.teamId}})
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
                    else{
                        console.log(this.team)
                        this.$message({
                            type: 'error',
                            message: '比赛规定人数:' + this.competition.competitionPeopleSum + ',当前队伍人数' + this.team.teamHeadcount
                        });
                    }
                    
                }
                
            }
        },

        //select变化监听,value即为select的option的:value
        handleChange(value){
            this.team = value
            console.log(this.team)
        },

        //点击选择队伍时触发
        onClick(){
            this.axios.get("/team/getMyTeamByCompetitionId", {params:{competitionId:this.competition.competitionId}})
            .then((res)=>{
                if(res.data.status == '1'){
                    this.teamList = []
                    this.teamList = res.data.data.teams
                    console.log(res)
                }
                else{
                    console.log(res)
                }
            })
            .catch()
        },
        //取消报名
        cancelApply(){
            if(this.competition.competitionPeopleSum == 1){
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
            else{
                this.cancelLoding = true
                this.axios.get("/apply/cancelTeamApply",{params:{competitionId:this.competition.competitionId}})
                .then((res)=>{
                    console.log(res)
                    this.cancelLoding = false
                    this.buttonState = false
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
                .catch((res)=>{
                    this.cancelLoding = false
                })
            }
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
    },

    created(){

        if(this.$route.query.competition.competitionPeopleSum == 1 || this.$route.query.competition.competitionPeopleSum == '个人赛'){
            this.axios.get("/apply/loadApplyState",{params:{competitionId:this.$route.query.competition.competitionId}})
            .then((res)=>{
                if(res.data.data.userCompetition != null){
                    this.buttonState = true
                }

            }).catch()
        }
        else{
            console.log(this.$route.query.competition.competitionPeopleSum)
            this.axios.get("/apply/loadTeamApplyState",{params:{competitionId:this.$route.query.competition.competitionId}})
            .then((res)=>{
                console.log(res)
                if(res.data.status == 2){
                    if(res.data.data.team.applyTime != null){
                        this.buttonState = true
                        this.teamName = res.data.data.team.teamName
                    }   
                }
            }).catch()
        }

        //页面加载调用方法,查询个人信息封装至res
        this.axios.get("/competition/findCompetitionById",{params:{competitionId:this.$route.query.competition.competitionId}})
        .then((res)=>{
            console.log(res)
            //将res中的比赛信息解析放入this.competition
            this.competition = res.data.data.competition
            if(this.competition.competitionTime == null || this.competition.competitionTime == ''){
                this.competition.competitionTime = "待定"
            }
            if(this.competition.competitionState != 1 ){
                this.over = true
            }
            console.log(this.competition)
        })
        .catch()
    },
}
</script>

<style scoped>
    .comp{
        margin-top: 30px;
        
    }

    .text {
    font-size: 14px;
    }
    
    .file {
    padding: 8px 0;
    }

    .box-card {
    width: 100%;
    }
</style>