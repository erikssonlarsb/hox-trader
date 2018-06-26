import { User } from './user';

export class Session {
  user: User;
  iat: number;
  exp: number;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.user = new User(data);
    } else {
      this.user = data.user ? new User(data.user) : null;
      this.iat = data.iat;
      this.exp = data.exp;
    }
  }

  isValid(): boolean {
    return this.exp >= new Date().getTime() / 1000;
  }
}
