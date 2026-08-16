import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInterviewSession, submitInterviewAnswer } from "../../api/interview.api";

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Keep track of evaluated answers
  // Map of questionId -> evaluation result
  const [evaluations, setEvaluations] = useState({});

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await getInterviewSession(id);
        if (res.success) {
          setSession(res.session);
        }
      } catch (err) {
        setError("Failed to load interview session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  const currentQuestion = session?.questions?.[currentQuestionIndex];
  const isEvaluated = currentQuestion ? !!evaluations[currentQuestion.id] : false;
  const currentEvaluation = currentQuestion ? evaluations[currentQuestion.id] : null;

  const handleSubmit = async () => {
    if (!answerContent.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await submitInterviewAnswer(currentQuestion.id, answerContent);
      if (res.success) {
        setEvaluations(prev => ({
          ...prev,
          [currentQuestion.id]: res.evaluation
        }));
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerContent("");
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswerContent("");
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-slate-500">Loading session...</div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 space-y-4">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => navigate('/interview')}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!session || !currentQuestion) {
    return <div className="p-6">No questions available.</div>;
  }

  return (
    <div className="p-6 overflow-auto">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Mock Interview</h1>
            <p className="mt-1 text-sm text-slate-500">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </p>
          </div>
          <button
            onClick={() => navigate('/interview')}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            End Interview
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Question Card */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex gap-2">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 border border-indigo-200">
              {currentQuestion.category}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border
              ${currentQuestion.difficulty === 'EASY' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-red-50 text-red-700 border-red-200'}`}
            >
              {currentQuestion.difficulty}
            </span>
            {currentQuestion.concept && (
              <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                {currentQuestion.concept}
              </span>
            )}
          </div>

          <h2 className="text-xl font-medium text-slate-800">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Area OR Evaluation Result */}
        {!isEvaluated ? (
          <div className="space-y-4">
            <textarea
              rows={6}
              placeholder="Type your answer here..."
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              disabled={submitting}
              className="w-full resize-y rounded-md border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:opacity-50"
            />

            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || submitting}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={handleSubmit}
                disabled={!answerContent.trim() || submitting}
                className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? "Evaluating..." : "Submit Answer"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Evaluation Result</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Score</span>
                  <span className={`text-xl font-bold ${
                    currentEvaluation.score >= 80 ? 'text-emerald-600' :
                    currentEvaluation.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {currentEvaluation.score}/100
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">Feedback</h4>
                  <p className="text-slate-800 whitespace-pre-wrap">{currentEvaluation.feedback}</p>
                </div>

                {currentEvaluation.strengths?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-emerald-600 mb-1 flex items-center gap-1">
                      <span>✓</span> Strengths
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {currentEvaluation.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentEvaluation.missingConcepts?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-amber-600 mb-1 flex items-center gap-1">
                      <span>!</span> Missing Concepts
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {currentEvaluation.missingConcepts.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentEvaluation.improvedAnswer && (
                  <div className="rounded-md bg-indigo-50 p-4 border border-indigo-100">
                    <h4 className="text-sm font-semibold text-indigo-800 mb-2">Ideal Answer Framework</h4>
                    <p className="text-sm text-indigo-900 whitespace-pre-wrap">
                      {currentEvaluation.improvedAnswer}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === session.questions.length - 1}
                className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {currentQuestionIndex === session.questions.length - 1 ? "Finish" : "Next Question"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
