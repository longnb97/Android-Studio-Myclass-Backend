const socket = require('socket.io');

const SocketSingleton = (function () {
    this.io = null;
    this.configure = function (server) {
        this.io = socket.listen(server);
    }
    this.emit = function (topic, data) {
        io.emit(topic, data);
    }
    this.on = function (topic) {
        io.on(topic, (data) => {
            console.log(data)
        });
    }

    this.connectEvent = function () {
        this.emit('connect-event', 'connected');
        console.log(`*`);
        console.log(`${socket.id}:  (Connected)`);
    }
    this.disconnectEvent = function (socketInfo) {
        this.emit('disconnect-event', 'disconnected');
        console.log(`*`);
        console.log(`(Disconnected) :  ${socketInfo.id}`);
    }
    return this;
})();

module.exports = SocketSingleton;