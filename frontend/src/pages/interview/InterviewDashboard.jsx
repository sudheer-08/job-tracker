import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateInterview, getInterviewAnalytics } from "../../api/interview.api";

const InterviewDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getInterviewAnalytics();
        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      }
    };
    fetchAnalytics();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!resumeText || !jobDescription) {
      setError("Please provide both resume text and job description.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await generateInterview({
        resumeText,
        jobDescription,
      });

      if (res.success) {
        navigate(`/interview/${res.session.id}`);
      }
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to generate interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 overflow-auto">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mock Interview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Practice for your next role with AI-generated tailored questions.
          </p>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Avg. Answer Score</h3>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {analytics?.averageScore || 0}
              <span className="text-sm font-normal text-slate-500">/100</span>
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Questions Answered</h3>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {analytics?.totalResponses || 0}
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-slate-800">Start a New Interview Session</h2>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Resume Content
              </label>
              <textarea
                required
                rows={8}
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Target Job Description
              </label>
              <textarea
                required
                rows={8}
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Generating Questions..." : "Generate Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewDashboard;
