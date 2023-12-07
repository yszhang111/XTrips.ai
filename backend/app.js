
const express = require('express');
const { expressjwt } = require('express-jwt')
var bodyParser = require('body-parser');

const app = express();
const config = require('./config.js');
const dbConnection = require('./database.js')
const { HeadBucketCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
// const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');
var startTime;
app.use(bodyParser())
app.use(expressjwt({
  secret: 'f90f8eef-59bc-4bfa-a1e0-ca9bba0ff4d2',
  algorithms: ['HS256']
}).unless({
  path: ['/register', '/login']
}))

app.listen(config.service_port, () => {
  startTime = Date.now();
  console.log('web service running on:', config.service_port);
  
  process.env.AWS_SHARED_CREDENTIALS_FILE = config.xtrip_config;
});

app.get('/', (req, res) => {

  var uptime = Math.round((Date.now() - startTime) / 1000);

  res.json({
    "status": "running",
    "uptime-in-secs": uptime,
    "dbConnection": dbConnection.state
  });
});

//
// functions:
//
var register = require('./apis/register.js');
var login = require('./apis/login.js');
var generate = require('./apis/generate.js');

app.post('/register', register.register_user);  
app.post('/login', login.login_user);
app.post('/generate', generate.generate_recommendation);
