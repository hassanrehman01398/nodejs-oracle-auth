var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var auth = require(__dirname + '/routes/auth.js');
//var publicThings = require(__dirname + '/routes/publicThings.js');
//var protectedThings = require(__dirname + '/routes/protectedThings.js');
var getProfile = require(__dirname + '/routes/GetProfile');
var insertProfile = require(__dirname + '/routes/InsertProfile');
var getBooks = require(__dirname + '/routes/GetAllBooks');
var getChat = require(__dirname + '/routes/GetMyChat');
var getMyBooks = require(__dirname + '/routes/GetMyBooks');
var users = require(__dirname + '/routes/users.js');
var logins = require(__dirname + '/routes/login.js');
var app;
var router;
var port = 3001;

app = express();

app.use(morgan('combined')); //logger
app.use(bodyParser.json());

router = express.Router();



//router.get('/protected_things2', auth('ADMIN'), protectedThings.get);
//router.get('/public_things', publicThings.get);
//router.get('/protected_things', auth(), protectedThings.get);
router.get('/getprofile', auth(), getProfile.get);

router.get('/getallbooks', auth(), getBooks.get);

router.get('/getmybooks', auth(), getMyBooks.get);

router.get('/getChat', auth(), getChat.get);
router.post('/users', users.post);
router.post('/logins', logins.post);
router.post('/insertprofile', insertProfile.post);

app.use('/api', router);
app.listen(port, '0.0.0.0', function() {
    console.log('Listening to port:  ' + port);
});
// app.listen(port, function() {
//     console.log('Web server listening on localhost:' + port);
// });