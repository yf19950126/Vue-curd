var express = require('express');
var router = express.Router();
var User = require('../model/User');
//新增用户
router.post('/add',function (req,res) {
  console.log(req.body);
  //req.body.telphone = req.body.telphone.toString()
  let newUser = new User(req.body);
  newUser.save().then(data=>{
    res.status(200).json({message:'新增用户成功'})
  }).catch(err=>{
    console.log(err)
  })
})
//获取所有用户列表
router.get('/list',function (req,res) {
  var page = parseInt(req.query.page);
  //console.log(page)
  var pageSize = parseInt(req.query.pageSize);
  var skip = parseInt((page - 1) * pageSize);
  User.find({}).sort({'create_time':-1}).skip(skip).limit(pageSize).exec().then(users=>{
    if(users){
      User.count({},function(err,count){
        return res.json({
          status:'0',
          userList:users,
          count:count,
        })
      })
    }
  }).catch(err=>{
    console.log(err)
  })
})
//编辑用户
router.get('/getuser',function (req,res) {
  let id = req.query._id;
  // console.log(id)
  User.findOne({_id:id},['name','email','state']).exec().then(result=>{
    return res.status(200).json(result)
  }).catch(err=>{
    console.log(err)
  })
})
//修改用户
router.post('/updateuser',function (req,res) {
  // console.log(req.body)
  User.update({_id:req.body._id},{
    name:req.body.name,
    email:req.body.email,
    state:req.body.state,
  }).then(result=>{
    return res.status(200).json({message:'修改成功'});
  }).catch(err=>{
    console.log(err)
  })
})
//删除用户
router.get('/deleteuser',function (req,res) {
  User.remove({_id:req.query._id}).then(result=>{
    return res.status(200).json({message:'删除成功'})
  }).catch(err=>{
    console.log(err)
  })
})
//批量删除
router.post('/deleteall',function (req,res) {
  let list = req.body;
  let idList = [];
  list.forEach(function (item) {
    idList.push(item._id);
  })
  User.remove({_id:{$in:idList}}).then(result=>{
    return res.status(200).json({message:'批量删除成功'});
  }).catch(err=>{
    console.log(err)
  })
})
//上传头像
router.post('/upload',function (req,res) {

})
module.exports = router;
