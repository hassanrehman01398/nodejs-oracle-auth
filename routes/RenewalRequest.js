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
            if(req.body.duedate==null){
                
                return next("Current Due Date not found");
            }
            if(req.body.indexno==null){
                
                return next("User Id not found");
            }
            if(req.body.acceno==null){
                
                return next("Book Id not found");
            }
            
            var new_startDate= new Date(req.body.duedate);
            var update_date= moment(new_startDate).add(14, 'd').format('DD-MMM-YY');
            connection.execute(
                "update issue_return SET DUE_DATE ='"+update_date+"' WHERE INDEX_NO = :indexno and ACCENO = :acceno",
                {
                   indexno: req.body.indexno,
                   acceno:req.body.acceno
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
                
                    
                    console.log("renewal request submitted");
         
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