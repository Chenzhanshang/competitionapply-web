<template>
    <el-container>
        <el-dialog title="获奖名单" :visible.sync="dialogTableVisible" :before-close="closeDialog">
        
        <el-table :data="winList" height = 400>
            <el-table-column property="winRanking" label="名次" ></el-table-column>
            <el-table-column property="competition.competitionName" label="名次" ></el-table-column>
            <el-table-column property="user.name" label="姓名"></el-table-column>
            <el-table-column property="user.userClassName" label="班级"></el-table-column>
            <el-table-column property="winLevelName" label="奖项" v-if="hasWinLevel"></el-table-column>
        </el-table>
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
            </el-table-column>
            <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                
                <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索" 
                width="50"/>   
                </template>
                <template slot-scope="scope">
                    <el-button
                    v-if="!isFile"
                    size="small"
                    type="primary"
                    plain
                    @click="loadWinList(scope.row.competition.competitionId)">查看获奖名单</el-button>

                    <el-button
                    v-if="isFile"
                    size="small"
                    type="primary"
                    plain
                    @click="particulars(scope.row.competition.competitionId)">下载获奖名单文件</el-button>
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
                if(item.notificationTitle.includes(this.search)||item.notificationTime.includes(this.search)){
                   return item;
                }
            })
        }
    },
    data() {
        return {
            dialogTableVisible: false,
            currentRow: null,
            notificationList: [],
            search: '',
            hasWinLevel: false,
            isFile: false,
            winList: []
        }
    },

    methods: {
        //加载获奖名单
        loadWinList(data){
            console.log(data)
            this.axios.get("/win/findWinByCompetitionId", {params:{competitionId: data}})
            .then((res)=>{
                console.log(res)
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

        //关闭弹窗前进行该操作
        closeDialog(dowm){
            this.hasWinLevel = false
            dowm()
        }
    },
    created(){
        //查询竞赛通知数据列表
        this.axios.get("/win/findAllWinNotification")
        .then((res)=>{
            console.log(res)
            this.notificationList = res.data.data.notifications
     
        })
        .catch((res)=>{
            console.log(res)
        })
    }
  }
</script>