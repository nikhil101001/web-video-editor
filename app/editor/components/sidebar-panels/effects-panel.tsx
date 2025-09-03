import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";

const EffectsPanel: React.FC = () => {
  const effects = [
    { id: "none", name: "None" },
    { id: "blackAndWhite", name: "Black & White" },
    { id: "sepia", name: "Sepia" },
    { id: "invert", name: "Invert" },
    { id: "blur", name: "Blur" },
    { id: "brightness", name: "Brightness" },
    { id: "contrast", name: "Contrast" },
    { id: "saturate", name: "Saturate" },
  ];

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold mb-4">Effects</h3>

      <div className="grid grid-cols-2 gap-2">
        {effects.map((effect) => (
          <Button
            key={effect.id}
            variant="outline"
            size="sm"
            className="h-16 flex flex-col items-center justify-center"
            onClick={() => console.log("Apply effect:", effect.id)}
          >
            <Palette size={20} className="mb-1" />
            <span className="text-xs">{effect.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EffectsPanel;
