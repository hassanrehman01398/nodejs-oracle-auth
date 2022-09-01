var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var auth = require(__dirname + '/routes/auth.js');
//var publicThings = require(__dirname + '/routes/publicThings.js');
var renewalRequest = require(__dirname + '/routes/RenewalRequest.js');
var insertViewRequest = require(__dirname + '/routes/InsertRecentView.js');
var getProfile = require(__dirname + '/routes/GetProfile');
var insertProfile = require(__dirname + '/routes/InsertProfile');
var getBooks = require(__dirname + '/routes/GetAllBooks');
var getBookDetails = require(__dirname + '/routes/GetBookDetail');
var getChat = require(__dirname + '/routes/GetMyChat');
var getMyBooks = require(__dirname + '/routes/GetMyActivesBooks');
var updatePassword = require(__dirname + '/routes/UpdatePassword');

var updateToken = require(__dirname + '/routes/UpdateToken');
var getRecentView = require(__dirname + '/routes/GetRecentView');
var users = require(__dirname + '/routes/users.js');
var logins = require(__dirname + '/routes/login.js');

var sendMessage = require(__dirname + '/routes/SendMessage.js');
var app;
var router;
var port = 3001;
const cors = require('cors')

const Bree = require('bree')

const bree = new Bree({
  jobs : [{
    name : 'sendmailandnotification',
    cron : '5 * * * *',
    worker : {
      workerData : {
        description : "This job will send email and notifications."
      }
    }
  }]
})

bree.start()
app = express();

app.use(morgan('combined')); //logger
app.use(bodyParser.json());

router = express.Router();



//router.get('/protected_things2', auth('ADMIN'), protectedThings.get);
//router.get('/public_things', publicThings.get);
//router.get('/protected_things', auth(), protectedThings.get);
router.get('/getprofile', auth(), getProfile.get);

router.get('/getallbooks', auth(), getBooks.get);
router.get('/getrecentview', auth(), getRecentView.get);

router.get('/getmybooks', auth(), getMyBooks.get);
router.get('/getBookDetails', auth(), getBookDetails.get);

router.get('/getChat', auth(), getChat.get);
router.post('/sendMessage', auth(), sendMessage.post);
router.put('/renewalrequest', auth(), renewalRequest.put);
router.put('/updatepassword', auth(), updatePassword.put);
router.put('/updatetoken', auth(), updateToken.put);
router.post('/insertrecentview',auth() ,insertViewRequest.post);

router.post('/users', users.post);
router.post('/logins', logins.post);
router.post('/insertprofile', insertProfile.post);

app.use(cors())
app.use('/api', router);
app.listen(port, '0.0.0.0', function() {
    console.log('Listening to port:  ' + port);
});
// app.listen(port, function() {
//     console.log('Web server listening on localhost:' + port);
// });