import React, { useState, useEffect } from 'react';
import { insertRecord, fetchRecords, updateRecord, deleteRecord } from './services/database';

export default function TestSupabase() {
  const [status, setStatus] = useState('Initializing Supabase Test...');
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
    console.log(msg);
  };

  useEffect(() => {
    const runTest = async () => {
      try {
        const testTableName = 'test_integration'; // Assuming this table exists, or it will fail with 404/401
        
        addLog('Attempting to fetch records...');
        // We will just do a simple fetch to see if connection is valid
        const data = await fetchRecords(testTableName);
        addLog('Fetch successful! Data: ' + JSON.stringify(data));
        
        setStatus('✅ Supabase Connection Successful!');
      } catch (err) {
        addLog('Error: ' + err.message);
        setStatus('❌ Supabase Test Failed: ' + err.message);
      }
    };
    
    runTest();
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 10, left: 10, zIndex: 9999, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '1rem', borderRadius: '8px', fontSize: '12px' }}>
      <h3>{status}</h3>
      <ul style={{ marginTop: '10px', opacity: 0.8 }}>
        {logs.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  );
}
