import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface ResponseDataItem {
    id: number;
    fileHash: string;
    fileName: string;
    extractedData: string;
    createdData:Date;
    modifiedDate:Date;  // Add other properties as needed
  }

export default function ViewRecords() {
    const navigate=useNavigate()
  const [responseData, setResponseData] = useState<ResponseDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3005/view");
        setResponseData(response.data);
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
        <p>Error: {error.message}</p>
      ) : (
        <div>
          {Array.isArray(responseData) ? (
            <ul>
              {responseData.map((item) => (
                <li key={item.id}>{item.fileName} {item.extractedData}</li>
                
              ))}
            </ul>
          ) : (
            <p>Invalid data format received from the server.</p>
          )}
        </div>
      )}
      <button
      onClick={()=>navigate("/")}
      >
        go back!
      </button>
    </div>
  );
}
