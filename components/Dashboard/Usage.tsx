"use client";

import {
  useSchematicEntitlement,
  useSchematicIsPending,
} from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flag";
import Loader from "../common/Loader";
import { Progress } from "../ui/progress";

function Usage({
  featureFlag,
  title,
  className,
}: {
  featureFlag: FeatureFlag;
  title: string;
  className?: string;
}) {
  const isPending = useSchematicIsPending();
  const {
    featureAllocation,
    featureUsage,
    featureUsageExceeded,
    value: isFeatureEnabled,
  } = useSchematicEntitlement(featureFlag);

  const hasUsedAllTokens =
    featureAllocation && featureUsage && featureUsage >= featureAllocation;

  if (isPending) return <Loader />;

  if (!isFeatureEnabled) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 opacity-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h2>
        </div>
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-gray-500 dark:text-gray-300">
            Feature Disabled
          </span>
        </div>

        <div className="relative">
          <Progress
            value={0}
            className="h-3 rounded-full bg-gray-100 dark:bg-gray-600"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Upgrade to use this feature
          </p>
        </div>
      </div>
    );
  }

  if (hasUsedAllTokens || featureUsageExceeded) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center text-sm py-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="px-4 py-2 bg-red-50 rounded-lg dark:bg-red-900">
          <span className="font-medium text-red-700 dark:text-red-300">
            {featureUsage}
          </span>
          <span className="text-red-400 mx-2 dark:text-red-500">/</span>
          <span className="font-medium text-red-700 dark:text-red-300">
            {featureAllocation}
          </span>
        </div>

        <div className="relative">
          <Progress
            value={100}
            className="h3 rounded-full bg-gray-100 [&>*]:bg-red-600"
          />
          <p className="text-sm text-red-600 mt-2">
            You have used all your tokens, please upgrade your plan.
          </p>
        </div>
      </div>
    );
  }

  // Calculate the percentage of usage
  const progress = ((featureUsage || 0) / (featureAllocation || 1)) * 100;

  const getProgressColor = (percent: number) => {
    if (percent < 50) return "bg-green-500";
    if (percent < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const progressColor = getProgressColor(progress);

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {featureUsage}
          </span>
          <span className="text-gray-400 dark:text-gray-500 mx-2">/</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {featureAllocation}
          </span>
        </div>
      </div>

      <div className="relative">
        <Progress
          value={progress}
          className={`h-3 rounded-full bg-gray-100 dark:bg-gray-600 ${progressColor}`}
        />

        {progress >= 100 ? (
          <p className="text-sm text-red-600 mt-2">
            You have used all your tokens, please upgrade your plan.
          </p>
        ) : progress >= 80 ? (
          <p className="text-sm text-yellow-600 mt-2">
            You are about to reach your limit, please upgrade your plan.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default Usage;
