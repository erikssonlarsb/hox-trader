export class User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: Role;

  constructor(json) {
    this.id = json._id;
    this.name = json.name;
    this.username = json.username;
    this.email = json.email;
    this.phone = json.phone;
    this.role = json.role ? new Role(json.role) : null;
  }
}

class Role {
  name: string;
  isAdmin: boolean;
  permissions: Array<Permission>;

  constructor(json) {
    this.name = json.name;
    this.isAdmin = json.isAdmin;
    this.permissions = json.permissions ? json.permissions.map(permission => new Permission(permission)) : null;
  }
}

class Permission {
  resource: string;
  methods: Array<Method>;

  constructor(json) {
    this.resource = json.resource;
    this.methods = json.methods ? json.methods.map(method => Method[method]) : null;
  }
}

enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}
