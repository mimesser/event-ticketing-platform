import React, { useRef, useEffect } from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { EventDetails, EventDetailsOption } from "lib/types";
import EventCarouselItem from "./EventCellVert";

export default function EventsCarousel({
  events,
  options,
}: {
  events: EventDetails[];
  options: EventDetailsOption;
}) {
  // carousel
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1024 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      {
        <div
          style={{
            display: "block",
            marginTop: "20px",
            overflow: "hidden",
          }}
        >
          <Carousel
            swipeable={false}
            autoPlay={false}
            shouldResetAutoplay={false}
            responsive={responsive}
            slidesToSlide={1}
            arrows={true}
            showDots={false}
            renderButtonGroupOutside={true}
          >
            {events.map((event: EventDetails, index: number) => (
              <React.Fragment key={index}>
                <EventCarouselItem
                  layout="vertical"
                  event={event}
                  options={options}
                />
              </React.Fragment>
            ))}
          </Carousel>
        </div>
      }
    </>
  );
}
