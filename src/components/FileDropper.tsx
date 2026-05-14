import useStore from "@/store/store";
import { handleFile } from "@/utils/fetchData";
import { useState } from "react";

export default function DragAndDropUpload() {
  const update = useStore((state) => state.update);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    setFile(files[0]);

    const [data, error] = await handleFile(files[0]);
    if (!data || error) return;
    setIsDragging(false);
    update("summery", data?.summery);
    update("parsedData", data?.parsedData);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFile(files[0]);

    const [data, error] = await handleFile(files[0]);
    if (!data || error) return;
    update("summery", data?.summery);
    console.log({ parsed: data?.parsedData });
    update("parsedData", data?.parsedData);
    update("aiHeaderInterpretation", data.aiHeaderInterpretation);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`w-full rounded-lg border-2 border-dashed border-zinc-600 bg-zinc-900/60 backdrop-blur-xl p-10 text-center transition hover:border-white mt-4 relative
         ${
           isDragging
             ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
             : "border-zinc-600 bg-zinc-900"
         }
        `}
    >
      <div className="space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-3xl">
          📂
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">Drag & Drop Files</h2>
          <p className="mt-2 text-sm text-zinc-400">Upload XLSX</p>
        </div>

        <label
          htmlFor="file-upload"
          className="inline-flex cursor-pointer items-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
        >
          Browse Files
        </label>

        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          accept=".xlsx"
          onChange={handleFileChange}
        />
      </div>
      {file && (
        <p className="absolute bottom-6 left-[50%] translate-x-[-50%] mt-2 text-sm text-zinc-400">
          {file.name}
        </p>
      )}
    </div>
  );
}
