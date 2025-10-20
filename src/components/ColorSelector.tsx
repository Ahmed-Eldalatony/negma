import { Check } from "lucide-react";

interface ColorSelectorProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
}

export default function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  return (
    <div className="space-y-2" data-testid="color-selector">
      <label className="text-sm font-medium">اللون</label>
      <div className="flex gap-2">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => {
              console.log('Color selected:', color);
              onColorSelect?.(color);
            }}
            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
              selectedColor === color ? "border-primary scale-110" : ""
            }`}
            style={{ backgroundColor: color }}
            data-testid={`button-color-${index}`}
          >
            {selectedColor === color && (
              <Check className="h-5 w-5 text-white drop-shadow" strokeWidth={3} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
