var Hapi = require('hapi');
var router = require('./router');
var db = require('./db');


//require('modules/Main');


//Models
require('./models/model_links');
require('./models/hooks');

//Views
require('./views/home');
require('./views/import');

//Controllers;
require('./controllers/category');
require('./controllers/money');
require('./controllers/import');
require('./controllers/action');
require('./controllers/plugins');

//Plugins
require('./plugins/transfer');
require('./plugins/CategorySelector');
require('./plugins/Balance');
require('./plugins/RefreshCategory');



db.sync({force:false});

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

server.route({
    method: 'GET',
    path: '/{controller}/{method}',
    handler: function (request, reply) {
       router.call(reply, request.params.controller,request.params.method, request.query);
    }
});

server.route({
    method: 'GET',
    path: '/{view}',
    handler: function (request, reply) {
       router.callView(reply, request.params.view, request.query);
    }
});

server.route({
    method: 'GET',
    path: '/files/{file}',
    handler: function (request, reply) {
      var type = request.params.file.split('.')[1];
      if(type == 'js'){
        reply.file('views/js/'+request.params.file);
      }else if(type == 'css'){
        reply.file('views/css/'+request.params.file);
      }else{
        reply.file('views/html/404.html');
      }
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
    	router.callHome(reply, request.params.view, request.query);
    }
});

server.route({
   method: 'POST',
   path: '/upload/{controller}',
   config: {
      payload:{
            maxBytes: 209715200,
            output:'file',
            parse: true
      }, 
      handler: function(request,reply){
	router.callUploader(reply,request.params.controller, request);
      }
    }
});

