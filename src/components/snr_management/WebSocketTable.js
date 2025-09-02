// src/components/WebSocketTable.jsx
import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './WebSocketTable.css';

const WebSocketTable = ({ title, endpoint }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ws = new W3CWebSocket(`wss://your-api.com/ws/${endpoint}`);
    
    ws.onopen = () => {
      console.log(`${title} WebSocket connected`);
    };
    
    ws.onmessage = (e) => {
      const newData = JSON.parse(e.data);
      setData(prev => [...prev, ...newData]);
    };
    
    ws.onerror = (err) => {
      setError('Real-time connection error');
      console.error('WebSocket error:', err);
    };
    
    return () => ws.close();
  }, [endpoint]);

  return (
    <div className="websocket-table">
      <h3>{title}</h3>
      <div className="table-scroller">
        <table>
          <thead>
            <tr>
              {data[0] && Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <div className="ws-error">{error}</div>}
    </div>
  );
};

export default WebSocketTable;
// Note: Replace 'wss://your-api.com/ws/${endpoint}' with your actual WebSocket URL.