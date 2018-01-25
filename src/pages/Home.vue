<template>
    <div>
        <el-container>
          <el-header>
            <h1>Vue-Curd增删改查项目</h1>
          </el-header>
          <el-main>
            <el-row type="flex" justify="end">
              <el-col :span="4">
                <el-button type="primary" @click="addDialog = true">新增</el-button>
                <el-button type="danger" @click="removeAll()">删除</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-table :data="userList" :default-sort = "{prop: 'date', order: 'descending'}"
                            @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="用户头像">
                      <template slot-scope="scope">
                        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                                   :show-file-list="false"
                                   :on-success="handleAvatarSuccess"
                                   :before-upload="beforeAvatarUpload">
                          <img v-if="imageUrl" :src="imageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </template>
                    </el-table-column>
                    <el-table-column label="用户名">
                      <template slot-scope="scope">
                        {{scope.row.username}}
                      </template>
                    </el-table-column>
                    <el-table-column label="姓名">
                      <template slot-scope="scope">
                        {{scope.row.name}}
                      </template>
                    </el-table-column>
                    <el-table-column label="手机">
                      <template slot-scope="scope">
                        {{scope.row.telphone}}
                      </template>
                    </el-table-column>
                    <el-table-column label="邮箱">
                      <template slot-scope="scope">
                        {{scope.row.email}}
                      </template>
                    </el-table-column>
                    <el-table-column label="日期" sortable prop="date">
                      <template slot-scope="scope">
                        {{scope.row.date | formatDate}}
                      </template>
                    </el-table-column>
                    <el-table-column label="状态">
                      <template slot-scope="scope">
                          <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949" disabled></el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button @click="editForm(scope.row)" type="success" size="mini">编辑</el-button>
                        <el-button type="warning" size="mini" @click="deleteOne(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
              </el-col>
            </el-row>
            <el-row class="margin30" type="flex" justify="end">
              <el-pagination background layout="total,prev, pager, next" :total="total" :page-size="5" @current-change="pageChange" ></el-pagination>
            </el-row>
          </el-main>
        </el-container>
        <el-dialog title="新增用户" :visible.sync="addDialog">
        <el-form :model="newUser" :rules="addRules" label-width="100px" ref="addForm">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="newUser.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="newUser.name"></el-input>
          </el-form-item>
          <el-form-item label="电话:" prop="telphone">
            <el-input v-model.number="newUser.telphone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="newUser.email"></el-input>
          </el-form-item>
          <el-form-item label="日期:" prop="date">
            <el-date-picker v-model="newUser.date" type="date"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="是否启用" prop="state">
            <el-switch v-model="newUser.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('addForm')">取 消</el-button>
          <el-button type="primary" @click="addForm('addForm')">确 定</el-button>
        </div>
      </el-dialog>
        <el-dialog title="编辑用户" :visible.sync="editDialog">
          <el-form :model="editUser" :rules="addRules" label-width="80px" ref="editForm">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="editUser.name"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editUser.email"></el-input>
              </el-form-item>
              <el-form-item label="是否启用" prop="state">
                <el-switch v-model="editUser.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialog = false">取 消</el-button>
            <el-button type="primary" @click="updateForm('editForm')">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
  import axios from 'axios';
  export default {
    //声明周期
    mounted:function () {
      this.getUserList();//在渲染完成时，获取所需的数据
    },
    name:'Home', //组件的名称是Home
    data:function () {
      return{
        //用户头像上传
        imageUrl: '',
        //打开新增的弹出框
        addDialog:false,
        //打开编辑的弹出框
        editDialog:false,
        //新增的表单数据
        newUser:{
          username:'',
          name:'',
          telphone:'',
          email:'',
          date:'',
          state:''
        },
        //编辑的表单数据
        editUser:{
          name:'',
          email:'',
          state:''
        },
        //要删除的用户列表
        multipleUser:[],
        value: true,
        //验证规则
        addRules:{
          username:[
            {type:'string',required:true,message:'请输入用户名',trigger:'change'},
            {min:2,max:10,message:'请输入正确的用户名',trigger:'change'}
          ],
          name:[
            {type:'string',required:true,message:'请输入姓名',trigger:'change'},
          ],
          telphone:[
            {type:'number',required:true,message:'请输入电话号码',trigger:'change'},
          ],
          email:[
            {type:'email',required:true,message:'请输入邮箱',trigger:'change'}
          ],
          date:[
            {type:'date',required:true,message:'请填写正确的时间',trigger:'change'}
          ],
          state:[]
        },
        userList:[],
        total:0,
      }
    },
    methods:{
      //新增用户
      addForm:function (formName) {
        this.$refs[formName].validate(valid=>{
          if(valid){
            //验证之后提交数据
            axios.post('/user/add',this.newUser).then(res=>{
              //成功之后关掉弹出框
              this.addDialog = false;
              this.$refs[formName].resetFields();
              //提示一下
              this.$message({
                message:res.data.message,
                type: 'success'
              });
              //主动刷新数据
              this.getUserList()
              //console.log(res.data);
            }).catch(err=>{
              console.log(err);
            })
          }else{
            //验证不通过
            console.log('验证不通过');
            return false;
          }
        })
      },
      //取消
      resetForm:function (formName) {
        this.addDialog = false;
        this.$refs[formName].resetFields();
      },
      //获取所有用户列表
      getUserList:function (page) {
        axios.get('/user/list',{
          params:{
            page:page || 1,
            pageSize:5
          }
        }).then(res=>{
          //console.log(res.data);
          this.userList = res.data.userList;
          this.total = res.data.count;
          // console.log(res.data.count)
        }).catch(err=>{
          console.log(err)
        })
      },
      pageChange:function(value){
        this.getUserList(value);
      },
      //编辑表单
      editForm:function (row) {
        //打开编辑弹出框
        this.editDialog = true
        // console.log(row);
        //从数据库中获取数据
        axios.get('/user/getuser',{
          params:{
            _id:row._id
          }
        }).then(res=>{
          this.editUser = res.data
          //console.log(res.data.state)
        }).catch(err=>{
          console.log(err)
        })
      },
      //修改用户
      updateForm:function (formName) {
        this.$refs[formName].validate(valid=>{
          if(valid){
            //验证之后提交数据
            axios.post('/user/updateuser',this.editUser).then(res=>{
              //提示一下
              this.$message({
                message:res.data.message,
                type: 'success'
              });
              this.editDialog = false
              //重新获取数据
              this.getUserList();
            }).catch(err=>{
              console.log(err);
            })
          }else{
            //验证不通过
            console.log('验证不通过');
            return false;
          }
        })
      },
      //删除用户
      deleteOne:function (row) {
        this.$confirm('提示:此操作将永久删除用户，是否删除？','删除用户',{
          confirmButtonText: '确定', //确认按钮
          cancelButtonText: '取消', //取消按钮
          type: 'warning', //按钮类型
        }).then(()=>{
          axios.get('/user/deleteuser',{
            params:{
              _id:row._id
            }
          }).then(res=>{
            this.$message({
              type:'success',
              message:res.data.message
            })
            this.getUserList();//重新获取用户的数据
          })
        }).catch(()=>{
          this.$message({
            type:'info',
            message:'已取消删除'
          })
        })
      },
      //表单的选项改变的时候
      handleSelectionChange:function (val) {
          this.multipleUser = val;
      },
      //批量删除
      removeAll:function () {
        //console.log(this.multipleUser)
        this.$confirm('此操作将永久删除用户，确认要删除吗？','批量删除',{
          confirmButtonText: '确定', //确认按钮
          cancelButtonText: '取消', //取消按钮
          type: 'warning', //按钮类型
        }).then(()=>{
          axios.post('/user/deleteall',this.multipleUser).then(res=>{
            this.$message({
              type:'success',
              message:res.data.message
            })
            this.getUserList();
          }).catch(err=>{
            console.log(err)
          })
        }).catch(()=>{
            this.$message({
              type:'info',
              message:'已取消删除'
            })
        })
      },
      //头像上传
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
      //上传操作

    }
  }
</script>
<style scoped>
  h1{
    text-align: center;
    color: orangered;
  }
  .fr{
    clear: both;
  }
  .left{
    float: left;
  }
  .right{
    float: right;
  }
  .margin30{
    margin-top: 30px;
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 60px;
    height: 60px;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 60px;
    display: block;
  }
</style>
