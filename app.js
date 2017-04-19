
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load customers route
var customers = require('./routes/customers');
var bonuses = require('./routes/bonus.js');
var bonus = require('./routes/bonus.js');
var drivers = require('./routes/user');
var holidays = require('./routes/holidays');
var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    
    connection(mysql,{
        
        host: 'support',
        port: '3306',
        database: 'mobilite',
        user: 'mobilite',
        password: 'Nabzif10'

    },'pool') //or single

);



app.get('/', routes.index);
app.get('/customers', customers.list);
app.get('/customers/add', customers.add);
app.post('/customers/add', customers.save);
app.get('/customers/delete/:id', customers.delete_customer);
app.get('/customers/edit/:id', customers.edit);
app.post('/customers/edit/:id',customers.save_edit);

/*ROUTES API*/

/*app.post('/address/add', address.add);
app.post('/contact/add', contact.add);
app.post('/company/add', company.add);
app.post('/user/add', user.add);
app.get('/profile', user.show);
app.post('/truck/add', truck.add);
app.post('/bonusmodel/add', bonusmodel.add);
app.post('/bonusmodel/edit/:id', bonusmodel.edit);*/
app.get('/bonuses/:id', bonuses.show);
app.post('/bonus/edit', bonus.edit);
app.post('/bonus/add', bonus.add);
app.get('/drivers/show', drivers.show);
app.post('/holidays/add', holidays.add);
app.post('/holidays/accept/:id', holidays.accept);
app.post('/holidays/reject/:id', holidays.reject);





app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
