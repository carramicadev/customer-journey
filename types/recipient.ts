export interface Coordinate {
  lat: number;
  lng: number;
}

export interface RecipientInfo {
  receiverName: string;
  receiverPhone: string;
  address: string;
  koordinateReceiver?: Coordinate; // ⬅️ optional
}
