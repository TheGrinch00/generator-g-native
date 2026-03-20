export interface IContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  category: string;
  newsletter: boolean;
}

export class Contact implements IContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  category: string;
  newsletter: boolean;

  constructor(data: IContact) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.category = data.category;
    this.newsletter = data.newsletter;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
