import { useState } from 'react';
import ColorSelector from '../ColorSelector';

export default function ColorSelectorExample() {
  const [selectedColor, setSelectedColor] = useState('#D2691E');
  
  const colors = ['#D3D3D3', '#000000', '#4169E1', '#D2691E'];

  return (
    <div className="p-4 max-w-mobile mx-auto">
      <ColorSelector
        colors={colors}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />
    </div>
  );
}
