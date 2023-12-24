import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface ResponseDataItem {
  id: number;
  fileHash: string;
  fileName: string;
  filePath: string;
  extractedData: string;
  createdDate: Date;
  modifiedDate: Date; // Add other properties as needed
}

export default function ViewRecords() {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState<ResponseDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [search, setSearch] = useState("");

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:3005/view", {
        withCredentials: true,
      });
      const data = response.data;

      // Wait for all data to arrive
      const allData = await Promise.all(data);
      setResponseData(allData);

      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const data = {
    nodes: responseData.filter((item) => item.extractedData.includes(search)),
  };
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  async function handleOpenFile(fileName: string) {
    const res = await fetch(`http://localhost:3005/api/files/${fileName}`, {
      credentials: "include",
    });
    if (res.status != 200) {
      alert("file doesn't exist.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  async function handleDeleteFile(fileHash: string) {
    const res = await fetch(`http://localhost:3005/api/delete/${fileHash}`, {
      credentials: "include",
    });
    if (res.status === 200) {
      alert("File deleted successfully!");
      fetchData();
    } else if (res.status === 404) {
      alert("File doesn't exist!");
    }
  }
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {(error as Error).message}</p>
      ) : (
        <div className="flex p-10 bg-gray-500 h-full">
          {Array.isArray(responseData) ? (
            <div className="flex w-full relative overflow-x-auto">
              <table className="w-full text-sm text-center text-gray-500">
                <caption className="p-5 text-xl font-semibold text-gray-900 bg-white">
                  <div className="flex items-center">
                    <button
                      className="bg-blue-500 text-gray-100 w-40 ml-8 p-4 border-2 border-transparent rounded-full tracking-wide font-semibold focus:shadow-outline focus:border-2 focus:border-blue-800 hover:bg-blue-700 hover:border-2 hover:border-blue-1000 shadow-lg cursor-pointer transition ease-in duration-200"
                      onClick={() => navigate("/")}
                    >
                      back
                    </button>
                    <p className="mx-auto text-5xl">List of unfit candidates</p>
                    <label htmlFor="search" className="text-xl">
                      Search by CNIC : {"    "}
                      <input
                        id="search"
                        type="text"
                        className="border-2 border-blue-500 p-2 rounded"
                        onChange={handleSearch}
                      />
                    </label>
                  </div>
                </caption>

                <thead className="text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      File Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      File Path
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Extracted CNIC
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Open
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.nodes.length > 0 ? (
                    data.nodes.map((item) => (
                      <tr
                        className="text-lg bg-white border-b h-16"
                        key={item.id}
                      >
                        <td>{item.fileName}</td>
                        <td>{item.filePath}</td>
                        {item.extractedData && <td>{item.extractedData}</td>}
                        <td>
                          {new Date(item.createdDate).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </td>
                        <td>
                          <button
                            className=" p-2 border-2 rounded-full tracking-wide font-semibold focus:shadow-outline focus:border-2 bg-blue-500 text-gray-100 border-blue-500 hover:bg-blue-600 hover:border-blue-800 shadow-lg cursor-pointer transition ease-in duration-200"
                            onClick={() => handleOpenFile(item.fileName)}
                          >
                            Open file
                          </button>
                        </td>
                        <td>
                          <button
                            className=" p-2 border-2 rounded-full tracking-wide font-semibold focus:shadow-outline focus:border-2 bg-red-500 text-gray-100 border-red-500 hover:bg-red-600 hover:border-red-800 shadow-lg cursor-pointer transition ease-in duration-200"
                            onClick={() => handleDeleteFile(item.fileHash)}
                          >
                            Delete file
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-lg bg-white border-b h-16">
                      <td>No matching records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Invalid data format received from the server.</p>
          )}
        </div>
      )}
    </div>
  );
}
