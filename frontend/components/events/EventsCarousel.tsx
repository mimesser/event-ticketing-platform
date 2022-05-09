import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "styles/components/Events.module.scss";

import { EventDetails, EventDetailsOption } from "lib/types";
import EventCell from "components/events/EventCell";

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
      breakpoint: { max: 4000, min: 1600 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1600, min: 1200 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 1200, min: 800 },
      items: 1,
    },
  };
  const itemWidth = 400;
  const item3 = useMediaQuery(`(min-width:${itemWidth * 4}px)`);
  const item2 = useMediaQuery(`(min-width:${itemWidth * 3}px)`);
  const items = item3 ? 3 : item2 ? 2 : 1;
  return (
    <>
      {
        <div className={styles.carousel_container}>
          <div style={{ display: "block", width: `${items * itemWidth}px` }}>
            <Carousel
              swipeable={false}
              autoPlay={false}
              shouldResetAutoplay={false}
              containerClass="carousel-container"
              responsive={responsive}
              slidesToSlide={1}
              arrows={true}
              showDots={false}
              itemClass={styles.carousel_item}
              renderButtonGroupOutside={true}
            >
              {events.map((event: EventDetails, index: number) => (
                <React.Fragment key={index}>
                  <EventCell
                    layout="vertical"
                    event={event}
                    options={options}
                  />
                </React.Fragment>
              ))}
            </Carousel>
          </div>
        </div>
      }
    </>
  );
}
