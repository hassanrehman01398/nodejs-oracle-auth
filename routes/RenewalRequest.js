var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');

function post(req, res, next) {
    oracledb.getConnection(
        config.database,
        function(err, connection){
            //console.log(req.body)
            if (err) {
                return next(err);
            }
            if(req.body.email==null){
                
                return next("Email not found");
            } if(req.body.password==null){
                return next("Password not found");
            }
            connection.execute(
                'select * '+
                'from users ' +
                'where email = :email',
                {
                   email: req.body.email.toLowerCase()
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(err, results){
                    var user;

                    if (err) {
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });

                        return next(err);
                    }
                    user = results.rows[0];
                    if(user==null){
                        return next("No user found with this email");
        

                    }
                   

                    bcrypt.compare(req.body.password, user.PASSWORD, function(err, pwMatch) {
                        var payload;

                        if (err) {
                            return next(err);
                        }

                        if (!pwMatch) {
                            res.status(401).send({message: 'Invalid email or password.'});
                            return;
                        }

                        payload = {
                            sub: user.email,
                            role: user.role
                        };

                        res.status(200).json({
                            user: user,
                            token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes: 60})
                        });
                    });

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                });
        }
    );
}

module.exports.post = post;