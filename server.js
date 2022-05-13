var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app;
var router;
var port = 3000;

app = express();

app.use(morgan('combined')); //logger
app.use(bodyParser.json());

router = express.Router();



router.get('/public_things', publicThings.get);
router.get('/protected_things', auth(), protectedThings.get);
router.get('/protected_things2', auth('ADMIN'), protectedThings.get);
router.post('/users', users.post);
router.post('/logins', logins.post);
app.use('/api', router);

app.listen(port, function() {
    console.log('Web server listening on localhost:' + port);
});