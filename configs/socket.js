const socket = require('socket.io');

module.exports = class SocketSingleton {
    constructor() {
        this.io = null;
    }
    configure(server) {
        this.io = socket.listen(server);
    }
    emit(topic, data) {
        this.io.emit(topic, data);
    }
    on(topic) {
        this.io.on(topic, (data) => {
            console.log(data)
        });
    }
    connectEvent(socketInfo) {
        this.emit('connect-event', 'connected');
        console.log(`*`);
        console.log(`${socketInfo.id}:  (Connected)`);
    }
    disconnectEvent(socketInfo) {
        this.emit('disconnect-event', 'disconnected');
        console.log(`*`);
        console.log(`(Disconnected) :  ${socketInfo.id}`);
    }
}