const Event = require('./event');

class DocumentEvent extends Event {
  constructor(operation, docType, document) {
    super('Document');
    this.operation = operation ? operation : 'Unknown';
    this.docType = docType ? docType : 'Unknown';
    this.document = document;
  }
}

module.exports = DocumentEvent;
