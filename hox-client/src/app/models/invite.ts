import { User } from './user';

export class Invite {
  id: string;
  inviter: User;
  invitee: User;
  code: string
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.inviter = json.inviter ? new User(json.inviter) : null;
    this.invitee = json.invitee ? new User(json.invitee) : null;
    this.code = json.code ? json.code : null;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }
}
