import { User } from './user';

export class Invite {
  id: string;
  inviter: User;
  invitee: User;
  code: string
  updateTimestamp: Date;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.id = data;
    } else {
      this.id = data._id || data.id;
      this.inviter = data.inviter ? new User(data.inviter) : null;
      this.invitee = data.invitee ? new User(data.invitee) : null;
      this.code = data.code ? data.code : null;
      this.updateTimestamp = data.updateTimestamp ? new Date(data.updateTimestamp) : null;
    }
  }

  get createTimestamp(): Date {
    return this.id ? new Date(parseInt(this.id.toString().substring(0, 8), 16) * 1000) : null;
  }
}
