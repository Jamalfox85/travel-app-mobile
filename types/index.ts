export interface Trip {
  ID: any;
  Id: never;
  Title: string;
  Location: string;
  UserId: string;
  Start_date: string;
  End_date: string;
  Place_id: string;
  Photo_uri: string;
  Activities?: Activity[];
  Accommodations?: Accommodation[];
}

export interface Activity {
  TripId: number;
  Title: string;
  Date: string;
  Url?: string;
  Phone?: string;
  Address?: string;
  PoiId?: any;
  IsCustom?: boolean;
  PhotoUri?: string;
  Rating?: number;
  Price?: number;
}

export interface Accommodation {
  ID: any;
  TripId: number;
  Title: string;
  Address: string;
  StartDate: string;
  EndDate: string;
}
