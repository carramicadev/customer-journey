export interface ContactInfo {
  id?: string;

  name: string;
  phone: string;
  address: string;

  district?: string;
  postalCode?: string;

  coordinate?: {
    lat: number;
    lng: number;
  };

  email?: string;

  type?: "sender" | "receiver" | "both";
}
