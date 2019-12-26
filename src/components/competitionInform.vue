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
            property="competition.competitionState"
            label="状态"
            width="90"
            align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
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
                item.competition.competitionState == 1 || item.competition.competitionState == "进行中" ? item.competition.competitionState='已结束' : item.competition.competitionState='进行中'
                
                //解析比赛类型
                item.competition.competitionLevel == 1 ||  item.competition.competitionLevel == "院级" 
                ? item.competition.competitionLevel = "院级" 
                :item.competition.competitionLevel == 2 ||  item.competition.competitionLevel == "校级" 
                ?item.competition.competitionLevel = "校级" 
                :item.competition.competitionLevel == 3 ||  item.competition.competitionLevel == "省级" 
                ?item.competition.competitionLevel = "省级"
                :item.competition.competitionLevel = "国家级"

                //if(item.notificationTitle.includes('')||item.notificationId.includes('')){
                   return item;
                //}
            })
        }
    },
    data() {
        return {
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
        }
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