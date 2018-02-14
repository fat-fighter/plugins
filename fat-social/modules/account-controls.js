var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;
var crypto = require('crypto');

var dbHost = process.env.DB_HOST || 'localhost';
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'fat-social';

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(err, d) {
    if (err) {
        console.log(err);
    }
    else {
        if (process.env.NODE_ENV == 'live') {
            db.authenticate(process.env.DB_USER, process.env.DB_PASS, function(err, response) {
                if (err) {
                    console.log("Error connecting to Database");
                }
                else {
                    console.log("Authenticated and connected to Database : " + dbName);
                }
            });
        }
        else {
            console.log("Connected to Database : " + dbName);
        }
    }
});

var users = db.collection('users');

exports.loginAccount = function(user, callback) {
    users.findOne({username: user.username}, function(err, response) {
        if (err) {
            callback(err);
        }
        else {
            if (response == null) {
                callback('user-not-found');
            }
            else {
                validatePassword(user.password, response, callback);
            }
        }
    });
};

exports.createNewAccount = function(user, callback) {
    saltAndHash(user.password, function(hashedPassword) {
        user.password = hashedPassword;
        users.insert(user, callback);
    });
};

var generateSalt = function() {
    var set = 'mynameisfatfighter';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};

var md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback) {
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
};

var validatePassword = function(plainPass, user, callback) {
    var salt = user.password.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    if (user.password == validHash) {
        callback(null, {username: user.username, password: plainPass});
    }
    else {
        callback('invalid-password');
    }
};