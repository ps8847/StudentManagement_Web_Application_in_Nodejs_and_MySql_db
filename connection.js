var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sql_nodejs",
    port: 3306
});

con.connect((err) => {
    if (err) throw err;
    console.log("connection created with db");
})

module.exports.con = con;