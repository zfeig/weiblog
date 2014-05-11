var mongoose = require('mongoose') ;     // 导入组件
var models = require('./models') ;    // 导入自定义组件
var User = models.User ;       // 使用User模型，对应的users表
var Article=models.Article;
var fs=require('fs');
var crypto=require('crypto');
mongoose.connect('mongodb://localhost/mldndb') ;    // 连接数据库
exports.index = function(req, res){
  var user=req.session.user;
  User.find().sort({_id:-1}).limit(3).exec(function(err,data){
    if(!err){
      User.count({},function(err,count){
        res.render('index', { title: '小微项目',data:data,count:count,user:user});
      })
      
    }
  })
  
};
exports.login = function(req, res){
  if(req.session.user){
     res.redirect('/home');      // 地址重写
  }
  res.render('login', { title: '用户登录' });
};
exports.doLogin = function(req, res){
         // 现在拼凑出了一个基本的字符串
         var md5=crypto.createHash('md5');
         var password=md5.update(req.body.password).digest('hex');
         var query_doc = {name:req.body.name , password:password} ;    // 固定数据
         User.count(query_doc,function(err,doc){// 直接利用mongodb的命令进行操作
                   if(doc == 0) {      // 输入错误，没有此信息
                            res.redirect("/login") ;
                   } else {       // 成功
                            req.session.user=req.body.name;
                            res.redirect('/home');      // 地址重写
                   }
         }) ;
};
exports.logout = function(req, res){
    if(!req.session.user){
    res.redirect('/login');
    }
  req.session.user=null;
  res.redirect('/login');
};
exports.welcome = function(req, res){
         // 如果是地址栏参数使用req.query.参数名称接收
         var user = {
                   name : req.query.name 
                 };
  res.render('welcome', { title: '程序首页' , user:user });
};
exports.reg = function(req, res){
  res.render('reg', { title: '用户注册' });
};
exports.doreg=function(req,res){
  User.count({name:req.body.name},function(err,doc){
        if(doc>0){
          res.redirect('/reg');
        }else{
           var user=new User({userid:req.body.userid,name:req.body.name,password:req.body.password});
            user.save(function(err,doc){
              if(!err){
               res.redirect('/list'); 
              }else{
                res.redirect('/reg');
              }
            })
        }
  })
};
exports.list=function(req,res){
  User.find({},function(err,data){
    if(!err){
      res.render('list',{title:'用户列表',data:data});
    }
  })
};
exports.edit=function(req,res){
   if(!req.session.user){
    res.redirect('/login');
    }
  var id=req.params.id;
  User.find({_id:id},function(err,doc){
      if(!err){
        res.render('edit',{title:'文章编辑',data:doc[0]});
      }
  })
};
exports.doedit=function(req,res){
   if(!req.session.user){
    res.redirect('/login');
    }
  
  var md5=crypto.createHash('md5');
  var password=md5.update(req.body.password).digest('hex');
  User.update({_id:req.body.id},{userid:req.body.userid,name:req.body.name,password:password},function(err,doc){
      
      if(!err){
        res.redirect('/list');
      }
  })
};
exports.del=function(req,res){
  if(!req.session.user){
    res.redirect('/login');
    }
  var id=req.params.id;
  User.remove({_id:id},function(err,data){
    if(!err){
       res.redirect('/list');
    }
  })
};
exports.fenye=function(req,res){
   if(!req.session.user){
    res.redirect('/login');
    }
  var page=req.params.p;
  var size=5;
  User.count({name:req.session.user},function(err,count){
    if(!err){
      var totalpage=Math.ceil(count/size);
      User.find({name:req.session.user}).skip((page-1)*size).limit(size).exec(function(err,data){
         res.render('fenye',{title:'分页浏览',p:page,total:totalpage,size:size,data:data});
      })
    }
  })
 
};
exports.alist=function(req,res){
  
  var page=req.params.p;
  var size=5;
  Article.count({},function(err,count){
    if(!err){
      var totalpage=Math.ceil(count/size);
      Article.find().skip((page-1)*size).limit(size).exec(function(err,data){
         res.render('alist',{title:'全部文章列表',p:page,total:totalpage,size:size,data:data});
      })
    }
  })
};
exports.adel=function(req,res){
  if(!req.session.user){
    res.redirect('/login');
    }
  var id=req.params.id;
  Article.remove({_id:id},function(err,data){
    if(!err){
       res.redirect('/article/1');
    }
  })
};
exports.aedit=function(req,res){
   if(!req.session.user){
    res.redirect('/login');
    }
  var id=req.params.id;
  Article.find({_id:id},function(err,doc){
      if(!err){
        res.render('aedit',{title:'文章编辑',data:doc[0]});
      }
  })
};
exports.doaedit=function(req,res){
   if(!req.session.user){
    res.redirect('/login');
    }
  Article.update({_id:req.body.id},{title:req.body.title,tag:req.body.tag,content:req.body.content},function(err,doc){
      
      if(!err){
        res.redirect('/article/1');
      }
  })
};
exports.aread=function(req,res){
  var id=req.params.id;
  Article.find({_id:id},function(err,doc){
      if(!err){
        res.render('aread',{title:'查看文章',data:doc[0]});
      }
  })
};
exports.article=function(req,res){
   if(!req.session.user){
    res.redirect('/login');
    }
  var page=req.params.p;
  var size=5;
  Article.count({author:req.session.user},function(err,count){
    if(!err){
      var totalpage=Math.ceil(count/size);
      Article.find({author:req.session.user}).skip((page-1)*size).limit(size).exec(function(err,data){
         res.render('article',{title:'文章列表',p:page,total:totalpage,size:size,data:data});
      })
    }
  })
};
exports.home=function(req,res){
  if(req.session.user!==null){
    res.render('home',{title:'欢迎回来',user:req.session.user});
  }else{
    res.redirect('/login');
  }
};
exports.post=function(req,res){
  if(!req.session.user){
    res.redirect('/login');
    }
    res.render('post',{title:'发布文章',user:req.session.user});
};
exports.dopost=function(req,res){
   if(!req.session.user){
    res.redirect('/login');
    }
    var sj=new Date();
    var tmp_path = req.files.file.path;
    var target_path='./public/upload/'+sj.getTime()+req.files.file.name;
    var real_path='/upload/'+sj.getTime()+req.files.file.name;
     fs.rename(tmp_path,target_path,function(err,data){
     if(err){
      res.send("<p>上传成功！</p><img src="+real_path+">");
     }
   });
    
    // var date=new Date();
    // var year=date.getFullYear();
    // var month=date.getMonth()+1;
    // var date=date.getDate();
    // var h=date.getHour();
    // var m=date.getMinite();
    // var s=date.getSecond();


    var wz={title:req.body.title,author:req.body.author,tag:req.body.tag,thumb:real_path,content:req.body.content};
    var article=new Article(wz);
    article.save(function(err,data){
      if(!err){
        res.redirect('/home');
      }
    })



}
exports.upload=function(req,res){
   if(!req.session.user){
    res.redirect('/login');
    }
    res.render('upload',{title:'文件上传'});
};
exports.doupload=function(req,res){
   if(!req.session.user){
    res.redirect('/login');
    }
  var tmp_path = req.files.file.path;
  var target_path='./public/upload/' + req.files.file.name;
  var real_path='upload/'+req.files.file.name;
  fs.rename(tmp_path,target_path,function(err,data){
     if(!err){
      res.send("<p>上传成功！</p><img src="+real_path+">");
     }
 });
};

