import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import ApplicationForm, {
  applicationToForm,
  formToPayload,
} from "../../components/applications/ApplicationForm";
import { useApplication, useUpdateApplication } from "../../hooks/useApplications";

const EditApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: application, isLoading, isError } = useApplication(id);
  const updateMutation = useUpdateApplication(id);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (application) {
      setForm(applicationToForm(application));
    }
  }, [application]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateMutation.mutateAsync(formToPayload(form));
      navigate("/applications");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update application.");
    }
  };

  return (
    <>
      <Header
        title="Edit Application"
        subtitle={application ? `${application.companyName} — ${application.jobTitle}` : ""}
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
          {isLoading || !form ? (
            <p className="text-sm text-slate-500">Loading application...</p>
          ) : isError ? (
            <p className="text-sm text-red-500">Application not found.</p>
          ) : (
            <ApplicationForm
              form={form}
              onChange={setForm}
              onSubmit={handleSubmit}
              submitting={updateMutation.isPending}
              submitLabel="Save Changes"
              error={error}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default EditApplication;
