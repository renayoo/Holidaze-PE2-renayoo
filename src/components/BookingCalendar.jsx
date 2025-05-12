import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BookingCalendar({ selectedDates, onDateChange, bookedRanges }) {
  const getExcludedDates = () => {
    return bookedRanges.flatMap((range) => {
      const dates = [];
      let current = new Date(range.start);
      while (current <= range.end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    });
  };

  const excludedDates = getExcludedDates();

  const dayClassName = (date) => {
    const isExcluded = excludedDates.some(
      (excluded) => excluded.toDateString() === date.toDateString()
    );
    return isExcluded ? "react-datepicker__day--disabled custom-disabled" : undefined;
  };

  return (
    <div className="space-y-2">
      <p className="font-semibold">Select booking dates:</p>
      <div className="flex gap-4">
        <DatePicker
          selected={selectedDates.dateFrom}
          onChange={(date) => onDateChange({ ...selectedDates, dateFrom: date })}
          selectsStart
          startDate={selectedDates.dateFrom}
          endDate={selectedDates.dateTo}
          excludeDates={excludedDates}
          dayClassName={dayClassName}
          placeholderText="From"
          className="border p-2 rounded"
        />

        <DatePicker
          selected={selectedDates.dateTo}
          onChange={(date) => onDateChange({ ...selectedDates, dateTo: date })}
          selectsEnd
          startDate={selectedDates.dateFrom}
          endDate={selectedDates.dateTo}
          minDate={selectedDates.dateFrom}
          excludeDates={excludedDates}
          dayClassName={dayClassName}
          placeholderText="To"
          className="border p-2 rounded"
        />
      </div>

      <style>
        {`
          .custom-disabled {
            color: #ccc !important;
            text-decoration: line-through;
          }
        `}
      </style>
    </div>
  );
}

export default BookingCalendar;



