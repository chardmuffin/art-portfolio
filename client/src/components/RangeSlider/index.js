import { useState } from 'react';
import Slider from '@mui/material/Slider';

export default function RangeSlider({ priceRange, handlePriceChange, maxPrice }) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handleChange = (event, newValue) => {
    setLocalPriceRange(newValue);
  };

  const handleCommit = (event, newValue) => {
    handlePriceChange(event, newValue);
  };
  
  const roundedMax = maxPrice % 10 === 0 ? maxPrice : Math.ceil(maxPrice / 10) * 10;

  return (
    <Slider
      value={localPriceRange}
      onChange={handleChange}
      onChangeCommitted={handleCommit}
      valueLabelDisplay="auto"
      min={0}
      max={roundedMax}
      step={10}
    />
  );
}