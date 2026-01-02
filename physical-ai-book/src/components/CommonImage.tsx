import React, { useState } from 'react';

interface CommonImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const CommonImage: React.FC<CommonImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to a default image if the primary one fails
      setImgSrc('/img/docusaurus.png'); // Using docusaurus logo as fallback
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
    />
  );
};

export default CommonImage;