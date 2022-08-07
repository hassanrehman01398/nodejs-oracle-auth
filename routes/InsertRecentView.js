var oracledb = require('oracledb');
var config = require(__dirname + '../../config.js');
function post(req, res, next) {
 
    oracledb.autoCommit = true;
    oracledb.getConnection(
        config.database,
        async function(err, connection){
            //console.log(req.body)
            if (err) {
                return next(err);
            }
            if(req.body.userid==null){
                
                return next("User Id not found");
            }
            if(req.body.bookid==null){
                
                return next("Book Id not found");
            }
            
            // '13-AUG-22'
            connection.execute(
                "insert into recentviews(user_id,book_id) values(:indexno,:acceno)",
                {
                   indexno: req.body.userid,
                   acceno:req.body.bookid
                },
                {
                    
                   autoCommit: true,
                    outFormat: oracledb.OBJECT,


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
                
                    
                    console.log("inserted view submitted");
         
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

module.exports.post = post;