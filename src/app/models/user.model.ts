export interface User {
  id: number;
  name: string;
  email: string;
  role: any;
}

export class User {
  id: number;
  name: string;
  email: string;
  role: any;
  constructor(id: number, name: string, email: string, role: any) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
