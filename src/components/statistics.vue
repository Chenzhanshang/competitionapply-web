<template>
  <div>
      <h1 style="text-align:center">已报名竞赛统计</h1>
      <ve-pie :data="competitionData" :settings="chartSettings" height=600px></ve-pie>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        chartSettings: {
            radius: 180,
            offsetY: 250
        },
        competitionData: {
          columns: ['competition', 'sum'],
          rows: [
            { 'competition': '创新创业', 'sum': 0 },
            { 'competition': '学科竞赛', 'sum': 0 },
            { 'competition': '知识竞赛', 'sum': 0 },
            { 'competition': '体育竞赛', 'sum': 0 },
            { 'competition': '电子竞技', 'sum': 0 },
            { 'competition': '数学竞赛', 'sum': 0 },
            { 'competition': '科技竞赛', 'sum': 0 },
          ]
        },
      }
    },
    methods: {
        
    },
    created(){
        this.axios.get("/competition/findCompetitionListByUserId")
        .then((res)=>{
            res.data.data.userCompetitions.forEach(userCompetition => {
                for(let i = 0; i < this.competitionData.rows.length; i++){
                    if(this.competitionData.rows[i].competition == userCompetition.competition.competitionType){
                        this.competitionData.rows[i].sum ++;
                        break;
                    }
                }
            });
        })
        .catch()
    }
  }
</script>