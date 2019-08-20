const express = require('express');
const mongoose = require('mongoose');
const Device = require('./models/device');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(`${__dirname}/public`));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

/**
* @api {get} /docs API Docs
* @apiGroup Docs
* @apiSuccessExample {object} Success-Response:
* '/generated-docs/index.html'
* @apiErrorExample {string} Error-Response:
* null
*/

app.get('/docs', (req, res) => {
  res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

/**
* @api {get} /api/test Test API
* @apiGroup Test
* @apiSuccessExample {string} Success-Response:
* 'The API is working!'
* @apiErrorExample {string} Error-Response:
* null
*/

app.get('/api/test', (req, res) => {
  res.send('The API is working!');
});

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Devices
* @apiSuccessExample {json} Success-Response:
* [
*   {
*     "_id": "dsohsdohsdofhsofhosfhsofh",
*     "name": "Mary's iPhone",
*     "user": "mary",
*     "sensorData": [
*       {
*         "ts": "1529542230",
*         "temp": 12,
*         "loc": {
*           "lat": -37.84674,
*           "lon": 145.115113
*         }
*       },
*       {
*         "ts": "1529572230",
*         "temp": 17,
*         "loc": {
*           "lat": -37.850026,
*           "lon": 145.117683
*         }
*       }
*     ]
*   }
* ]
* @apiErrorExample {json} Error-Response:
* {
*   "User does not exist"
* }
*/

app.get('/api/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    return err
      ? res.send(err)
      : res.send(devices);
  });
});

app.get('/api/devices/:deviceId/device-history', (req, res) => {
  const { deviceId } = req.params;
  Device.findOne({"_id": deviceId}, (err, devices) => {
    const { sensorData } = devices;
    return err
      ? res.send(err)
      : res.send(sensorData);
  });
});

/**
* @api {post} /api/devices Add device
* @apiGroup Devices
* @apiSuccessExample {string} Success-Response:
* 'Successfully added device and data.'
* @apiErrorExample {string} Error-Reponse:
* 'Syntax error.'
*/

app.post('/api/devices', (req, res) => {
  const { name, user, sensorData } = req.body;
  const newDevice = new Device({
    name,
    user,
    sensorData
  });
  newDevice.save(err => {
    return err
      ? res.send(err)
      : res.send('Successfully added device and data.');
  });
});

app.post('/api/authenticate', (req, res) => {
  const { name, password } = req.body;
  User.findOne({"name":name}, (err, users) => {
    if (err) {
      return res.send(err);
    } else if (!users) {
      return res.send("No user found!");
    } else if (users.password != password) {
      return res.send("Password incorrect!");
    } else {
      return res.json({
        success: true,
        message: 'Authenticated Successfully!',
        isAdmin: users.isAdmin
      });
    }
  });
});

app.post('/api/registration', (req, res) => {
  const { name, password, isAdmin } = req.body;
  User.findOne({"name":name}, (err, users) => {
    if (err) {
      return res.send(err);
    } else if (users) {
      return res.send("This user already exists!")
    } else {
      const newUser = new User({
        name,
        password,
        isAdmin
      });

      newUser.save(err => {
        return err
          ? res.send(err)
          : res.json({
            success: true,
            message: 'Created new user'
          });
      });
    }
  });
});

app.post('/api/send-command', (req, res) => {
  console.log(req.body);
});