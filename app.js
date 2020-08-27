const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require("dotenv");

dotenv.config();

const apiKey = process.env.API_KEY;
const apiKeyAudience = process.env.API_KEY_AUDIENCE;
const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/"+apiKeyAudience;
  const options = {
    method: "POST",
    auth: "merykud:"+apiKey

  };
  const request = https.request(url, options, function(response){
    response.on("data", function(data){
    });

    //console.log(response.statusCode);

    if (response.statusCode == 200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }

  });

  request.write(jsonData);
  request.end();


});

app.post("/failure", function(req,res){
  res.redirect("/");

});

app.listen(3000, function() {
  console.log("Listening on port 3000");

});
