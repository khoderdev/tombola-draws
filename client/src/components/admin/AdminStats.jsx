import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function AdminStats({ stats }) {
  const { user } = useAuth();

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If stats is not available, show loading
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If stats data is empty
  if (!stats.totalUsers && !stats.activeDraws && !stats.totalRevenue && !stats.recentActivity?.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-neutral-500">
        No statistics available
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      change: stats.userGrowth || 0,
      changeType: (stats.userGrowth || 0) >= 0 ? "increase" : "decrease",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      title: "Active Draws",
      value: stats.activeDraws || 0,
      change: stats.drawGrowth || 0,
      changeType: (stats.drawGrowth || 0) >= 0 ? "increase" : "decrease",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Total Revenue",
      value: stats.totalRevenue ? `$${stats.totalRevenue.toFixed(2)}` : "$0.00",
      change: stats.revenueGrowth || 0,
      changeType: (stats.revenueGrowth || 0) >= 0 ? "increase" : "decrease",
      prefix: "$",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Conversion Rate",
      value: stats.conversionRate ? `${stats.conversionRate}%` : "0%",
      change: stats.conversionRateChange || 0,
      changeType:
        (stats.conversionRateChange || 0) >= 0 ? "increase" : "decrease",
      suffix: "%",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-lg bg-white dark:bg-neutral-800 px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-blue-500 p-3 text-white">
                  {card.icon}
                </div>
                <p className="ml-16 truncate text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {card.title}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {card.prefix}
                  {card.value}
                  {card.suffix}
                </p>
                {card.change !== undefined && (
                  <p
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      card.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {card.changeType === "increase" ? "+" : ""}
                    {card.change}%
                  </p>
                )}
              </dd>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="rounded-lg bg-white dark:bg-neutral-800 shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="mt-2">
              <div className="flow-root">
                {!Array.isArray(stats.recentActivity) || stats.recentActivity.length === 0 ? (
                  <p className="text-neutral-500 dark:text-neutral-400">No recent activity</p>
                ) : (
                  <ul className="-mb-8">
                    {stats.recentActivity.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== stats.recentActivity.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-neutral-200 dark:bg-neutral-700"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-neutral-800 text-white ${
                                  activity.type === "New User"
                                    ? "bg-blue-500"
                                    : activity.type === "Ticket Purchase"
                                    ? "bg-green-500"
                                    : "bg-purple-500"
                                }`}
                              >
                                {activity.type === "New User" ? (
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                ) : activity.type === "Ticket Purchase" ? (
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                )}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                  {activity.title}
                                </p>
                                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                                  {activity.description}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                {new Date(activity.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

AdminStats.propTypes = {
  stats: PropTypes.shape({
    totalUsers: PropTypes.number,
    activeDraws: PropTypes.number,
    totalRevenue: PropTypes.number,
    userGrowth: PropTypes.number,
    drawGrowth: PropTypes.number,
    conversionRate: PropTypes.number,
    conversionRateChange: PropTypes.number,
    recentActivity: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
      })
    ),
  }),
};
