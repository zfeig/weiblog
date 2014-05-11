
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var fs = require('fs');
var path = require('path');
var MongoStore = require("session-mongoose")(express);
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//将session存入mongodb
app.use(express.cookieParser());
app.use(express.session({
      secret: 'blog',
      store: new MongoStore({
      url: "mongodb://localhost/session",
      interval: 120000
     })
   })
);
//文件上传
app.use(express.bodyParser({uploadDir:'./public/upload'})); 
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/login', routes.login); // 此处还需要routes/index.js修改
app.post('/login', routes.doLogin);   // 处理post请求，表单提交
app.get('/logout', routes.logout);      // 处理注销
app.get('/welcome', routes.welcome);                 // 进入到首页
app.get('/reg',routes.reg);
app.post('/reg',routes.doreg);
app.get('/list',routes.list);
app.get('/edit/:id',routes.edit);
app.post('/edit',routes.doedit);
app.get('/del/:id',routes.del);
app.get('/fenye/:p',routes.fenye);
app.get('/home',routes.home);
app.get('/post',routes.post);
app.post('/post',routes.dopost);
app.get('/upload',routes.upload);
app.post('/upload',routes.doupload);
app.get('/article/:p',routes.article);
app.get('/adel/:id',routes.adel);
app.get('/aedit/:id',routes.aedit);
app.post('/aedit',routes.doaedit);
app.get('/alist/:p',routes.alist);
app.get('/aread/:id',routes.aread);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
