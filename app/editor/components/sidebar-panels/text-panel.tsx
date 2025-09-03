import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const TextPanel: React.FC = () => {
  const [text, setText] = useState("Enter your text here");
  const [fontSize, setFontSize] = useState(40);
  const [color, setColor] = useState("#ffffff");

  const handleAddText = () => {
    // This will be implemented to add text to canvas
    console.log("Adding text:", { text, fontSize, color });
  };

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold mb-4">Add Text</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="text-input">Text</Label>
          <Input
            id="text-input"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
            placeholder="Enter your text"
          />
        </div>

        <div>
          <Label htmlFor="font-size">Font Size</Label>
          <Input
            id="font-size"
            type="number"
            value={fontSize}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFontSize(Number(e.target.value))
            }
            min={12}
            max={200}
          />
        </div>

        <div>
          <Label htmlFor="text-color">Color</Label>
          <Input
            id="text-color"
            type="color"
            value={color}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setColor(e.target.value)
            }
          />
        </div>

        <Button onClick={handleAddText} className="w-full">
          <Plus size={16} className="mr-2" />
          Add Text
        </Button>
      </div>
    </div>
  );
};

export default TextPanel;
