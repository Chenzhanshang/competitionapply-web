<template>
    <el-container>
      <el-main>
        <el-dialog title="申请信息" :visible.sync="dialogFormVisible" center>
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
        <el-table :data="teamListTB.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
          :header-cell-style="{background:'#DCDFE6'}"
          border
          :height="tableHeight" style="width: 100%">
          <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
          <el-table-column prop="teamName" label="队伍" align="center"></el-table-column>
          <el-table-column  label="队长" align="center">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>电话: {{ scope.row.captain.phone }}</p>
                <p>邮箱: {{ scope.row.captain.email }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.captain.name }}</el-tag>
                </div>
              </el-popover>
            </template>

          </el-table-column>
          <el-table-column prop="teamHeadcount" label="当前人数" align="center"></el-table-column>
          <el-table-column prop="competition.competitionName" label="参与比赛" align="center"></el-table-column>
          <el-table-column prop="teamContent" label="队伍宣言" align="center"></el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-input prefix-icon="el-icon-search" v-model="search" size="mini" placeholder="输入关键字搜索" />
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                icon="el-icon-circle-plus"
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
            //表格高度,行高55.6px,乘以size行加1行表头，默认默认55.3 * 6
            tableHeight:55.3 * 6 ,
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
            if(size <= this.notificationList.length){
              this.tableHeight = 55.6 * (size + 1)
            }
            else{
              this.tableHeight = 55.6 * (this.notificationList.length +1)
            }
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