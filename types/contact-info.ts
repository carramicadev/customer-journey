export interface ContactInfo {
  id?: string;

  name: string;
  phone: string;

  address: string; // alamat manual
  pinAddress?: string; // 🔥 TAMBAH

  district?: string;
  postalCode?: string;

  coordinate?: {
    lat: number;
    lng: number;
  };

  email?: string;
  type?: "sender" | "receiver" | "both";
}
