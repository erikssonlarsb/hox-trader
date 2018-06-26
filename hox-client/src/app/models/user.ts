export class User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: Role;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.id = data;
    } else {
      this.id = data._id || data.id;
      this.name = data.name;
      this.username = data.username;
      this.email = data.email;
      this.phone = data.phone;
      this.role = data.role ? new Role(data.role) : null;
    }
  }

  get createTimestamp(): Date {
    return this.id ? new Date(parseInt(this.id.toString().substring(0, 8), 16) * 1000) : null;
  }
}

class Role {
  id: string;
  name: string;
  isAdmin: boolean;
  permissions: Array<Permission>;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.id = data;
    } else {
      this.id = data._id || data.id;
      this.name = data.name;
      this.isAdmin = data.isAdmin;
      this.permissions = data.permissions ? data.permissions.map(permission => new Permission(permission)) : null;
    }
  }

  get createTimestamp(): Date {
    return this.id ? new Date(parseInt(this.id.toString().substring(0, 8), 16) * 1000) : null;
  }
}

class Permission {
  resource: string;
  methods: Array<Method>;

  constructor(data) {
    if(typeof(data) != 'string') {
      this.resource = data.resource;
      this.methods = data.methods ? data.methods.map(method => Method[method]) : null;
    }

  }
}

enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}
