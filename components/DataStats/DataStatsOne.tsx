import { Banknote, ChartBar, TimerIcon } from "lucide-react";
import React from "react";

const DataStatsOne = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 2xl:gap-7.5">
      {[
        {
          title: "Avg. Client Rating",
          value: "7.8/10",
          change: "+2.5%",
          changeColor: "text-green-500",
          changeIcon: "#10B981",
          icon: ChartBar,
        },
        {
          title: "Average Time Spent",
          value: "7.8/10",
          change: "-1.5%",
          changeColor: "text-red-500",
          changeIcon: "#FB5454",
          icon: TimerIcon,
        },
        {
          title: "Total Subscription",
          value: "5.2k",
          change: "+5.1%",
          changeColor: "text-green-500",
          changeIcon: "#10B981",
          icon: Banknote,
        },
      ].map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-strokedark dark:bg-gray-800 dark:text-white md:p-6 xl:p-7.5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <h4 className="text-lg font-medium">{stat.title}</h4>
          </div>
          <h3 className="mt-5 text-2xl font-bold text-black dark:text-white">
            {stat.value}
          </h3>
          <p className="flex items-center gap-1 text-sm font-medium mt-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.0158 4.74683H9.4939C9.2314 4.74683 9.01265 4.96558 9.01265 5.22808C9.01265 5.49058 9.2314 5.70933 9.4939 5.70933H11.6595L8.85953 7.59058C8.75015 7.67808 8.59703 7.67808 8.46578 7.59058L5.57828 5.68745C5.1189 5.3812 4.55015 5.3812 4.09078 5.68745L0.722027 7.94058C0.503277 8.0937 0.437652 8.39995 0.590777 8.6187C0.678277 8.74995 0.831402 8.83745 1.0064 8.83745C1.0939 8.83745 1.20328 8.81558 1.2689 8.74995L4.65953 6.49683C4.7689 6.40933 4.92203 6.40933 5.05328 6.49683L7.94078 8.42183C8.40015 8.72808 8.9689 8.72808 9.42828 8.42183L12.5127 6.3437V8.77183C12.5127 9.03433 12.7314 9.25308 12.9939 9.25308C13.2564 9.25308 13.4752 9.03433 13.4752 8.77183V5.22808C13.5189 4.96558 13.2783 4.74683 13.0158 4.74683Z"
                fill={stat.changeIcon}
              />
            </svg>
            <span className={stat.changeColor}>{stat.change}</span>
            <span>than last week</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default DataStatsOne;
