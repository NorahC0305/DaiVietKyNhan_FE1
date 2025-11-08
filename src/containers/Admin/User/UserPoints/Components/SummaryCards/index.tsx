type Props = {
  average: number;
  highest: number;
  highUsers: number;
  isLoading?: boolean;
};

const SummaryCards = ({
  average,
  highest,
  highUsers,
  isLoading = false,
}: Props) => {
  const items = [
    { label: "Điểm trung bình", value: average },
    { label: "Điểm cao nhất", value: highest },
    { label: "Người dùng có điểm cao", value: highUsers },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 min-h-32">
      {items.map((i) => (
        <div
          key={i.label}
          className="rounded-lg border border-gray-300 bg-admin-primary p-4 font-bold"
        >
          <p className="text-sm text-gray-600">{i.label}</p>
          <p className="pt-6 mt-1 text-2xl font-bold text-gray-900">
            {isLoading ? "..." : i.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
