export interface Role {
    id: number;
    name: string;

  }
  
  export class User {
    id: number;
    name: string;
    
    constructor(id: number, name: string,) {
      this.id = id;
      this.name = name;
      
    }
  }
  