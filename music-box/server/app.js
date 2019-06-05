require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let request = require("request");
var cors = require("cors");
cors({ credentials: true, origin: true });
app.use(cors());

let https = require("https");

let token_host = process.env.TOKEN_HOST;
let client_id = process.env.CLIENT_ID;
let client_secret = process.env.CLIENT_SECRET;

app.listen(3000, () => {
  console.log("Server running, port 3000");
  fetchToken(() => {
    console.log("Token fetched");
  });
});

// application requests authorization
let authOptions = {
  url: token_host,
  headers: {
    Authorization:
      "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64")
  },
  form: {
    grant_type: "client_credentials"
  },
  json: true
};

// getting the token with above generated options
let authorization;
const fetchToken = completed => {
  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // use the access token to access the Spotify Web API
      authorization = {
        token: body.access_token,
        expires_in: body.expires_in,
        timestamp: new Date().getTime() / 1000
      };
      completed(authorization);
    } else {
      console.error(response.body.error);
    }
  });
};

// checking if the token is still valid
const isTokenValid = () => {
  let currentTime = new Date().getTime() / 1000;
  return currentTime > authorization.timestamp + authorization.expires_in
    ? false
    : true;
};

// creating endpoint to which I'm passing URL from front end, which will be in req parameter
app.get("/*", (req, res) => {
  // if the token is valid I just send the body via response
  if (isTokenValid()) {
    let options = {
      url: "https://api.spotify.com/v1" + req.url,
      headers: {
        Authorization: "Bearer " + authorization.token
      },
      json: true
    };

    request.get(
      options,
      (error, response, body) => {
        res.statusCode = response.statusCode;
        res.send(body);
      },
      error => {
        res.send(error);
      }
    );
  } else {
    // if the token is invalid I re-fetch it and send the body then
    fetchToken(val => {
      console.log("Token re-fetched.");
      let options = {
        url: "https://api.spotify.com/v1" + req.url,
        headers: {
          Authorization: "Bearer " + authorization.token
        },
        json: true
      };

      request.get(
        options,
        (error, response, body) => {
          res.send(body);
        },
        error => {
          res.send(error);
        }
      );
    });
  }
});
