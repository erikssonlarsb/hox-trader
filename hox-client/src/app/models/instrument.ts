export class Instrument {
  name: string;
  underlying: string;
  expiry: Date;
  createTimestamp: Date;
  updateTimestamp: Date;

  constructor(json) {
    this.name = json.name;
    this.underlying = json.underlying;
    this.expiry = new Date(json.expiry);
    this.createTimestamp = new Date(json.createTimestamp);
    this.updateTimestamp = new Date(json.updateTimestamp);
  }
}
