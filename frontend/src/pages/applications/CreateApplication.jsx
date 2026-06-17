import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import ApplicationForm, {
  emptyApplicationForm,
  formToPayload,
} from "../../components/applications/ApplicationForm";
import { useCreateApplication } from "../../hooks/useApplications";

const CreateApplication = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyApplicationForm);
  const [error, setError] = useState("");
  const createMutation = useCreateApplication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createMutation.mutateAsync(formToPayload(form));
      navigate("/applications");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create application.");
    }
  };

  return (
    <>
      <Header
        title="New Application"
        subtitle="Add a new job application to your pipeline"
        action={
          <Link
            to="/applications"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to list
          </Link>
        }
      />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <ApplicationForm
            form={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            submitting={createMutation.isPending}
            submitLabel="Create Application"
            error={error}
          />
        </div>
      </main>
    </>
  );
};

export default CreateApplication;
