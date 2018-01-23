export class Payload {
  user: User;
  iat: number;
  exp: number;

  isValid(): boolean {
    return this.exp >= new Date().getTime() / 1000;
  }
}

export class User {
  name: string;
  role: Role;
  email: string;
}

class Role {
  name: string;
  isAdmin: boolean;
  permissions: Array<Permission>;
}

class Permission {
  resource: string;
  methods: Array<method>;
}

enum method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}
