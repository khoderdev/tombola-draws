import PropTypes from "prop-types";

export default function AdminStats({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: "Total Users",
      value: Number(stats.totalUsers || 0),
      change: Number(stats.userGrowth || 0),
      changeType: Number(stats.userGrowth || 0) >= 0 ? "increase" : "decrease",
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
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "Active Draws",
      value: Number(stats.activeDraws || 0),
      change: Number(stats.drawGrowth || 0),
      changeType: Number(stats.drawGrowth || 0) >= 0 ? "increase" : "decrease",
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
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      ),
    },
    {
      title: "Total Revenue",
      value: `$${Number(stats.totalRevenue || 0).toLocaleString()}`,
      change: Number(stats.revenueGrowth || 0),
      changeType: Number(stats.revenueGrowth || 0) >= 0 ? "increase" : "decrease",
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
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Conversion Rate",
      value: `${Number(stats.conversionRate || 0).toFixed(1)}%`,
      change: Number(stats.conversionGrowth || 0),
      changeType: Number(stats.conversionGrowth || 0) >= 0 ? "increase" : "decrease",
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
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-neutral-700 overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-md text-white bg-blue-500 p-3">
                    {card.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-800 dark:text-gray-100 truncate">
                      {card.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold ">
                        {card.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          card.changeType === "increase"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {card.changeType === "increase" ? (
                          <svg
                            className="w-5 h-5 flex-shrink-0 self-center"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 flex-shrink-0 self-center"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        )}
                        <span className="sr-only">
                          {card.changeType === "increase"
                            ? "Increased"
                            : "Decreased"}{" "}
                          by
                        </span>
                        {Math.abs(card.change)}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium mb-4">Recent Activity</h3>
        <div className="bg-white dark:bg-neutral-700 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-neutral-400">
            {stats.recentActivity?.map((activity) => (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-500 truncate">
                      {activity.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {activity.type}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="text-sm ">
                        {activity.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm sm:mt-0">
                      <p>
                        {new Date(activity.timestamp).toLocaleDateString()} at{" "}
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

AdminStats.propTypes = {
  stats: PropTypes.shape({
    totalUsers: PropTypes.number.isRequired,
    userGrowth: PropTypes.number.isRequired,
    activeDraws: PropTypes.number.isRequired,
    drawGrowth: PropTypes.number.isRequired,
    totalRevenue: PropTypes.number.isRequired,
    revenueGrowth: PropTypes.number.isRequired,
    conversionRate: PropTypes.number.isRequired,
    conversionGrowth: PropTypes.number.isRequired,
    recentActivity: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};
