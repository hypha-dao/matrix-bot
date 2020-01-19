require('dotenv').config();
const axios = require('axios').default;
const roomId = process.env.roomId;
const baseUrl = process.env.baseUrl;

var d = new Date();
const trxId = Math.round(d.getTime() / 1000);

axios({
  method: 'put',
  url: `${baseUrl}/${roomId}/send/m.room.message/${trxId}`,
  params: {
    access_token: process.env.matrix_token
  },
  data: {
    msgtype: 'm.text',
    body: 'This is a test message from blah blah'
  }
});