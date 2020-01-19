global.fetch = require('node-fetch')
global.WebSocket = require('ws')

require('dotenv').config({ path: '../hyphabot.cfg' });
const axios = require('axios').default;
const roomId = process.env.ROOM_ID;
const baseUrl = process.env.BASE_URL;
const matrix_token = process.env.MATRIX_TOKEN;

const telosTrxStatus = () => {
  const messageBody = {
    "apikey": "test-api-key",
    "event": "subscribe",
    "type": "get_actions",
    "data": {
      "account": "dao.hypha",
      "actions": []
    }
  }
  const socket = new WebSocket("wss://telos.spectrumeos.io/streaming")

  socket.onopen = () => {
    socket.send(JSON.stringify(messageBody));
  }

  socket.onmessage = (event) => {
    console.log('Telos websocket:', JSON.parse(event.data))
    var d = new Date();
    const trxId = Math.round(d.getTime() / 1000);    // Send a POST request
    axios({
      method: 'put',
      url: `${baseUrl}/${roomId}/send/m.room.message/${trxId}`,
      params: {
        access_token: matrix_token
      },
      data: {
        msgtype: 'm.text',
        body: JSON.stringify(event.data, null, 2)
      }
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