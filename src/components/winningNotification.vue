<template>
    <el-container>
        <el-dialog title="获奖名单" :visible.sync="dialogTableVisible" :before-close="closeDialog">
        
        <el-table :data="winList" height = 400>
            <el-table-column property="winRanking" label="名次" ></el-table-column>
            <el-table-column property="competition.competitionName" label="比赛名" ></el-table-column>
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
                <template slot-scope="scope">
                    <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
                    {{scope.row.notificationTime==null?new Date():scope.row.notificationTime | dateFormart}}
                </template>
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
                    v-if="!isFile(scope.row.isFile)"
                    size="small"
                    type="primary"
                    plain
                    @click="loadWinList(scope.row.competition.competitionId)">查看获奖名单</el-button>

                    <el-button
                    v-if="isFile(scope.row.isFile)"
                    size="small"
                    type="primary"
                    plain
                    @click="downloadFile(scope.row.files[0].fileId,scope.row.files[0].fileName)">下载获奖名单文件</el-button>
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
                    //判断是否存在文件，存在则为文件通知，否则信息通知，控制按钮显示
                   if(item.files == null || item.files.length ==0){
                       item["isFile"] = false
                   }
                   else{
                       item["isFile"] = true
                   }
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
        },

        //判断是否为文件通知
        isFile(data){
            if(data == true){
                return true
            }
            else{
                return false
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
            .catch((res)=>{
                console.log(res)
            })

        },
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