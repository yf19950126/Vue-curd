const mongoose = require('mongoose');
const shortid = require('shortid');
const db = require('./db')
//创建一个架构
const UserSchema = mongoose.Schema({
  _id:{
    type:String,
    index:true,//索引
    default:shortid.generate //默认值
  },
  username:{
    type:String,
    required:true//必填项
  },
  name:{
    type:String,
    required:true//必填项
  },
  telphone:{
    type:String,
    required:true//必填项
  },
  email:{
    type:String,
    required:true//必填项
  },
  date:{
    type:String,
    default:Date.now
  },
  state:{
    type:Boolean,
  }
});
//创建模型
const User = mongoose.model('User',UserSchema);
module.exports = User;
