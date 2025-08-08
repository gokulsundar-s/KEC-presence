import React, { useEffect, useState } from "react";
import Loaders from "../Loaders/Loaders";

export default function LoadingWrapper({ children, duration = 1000 }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), duration);
  }, [duration]);

  return (
    <div className="loading-wrapper">{isLoading ? <Loaders /> : children}</div>
  );
}
