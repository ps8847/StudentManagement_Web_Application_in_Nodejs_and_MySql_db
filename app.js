const express = require("express");

const app = express();
const mysql = require("./connection").con;
const port = 7000;

//configuration

app.set("view engine", "hbs"); // telling the application about the vuew enfine
app.set("views", "./view") // setting view directory
app.use(express.static(__dirname + "/public")) // for useing css and other static file

/*   if we want to use Form method as post
app.use(express.urlencoded());
app.use(express.json());
*/

//routing
app.get("/", (req, res) => {
    res.render("index")
})

app.get("/add", (req, res) => {
    res.render("add")
})

app.get("/search", (req, res) => {
    res.render("search")
})

app.get("/update", (req, res) => {
    res.render("update")
})

app.get("/delete", (req, res) => {
    res.render("delete")
})

app.get("/view", (req, res) => {
    let qry = "select * from test ";
    mysql.query(qry, (err, results) => {
        if (err) console.log("error at view render");
        else {
            res.render("view", { data: results });
        }
    })
})


// functionings

app.get("/addstudent", (req, res) => {
    // fetching data from form

    // res.send(req.query);
    const { name, phone, email, gender } = req.query;

    // sanitization XSS....   (it will prevent that>>  database mie koi js ki query na store karde)


    let query = "select * from test where emailid=? or phoneno=?";
    mysql.query(query, [email, phone], (err, result) => {
        if (err) {
            console.log("error at addstudent");
        } else {
            if (result.length > 0) {
                res.render("add", { checkmesg: true });
            } else {
                // insert query
                let query2 = "insert into test values(?,?,?,?)";
                mysql.query(query2, [name, phone, email, gender], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.render("add", { mesg: true })
                    }
                })
            }
        }
    })
})


/* if w ewan to use form method as post
app.post("/srchstudent", (req, res) => {
    res.send(req.body);
})
*/

app.get("/srchstudent", (req, res) => {
    //fech data from form
    const { phone } = req.query;

    let qry = "select * from test where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) {
            console.log("error at searchstudent render");
        } else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false });
            } else {
                res.render("search", { mesg1: false, mesg2: true });

            }
        }
    })
})


app.get("/updatesearch", (req, res) => {
    const { phone } = req.query;
    let qry = "select * from test where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) {
            console.log("error at updatesearch");
        } else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results });
            } else {
                res.render("update", { mesg1: false, mesg2: true });

            }
        }
    })
})

app.get("/updatestudent", (req, res) => {
    // fetch data

    const { phone, name, gender } = req.query;
    let qry = "update test set username=?, gender=? where phoneno=?";

    mysql.query(qry, [name, gender, phone], (err, results) => {
        if (err) console.log("error at updatestudent render");
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umsg: true })
            }
        }
    })
})


app.get("/delstudent", (req, res) => {

        const { phone } = req.query;
        let qry = "delete from test where phoneno=?";
        mysql.query(qry, [phone], (err, results) => {
            if (err) {
                console.log("error at delstudent render");
            } else {
                if (results.affectedRows > 0) {
                    res.render("delete", { mesg1: true, mesg2: false, data: results });
                } else {
                    res.render("delete", { mesg1: false, mesg2: true });

                }
            }
        })
    })
    // create server
app.listen(port, (error) => {
    if (error) throw error;
    console.log("listening to port no ", port);
})