import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setisUploading] = useState<boolean>(false);

  const navigate = useNavigate();
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
    }
  };
  const sendFiles = async () => {
    //add elegant alert TODO:
    if (selectedFiles.length == 0) {
      alert("no files selected!");
      return;
    }
    setisUploading(true);
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append("files", file);
    }
    try {
      const response = await axios.post(
        "http://localhost:3005/process",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setisUploading(false);
        console.log(response.data);
      } else {
        console.error("Error sending files");
        setisUploading(false);
      }
    } catch (error) {
      setisUploading(false);
      console.error("Error sending files:", error);
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover ">
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
          <div className="text-center">
            <h2 className="mt-5 text-3xl font-bold text-gray-900">
              CNIC Tracker
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Upload scanned images or drag and drop images below
            </p>
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-8 space-y-3 "
          >
            <div className="grid grid-cols-1 space-y-2 text-center">
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Attach Documents
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div className="h-full w-full text-center flex flex-col justify-center items-center">
                    <p className="pointer-none text-gray-500">
                      <a className="text-blue-600 hover:underline">
                        select files
                      </a>{" "}
                      from your computer
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
              <div>
                {selectedFiles.length !== 0 && (
                  <h2 className="text-lg font-bold mt-4">Selected Files:</h2>
                )}
                <ul className="list-decimal list-inside text-start">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file?.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              <span>File type: .jpeg, .jpg, .png types of images</span>
            </p>

            <div className="flex justify-center">
              <button
                onClick={sendFiles}
                disabled={isUploading}
                className={`w-2/3 p-4 border-2 rounded-full tracking-wide font-semibold focus:shadow-outline focus:border-2 ${
                  isUploading
                    ? "bg-gray-500 text-gray-400 border-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-gray-100 border-blue-500 hover:bg-blue-600 hover:border-blue-800"
                } shadow-lg cursor-pointer transition ease-in duration-200`}
              >
                {isUploading ? "Uploading..." : "Upload to database"}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (isUploading) {
                    alert("files are uploading wait!");
                  } else {
                    navigate("/view");
                  }
                }}
                className={`w-2/3 p-4 border-2 rounded-full tracking-wide font-semibold focus:shadow-outline focus:border-2 ${
                  isUploading
                    ? "bg-gray-500 text-gray-400 border-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-gray-100 border-blue-500 hover:bg-blue-600 hover:border-blue-800"
                } shadow-lg cursor-pointer transition ease-in duration-200`}
              >
                View records
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
