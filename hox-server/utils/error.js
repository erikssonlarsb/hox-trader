class Error {
  constructor(message, code = 0) {
    this.message = message;
    this.code = code;
  }
}

module.exports = Error
