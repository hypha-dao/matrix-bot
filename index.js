global.fetch = require('node-fetch')
global.WebSocket = require('ws')

require('dotenv').config({ path: '.env' });
const axios = require('axios').default;
const roomId = process.env.ROOM_ID;
const baseUrl = process.env.BASE_URL;
const matrix_token = process.env.MATRIX_TOKEN;
const account = process.env.ACCOUNT;

console.log ('Application Configuration:');
console.log ('BASE_URL            : ' + baseUrl);
console.log ('MATRIX_TOKEN length : ' + matrix_token.length);
console.log ('ROOM_ID             : ' + roomId);
console.log ('ACCOUNT             : ' + account);

const telosTrxStatus = () => {
  const messageBody = {
    "apikey": "test-api-key",
    "event": "subscribe",
    "type": "get_actions",
    "data": {
      "account": account,
      "actions": []
    }
  }
  const socket = new WebSocket("wss://telos.spectrumeos.io/streaming")

  socket.onopen = () => {
    socket.send(JSON.stringify(messageBody));
  }
 
  socket.onmessage = (event) => {
    var d = new Date();
    const trxId = Math.round(d.getTime() / 1000);    // Send a POST request
    const url = `${baseUrl}/${roomId}/send/m.room.message/${trxId}`
    axios({
      method: 'put',
      url: url,
      params: {
        access_token: matrix_token
      },
      data: {
        msgtype: 'm.text',
        body: event.data
      }
    }).then (function (response) {
      // do nothing
      console.log (JSON.stringify(response, null, 2));
    }).catch (function (error) {
      console.log (error);
    });
  }
  socket.onclose = (event) => {
    console.log("Telos socket connection closed:" + event.data)
  }
  socket.onerror = function (error) {
    console.log("Telos websocket got error: " + error.message)
  }
}

telosTrxStatus()