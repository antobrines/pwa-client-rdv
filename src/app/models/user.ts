export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  isPrestatary: boolean;
  latitude: number | null;
  longitude: number | null;
}
