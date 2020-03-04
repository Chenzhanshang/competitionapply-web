<template>
  <el-container>
    <el-main>
        <h3 style="text-align:center">{{competition.competitionName}}已报名列表</h3>
      <el-table
      v-if="competition.competitionPeopleSum == 1"
      :data="userTable.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%">
        <el-table-column
        label="序号"
        type="index"
        width="70"
        align="center">
        </el-table-column>
        <el-table-column
        property="name"
        label="姓名"
        align="center">
        </el-table-column>
        <el-table-column
        property="college.university.universityName"
        label="学校"
        align="center">
        </el-table-column>
        <el-table-column
        property="college.collegeName"
        label="学院"
        align="center">
        </el-table-column>
        <el-table-column
        property="period"
        label="年级"
        align="center">
        </el-table-column>
        <el-table-column
        property="userClassName"
        label="班级"
        width="120"
        align="center">
        </el-table-column>
        <el-table-column
        align="center">
          <template slot="header" slot-scope="scope" v-if="competition.competitionPeopleSum == 1">
            <el-input
              prefix-icon="el-icon-search"
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索" 
              width="50"/>   
          </template>
          <template slot-scope="scope" >
              <el-button
              size="mini"
              type="primary"
              plain
              @click="moreMsg(scope.row.userId)"
            >查看更多信息</el-button> 
            <el-button
              size="mini"
              type="danger"
              plain
              @click="openDeleteWindow(scope.row)"
            >删除</el-button>    
          </template>
        </el-table-column>
      </el-table>

      <el-table
      v-if="competition.competitionPeopleSum != 1"
      :data="teamTable.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%">
        <el-table-column
        label="序号"
        type="index"
        width="70"
        align="center">
        </el-table-column>
        <el-table-column
        property="teamName"
        label="队伍名"
        align="center">
        </el-table-column>
        <el-table-column
        property="captain.name"
        label="队长名"
        align="center">
        </el-table-column>
        <el-table-column
        property="captain.phone"
        label="队长电话"
        align="center">
        </el-table-column>
        <el-table-column
        property="captain.email"
        label="队长邮箱"
        align="center">
        </el-table-column>
        <el-table-column
        align="center">
          <template slot="header" slot-scope="scope" v-if="competition.competitionPeopleSum != 1">
            <el-input
              prefix-icon="el-icon-search"
              v-model="teamSearch"
              size="mini"
              placeholder="输入关键字搜索" 
              width="50"/>   
          </template>
          <template slot-scope="scope" >
              <el-button
              size="mini"
              type="primary"
              plain
              @click="teamMembersMsg(scope.row)"
            >查看队伍成员</el-button> 
            <el-button
              size="mini"
              type="danger"
              plain
              @click="openDeleteTeamWindow(scope.row)"
            >删除</el-button>    
          </template>
        </el-table-column>
      </el-table>
      <el-pagination 
      v-if="competition.competitionPeopleSum == 1"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userList.length"
      prev-text="上一页"
      next-text="下一页"
      style="text-align:center;
        letter-spacing:4px;
        margin-top:30px">
      </el-pagination>
      
      <el-pagination 
      v-if="competition.competitionPeopleSum != 1"
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

    <!--个人详细信息抽屉-->
    <el-drawer
    title="详细信息"
    :visible.sync="more"
    direction="rtl"
    size="50%">
        <el-table :data="moreUserMsg">
            <el-table-column prop="key" label align="center"></el-table-column>
            <el-table-column prop="value" label></el-table-column>
        </el-table>
    </el-drawer>


    <!--队伍成员详细信息抽屉-->
    <el-drawer
    title="队伍成员信息"
    :visible.sync="teamMembers"
    direction="rtl"
    size="75%">
    <el-table
        :data="userListMsg"
        style="width: 100%">
            <el-table-column
            label="序号"
            type="index"
            width="70"
            align="center">
            </el-table-column>
            <el-table-column
            property="name"
            label="姓名"
            align="center">
            </el-table-column>
            <el-table-column
            property="role"
            label="职位"
            align="center">
            </el-table-column>
            <el-table-column
            property="college.university.universityName"
            label="学校"
            align="center">
            </el-table-column>
            <el-table-column
            property="college.collegeName"
            label="学院"
            align="center">
            </el-table-column>
            <el-table-column
            property="period"
            label="年级"
            align="center">
            </el-table-column>
            <el-table-column
            property="userClassName"
            label="班级"
            width="120"
            align="center">
            </el-table-column>
            <el-table-column
            align="center">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="primary"
                plain
                @click="teamMemberMore(scope.row.userId)"
                >查看更多信息</el-button> 
            </template>
            </el-table-column>
        </el-table>
    <div>
    <el-drawer
        title="详细信息"
        :append-to-body="true"
        :visible.sync="innerDrawer">
        <el-table :data="moreUserMsg">
            <el-table-column prop="key" label align="center"></el-table-column>
            <el-table-column prop="value" label></el-table-column>
        </el-table>
    </el-drawer>
    </div>
    </el-drawer>
        
  </el-container>
</template>
<script>
export default {
    //计算函数，处理查询到的通知数据
    computed:{
        userTable: function() {
            return this.userList.filter(item => {
                if (
                    item.name.includes(this.search) ||
                    item.college.university.universityName.includes(this.search) ||
                    item.college.collegeName.includes(this.search) ||
                    item.userClassName.includes(this.search)
                ) {
                    return item;
                }
            });
        },
        teamTable: function() {
            return this.teamList.filter(item => {
                if (
                    item.teamName.includes(this.teamSearch) ||
                    item.captain.name.includes(this.teamSearch)
                ) {
                    return item;
                }
            });
        },
        userListMsg:function(){
            return this.teamUserList.filter(item => {
                if(item.userId == this.captainId){
                    item.role = '队长'
                }
                else{
                    item.role = '队员'
                }
                return item;
            });
        }
    },
    data() {
      return {
        //当前页
        currentPage: 1,
        //每页条数
        pageSize: 5,
        //当前行
        currentRow: null,
        loading: false,
        competition: {},
        userList: [],
        teamList:[],
        search: '',
        teamSearch:'',
        more: false,
        teamMembers: false,
        innerDrawer: false,
        teamUserList:[],
        //临时存放当前队伍队长id，供判断队伍成员列表成员是否为队长
        captainId: '',
        moreUserMsg: [
          {
            key: "用户名",
            value: ""
          },
          {
            key: "姓名",
            value: ""
          },
          {
            key: "性别",
            value: ""
          },
          {
            key: "学校",
            value: ""
          },
          {
            key: "二级学院",
            value: ""
          },

          {
            key: "年级",
            value: ""
          },
          {
            key: "班级",
            value: ""
          },
          {
            key: "电话",
            value: ""
          },
          {
            key: "邮箱",
            value: ""
          }
        ]
    };

    },

    methods: {
        moreMsg(data){
            //打开抽屉
            this.more = true
            this.axios.get("/user/getUserByUserId",{params:{userId: data}})
            .then((res)=>{
                //解析json渲染页面
                this.moreUserMsg[0].value = res.data.userName;
                this.moreUserMsg[1].value = res.data.name;
                this.moreUserMsg[2].value = res.data.sex;
                this.moreUserMsg[3].value = res.data.college.university.universityName;
                this.moreUserMsg[4].value = res.data.college.collegeName;
                this.moreUserMsg[5].value = res.data.period;
                this.moreUserMsg[6].value = res.data.userClassName;
                this.moreUserMsg[7].value = res.data.phone;
                this.moreUserMsg[8].value = res.data.email;
            })
            .catch()
        },

        teamMemberMore(data){
            //打开抽屉
            this.innerDrawer = true
            this.axios.get("/user/getUserByUserId",{params:{userId: data}})
            .then((res)=>{
                //解析json渲染页面
                this.moreUserMsg[0].value = res.data.userName;
                this.moreUserMsg[1].value = res.data.name;
                this.moreUserMsg[2].value = res.data.sex;
                this.moreUserMsg[3].value = res.data.college.university.universityName;
                this.moreUserMsg[4].value = res.data.college.collegeName;
                this.moreUserMsg[5].value = res.data.period;
                this.moreUserMsg[6].value = res.data.userClassName;
                this.moreUserMsg[7].value = res.data.phone;
                this.moreUserMsg[8].value = res.data.email;
            })
            .catch()
        },

        //删除对话框
        openDeleteWindow(data) {
          console.log(data)
          this.$confirm('此操作将更改该用户报名状态为未报名状态, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.post("/apply/adminCancelApply",{competition:{competitionId:this.competition.competitionId},user:{userId:data.userId}})
            .then((res)=>{
                if(res.data.status == "1"){
                    this.$message({
                        type: 'success',
                        message:res.data.msg
                    });
                    this.getList()
                    
                }
                else{
                    this.$message({
                        type: 'error',
                        message:res.data.msg
                    });
                }
                
            })
            .catch()
          }).catch(() => {  

          });
        },

        //删除队伍报名对话框
        openDeleteTeamWindow(data) {
          console.log(data)
          this.$confirm('此操作将更改该队伍报名状态为未报名状态, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.get("/apply/adminCancelTeamApply",{params:{teamId:data.teamId}})
                .then((res)=>{
                    if(res.data.status == 1){
                        this.$message({
                            type: 'success',
                            message:res.data.msg
                        });
                        this.getList()
                    }
                    else{
                        this.$message({
                            type: 'error',
                            message:res.data.msg
                        });
                    }
                    
                })
                .catch()
          }).catch(() => {  

          });
        },

        //查看队伍成员信息
        teamMembersMsg(data){
            this.teamMembers = true
            //存放队长id
            this.captainId = data.captain.userId
            this.axios.get('team/getTeamMembers',{params:{teamId: data.teamId,captainId: data.captain.userId}})
            .then((res=>{
                console.log(res)
                if(res.data.status == 1){
                    this.teamUserList = res.data.data.users
                }
            }))
            .catch()
        },

        //监听页数改变
        handleSizeChange: function(size){
          this.pageSize = size

        },

        //监听当前页码
        handleCurrentChange: function(currentPage){
            this.currentPage = currentPage
        },
        getList(){
          this.axios.get('competition/findCompetitionById',{params:{competitionId: this.$route.query.competitionId}})
          .then((res)=>{
            this.competition = res.data.data.competition
            if(this.competition.competitionPeopleSum == 1){
              this.axios.get('competition/getUserReportList',{params:{competitionId: this.competition.competitionId}})
              .then((res)=>{
                this.userList = res.data.data.users
              })
              .catch()
            }
            else{
              this.axios.get('team/getTeamReportList',{params:{competitionId: this.competition.competitionId}})
              .then((res=>{
                this.teamList = res.data.data.teams
              }))
              .catch()
            }
          })
          .catch()
        }

    },
    created(){
      this.getList()
        
    }
  }
</script>