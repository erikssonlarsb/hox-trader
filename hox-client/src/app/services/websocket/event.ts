import * as models from '../../models/index';

export class Event {
  eventType: EVENT_TYPE;
  document: any;

  constructor(data) {
    this.eventType = data.eventType ? <EVENT_TYPE>EVENT_TYPE[data.eventType] : null;
    this.document = data.document ? new models[data.docType](data.document) : null;
    }
  }

  export enum EVENT_TYPE {
    Create = "Create",
    Update = "Update",
    Delete = "Delete"
  }
