<template>
 <div class="app-container">
      <div class="filter-container">
         <el-input v-model="listQuery.username" placeholder="帐号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
         <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="handleFilter">
           搜索
         </el-button>

      </div>
      <br>
   <el-table
     :key="tableKey"
    :data="tableData"
    v-loading="listLoading"
     border
     fit
     highlight-current-row
     style="width: 100%;"
   >
     <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" >
       <template slot-scope="{row}">
         <span>{{ row.id }}</span>
       </template>
     </el-table-column>

     <el-table-column label="帐号" align="center">
       <template slot-scope="{row}">
         <span>{{ row.username }}</span>
       </template>
     </el-table-column>
     <el-table-column label="名称" align="center">
       <template slot-scope="{row}">
         <span>{{ row.user_display_name }}</span>
       </template>
     </el-table-column>
     <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
       <template slot-scope="{row,$index}">
         <el-button type="primary" size="mini" @click="handleUpdate(row)">
           编辑
         </el-button>

         <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
           删除
         </el-button>
       </template>
     </el-table-column>
   </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item label="名称" prop="title">
          <el-input v-model="temp.user_display_name" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          修改
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
   import { userList , delUser , updateUser} from '@/api/user'
   import waves from '@/directive/waves' // waves directive
   import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    components: { Pagination },
     directives: { waves },
    data() {
      return {
        tableKey: 0,
        tableData:null,
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          username: undefined,
          sort: '+id'
        },
        temp: {
          id: undefined,
          name: '',
        },
        dialogPvVisible: false,
        dialogFormVisible: false,
        dialogStatus: '',
        pvData: [],
        textMap: {
          update: '编辑',
          create: 'Create'
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        userList(this.listQuery).then(response => {
          this.tableData = response.data.item;
          this.total = response.data.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleUpdate(row) { 
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
          updateUser(tempData.id,tempData).then(() => {
            const index = this.tableData.findIndex(v => v.id === this.temp.id)
            this.tableData.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
          })
          }
        })
      },

      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
          delUser(index.id).then(response => {
          this.$notify({
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.tableData.splice(row, 1)
          })
        }).catch(() => { 
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    }
  }
</script>
