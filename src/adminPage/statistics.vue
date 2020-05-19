<template>
    <div>
        <div style="text-align:center">
            <el-button type="primary" :plain="collegeBtnPlain" @click="collegeClick()">学院</el-button>
            <el-button type="primary" :plain="classBtnPlain" @click="classClick()">班级</el-button>
            <el-button type="primary" :plain="sexBtnPlain" @click="sexClick()">性别</el-button>
            
        </div>
        <div v-if = !collegeBtnPlain>
            <h1 style="text-align:center">用户学院分布</h1>
            <ve-pie :data="collegeData" :settings="chartSettings" height=600px></ve-pie>
        </div>
        <div v-if = !sexBtnPlain>
            <h1 style="text-align:center">用户性别分布</h1>
            <ve-pie :data="sexData" :settings="chartSettings" height=600px></ve-pie>
        </div>
        <div v-if = !classBtnPlain>
            <h1 style="text-align:center">用户班级分布</h1>
            <ve-pie :data="classData" :settings="chartSettings" height=600px></ve-pie>
        </div>
        
    </div>
</template>

<script>
  export default {
    data () {
      return {
        collegeBtnPlain:false,
        sexBtnPlain:true,
        classBtnPlain:true,
        competitionBtnPlain:true,
        chartSettings: {
            radius: 180,
            offsetY: 250
        },
        collegeData: {
          columns: ['college', 'sum'],
          rows: [
            { 'college': '信息工程学院', 'sum': 0 },
            { 'college': '高博软件学院', 'sum': 0 },
            { 'college': '艺术设计学院', 'sum': 0 },
            { 'college': '土木建筑学院', 'sum': 0 },
            { 'college': '会计与审计学院', 'sum': 0 },
            { 'college': '管理学院', 'sum': 0 },
            { 'college': '机电与质量技术工程学院', 'sum': 0 },
            { 'college': '交通学院', 'sum': 0 },
          ]
        },
        sexData: {
          columns: ['sex', 'sum'],
          rows: [
            { 'sex': '男', 'sum': 0 },
            { 'sex': '女', 'sum': 0 },
          ]
        },
        classData: {
          columns: ['class', 'sum'],
          rows: [
            { 'class': '计科1班', 'sum': 0 },
            { 'class': '计科2班', 'sum': 0 },
            { 'class': '计科3班', 'sum': 0 },
            { 'class': '计科4班', 'sum': 0 },
            { 'class': '计科（高博）2班', 'sum': 0 },
            { 'class': '计科（高博）3班', 'sum': 0 },
            { 'class': '计科（高博）4班', 'sum': 0 },
            { 'class': '物联1班', 'sum': 0 },
            { 'class': '物联3班', 'sum': 0 },
            { 'class': '会计学1班', 'sum': 0 },
            { 'class': '会计学2班', 'sum': 0 },
            { 'class': '通信1班', 'sum': 0 },
            { 'class': '通信2班', 'sum': 0 },
          ]
        },
      }
    },
    methods: {
        collegeClick(){
            this.sexBtnPlain = true;
            this.classBtnPlain = true;
            this.competitionBtnPlain = true;
            this.collegeBtnPlain = false;
        },
        sexClick(){
            this.sexBtnPlain = false;
            this.classBtnPlain = true;
            this.competitionBtnPlain = true;
            this.collegeBtnPlain = true;
        },
        classClick(){
            this.sexBtnPlain = true;
            this.classBtnPlain = false;
            this.competitionBtnPlain = true;
            this.collegeBtnPlain = true;
        }
    },
    created(){
        this.axios.get("/user/getAllUser")
        .then((res)=>{
            console.log(res)
            res.data.data.userList.forEach(user => {
                for(let i = 0; i < this.collegeData.rows.length; i++){
                    if(this.collegeData.rows[i].college == user.college.collegeName){
                        this.collegeData.rows[i].sum ++;
                        break;
                    }
                }

                for(let i = 0; i < this.sexData.rows.length; i++){
                    if(this.sexData.rows[i].sex == user.sex){
                        this.sexData.rows[i].sum ++;
                        break;
                    }
                }

                for(let i = 0; i < this.classData.rows.length; i++){
                    if(this.classData.rows[i].class == user.userClassName){
                        this.classData.rows[i].sum ++;
                        break;
                    }
                }
            });
            console.log(this.collegeData)
        })
        .catch()
    }
  }
</script>