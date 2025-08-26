import React, { useEffect, useRef } from "react";
import "./otp.css";

function OtpInput({ value, onChange, length = 6, name = "otp" }) {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length);
  }, [length]);

  const handleChange = (idx, e) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const chars = value.split("");
    chars[idx] = char || "";
    const next = chars.join("");
    onChange(next);
    if (char && idx < length - 1) inputsRef.current[idx + 1].focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1].focus();
    if (e.key === "ArrowRight" && idx < length - 1) inputsRef.current[idx + 1].focus();
  };

  return (
    <div className="otp" role="group" aria-label={name}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          className="otp__cell"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  );
}

export default OtpInput;


