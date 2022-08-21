var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');
var moment = require('moment');
function put(req, res, next) {
 
    oracledb.autoCommit = true;
    oracledb.getConnection(
        config.database,
         function(err, connection){
            //console.log(req.body)
            if (err) {
                return next(err);
            }
            if(req.body.token==null){
                
                return next("No token found");
            }
            if(req.body.indexno==null){
                
                return next("Index No not found");
            }
      
            connection.execute(
                "update member SET token = :token WHERE INDEX_NO = :indexno",
                {
                   token: req.body.token,
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
                
                    
                    console.log("token updated");
         
                    res.status(200).json(results.rows);

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                });
        }
    );
}

module.exports.put = put;