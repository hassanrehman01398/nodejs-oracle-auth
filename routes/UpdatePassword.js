var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');
var moment = require('moment');

var bcrypt = require('bcrypt');
function put(req, res, next) {
 
    oracledb.autoCommit = true;
    oracledb.getConnection(
        config.database,
         function(err, connection){
            //console.log(req.body)
            if (err) {
                return next(err);
            }
            if(req.body.newpassword==null){
                
                return res.status(200).json({message:"new password not found"});
              //  return next("No new password found");
            }
            if(req.body.indexno==null){
                
                return res.status(200).json({message:"userid not found"});
                
            }
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    return next(err);
                }
                bcrypt.hash(req.body.newpassword, salt, function(err, hash) {
                    if (err) {
                        return next(err);
                    }
        console.log(hash);
                    // hashedPassword = hash;
                    // console.log("hash password");
                    // console.log(hash)
        
                    connection.execute( 
                        "update member SET password = '"+hash+"' WHERE INDEX_NO = :indexno",
                        {
                        //    newpassword: req.body.newpassword,
                           indexno: req.body.indexno
                        },
                        {
                            outFormat: oracledb.OBJECT,
        
                            autoCommit: true,
        
                        },
                        function(err, results){
                            console.log("function return");
                         
                            if (err) {
                                connection.release(function(err) {
                                    if (err) {
                                        console.error(err.message);
                                    }
                                });
        
                                return next(err);
                            }
                        
                            
                            console.log("password updated");
                 
                            res.status(200).json(results.rows);
        
                            connection.release(function(err) {
                                if (err) {
                                    console.error(err.message);
                                }
                            });
                        });
                });
            
            });
           
           
        }
    );
}

module.exports.put = put;