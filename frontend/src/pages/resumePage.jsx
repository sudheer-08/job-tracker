import React, { useMemo, useState } from "react";
import { analyzeResume } from "../api/resume.api";

const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(() => {
    return file && jobDescription.trim().length > 0;
  }, [file, jobDescription]);

  const handleUpload = async () => {
    setError(null);
    setResult(null);

    if (!file) {
      setError("Please upload a resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await analyzeResume(file, jobDescription);
      setResult(res);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const analysis = result?.success ? result.analysis : null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 overflow-auto">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-2xl font-bold text-slate-800">
          Resume Analyzer
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Upload a resume PDF and paste a job description to get an AI-powered
          match analysis.
        </p>

        {/* Input card */}
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            {/* File upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Resume (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-500 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {file && (
                <p className="mt-1 text-xs text-slate-400">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* Job description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Job Description
              </label>
              <textarea
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleUpload}
              disabled={!canSubmit || loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-5">
            {/* Match Score */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-slate-800">
                Match Score
              </h2>
              <div className="mb-1 flex items-baseline gap-2">
                <span
                  className={`text-4xl font-bold ${getScoreColor(
                    analysis.matchScore
                  )}`}
                >
                  {analysis.matchScore}%
                </span>
                <span className="text-sm text-slate-500">
                  {analysis.matchScore >= 80
                    ? "Great match!"
                    : analysis.matchScore >= 60
                    ? "Moderate match"
                    : "Low match"}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
                    analysis.matchScore
                  )}`}
                  style={{ width: `${analysis.matchScore}%` }}
                />
              </div>
            </div>

            {/* Strengths */}
            {analysis.strengths?.length > 0 && (
              <div className="rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-emerald-800">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Strengths
                </h2>
                <ul className="space-y-1.5">
                  {analysis.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="mt-0.5 text-emerald-500">&#10003;</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Skills */}
            {analysis.missingSkills?.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-amber-800">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Missing Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Tips */}
            {analysis.improvementTips?.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-800">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Improvement Tips
                </h2>
                <ul className="space-y-2">
                  {analysis.improvementTips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePage;