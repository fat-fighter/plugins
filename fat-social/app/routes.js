var account = require('../modules/account-controls');

module.exports = function(router) {
    router.get('/', function(request, response) {
        if (request.session.user) {
            account.loginAccount({
                username: request.session.user.username,
                password: request.session.user.password
            }, function(err, result) {
                if (err) {
                    request.session.destroy();
                    response.render('pages/index.ejs', {
                        msg_title: "Something went Wrong",
                        msg: "Please login to continue",
                        errors: err
                    });
                }
                else {
                    response.redirect('/home');
                }
            });
        }
        else {
            response.render('pages/index.ejs', {
                msg: false,
                msg_title: false,
                errors: false
            });
        }
    });

    router.post('/', function(request, response) {
        if (request.body.register) {
            account.createNewAccount({
                name: request.body.name,
                username: request.body.username,
                password: request.body.password,
                email: request.body.email
            }, function(err, user) {
                if (err) {
                    response.render('pages/index.ejs', {
                        msg_title: "Registration Unsuccessful",
                        msg: "There was an error while handling your request, please try again later.",
                        errors: err
                    });
                }
                else {
                    response.render('pages/index.ejs', {
                        msg_title: "Registration Successful",
                        msg: "You are now registered and can now login",
                        errors: false
                    });
                    console.log(user);
                }
            });
        }
        if (request.body.login) {
            account.loginAccount({
                username: request.body.username,
                password: request.body.password
            }, function(err, result) {
                if (err) {
                    if (err == 'user-not-found') {
                        response.render('pages/index.ejs', {
                            msg_title: "User not registered",
                            msg: "You must register first before continuing",
                            errors: false
                        });
                    }
                    else if (err == 'invalid-password') {
                        response.render('pages/index.ejs', {
                            msg: "Check your password",
                            msg_title: "Invalid Password",
                            errors: false
                        });
                    }
                    else {
                        response.render('pages/index.ejs', {
                            msg_title: "Login Unsuccessful",
                            msg: "There was an error while handling your request, please try again later.",
                            errors: err
                        });
                    }
                }
                else {
                    request.session.user = result;
                    response.redirect('/home');
                }
            });
        }
    });

    router.get('/home', function(request, response) {
        if (request.session.user) {
            account.loginAccount({
                username: request.session.user.username,
                password: request.session.user.password
            }, function(err, result) {
                if (err) {
                    response.redirect('/');
                }
                else {
                    response.render('pages/home.ejs', {
                        username: request.session.user.username,
                        password: request.session.user.password
                    });
                }
            });
        }
        else {
            response.redirect('/');
        }
    });

    router.get('/logout', function(request, response) {
        request.session.destroy();
        response.redirect('/');
    });
};