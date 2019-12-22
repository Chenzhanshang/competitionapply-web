<template> 
<el-container>
  <el-aside>
    <el-menu :default-openeds="activeIndex">
        <el-menu-item-group >
          <el-menu-item index=0>{{notificationList[0].notificationTitle}}</el-menu-item>
          <el-menu-item index=1>{{notificationList[1].notificationTitle}}</el-menu-item>
          <el-menu-item index=2>{{notificationList[2].notificationTitle}}</el-menu-item>
        </el-menu-item-group>
    </el-menu>
  </el-aside>
  
  <el-container>  
    <el-main width:150px>
      <p>公告详情：</p>
      <div>
        {{content}}
       </div>
      <p>文件列表：</p>
    </el-main>
  </el-container>
</el-container>

</template>


<script>
export default {
    data() {
        return {
            activeIndex: 0,
            notificationList: [],
            content: ''
        }
    },

    methods:{

    },

    created(){
      this.axios.post("/notification/findSystemNoticeByTypeAndState",{notificationType:'1',notificationState:'1'})
      .then((res)=>{
        this.notificationList = res.data.data.notifications
        console.log(this.notificationList)
      })
      .catch((res)=>{
        console.log(res)
      })
    }
  }
</script>

<style>
  
  .el-aside {
    color: #333;
  }
</style>