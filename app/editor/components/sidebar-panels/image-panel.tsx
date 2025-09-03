import { Plus, Upload } from "lucide-react";
import { useEditorStore } from "../../store/use-editor";
import { Button } from "@/components/ui/button";

const ImagePanel: React.FC = () => {
  const { addImage, images } = useEditorStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        addImage(url);
      });
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold mb-4">Image Library</h3>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Upload image files
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
        />
        <Button asChild variant="outline" size="sm">
          <label htmlFor="image-upload" className="cursor-pointer">
            Browse Images
          </label>
        </Button>
      </div>

      {images.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Uploaded Images</h4>
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-20 object-cover rounded cursor-pointer"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                >
                  <Plus size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePanel;
