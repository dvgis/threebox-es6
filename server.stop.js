'use strict';
var port = 8080 || process.env.PORT || 1337;

const io = require('socket.io-client');
const socketClient = io.connect('http://localhost' + port); // Specify port if your express server is not using default port 80

socketClient.on('connect', () => {
    socketClient.emit('npmStop');
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

