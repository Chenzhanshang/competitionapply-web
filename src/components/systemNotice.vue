<template> 
  <el-container>
    <el-aside>
      <el-menu >
          <el-menu-item-group>
            <el-menu-item v-for="notification in notificationList" :key="notification.notificationId" @click="select(notification.notificationId)">
              {{notification.notificationTitle}}
            </el-menu-item>
          </el-menu-item-group>
      </el-menu>
    </el-aside>
    <el-container>  
      <el-main width:150px v-if="notification != ''">
        <h3 style="text-align:center">{{notification.notificationTitle}}</h3>
        <div style="text-align:center">
          发布时间：
          <template>
            <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
            {{notification.notificationTime==null?new Date():notification.notificationTime | dateFormart}}
          </template>
        </div>
        <el-divider></el-divider>
        <div>
          {{this.notification.notificationContent}}
        </div>
        <el-divider v-if="notification.files.length != 0"></el-divider>
        <div class="comp" v-if="notification.files.length != 0">附件：</div>
        <el-card class="box-card" v-if="notification.files.length != 0">
            <div v-for="(file,index) in this.notification.files" :key="file.fileId" class="text file">
              文件{{index+1}}:
              <el-link  target="_blank">{{file.fileName}}</el-link>
              <el-button @click="downloadFile(file.fileId,file.fileName)" size="mini" >下载</el-button>
            </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
  export default {
    data() {
      return {
        active:'',
        notificationList: [],
        notification: '',
      }
    },

    methods:{
      select(data){
        try{
          this.notificationList.forEach(item=>{
            if(item.notificationId === data){
              this.notification = item
              //已找到对应数据，抛异常跳出循环
              throw new Error("已找到公告对应数据")
            }
          })  
        }
        catch{ 
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
      .catch()
    },
  },

  created(){
    this.axios.get("/notice/findAll")
    .then((res)=>{
      this.notificationList = res.data.data.notifications
      console.log(this.notificationList)
      if(res.data.status == 1){
        this.notification = this.notificationList[0]
      }
    })
    .catch()
  }
}
</script>

<style>
  
  .el-aside {
    color: #333;
  }
</style>