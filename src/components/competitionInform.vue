<template>
    <el-container>
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
            property="competition.competitionType"
            label="竞赛类型"
            align="center">
            </el-table-column>
            <el-table-column
        property="competition.competitionPeopleSum"
        label="个人赛·组队赛"
        width="90"
        align="center">
        </el-table-column>
            <el-table-column
            property="competition.competitionLevel"
            label="竞赛等级"
            align="center">
            </el-table-column>
            <el-table-column
            property="competition.competitionSite"
            label="比赛地点"
            align="center">
            </el-table-column>
            <el-table-column
            property="notificationState"
            label="状态"
            width="90"
            align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot="header" slot-scope="scope">
                    <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索" 
                    width="50"/>   
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="small"
                    type="primary"
                    plain
                    @click="particulars(scope.row.competition.competitionId)">查看详情</el-button>
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
            //解析比赛级别
            item.competition.competitionLevel = this.analysisLevel(item.competition.competitionLevel)
            //解析通知状态
            item.notificationState = this.analysisNotificationState(item.notificationState)
            if(item.notificationTitle.includes(this.search)||item.notificationState.includes(this.search)||
                item.competition.competitionType.includes(this.search) || item.competition.competitionLevel.includes(this.search)||
                item.competition.competitionSite.includes(this.search) || item.competition.competitionPeopleSum.includes(this.search)){
                item.competition.competitionPeopleSum == 1 || item.competition.competitionPeopleSum == "个人赛" ? 
                item.competition.competitionPeopleSum = "个人赛" :item.competition.competitionPeopleSum = "组队赛"
                return item;
            }
         })
        }
    },
    data() {
        return {
            search: '',
            currentRow: null,
            notificationList: []
        }
    },

    methods: {
        //查看详情，data为竞赛的id
        particulars(data){
            //更新路由，将竞赛id带入新路由
            this.$router.push({
                path: '/home/competitionDetails',
                query: {
                competitionId: data
                }
            })
        },

        //解析比赛级别
      analysisLevel(data){
        data == 1 ||  data == "院级" ? data = "院级" 
        :data == 2 ||  data == "校级" ? data = "校级" 
        :data == 3 ||  data == "省级" ? data = "省级"
        :data = "国家级"
        return data;
      },

      //解析通知状态
      analysisNotificationState(data){
        data == 0 ||  data == "已结束" ? data = "已结束" 
        :data == 1 ||  data == "进行中" ? data = "进行中" 
        :data = "维护中"
        return data;
      },

    },
    created(){
        //查询竞赛通知数据列表
        this.axios.get("/notification/findNotificationByType")
        .then((res)=>{
            console.log(res)
            this.notificationList = res.data.data.notifications
            console.log(this.notificationList)
        })
        .catch((res)=>{
            this.$message({
                type: 'error',
                message:res.data.msg
              });
        })
    }
  }
</script>