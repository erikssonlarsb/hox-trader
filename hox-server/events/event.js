class Event {
  constructor(eventType, docType, doc) {
    this.eventType = eventType;
    this.docType = docType;
    this.document = doc;
  }
}

module.exports = Event;
