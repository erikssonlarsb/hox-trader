export class User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  createTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.name = json.name;
    this.username = json.username;
    this.email = json.email;
    this.phone = json.phone;
    this.createTimestamp = json.createTimestamp ? new Date(json.createTimestamp) : null;
  }
}
