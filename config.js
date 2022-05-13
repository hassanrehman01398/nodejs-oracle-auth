
const oracledb = require('oracledb');
module.exports = {
    database: {
        user: "sys",
        password: "hassan",
        connectString: "localhost:1521/orcl.lan",
        privilege: oracledb.SYSDBA
    },

    jwtSecretKey: "jmvhDdDBMvqb=M@6h&QVA7x"
};

