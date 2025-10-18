"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DateRangePicker({ 
  onChange, 
  placeholder = "Pick a date range",
  className,
  value
}) {
  const [range, setRange] = React.useState(() => {
    if (!value) return null;
    try {
      return {
        from: value.from ? new Date(value.from) : null,
        to: value.to ? new Date(value.to) : null
      };
    } catch (err) {
      console.error("Invalid date value:", value);
      return null;
    }
  });

  // Sync with external value
  React.useEffect(() => {
    if (!value) {
      setRange(null);
      return;
    }
    
    try {
      const newRange = {
        from: value.from ? new Date(value.from) : null,
        to: value.to ? new Date(value.to) : null
      };
      
      if (JSON.stringify(newRange) !== JSON.stringify(range)) {
        setRange(newRange);
      }
    } catch (err) {
      console.error("Invalid date value in effect:", value);
    }
  }, [value]);

  // Notify parent of changes
  React.useEffect(() => {
    if (onChange && JSON.stringify(value) !== JSON.stringify(range)) {
      onChange(range);
    }
  }, [range, onChange, value]);

  const handleSelect = (newRange) => {
    try {
      if (!newRange) {
        setRange(null);
        return;
      }
      
      const validatedRange = {
        from: newRange.from ? new Date(newRange.from) : null,
        to: newRange.to ? new Date(newRange.to) : null
      };
      
      setRange(validatedRange);
    } catch (err) {
      console.error("Error handling date selection:", err);
      setRange(null);
    }
  };

  // Safe format function
  const formatDate = (date) => {
    if (!date) return "";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date object:", date);
        return "";
      }
      return format(dateObj, "MMM d, y");
    } catch (err) {
      console.error("Error formatting date:", err);
      return "";
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !range && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {(() => {
              try {
                if (!range?.from) return <span>{placeholder}</span>;
                
                const fromStr = formatDate(range.from);
                if (!fromStr) return <span>{placeholder}</span>;
                
                if (!range.to) return fromStr;
                
                const toStr = formatDate(range.to);
                if (!toStr) return fromStr;
                
                return (
                  <>
                    {fromStr} - {toStr}
                  </>
                );
              } catch (err) {
                console.error("Error rendering date range:", err);
                return <span>{placeholder}</span>;
              }
            })()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
