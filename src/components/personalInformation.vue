 <template>
    <el-container direction="vertical" >
        <el-main>
            <el-table
            :data="tableData"
           style="width: 100%"
      height="530">
            <el-table-column
                prop="key"
                label=""
                align="center"
                >
            </el-table-column>
            <el-table-column
                prop="value"
                label=""
                >
            </el-table-column>
       
            </el-table>
        </el-main>
    </el-container>
</template>

  <script>
    export default {
      data() {
        return {
          tableData: [
            {
              key: '用户名',
              value: ''
            },
            {
              key: '姓名',
              value: ''
            },
            {
              key: '性别',
              value: ''
            },
            {
              key: '学校',
              value: ''
            },
            {
              key: '二级学院',
              value: ''
            },
            
            {
              key: '年级',
              value: ''
            },
            
            {
              key: '身份',
              value: ''
            },
            {
              key: '邮箱',
              value: ''
            },
          ]
        }
      },

      methods: {
          
      },

      created(){
        //页面加载调用方法,查询个人信息封装至res
        this.axios.get("/user/findUserByUsername")
        .then((res)=>{
            //解析json渲染页面
            console.log(res)
            this.tableData[0].value = res.data.userName
            this.tableData[1].value = res.data.name
            this.tableData[2].value = res.data.sex
            this.tableData[3].value = res.data.college.university.universityName
            this.tableData[4].value = res.data.college.collegeName
            this.tableData[5].value = res.data.period
            //获取所有角色，逗号分隔
            res.data.roles.forEach(role => {
               this.tableData[6].value += role.roleName
               this.tableData[6].value += '，'
            });

          //去除最后一个字符（，）
           this.tableData[6].value = this.tableData[6].value.substr(0,this.tableData[6].value.length - 1)
            
          this.tableData[7].value = res.data.email
        })
        .catch((res)=>{
            console.log(res);
        })
    },
    }
  </script>