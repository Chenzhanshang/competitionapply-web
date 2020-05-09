<template>
  <el-container>
    <el-main>
      <el-table
      :header-cell-style="{background:'#DCDFE6'}"
      border
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%">
        <el-table-column
        label="序号"
        type="index"
        width="70"
        align="center">
        </el-table-column>
        <el-table-column
        property="user.userName"
        label="用户名"
        align="center">
        </el-table-column>
        <el-table-column
        property="adviceDate"
        label="反馈时间"
        align="center">
          <template slot-scope="scope">
            <!-- 使用自定义的全局vue过滤器，具体见main.js中 -->
            <i class="el-icon-time"></i>{{scope.row.adviceDate==null?new Date():scope.row.adviceDate | dateFormart}}
          </template>
        </el-table-column>
        <el-table-column
        property="adviceType"
        label="类型"
        align="center">
        </el-table-column>
        <el-table-column
        property="adviceState"
        label="状态"
        align="center">
        </el-table-column>
        <el-table-column
        property="adviceContent"
        label="反馈内容"
        align="center">
        </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <el-input
            prefix-icon="el-icon-search"
            v-model="search"
            size="mini"
            placeholder="输入通知关键字搜索" 
            width="50"/>   
          </template>
          <template slot-scope="scope">
            <el-button
            size="small"
            icon="el-icon-success"
            type="primary"
            plain
            @click="dispose(scope.row)"
            >处理</el-button> 
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
        :total="adviceList.length"
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
    //计算属性，处理查询到的通知数据
    computed:{
      tableData:function(){
          return this.adviceList.filter((item)=>{
              if(item.adviceState.includes(this.search) || item.user.userName.includes(this.search)
              ||item.adviceType.includes(this.search)||item.adviceContent.includes(this.search)){
                
                  return item;
              }
          })
      },
    },
    data() {
      return {
        //当前页
        currentPage: 1,
        //每页条数
        pageSize: 5,
        //当前行
        currentRow: null,
        adviceList:[],
        search:''
      }
    },

    methods: {
        dispose(data){
          console.log(data.adviceId)
          this.$confirm('是否处理该反馈记录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.get("/advice/disposeAdvice", {params:{adviceId: data.adviceId}})
            .then((res)=>{
              if(res.data.status == 1){
                this.$message({
                  type: 'success',
                  message:res.data.msg 
                });
                this.getAdviceList()
              }
              else{
                this.$message({
                  type: 'error',
                  message:res.data.msg 
                });
              }
            })
            .catch()
          }).catch();
        },

      //监听页数改变
      handleSizeChange: function(size){
        this.pageSize = size
      },

      //监听当前页码
        handleCurrentChange: function(currentPage){
        this.currentPage = currentPage
      },

      //获取反馈列表
      getAdviceList(){
        this.axios.get("/advice/getAllAdvice",{params:{adviceState:0}})
        .then((res=>{
          console.log(res)
          this.adviceList = res.data.data.advices
          this.adviceList.forEach(item => {
            //解析状态
            item.adviceState == 0 || item == '待处理' ? item.adviceState = '待处理' : item.adviceState = '已处理'
          });
        }))
        .catch()
      }
    },

    created(){
        this.getAdviceList()
    }
  }
</script>