const Event = require('./event');

class ConnectionEvent extends Event {
  constructor(status, info) {
    super('Connection');
    this.status = status;
    this.info = info;
  }
}

module.exports = ConnectionEvent;
