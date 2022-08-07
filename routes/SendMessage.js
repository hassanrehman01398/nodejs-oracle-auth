var oracledb = require('oracledb');
var config = require(__dirname + '../../config.js');

function post(req, res, next) {
    oracledb.getConnection(
        config.database,
        function(err, connection){
            //console.log(req.body)
            if (err) {
                return next(err);
            }
            if(req.body.message==null){
                
                return next("Message not found");
            } if(req.body.sender_id==null){
                return next("Sender Id not found");
            }
            if(req.body.receiver_id==null){
                return next("Receiver Id not found");
            }
            connection.execute(
                'insert into chat(sender_user_id,replyer_user_id,message_content) values(:sender_id,:receiver_id,:message)',
                {
                   sender_id: req.body.sender_id,
                   receiver_id: req.body.receiver_id,
                   message:req.body.message

                },
                {
                    outFormat: oracledb.OBJECT,
                    autoCommit: true
                },
                function(err, results){
                    
                    console.log("results");
                    console.log(results)
                    if (err) {
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });

                        return next(err);
                    }

                    
                    console.log("chat insert");
         
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