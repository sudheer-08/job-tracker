import Header from "../components/layout/Header";
import StatCard from "../components/dashboard/StatCard";
import StatusDistributionChart from "../components/dashboard/StatusDistributionChart";
import ApplicationsByMonthChart from "../components/dashboard/ApplicationsByMonthChart";
import PipelineFunnelChart from "../components/dashboard/PipelineFunnelChart";
import FollowUpsCard from "../components/dashboard/FollowUpsCard";
import RecentActivityTable from "../components/dashboard/RecentActivityTable";
import { useDashboardOverview } from "../hooks/useDashboard";

const Dashboard = () => {
  const { data, isLoading, isError } = useDashboardOverview();

  return (
    <>
      <Header
        title="Overview"
        subtitle="Your career pipeline at a glance"
      />

      <main className="flex-1 space-y-6 p-8">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            Loading dashboard...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center text-sm text-red-600">
            Failed to load dashboard data.
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard
                label="Total Applications"
                value={data.stats.totalApplications}
                badge={`${data.stats.activeApplications} active`}
                accent="bg-sky-500"
              />
              <StatCard
                label="Interviews"
                value={data.stats.interviews}
                badge="In progress"
                badgeColor="bg-violet-100 text-violet-700"
                accent="bg-violet-500"
              />
              <StatCard
                label="Offers"
                value={data.stats.offers}
                badge="Success"
                badgeColor="bg-emerald-100 text-emerald-700"
                accent="bg-emerald-500"
              />
              <StatCard
                label="Rejections"
                value={data.stats.rejected}
                badge="Closed"
                badgeColor="bg-red-100 text-red-600"
                accent="bg-red-400"
              />
              <StatCard
                label="Follow-ups Due"
                value={data.stats.followUpsDue}
                badge={data.stats.followUpsDue > 0 ? "Action needed" : "Clear"}
                badgeColor={
                  data.stats.followUpsDue > 0
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald-100 text-emerald-700"
                }
                accent="bg-amber-400"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <PipelineFunnelChart data={data.pipelineFunnel} />
              </div>
              <FollowUpsCard followUps={data.followUps} followUpsDue={data.stats.followUpsDue} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <StatusDistributionChart data={data.statusDistribution} />
              <ApplicationsByMonthChart data={data.applicationsByMonth} />
            </div>

            <RecentActivityTable activities={data.recentActivity} />
          </>
        )}
      </main>
    </>
  );
};

export default Dashboard;
