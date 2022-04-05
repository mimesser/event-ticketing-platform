import { ReactElement } from "react";

export default function MapMarker({
  lat,
  lng,
  children,
}: {
  lat: number;
  lng: number;
  children: ReactElement | ReactElement[];
}) {
  return <div>{children}</div>;
}
