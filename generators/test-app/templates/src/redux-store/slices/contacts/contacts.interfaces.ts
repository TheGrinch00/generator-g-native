export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  category: string;
  newsletter: boolean;
}

export interface ContactsState {
  items: Contact[];
}
