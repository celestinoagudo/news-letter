const express = require('express');
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");

const server = "us6"
const listId = "ccef1bfefd"
const apiKey = "6b018b6407acaa2bd4e1bafbe4e38328-us6"

const app = express();
//Serving static files in Express
app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));


app.get("/", function (request, response) {
    response.sendFile(`${__dirname}/signup.html`);
});

app.post("/", function (request, response) {
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const email = request.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);
    const url = `https://${server}.api.mailchimp.com/3.0/lists/${listId}`
    const options = {
        method: "POST",
        auth: `celestino:${apiKey}`

    }

    const apiRequest = https.request(url, options, function (apiResponse) {
        if (apiResponse.statusCode === 200) {
            response.sendFile(`${__dirname}/success.html`);
        } else {
            response.sendFile(`${__dirname}/failure.html`);
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    apiRequest.write(jsonData);
    apiRequest.end();
});

app.post("/failure", function(request, response){
    response.redirect("/");
});

app.post("/success", function(request, response){
    response.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is up and running at port 3000");
});