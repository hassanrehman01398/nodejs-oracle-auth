var oracledb = require('oracledb');
var config = require(__dirname + '../../config.js');
var jwt = require('jsonwebtoken');


function get(req, res, next) {
  
    oracledb.getConnection(
        config.database,
        function(err, connection){
            if (err) {
                return next(err);
            }

            connection.execute(
                //"SELECT * FROM AUTHOR a, AUTHOR1 b,SBOOK c, BK_STATUS d,LOC e,ISSUE_RETURN f WHERE a.A_CODE = b.A_COD AND   c.ACCENO = b.ACCENO AND   c.STATUS_CODE = d.STATUS_CODE AND   c.REF=e.LOC_NO and c.ACCENO =: acceno"
                'select * from ISSUE_RETURN a,SBOOK b where a.INDEX_NO = :indexNo and a.ACCENO=b.ACCENO',
                {

                    indexNo:req.param('indexNo')

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