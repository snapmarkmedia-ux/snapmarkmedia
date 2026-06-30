import React, { useState, useEffect } from 'react';
import { 
  createReview, 
  fetchApprovedReviews, 
  fetchPendingReviews, 
  approveReview, 
  deleteReview,
  uploadReviewImage 
} from './services/reviews';

export default function TestReviews() {
  const [logs, setLogs] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);

  const addLog = (msg, success = true) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${success ? '✅' : '❌'} ${msg}`, ...prev]);
  };

  // Test 1: Fetch Approved Reviews (Public Access)
  const testFetchApproved = async () => {
    try {
      addLog('Fetching approved reviews...');
      const data = await fetchApprovedReviews();
      setApprovedReviews(data);
      addLog(`Fetched ${data.length} approved reviews successfully.`);
    } catch (err) {
      addLog(`Failed to fetch approved reviews: ${err.message}`, false);
    }
  };

  // Test 2: Fetch Pending Reviews (Admin Only)
  const testFetchPending = async () => {
    try {
      addLog('Attempting to fetch pending reviews (Admin Auth)...');
      const data = await fetchPendingReviews();
      setPendingReviews(data);
      addLog(`Fetched ${data.length} pending reviews successfully.`);
    } catch (err) {
      addLog(`Failed (Expected if not admin): ${err.message}`, false);
    }
  };

  // Test 3: Insert Review (Public)
  const testInsertReview = async () => {
    try {
      addLog('Submitting a valid test review...');
      const mockReview = {
        full_name: 'John Doe',
        profession: 'Director',
        company: 'Vapor Wave Inc.',
        service: 'Reels Editing',
        rating: 5,
        review: 'This is a test review that satisfies the minimum 20 characters length constraint.',
        approved: false // Starts as pending
      };
      const result = await createReview(mockReview);
      addLog(`Review submitted successfully! ID: ${result[0]?.id}`);
    } catch (err) {
      addLog(`Failed to submit review: ${err.message}`, false);
    }
  };

  // Test 4: Insert Invalid Review (Validation Check)
  const testInsertInvalid = async () => {
    try {
      addLog('Attempting to submit invalid review (Rating 6, too short)...');
      const mockReview = {
        full_name: 'Testy Tester',
        profession: 'Tester',
        service: 'Design',
        rating: 6, // Violates check
        review: 'Too short', // Violates check
        approved: false
      };
      await createReview(mockReview);
      addLog('Failed: Review inserted (DB constraints did not catch it!)', false);
    } catch (err) {
      addLog(`Success! DB rejected invalid insert: ${err.message}`);
    }
  };

  // Test 5: Storage Upload (Admin Only)
  const testStorageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      addLog(`Uploading image ${file.name} (Admin Auth)...`);
      const url = await uploadReviewImage(file);
      addLog(`Uploaded successfully! Public URL: ${url}`);
    } catch (err) {
      addLog(`Upload failed (Expected if not admin): ${err.message}`, false);
    }
  };

  useEffect(() => {
    testFetchApproved();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-h-[85vh] w-[380px] flex-col rounded-2xl border border-white/10 bg-black/95 p-5 text-white shadow-2xl backdrop-blur-lg">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-heading text-lg italic text-[#00f0ff]">Reviews Diagnostics</h3>
        <button onClick={() => setLogs([])} className="text-[10px] text-white/50 hover:text-white">Clear Logs</button>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2 py-4">
        <button onClick={testFetchApproved} className="rounded-lg bg-white/5 py-1.5 text-xs font-semibold hover:bg-white/10">Fetch Approved</button>
        <button onClick={testFetchPending} className="rounded-lg bg-white/5 py-1.5 text-xs font-semibold hover:bg-white/10">Fetch Pending</button>
        <button onClick={testInsertReview} className="rounded-lg bg-blue-500/25 py-1.5 text-xs font-semibold hover:bg-blue-500/40 text-blue-300">Submit Review</button>
        <button onClick={testInsertInvalid} className="rounded-lg bg-red-500/25 py-1.5 text-xs font-semibold hover:bg-red-500/40 text-red-300">Test Constraint</button>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Upload Photo (Admin)</label>
        <input type="file" onChange={testStorageUpload} className="text-xs text-white/70 file:mr-2 file:rounded file:border-0 file:bg-white/10 file:px-2 file:py-1 file:text-xs file:text-white hover:file:bg-white/20" />
      </div>

      {/* Logs Console */}
      <div className="mt-4 flex-1 overflow-y-auto rounded-lg bg-black/40 p-2 font-mono text-[10px] leading-relaxed">
        {logs.length === 0 ? (
          <span className="text-white/30">Ready for diagnostics...</span>
        ) : (
          logs.map((log, idx) => <div key={idx}>{log}</div>)
        )}
      </div>

      {/* Stats */}
      <div className="mt-3 flex justify-between text-[10px] text-white/40 border-t border-white/10 pt-2">
        <span>Approved fetched: {approvedReviews.length}</span>
        <span>Pending fetched: {pendingReviews.length}</span>
      </div>
    </div>
  );
}
