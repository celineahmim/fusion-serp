import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [keywords, setKeywords] = useState("");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (!files.length || !keywords.trim()) {
      alert("Veuillez ajouter des fichiers et entrer des mots-clés.");
      return;
    }

    const formData = new FormData();
    formData.append("mots_cles", keywords);
    files.forEach((file) => formData.append("fichiers", file));

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "fusion_resultats.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("Erreur lors du téléchargement du fichier");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des fichiers", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Fusionner les SERP</h1>
      
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <label className="block text-gray-700 font-medium mb-2">Mots-clés (séparés par une virgule) :</label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Ex: plombier, plomberie commercial, tuyau à gaz"
        />
        
        <label className="block text-gray-700 font-medium mb-2">Téléverser les fichiers Excel :</label>
        <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100">
          <input
            type="file"
            multiple
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="block cursor-pointer">
            <UploadCloud size={40} className="mx-auto text-blue-500" />
            <span className="text-gray-600">Glissez-déposez ou cliquez pour téléverser</span>
          </label>
        </div>
        
        {files.length > 0 && (
          <ul className="mt-4 text-gray-700">
            {files.map((file, index) => (
              <li key={index} className="flex items-center gap-2">
                <FileText className="text-blue-500" /> {file.name}
              </li>
            ))}
          </ul>
        )}
        
        <Button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700" onClick={handleUpload}>
          Fusionner & Télécharger
        </Button>
      </div>
    </div>
  );
}
