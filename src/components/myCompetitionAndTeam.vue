<template>
  <el-container>
    <el-main>
      <el-dialog title="队伍信息" :visible.sync="dialogFormVisible" width="60%">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="队伍名：" prop="teamName">
            <el-input v-model="ruleForm.teamName"></el-input>
          </el-form-item>
          <el-form-item label="竞赛名：" prop="competitionId">
            <el-select v-model="ruleForm.competitionId" placeholder="请选择比赛" :disabled="!isAdd">
              <el-option
                v-for="competition in teamCompetitionList"
                :key="competition.competitionId"
                :label="competition.competitionName"
                :value="competition.competitionId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="队伍简介：" prop="teamContent">
            <el-input type="textarea" v-model="ruleForm.teamContent"></el-input>
          </el-form-item>
          <div v-if="!isAdd">
            成员管理：
            <el-table :data="myTeamUserList">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column label="姓名" prop="name"></el-table-column>
              <el-table-column label="学院" prop="college.collegeName"></el-table-column>
              <el-table-column label="班级" prop="userClassName"></el-table-column>
              <el-table-column align="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="openDeleteTeamUser(scope.row.userId)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" v-show="isAdd">提交</el-button>
            <el-button type="primary" @click="submitUpdateForm('ruleForm')" v-show="!isAdd">提交修改</el-button>
            <el-button @click="closeForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-tabs
        :tab-position="'left'"
        style="height: 600px;"
      >
        <el-tab-pane label="我的比赛" name="first">
          <el-table :data="CompetitionList" height="600px" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="competition.competitionName" label="比赛名" width="350"></el-table-column>
            <el-table-column prop="competition.competitionType" label="比赛类型"></el-table-column>
            <el-table-column prop="competition.competitionPeopleSum" label="个人赛·组队赛"></el-table-column>
            <el-table-column prop="competition.competitionState" label="比赛状态"></el-table-column>
            <el-table-column label="报名时间">
              <template slot-scope="scope">
                <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
                {{scope.row.date==null?new Date():scope.row.date | dateFormart}}
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="search1" size="mini" placeholder="输入关键字搜索" />
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handle(scope.$index, scope.row)"
                >比赛详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="我加入的队伍" name="second">
          <el-table :data="joinTeamList1" height="600px" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="teamName" label="队伍名"></el-table-column>
            <el-table-column prop="competition.competitionName" label="所属比赛"></el-table-column>
            <el-table-column prop="teamState" label="队伍状态"></el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="search2" size="mini" placeholder="输入关键字搜索" />
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="openExitTeam(scope.row.teamId)"
                >退出队伍</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我创建的队伍" name="third">
          <el-table :data="myTeamList1" height="600px" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="teamName" label="队伍名"></el-table-column>
            <el-table-column prop="competition.competitionName" label="所属比赛"></el-table-column>
            <el-table-column prop="teamState" label="队伍状态"></el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="search3" size="mini" placeholder="输入关键字搜索" />
              </template>
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain @click="updateMyTeam(scope.row)">管理</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="openDeleteTeam(scope.row.teamId)"
                >解散队伍</el-button>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="scope">
                <el-button size="mini" type="success" plain @click="createTeam()">创建队伍</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="加入我的申请" name="fourth">
          <el-table :data="joinMyTeamList1" height="600px" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="team.teamName" label="队伍名"></el-table-column>
            <el-table-column prop="team.competition.competitionName" label="所属比赛"></el-table-column>
            <el-table-column prop="applyTime" label="申请时间">
              <template slot-scope="scope">
                <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
                {{scope.row.applyTime==null?new Date():scope.row.applyTime | dateFormart}}
              </template>
            </el-table-column>
            <el-table-column prop="user.name" label="申请人姓名"></el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="search4" size="mini" placeholder="输入关键字搜索" />
              </template>
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain @click="pass(scope.row.applyId)">通过</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="refuse(scope.row.applyId)"
                >拒绝</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我的处理记录" name="seventh">
          <el-table :data="myDisposeList1" height="600px" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="team.teamName" label="队伍名"></el-table-column>
            <el-table-column prop="team.competition.competitionName" label="所属比赛"></el-table-column>
            <el-table-column prop="applyTime" label="申请时间">
              <template slot-scope="scope">
                <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
                {{scope.row.applyTime==null?new Date():scope.row.applyTime | dateFormart}}
              </template>
            </el-table-column>
            <el-table-column prop="user.name" label="申请人姓名"></el-table-column>
            <el-table-column prop="applyState" label="处理结果"></el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="search4" size="mini" placeholder="输入关键字搜索" />
              </template>
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain @click="pass(scope.row.applyId)">通过</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="refuse(scope.row.applyId)"
                >拒绝</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我的申请" name="fifth">
          <el-table :data="myJoinApplyList1" height="600px" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="team.teamName" label="队伍名"></el-table-column>
            <el-table-column prop="team.competition.competitionName" label="所属比赛"></el-table-column>
            <el-table-column prop="applyState" label="申请状态"></el-table-column>
            <el-table-column prop="applyTime" label="申请时间">
              <template slot-scope="scope">
                <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
                {{scope.row.applyTime==null?new Date():scope.row.applyTime | dateFormart}}
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="search5" size="mini" placeholder="输入关键字搜索" />
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="openDeleteTeam(scope.row.teamId)"
                >撤销申请</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我的申请历史" name="sixth">
          <el-table :data="historyJoinApplyList1" height="600px" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="team.teamName" label="队伍名"></el-table-column>
            <el-table-column prop="team.competition.competitionName" label="所属比赛"></el-table-column>
            <el-table-column prop="applyState" label="申请状态"></el-table-column>
            <el-table-column prop="applyTime" label="申请时间">
              <template slot-scope="scope">
                <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
                {{scope.row.applyTime==null?new Date():scope.row.applyTime | dateFormart}}
              </template>
            </el-table-column>
            <el-table-column prop="applyTime" label="处理时间">
              <template slot-scope="scope">
                <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
                {{scope.row.applyTime==null?new Date():scope.row.applyTime | dateFormart}}
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="search6" size="mini" placeholder="输入关键字搜索" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
export default {
  computed: {
    CompetitionList: function() {
      return this.userCompetitionList.filter(item => {
        if (
          item.competition.competitionName.includes(this.search1) ||
          item.competition.competitionPeoplenum.includes(this.search1) ||
          item.competition.competitionState.includes(this.search1) ||
          item.competition.competitionType.includes(this.search1)
        ) {
          return item;
        }
      });
    },

    joinTeamList1: function() {
      return this.joinTeamList.filter(item => {
        if (
          item.competition.competitionName.includes(this.search2) ||
          item.teamName.includes(this.search2) ||
          item.teamState.includes(this.search2)
        ) {
          return item;
        }
      });
    },

    myTeamList1: function() {
      return this.myTeamList.filter(item => {
        if (
          item.competition.competitionName.includes(this.search3) ||
          item.teamName.includes(this.search3) ||
          item.teamState.includes(this.search3)
        ) {
          return item;
        }
      });
    },

    joinMyTeamList1: function() {
      return this.joinMyTeamList.filter(item => {
        if (
          item.team.competition.competitionName.includes(this.search4) ||
          item.team.teamName.includes(this.search4) ||
          item.user.name.includes(this.search4)
        ) {
          return item;
        }
      });
    },

    myDisposeList1: function() {
      return this.myDisposeList.filter(item => {
        if (
          item.team.competition.competitionName.includes(this.search7) ||
          item.team.teamName.includes(this.search7) ||
          item.user.name.includes(this.search7) ||
          item.applyState.includes(this.search7)
        ) {
          return item;
        }
      });
    },

    myJoinApplyList1: function() {
      return this.myJoinApplyList.filter(item => {
        if (
          item.team.competition.competitionName.includes(this.search5) ||
          item.team.teamName.includes(this.search5)) {
          return item;
        }
      });
    },

    historyJoinApplyList1: function() {
      return this.historyJoinApplyList.filter(item => {
        if (
          item.team.competition.competitionName.includes(this.search6) ||
          item.team.teamName.includes(this.search6)) {
          return item;
        }
      });
    },
  },
  data() {
    return {
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
      search6: "",
      search7: "",
      isAdd: false,
      teamCompetitionList: [],
      dialogFormVisible: false,
      userCompetitionList: [],
      joinMyTeamList: [],
      myJoinApplyList: [],
      historyJoinApplyList: [],
      //管理队伍时队员信息
      myTeamUserList: [],
      myTeamList: [],
      joinTeamList: [],
      myDisposeList: [],
      ruleForm: {
        teamName: "",
        competitionId: "",
        teamContent: "",
        teamId: ""
      },

      //表单校验
      rules: {
        teamName: [
          { required: true, message: "请输入队伍名称", trigger: "blur" },
          { max: 48, message: "长度最多为48个字符", trigger: "blur" }
        ],
        competitionId: {
          required: true,
          message: "请选择比赛",
          trigger: "blur"
        },
        teamContent: [
          { required: true, message: "请输入队伍简介", trigger: "blur" },
          { max: 255, message: "长度最多为255个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    createTeam() {
      this.dialogFormVisible = true;
      this.isAdd = true;
      //清空回显数据
      this.ruleForm.teamName = "";
      this.ruleForm.competitionId = "";
      this.ruleForm.teamContent = "";
    },

    closeForm() {
      this.dialogFormVisible = false;
    },

    //唤出管理队伍表单
    updateMyTeam(data) {
      console.log(data);
      this.dialogFormVisible = true;
      this.isAdd = false;
      //请求获得该队伍除队长外的所有成员
      this.axios
        .get("/team/findUsersByTeamId", { params: { teamId: data.teamId } })
        .then(res => {
          console.log(res);
          this.myTeamUserList = res.data.data.users;
        })
        .catch(res => {});
      this.ruleForm.teamName = data.teamName;
      this.ruleForm.competitionId = data.competition.competitionId;
      this.ruleForm.teamContent = data.teamContent;
      this.ruleForm.teamId = data.teamId;
    },

    //退出队伍对话框
    openExitTeam(data) {
      console.log(data);
      this.$confirm("此操作将退出该队伍, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .get("/team/exitTeam", { params: { teamId: data } })
            .then(res => {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            })
            .catch(res => {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            });
        })
        .catch(() => {});
    },

    //解散队伍对话框
    openDeleteTeam(data) {
      console.log(data);
      this.$confirm(
        "此操作将解散该队伍并移除该队伍所有成员, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.axios
            .get("/team/deleteTeam", { params: { teamId: data } })
            .then(res => {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            })
            .catch(res => {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            });
        })
        .catch(() => {});
    },

    //删除队员对话框
    openDeleteTeamUser(data) {
      console.log(data);
      this.$confirm("此操作将从队伍中移除该成员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .get("/team/deleteTeamUser", {
              params: { teamId: this.ruleForm.teamId, userId: data }
            })
            .then(res => {
              this.$message({
                type: "success",
               message: res.data.msg
              });
            })
            .catch(res => {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            });
        })
        .catch(() => {});
    },

    //提交创建队伍表单
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.axios
            .post("/team/addTeam", {
              teamName: this.ruleForm.teamName,
              teamContent: this.ruleForm.teamContent,
              competition: { competitionId: this.ruleForm.competitionId }
            })
            .then(res => {
              this.dialogFormVisible = false;
              this.$message({
                type: "success",
                message: res.data.msg
              });
            })
            .catch(res => {
              console.log(res);
              this.$message({
                type: "error",
                message: res.data.msg
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //提交更新队伍信息表单
    submitUpdateForm(ruleForm) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("/team/updateMyTeam", {
              teamId: this.ruleForm.teamId,
              teamContent: this.ruleForm.teamContent,
              teamName: this.ruleForm.teamName
            })
            .then(res => {
              this.dialogFormVisible = false;
              this.$message({
                type: "success",
                message: res.data.msg
              });
            })
            .catch(res => {
              console.log(res);
              this.$message({
                type: "error",
                message: res.data.msg
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //解析比赛状态
    analysisCompetitionState(data) {
      data == 0 || data == "已结束"
        ? data = "已结束"
        : data == 1 || data == "进行中"
        ? data = "进行中"
        : data = "维护中"
      return data;
    },

    //解析申请状态
    analysisApplyState(data) {
      data == 0 || data == "处理中"
        ? data = "处理中"
        : data == 1 || data == "通过"
        ? data = "通过"
        : data == 2 || data == "拒绝"
        ? data = "拒绝"
        : data = "结束"
      return data;
    },

    //获取我的比赛列表
    getMyCompetitionList() {
      this.axios
        .get("/competition/findCompetitionListByUserId")
        .then(res => {
          console.log(res);
          
          this.userCompetitionList = res.data.data.userCompetitions;
          //通过比赛的人数解析为个人赛（1人）还是组队赛（非1）
          this.userCompetitionList.forEach(item => {
            if (item.competition.competitionPeopleSum == 1) {
              item.competition.competitionPeopleSum = "个人赛";
            } else {
              item.competition.competitionPeopleSum = "组队赛";
            }
            //解析比赛状态
            item.competition.competitionState = this.analysisCompetitionState(item.competition.competitionState);
          });
        })
        .catch(res => {
          console.log(res);
        });
    },

    //通过加入队伍申请
    pass(data){
      this.axios.get("/apply/pass",{params:{applyId: data}})
      .then((res)=>{

      })
      .catch((res)=>{

      })
    },

    //拒绝加入队伍申请
    refuse(data){
      this.axios.get("/apply/refuse",{params:{applyId: data}})
      .then((res)=>{

      })
      .catch((res)=>{

      })
    },

    //解析队伍状态
    analysisTeamState(data) {
      data == 0 || data == "未招募"
        ? (data = "未招募")
        : data == 1 || data == "招募中"
        ? (data = "招募中")
        : (data = "已满员");
      return data;
    },

    //获取我创建的队伍列表
    getMyTeamList() {
      this.axios.get("/team/findMyTeam")
        .then(res => {
          console.log(res);
          this.myTeamList = res.data.data.teams;
          //解析队伍状态
          this.myTeamList.forEach(item => {
            item.teamState = this.analysisTeamState(item.teamState);
          });
        })
        .catch(res => {
          console.log(res);
        });
    },

    //获取当前用户加入的队伍列表
    getJoinTeamList() {
      this.axios.get("/team/findJoinTeam")
        .then(res => {
          console.log(res);
          this.joinTeamList = res.data.data.teams;
          //解析队伍状态
          this.joinTeamList.forEach(item => {
            item.teamState = this.analysisTeamState(item.teamState);
          });
        })
        .catch(res => {
          console.log(res);
        });
    },

    //获取申请加入当前用户的队伍的申请列表
    getJoinMyTeamList() {
      this.axios.get("/team/joinMyTeamList")
        .then(res => {
         this.joinMyTeamList = res.data.data.applies
        })
        .catch(res => {
          console.log(res);
        });
    },

    //获取当前用户已处理的申请列表
    getMyDisposeList() {
      this.axios.get("/team/myDisposeList")
        .then(res => {
         console.log(res);
         this.myDisposeList = res.data.data.applies
         this.myDisposeList.forEach(item => {
            //解析申请状态
            item.applyState = this.analysisApplyState(item.applyState);
          });
        })
        .catch(res => {
          console.log(res);
        });
    },

    //获取我正在申请加入队伍的列表
    getMyJoinApplyList() {
      this.axios.get("/apply/getMyJoinApplyList")
        .then(res => {
          this.myJoinApplyList = res.data.data.applies
          this.myJoinApplyList.forEach(item => {
            //解析申请状态
            item.applyState = this.analysisApplyState(item.applyState);
          });
        })
        .catch(res => {
          console.log(res);
        });
    },

    //获取我已结束申请加入队伍的列表
    getHistoryJoinApplyList() {
      this.axios.get("/apply/getHistoryJoinApplyList")
        .then(res => {
          this.historyJoinApplyList = res.data.data.applies
          this.historyJoinApplyList.forEach(item => {
            //解析申请状态
            item.applyState = this.analysisApplyState(item.applyState);
          });
        })
        .catch(res => {
          console.log(res);
        });
    }
  },

  created() {
    //获取我的比赛列表
    this.getMyCompetitionList();
    //获取我创建的队伍列表
    this.getMyTeamList();
    //获取当前用户加入的队伍列表
    this.getJoinTeamList();

    //获取加入我的队伍所有申请
    this.getJoinMyTeamList()

    //获取我申请加入队伍的列表
    this.getMyJoinApplyList()

    //获取当前用户已处理的申请列表
    this.getMyDisposeList()

    //获取我已结束申请加入队伍的列表
    this.getHistoryJoinApplyList()

    //查询所有组队比赛
    this.axios
      .get("/competition/findAllTeamCompetition")
      .then(res => {
        console.log(res);
        this.teamCompetitionList = res.data.data.competitions;
      })
      .catch(res => {});
  }
};
</script>