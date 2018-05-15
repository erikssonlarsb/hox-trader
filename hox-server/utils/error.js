class Error {
  constructor(error) {
    if(error.constructor === String) {
      this.message = error;
      this.code = null;
      this.type = null;
    } else {
      if(error.hasOwnProperty('errmsg')) {
        this.message = error.errmsg;
      } else if(error.hasOwnProperty('error')) {
        this.message = error.error;
      } else if(error.hasOwnProperty('message')) {
        this.message = error.message;
      } else if(error.hasOwnProperty('msg')) {
        this.message = error.msg;
      } else {
        this.message = "Unknown error";
      }

      if(error.hasOwnProperty('code')) {
        this.code = error.code;
      } else {
        this.code = null;
      }

      if(error.hasOwnProperty('name')) {
        this.type = error.name;
      } else {
        this.type = null;
      }
    }
  }
}

module.exports = Error
