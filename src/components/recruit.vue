<template>
    <el-container>
      <el-main>
        <el-dialog title="申请信息" :visible.sync="dialogFormVisible">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="队伍名：" prop="teamName" >
              <el-input v-model="ruleForm.teamName" disabled></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="applyContent">
              <el-input type="textarea" v-model="ruleForm.applyContent" placeholder="请输入个人介绍或加入原因等信息"></el-input>
            </el-form-item> 
            <el-form-item>
              <el-button type="primary" @click="submitApply('ruleForm')" >提交</el-button>
              <el-button @click="closeForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-table :data="teamListTB.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="teamName" label="队伍"></el-table-column>
          <el-table-column prop="captain.name" label="队长"></el-table-column>
          <el-table-column prop="teamHeadcount" label="当前人数"></el-table-column>
          <el-table-column prop="competition.competitionName" label="参与比赛"></el-table-column>
          <el-table-column prop="teamContent" label="队伍宣言"></el-table-column>
          <el-table-column align="right">
            <template slot="header" slot-scope="scope">
              <el-input prefix-icon="el-icon-search" v-model="search" size="mini" placeholder="输入关键字搜索" />
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="applyForm(scope.row)"
              >申请加入</el-button>
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
          :total="teamList.length"
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
    computed:{
        teamListTB:function(){
            return this.teamList.filter((item)=>{
                if(item.teamName.includes(this.search) || item.competition.competitionName.includes(this.search) || item.captain.name.includes(this.search)){
                    return item;
                }
            })
        }
    },
    data(){
        return{
            //当前页
            currentPage: 1,
            //每页条数
            pageSize: 5,
            //当前行
            currentRow: null,
            teamList: [],
            search: '',
            ruleForm: {
                teamName: '',
                applyContent: '',
                teamId: '',
            },

            dialogFormVisible: false,
        }

    },

    methods:{
        //控制申请表单
        applyForm(data){
            this.ruleForm.teamName = data.teamName
            this.ruleForm.teamId = data.teamId
            this.dialogFormVisible = true
        },

        //提交申请
        submitApply(ruleForm){
            this.axios.post("/apply/joinTeam", 
            {applyContent: this.ruleForm.applyContent,
            team:{teamId: this.ruleForm.teamId}})
            .then((res)=>{
                console.log(res)
                this.dialogFormVisible = false
                if(res.data.status == 1){
                  this.$message({
                    type: "success",
                    message: res.data.msg
                  });
                  this.getRecruitList()
                }
                else{
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
                
            })
            .catch()
        },

        //关闭表单
        closeForm(){
            this.dialogFormVisible = false
        },

        //监听页数改变
        handleSizeChange: function(size){
            this.pageSize = size
        },

        //监听当前页码
            handleCurrentChange: function(currentPage){
            this.currentPage = currentPage
        },
        //加载正在招募的队伍列表
        getRecruitList(){
          this.axios.get("/recruit/findAllRecruitTeam")
          .then((res)=>{
            console.log(res)
            this.teamList = res.data.data.teams
          })
          .catch()
        }
        
    },

    created(){
        this.getRecruitList()
    }
}
</script>