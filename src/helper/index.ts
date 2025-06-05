export const StatusBgClass = (status: string) => {
  switch (status) {
    case "Inventory":
      return "bg-blue-50";
    case "Listed":
      return "bg-yellow-50";
    case "Sold":
      return "bg-green-50";
    case "Pending Sale":
      return "bg-orange-50";
    case "Archived":
      return "bg-gray-100";
    case "Acquired":
      return "bg-purple-50";
    default:
      return "bg-white";
  }
};
