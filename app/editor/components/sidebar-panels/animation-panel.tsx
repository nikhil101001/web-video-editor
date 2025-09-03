import { Layers } from "lucide-react";

import { Button } from "@/components/ui/button";

const AnimationsPanel: React.FC = () => {
  const animations = [
    { id: "fadeIn", name: "Fade In" },
    { id: "fadeOut", name: "Fade Out" },
    { id: "slideIn", name: "Slide In" },
    { id: "zoomIn", name: "Zoom In" },
    { id: "zoomOut", name: "Zoom Out" },
  ];

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold mb-4">Animations</h3>

      <div className="space-y-2">
        {animations.map((animation) => (
          <Button
            key={animation.id}
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => console.log("Apply animation:", animation.id)}
          >
            <Layers size={16} className="mr-2" />
            {animation.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AnimationsPanel;
