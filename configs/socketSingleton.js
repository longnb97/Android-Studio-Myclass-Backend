const socket = require('socket.io');

const SocketSingleton = (function () {
    this.io = null;
    this.configure = function (server) {
        this.io = socket.listen(server);
    }
    this.emit = function (topic, data) {
        this.io.emit(topic, data);
    }

    this.connectEvent = function (socketInfo) {
        this.emit('connect-event', 'connected');
        console.log(`*`);
        console.log(`${socketInfo.id}:  (Connected)`);
    }
    this.disconnectEvent = function (socketInfo) {
        this.emit('disconnect-event', 'disconnected');
        console.log(`*`);
        console.log(`(Disconnected) :  ${socketInfo.id}`);
    }
    return this;
})();

module.exports = SocketSingleton;