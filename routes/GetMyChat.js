var oracledb = require('oracledb');
var config = require(__dirname + '../../config.js');

function get(req, res, next) {
    oracledb.getConnection(
        config.database,
        function(err, connection){
            if (err) {
                return next(err);
            }

            connection.execute(
                
                'SELECT * FROM CHAT WHERE (REPLYER_USER_ID =:userId OR SENDER_USER_ID =:userId)',
                {
                    userId:req.param('userId')

                },//no binds
                {
                    outFormat: oracledb.OBJECT
                },
                function(err, results){
                    if (err) {
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });

                        return next(err);
                    }

                    res.status(200).json(results.rows);

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                }
            );
        }
    );
}

module.exports.get = get;