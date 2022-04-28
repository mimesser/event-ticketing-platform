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
  title: string;
  description: string;
  startTime: string | "";
  endTime: string | "";
  location: LocationInfo;
  going: number;
  coverPhoto: CoverPhotoInfo;
};