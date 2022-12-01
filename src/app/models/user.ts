export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postal_code: string;
  isPrestatary: boolean;
  lat: number;
  lng: number;
  geohash: string;
}
