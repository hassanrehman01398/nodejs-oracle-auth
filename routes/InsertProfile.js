var oracledb = require('oracledb');
var config = require(__dirname + '../../config.js');

 function insertProfile (req, res, next) {
    oracledb.getConnection(
        config.database,
        function(err, connection){
            if (err) {
                return next(err);
            }
          
            // connection.execute(
            //     'INSERT INTO MEMBER(INDEX_NO,NAME,ROLL_NO,BATCH_NO,DEPT_CO,CAT_CO,NIC_NO,DESIGNATION,R_ADDRESS,STATUS,USER_ID,FATHER_NAME,PHOTO,EMAIL,PHONE1)'+
            //     'values('+
            //     ' :INDEX_NO, '+
            //     ' :NAME,     '+
            //     ' :ROLL_NO,  '+   
            //     ' :BATCH_NO, '+
            //     ' :DEPT_CO,  '+
            //     ' :CAT_CO,   '+
            //     ' :NIC_NO,   '+
            //     ' :DESIGNATION,'+
            //     ' :R_ADDRESS,'+
            //     ' :STATUS,   '+
            //     ' :USER_ID,  '+
            //     ' :FATHER_NAME,'+
            //     ' :PHOTO,    '+
            //     ' :EMAIL,    '+
            //     ' :PHONE1)',
            //     {

            //         INDEX_NO:req.body.INDEX_NO,
            //         NAME:req.body.NAME,
            //         ROLL_NO:req.body.ROLL_NO,
            //         BATCH_NO:req.body.BATCH_NO,
            //         DEPT_CO:req.body.DEPT_CO,
            //         CAT_CO:req.body.CAT_CO,
            //         NIC_NO:req.body.NIC_NO,
            //         DESIGNATION:req.body.DESIGNATION,
            //         R_ADDRESS:req.body.R_ADDRESS,
            //         STATUS:req.body.STATUS,
            //         USER_ID:req.body.USER_ID,
            //         FATHER_NAME:req.body.FATHER_NAME,
            //         PHOTO:req.body.PHOTO,
            //         EMAIL:req.body.EMAIL,
            //         PHONE1:req.body.PHONE1
            //     },//no binds
            //     {
                    
            //         autoCommit: true
            //     },
                
            connection.execute(
                'insert into member ( ' +
                ' INDEX_NO,'+
                '   NAME, ' +
                '   NIC_NO, ' +
                '   STATUS ' +
                ') ' +
                'values (' +
                ':INDEX_NO,'+
                '    :NAME, ' +
                '    :NIC_NO, ' +
                '    :STATUS ' +
                ') ' +
                'returning ' +
                '   INDEX_NO, ' +
                '   NAME, ' +
                '   NIC_NO ' +
                'into ' +
                '   :rindex_no, ' +
                '   :rname, ' +
                '   :rnic_no',
                {
                    INDEX_NO:req.body.INDEX_NO,
                    NAME: req.body.NAME,
                    NIC_NO: req.body.NIC_NO,
                    STATUS:req.body.STATUS,
                    rindex_no: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    },
                    rname: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    },
                    rnic_no: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    }

                },
                    {
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
                    console.log("insert into profile");
         
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

module.exports.post = insertProfile;