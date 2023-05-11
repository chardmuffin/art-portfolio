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
  

  return (
    <Slider
      value={localPriceRange}
      onChange={handleChange}
      onChangeCommitted={handleCommit}
      valueLabelDisplay="auto"
      min={0}
      max={maxPrice + 20}
      step={10}
    />
  );
}