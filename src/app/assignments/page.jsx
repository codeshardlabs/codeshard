"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";
import { getAssignments, submitProject, getSubmissions } from "@/src/lib/actions";
import { ScaleLoader } from "react-spinners";
import { getPrimaryEmailFromClerk } from "@/src/lib/clerk";

// Helper function to format dates consistently
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export default function Assignments() {
  const { user } = useUser();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionForm, setSubmissionForm] = useState({
    assignmentId: "",
    shardId: ""
  })
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [userEmails, setUserEmails] = useState({});

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      toast.error("Failed to load assignments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, assignmentId) => {
    e.preventDefault();
    
    try {
      await submitProject(assignmentId, {
        shardId: submissionForm.shardId
       });
      
      toast.success("Project submitted successfully!");
      setSubmissionForm({ assignmentId: "", shardId: "" });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const handleViewSubmissions = async (assignmentId) => {
    try {
      const data = await getSubmissions(assignmentId);
      setSubmissions(data);
      setSelectedAssignment(assignmentId);
      
      // Fetch emails for all submissions
      const emailPromises = data.map(async (submission) => {
        const email = await getPrimaryEmailFromClerk(submission.userId);
        return { userId: submission.userId, email };
      });
      
      const emails = await Promise.all(emailPromises);
      const emailMap = Object.fromEntries(emails.map(({ userId, email }) => [userId, email]));
      setUserEmails(emailMap);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const handleCloseSubmissions = () => {
    setSelectedAssignment(null);
    setSubmissions([]);
  };

  const renderSubmissions = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Submissions</h2>
            <button
              onClick={handleCloseSubmissions}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {submissions.length === 0 ? (
            <p className="text-gray-400">No submissions yet</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <a href={`mailto:${userEmails[submission.userId]}`} className="font-medium">{userEmails[submission.userId]}</a>
                      <p className="text-sm text-gray-400">
                        Submitted: {formatDate(submission.createdAt)}
                      </p>
                    </div>
                    <a
                      href={`${process.env.NEXT_PUBLIC_HOST_URL}/shard/${submission.shardId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View Shard
                    </a>
                  </div>
                  <p className="text-sm text-gray-300">
                    Shard ID: {submission.shardId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]"><ScaleLoader color="white" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Link
          href="/create-assignment"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Assignment
        </Link>
      </div>

      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 px-4 ${
            activeTab === 'all'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All Assignments
        </button>
        <button
          onClick={() => setActiveTab('created')}
          className={`pb-2 px-4 ${
            activeTab === 'created'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          My Created Assignments
        </button>
      </div>

      <div className="space-y-6">
        {assignments.length === 0 ? (
          <p className="text-gray-400">No assignments found</p>
        ) : (
          assignments.map((assignment) => {
            if (activeTab === 'all') {
              return assignment;
            } else if (activeTab === 'created' && assignment.createdBy === user?.id) {
              return assignment;
            }
            return null;
          }).filter(Boolean).map((assignment) => (
          <div
            key={assignment.id}
            className="border border-gray-700 rounded-lg p-4 bg-gray-800"
          >
            <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
            <p className="text-gray-300 mb-2">{assignment.description}</p>
            <div className="text-sm text-gray-400 mb-4">
              <p>Deadline: {formatDate(assignment.deadline)}</p>
              <p>Requirements: {assignment.requirements}</p>
            </div>

            {assignment.createdBy === user?.id ? (
              <button
                onClick={() => handleViewSubmissions(assignment.id)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                View Submissions
              </button>
            ) : (
              <form onSubmit={(e) => handleSubmit(e, assignment.id)} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Shard ID
                  </label>
                  <input
                    type="text"
                    value={submissionForm.shardId}
                    onChange={(e) =>
                      setSubmissionForm({ ...submissionForm, shardId: e.target.value })
                    }
                    className="w-full p-2 border rounded-md bg-gray-700 border-gray-600"
                    placeholder="Enter your shard ID"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Submit Project
                </button>
              </form>
            )}
          </div>
        )))}
      </div>

      {selectedAssignment && renderSubmissions()}
    </div>
  );
} 