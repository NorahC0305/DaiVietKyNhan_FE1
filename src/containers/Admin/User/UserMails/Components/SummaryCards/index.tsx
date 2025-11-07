type Props = { total: number; unread: number; read: number; replied: number };

const SummaryCards = ({ total, unread, read, replied }: Props) => {
  const items = [
    { label: "Tổng thư", value: total },
    { label: "Chưa đọc", value: unread },
    { label: "Đã đọc", value: read },
    { label: "Đã trả lời", value: replied },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 min-h-32">
      {items.map((i) => (
        <div
          key={i.label}
          className="rounded-lg border border-gray-300 bg-admin-primary p-4 font-bold"
        >
          <p className="text-sm text-gray-600">{i.label}</p>
          <p className="pt-6 mt-1 text-2xl font-bold text-gray-900">
            {i.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
