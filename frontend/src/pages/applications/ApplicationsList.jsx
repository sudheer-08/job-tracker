import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import ApplicationTable from "../../components/applications/ApplicationTable";
import Pagination from "../../components/applications/Pagination";
import { APPLICATION_STATUSES } from "../../constants/application";
import { useApplications, useDeleteApplication } from "../../hooks/useApplications";

const ApplicationsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const params = {
    page,
    limit: 10,
    sort: "createdAt",
    order: "desc",
    ...(search && { search }),
    ...(status && { status }),
    ...(source && { source }),
  };

  const { data, isLoading, isError } = useApplications(params);
  const deleteMutation = useDeleteApplication();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Move this application to trash?")) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Header
        title="Applications"
        subtitle="Manage and track all your job applications"
        action={
          <Link
            to="/applications/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            + New Application
          </Link>
        }
      />

      <main className="flex-1 p-8">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Search</label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search company or job title..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 lg:w-40"
                >
                  <option value="">All statuses</option>
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Source</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setPage(1);
                  }}
                  placeholder="e.g. LINKEDIN"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 lg:w-40"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Search
              </button>
            </form>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">Loading applications...</div>
          ) : isError ? (
            <div className="px-6 py-12 text-center text-sm text-red-500">
              Failed to load applications.
            </div>
          ) : (
            <>
              <ApplicationTable
                applications={data?.applications}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
              <Pagination
                page={data?.page || 1}
                pages={data?.pages || 0}
                total={data?.total || 0}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ApplicationsList;
