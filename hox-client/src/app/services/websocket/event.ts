import * as models from '../../models/index';

export class Event {
  type: EVENT_TYPE;

  constructor(data) {
    this.type = data.type ? <EVENT_TYPE>EVENT_TYPE[data.type] : null;
  }

  static typeMapper(event): Event {
    switch(event.type) {
      case EVENT_TYPE.Connection: {
        return new ConnectionEvent(event);
      }
      case EVENT_TYPE.Document: {
        return new DocumentEvent(event);
      }
      default: {
        return new Event(event);
      }
    }
  }
}

export enum EVENT_TYPE {
  Connection = "Connection",
  Document = "Document"
}

export class ConnectionEvent extends Event {
  status: CONNECTION_STATUS;
  info: string;

  constructor(data) {
    super(data);
    this.status = data.status ? <CONNECTION_STATUS>CONNECTION_STATUS[data.status] : null;
    this.info = data.info;
  }
}

export enum CONNECTION_STATUS {
  Connected = "Connected",
  Disconnected = "Disconnected",
  Reconnecting = "Reconnecting"
}

export class DocumentEvent extends Event {
  operation: DOCUMENT_OPERATION;
  docType: DOCUMENT_TYPE;
  document: any;

  constructor(data) {
    super(data);
    this.operation = data.operation ? <DOCUMENT_OPERATION>DOCUMENT_OPERATION[data.operation] : null;
    this.docType = data.docType ? <DOCUMENT_TYPE>DOCUMENT_TYPE[data.docType] : null;
    this.document = data.document ? new models[data.docType](data.document) : null;
  }
}

export enum DOCUMENT_OPERATION {
  Create = "Create",
  Update = "Update",
  Delete = "Delete"
}

export enum DOCUMENT_TYPE {
  Instrument = "Instrument",
  Invite = "Invite",
  Order = "Order",
  OrderDepth = "OrderDepth",
  Position = "Position",
  Price = "Price",
  Session = "Session",
  Settlement = "Settlement",
  Ticker = "Ticker",
  Trade = "Trade",
  User = "User"
}
