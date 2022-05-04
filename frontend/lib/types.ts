export type LocationInfo = {
  hasLocation?: boolean;
  name?: string;
  location?: {
    lat: number;
    lng: number;
  };
};
export type CoverPhotoInfo = {
  url?: string;
  pos?: {
    x: number;
    y: number;
  };
};
export type EventDetails = {
  id: number;
  hostId: number;
  title: string;
  description: string;
  startTime: string | "";
  endTime: string | "";
  location: LocationInfo;
  count: number;
  coverPhoto: CoverPhotoInfo;
  privacy: string;
};
export type Guest = {
  username: string;
  name: string;
  status: "Going";
};
