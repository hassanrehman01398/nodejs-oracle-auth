var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');

function post(req, res, next) {
    oracledb.getConnection(
        config.database,
        function(err, connection){
            if (err) {
                return next(err);
            }
            if(req.body.email==null){
                
                return next("Email not found");
            } if(req.body.password==null){
                return next("Password not found");
            }
//
            connection.execute(
                'select id as "id", ' +
                '   email as "email", ' +
                '   password as "password", ' +
                '   role as "role" ' +
                'from jsao_users ' +
                'where email = :email',
                {
                    email: req.body.email.toLowerCase()
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(err, results){
                    console.log(req.body.email.toLowerCase());
                    var user;

                    if (err) {
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });

                        return next(err);
                    }
console.log("results");
                    console.log(results);
                    user = results.rows[0];
                   

                    bcrypt.compare(req.body.password, user.password, function(err, pwMatch) {
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