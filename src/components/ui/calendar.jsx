import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function Calendar({ selected, onSelect, mode = "single", numberOfMonths = 1 }) {
  const today = new Date()
  const [month, setMonth] = React.useState(today.getMonth())
  const [year, setYear] = React.useState(today.getFullYear())

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day)

    if (mode === "single") {
      onSelect(clickedDate)
    } else if (mode === "range") {
      if (!selected?.from || (selected.from && selected.to)) {
        // Start new range
        onSelect({ from: clickedDate, to: null })
      } else if (clickedDate < selected.from) {
        // If clicked before from → swap
        onSelect({ from: clickedDate, to: selected.from })
      } else {
        // End range
        onSelect({ ...selected, to: clickedDate })
      }
    }
  }

  const isInRange = (day) => {
    if (mode !== "range" || !selected?.from || !selected?.to) return false
    const d = new Date(year, month, day)
    return d >= selected.from && d <= selected.to
  }

  const isSelected = (day) => {
    const d = new Date(year, month, day)
    if (mode === "single") {
      return selected && d.toDateString() === selected.toDateString()
    } else if (mode === "range") {
      return selected?.from?.toDateString() === d.toDateString() ||
             selected?.to?.toDateString() === d.toDateString()
    }
    return false
  }


  return (
    <div className="w-80 rounded-2xl border bg-white shadow-lg p-4">
      {/* Header with arrows and selectors */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex gap-2">
          {/* Month dropdown */}
          <Select onValueChange={(val) => setMonth(parseInt(val))} value={month.toString()}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year dropdown */}
          <Select onValueChange={(val) => setYear(parseInt(val))} value={year.toString()}>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 50 }, (_, i) => year - 25 + i).map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      <div className="grid grid-cols-7 text-center mt-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()

          const inRange = isInRange(day)
          const isSelectedDay = isSelected(day)

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              className={cn(
                "h-10 flex items-center justify-center rounded-lg cursor-pointer",
                inRange && "bg-blue-100 hover:bg-blue-200",
                isSelectedDay && "bg-blue-600 text-white hover:bg-blue-700",
                !isSelectedDay && !inRange && "hover:bg-gray-100",
                isToday && "ring-2 ring-black",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
