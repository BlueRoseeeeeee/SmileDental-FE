import React, { useEffect, useState } from "react";
import banner from "../../assets/image/banner-caroseul.png";
import bannerAlt from "../../assets/image/hinh-anh-dang-nhap-dang-ki.png";
import "./carousel.css";

const slides = [
  { id: 1, src: banner, alt: "Smile Care Dental Clinic" },
  { id: 2, src: bannerAlt, alt: "Smile Dental" },
];

function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => (
        <img
          key={slide.id}
          className={`hero-carousel__slide ${index === current ? "hero-carousel__slide--active" : ""}`}
          src={slide.src}
          alt={slide.alt}
        />
      ))}
      <div className="hero-carousel__dots">
        {slides.map((s, index) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${index + 1}`}
            className={`hero-carousel__dot ${index === current ? "hero-carousel__dot--active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;


