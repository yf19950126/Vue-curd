//第一步:引入mongoose模块
const mongoose = require('mongoose');
//第二步:链接数据库
mongoose.connect('mongodb://localhost/vue-curd',{useMongoClient:true});
//第三步:设置mongoose里面的promise是ES6的promise
mongoose.Promise = global.Promise;
//最后一步:监听数据库状态
var db = mongoose.connection;
db.on('connected',function () {
  console.log('数据库启动成功');
})
db.on('error',function () {
  console.error('数据库启动失败');
})


