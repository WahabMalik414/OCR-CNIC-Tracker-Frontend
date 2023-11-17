import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3005/view");
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
    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {(error as Error).message}</p>
      ) : (
        <div className="flex p-10 bg-yellow-500">
          {Array.isArray(responseData) ? (
            <div className="flex w-full bg-yellow-200 relative overflow-x-auto">
              <table className="w-full text-sm text-center text-gray-500">
                <caption className="p-5 text-5xl font-semibold text-gray-900 bg-white">
                  <div className="flex items-center">
                    <button
                      className="bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:shadow-outline focus:border-2 focus:border-blue-800 hover:bg-blue-600 hover:border-2 hover:border-blue-800 shadow-lg cursor-pointer transition ease-in duration-200"
                      onClick={() => navigate("/")}
                    >
                      back
                    </button>
                    <p className="mx-auto">List of unfit candidates</p>
                  </div>
                </caption>
                <thead className="text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      File Hash
                    </th>
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
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {responseData.map((item) => (
                    <tr className="text-lg bg-white border-b h-16">
                      <td key={item.id}>{item.id}</td>
                      <td key={item.id}>{item.fileHash}</td>
                      <td key={item.id}>{item.fileName}</td>
                      <td key={item.id}>{item.filePath}</td>
                      <td key={item.id}>{item.extractedData}</td>
                      <td key={item.id}>{item.createdDate.toString()}</td>
                      {/* <td key={item.id}>{item.modifiedDate.toString()}</td> */}
                      <td key={item.id}>
                        <a>Open file</a>
                      </td>
                    </tr>
                  ))}
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
