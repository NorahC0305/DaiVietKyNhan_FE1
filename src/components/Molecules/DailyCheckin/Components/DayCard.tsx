import React, { memo } from "react";
import { Check } from "lucide-react";

const DayCard: React.FC<ICOMPONENTS.DayCardProps> = memo(({ day, variant }) => {
  // Extract day number directly from the date string
  // day.day is now an ISO date string like "2025-01-20"
  const getDayNumber = () => {
    try {
      const date = new Date(day.day);
      return {
        dayNumber: date.getDate(),
        month: `Th${date.getMonth() + 1}`,
      };
    } catch (error) {
      // Fallback: calculate from current week if parsing fails
      const today = new Date();
      const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const mondayIndex = currentDay === 0 ? 6 : currentDay - 1; // Convert to Monday = 0 format

      // Get day index from day string (T2 = 0, T3 = 1, etc.)
      const dayIndexMap: { [key: string]: number } = {
        T2: 0,
        T3: 1,
        T4: 2,
        T5: 3,
        T6: 4,
        T7: 5,
        CN: 6,
      };

      const dayIndex = dayIndexMap[day.day] ?? 0;
      const monday = new Date(today);
      monday.setDate(today.getDate() - mondayIndex + dayIndex);

      return {
        dayNumber: monday.getDate(),
        month: `Th${monday.getMonth() + 1}`,
      };
    }
  };

  const { dayNumber, month } = getDayNumber();

  const baseClasses =
    variant === "mobile"
      ? `relative bg-gradient-to-br rounded-full p-0 text-center transition-all duration-300 touch-action-manipulation`
      : `w-[38px] h-[38px] lg:w-[50px] lg:h-[50px] bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg p-1 sm:p-1.5 md:p-2 text-center flex flex-col justify-between`;

  const statusClasses = day.checked
    ? variant === "mobile"
      ? "from-green-100 to-green-200"
      : "bg-gradient-to-b from-amber-200 to-amber-300"
    : variant === "mobile"
      ? "from-gray-50 to-gray-100"
      : "";

  const specialClasses = day.isSpecial
    ? variant === "mobile"
      ? "from-yellow-100 to-yellow-200"
      : "bg-gradient-to-b from-yellow-100 to-amber-50"
    : "";

  const backdropStyle = {
    backgroundImage: "url('https://res.cloudinary.com/dauhpllo7/image/upload/v1763399320/Thie%CC%82%CC%81t_ke%CC%82%CC%81_chu%CC%9Ba_co%CC%81_te%CC%82n_21_1_os6dxe.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  const heightStyle =
    variant === "mobile"
      ? { height: "200px", minHeight: "200px" }
      : { height: "100px", minHeight: "100px" };

  return (
    <div
      className={`${baseClasses} ${statusClasses} ${specialClasses}`}
      style={{ ...backdropStyle, ...heightStyle }}
      role="gridcell"
      aria-label={`${day.label}, ${day.checked ? "completed" : "not completed"
        }`}
    >
      {/* Day name (T4) - top */}
      <div className="text-xs font-medium text-gray-700 mb-1">{day.label}</div>

      {/* Day number (22) - middle - only show day number */}
      <div
        className={`${variant === "mobile" ? "text-2xl" : "text-lg"
          } font-bold text-gray-800 mb-1`}
      >
        {dayNumber}
      </div>

      {/* Month (Th10) - between day name and day number */}
      <div className="text-[10px] text-gray-600 mb-1">{month}</div>

      {/* Check button - bottom - white circle with gray border like in image */}
      <div className="flex justify-center mt-auto">
        {day.checked ? (
          <div
            className={`${variant === "mobile"
              ? "w-6 h-6"
              : "w-3 h-3"
              } bg-red-800 rounded-full flex items-center justify-center`}
          >
            <Check
              className={`${variant === "mobile"
                ? "w-4 h-4"
                : "w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3"
                } text-white stroke-[2]`}
            />
          </div>
        ) : (
          <div
            className={`${variant === "mobile"
              ? "w-6 h-6"
              : "w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3"
              } rounded-full bg-white flex items-center justify-center`}
          >
            <div className="w-1 h-1 rounded-full bg-gray-200"></div>
          </div>
        )}
      </div>

      {variant === "mobile" && day.isSpecial && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
      )}
    </div>
  );
});

DayCard.displayName = "DayCard";
export default DayCard;
