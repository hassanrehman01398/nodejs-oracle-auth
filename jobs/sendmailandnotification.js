require("dotenv").config()
const { workerData } = require("worker_threads");
const nodeMailer = require("nodemailer");
const { Console } = require("console");
const fetch = require("node-fetch");
const oracledb = require('oracledb');

var config = require(__dirname + '../../config.js');
var moment = require('moment');
const sendnotification = (notititle,notibody,pushtoken) => {
  fetch("https://exp.host/--/api/v2/push/send/", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: pushtoken,
    data: { extraData: "Some data in the push notification" },
    title: notititle,
    body: notibody,
  }),
});
}
async function main() {
  console.log(workerData.description);
  let transporter = nodeMailer.createTransport({
    service: "Gmail",
    //host: "outlook.office365.com",
    // port: 587,
    //secure: false,
    auth: {
      user: process.env.EMAIL, //REPLACE WITH YOUR EMAIL ADDRESS
      pass: process.env.PASSWORD //REPLACE WITH YOUR EMAIL PASSWORD
    },

    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    var connection = await oracledb.getConnection(config.database);
    let query = 'select * from issue_return i, member m ,sbook s where i.index_no=m.index_no and i.acceno=s.acceno';

    result = await connection.execute(query, [], // no binds
      {
        outFormat: oracledb.OBJECT
      });
    
    if (result.rows.length == 0) {
      console.log('zero rows');
    } else {
      result.rows.forEach(async function (result) {
        //3 days -> alert
        //after 1 day -> remainder
        //after 7 days -> notice
        var current = moment();
        var returndate = new Date(result.DUE_DATE);
        returndate = moment(returndate);
        
       console.log(current.diff(returndate, 'days'));
        //change this code for others (this is the code for reminder (after 7 days))
     
        if (current.diff(returndate, 'days') == +7) {
          console.log(result.BOOK_TITLE);
          console.log(returndate);
          
          sendnotification("NOTICE!! ","Book's Name: " + result.TITLE , result.TOKEN);

          // console.log(current);
          // await transporter.sendMail({
          //   from: process.env.EMAIL, //SENDER
          //   to: result.EMAIL, //MULTIPLE RECEIVERS
          //   subject: "NOTICE!! ", //EMAIL SUBJECT
          //   html: "Book's Name: " + result.BOOK_TITLE + "<br> Book's Author: " + result.AUTHOR, //EMAIL BODY IN HTML FORMAT
          // })
        }
        //change this code for others (this is the code for alert (before 3 days))
        else if (current.diff(returndate, 'days') == -2) {
          console.log(result.BOOK_TITLE);
          console.log(returndate);

          console.log(current);
          
          sendnotification("ALERT!! ","Book's Name: " + result.TITLE , result.TOKEN);
          // await transporter.sendMail({
          //   from: process.env.EMAIL, //SENDER
          //   to: result.EMAIL, //MULTIPLE RECEIVERS
          //   subject: "ALERT!! ", //EMAIL SUBJECT
          //   html: "Book's Name: " + result.BOOK_TITLE + "<br> Book's Author: " + result.AUTHOR, //EMAIL BODY IN HTML FORMAT
          // })
        }
         //change this code for others (this is the code for reminder (after 1 day))
         else if (current.diff(returndate, 'days') == +1) {
          console.log(result.BOOK_TITLE);
          console.log(returndate);

          console.log(current);
      
          sendnotification("REMINDER!! ","Book's Name: " + result.TITLE , result.TOKEN);
          // await transporter.sendMail({
          //   from: process.env.EMAIL, //SENDER
          //   to: result.EMAIL, //MULTIPLE RECEIVERS
          //   subject: "REMINDER!! ", //EMAIL SUBJECT
          //   html: "Book's Name: " + result.BOOK_TITLE + "<br> Book's Author: " + result.AUTHOR, //EMAIL BODY IN HTML FORMAT
          // })
        }

      });
      //    console.log(result.rows);

      //
      //  return res.send(result.rows);
    }
  } catch (err) {
    console.log(err);
    console.log('error');
    return null;
    //send error message
    //return res.send(err.message);
  }
  finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close();
        console.log('close connection success');
      } catch (err) {
        console.error(err.message);
      }
    }
    //Transporter configuration

    // //Email configuration

  }
}

main().catch(err => console.log(err))