var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view_engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

var dbHost = process.env.DB_HOST || 'localhost';
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'fat-social';

var dbURL = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName;

app.use(session({
    secret: 'fatFighter_1997',
    saveUninitialized: true,
    store: new MongoStore({ url: dbURL }),
    resave: true
}));

require('./app/routes.js')(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Server listening on port ' + app.get('port'));
});