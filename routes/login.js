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
               return res.status(400).json({
                    error:"Email not found"
                });
             //   return next("Email not found");
            } if(req.body.password==null){
               return  res.status(400).json({
                    error:"Password not found"
                });
               // return next("Password not found");
            }
            connection.execute(
                'select * '+
                'from member ' +
                'where email = :email',
                {
                   email: req.body.email.toLowerCase(),
                  // nicno:req.body.nicno
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
                    if(!user){
                      
                        return res.status(400).json({
                            error:"No user found with this email"
                        });
                     //   return next("No user found with this email");
        

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
                            token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes: 120000060})
                        });
                      
                    });
                    // console.log(user);
                    
                    //     payload = {
                    //         sub: user.email,
                    //         role: user.role
                    //     };
                    // res.status(200).json({
                    //     user: user,
                    //     token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes: 60})
                    // });

                    // bcrypt.compare(req.body.password, user.PASSWORD, function(err, pwMatch) {
                    //     var payload;

                    //     if (err) {
                    //         return next(err);
                    //     }

                    //     if (!pwMatch) {
                    //         res.status(401).send({message: 'Invalid email or password.'});
                    //         return;
                    //     }

                    //     payload = {
                    //         sub: user.email,
                    //         role: user.role
                    //     };

                      
                    // });

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