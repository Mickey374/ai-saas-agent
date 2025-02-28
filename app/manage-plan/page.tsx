import SchematicComponent from "@/components/schematic/SchematicComponent";

const ManagePlan = () => {
  return (
    <div className="container mx-auto p-4 md:p-0">
      <h1 className="text-2xl font-semibold mb-4 my-8 dark:text-white">
        Manage Plan
      </h1>
      <p className="text-gray-600 mb-8 dark:text-gray-400">
        Manage Your Billings and Subscriptions Here
      </p>

      <SchematicComponent componentId="cmpn_CNnhzFbickp" />
    </div>
  );
};

export default ManagePlan;
