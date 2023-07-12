const port = 3000;
const express = require("express");
const app = express();

const Paytm = require('paytmchecksum');
var PaytmChecksum = require("./PaytmChecksum");


 const https = require('https');
 /*
  * import checksum generation utility
  * You can get this utility from https://developer.paytm.com/docs/checksum/
  */
 var paytmParams = {};
 paytmParams.body = {
     "mid": "SEPTAT00707693749510",
     "fromDate": "2023-01-25T23:59:35+08:00",
     "toDate": "2023-02-02T23:59:35+08:00",
     "orderSearchType": "TRANSACTION",
     "orderSearchStatus": "SUCCESS",
     "pageNumber": 1,
     "pageSize": 50
 };
 /*
  * Generate checksum by parameters we have in body
  * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
  */
 PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "oeURdfD87XbhspoX").then(function (checksum) {
     paytmParams.head = {
         "signature": checksum,
         "tokenType": "CHECKSUM",
         "requestTimestamp": ""
     };
     var post_data = JSON.stringify(paytmParams);
     var options = {
         /* for Staging */
         hostname: 'securegw.paytm.in',
         port: 443,
         path: '/merchant-passbook/search/list/order/v2',
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'Content-Length': post_data.length
         }
     };
     var response = "";
     var post_req = https.request(options, function (post_res) {
         post_res.on('data', function (chunk) {
             response += chunk;
         });
         post_res.on('end', function () {
             console.log('Response: ', response);
         });
     });
     post_req.write(post_data);
     post_req.end();
 });


 app.listen(port, () => {
     console.log("Server started")
 })