import { User } from './user';

export class Session {
  user: User;
  iat: number;
  exp: number;

  constructor(json) {
    this.user = json.user ? new User(json.user) : null;
    this.iat = json.iat;
    this.exp = json.exp;
  }
  
  isValid(): boolean {
    return this.exp >= new Date().getTime() / 1000;
  }
}
