const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;

app.use(express.static('public'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const client = mqtt.connect("mqtt://soldier.cloudmqtt.com:16448", {
  username: "ntbeepzi", 
  password: "qKtQx3AXlwE9"
});

client.on('connect', () => {
  console.log('connected');
});

app.post('/send-command', (req, res) => {
  const { deviceId, command } = req.body;
  const topic = `/command/${deviceId}`;
  client.publish(topic, command, () => {
    res.send('published new message');
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});