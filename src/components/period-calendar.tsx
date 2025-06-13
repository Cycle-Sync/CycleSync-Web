"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Types for our calendar data
type CalendarDay = {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isPeriod: boolean
  isOvulation: boolean
  isFertileWindow: boolean
  isPredicted: boolean
  intensity?: number // 1-3 for period intensity
  symptoms?: string[]
}

type CalendarMonth = {
  month: number
  year: number
  days: CalendarDay[]
}

// Helper function to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Helper function to get day of week (0-6, where 0 is Sunday)
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

// Generate calendar data for a specific month
const generateCalendarMonth = (year: number, month: number, cycleData: any): CalendarMonth => {
  const today = new Date()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Get days from previous month to fill in the first week
  const daysFromPrevMonth = firstDayOfMonth
  const prevMonth = month === 0 ? 11 : month - 1
  const prevMonthYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)

  const days: CalendarDay[] = []

  // Add days from previous month
  for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
    days.push({
      date: new Date(prevMonthYear, prevMonth, i),
      isCurrentMonth: false,
      isToday: false,
      isPeriod: false,
      isOvulation: false,
      isFertileWindow: false,
      isPredicted: false,
    })
  }

  // Add days from current month
  const periodStartDay = 2 // Example: period starts on the 2nd
  const periodLength = 5 // Example: period lasts 5 days
  const ovulationDay = 14 // Example: ovulation on the 14th
  const fertileWindowStart = ovulationDay - 3 // 3 days before ovulation
  const fertileWindowEnd = ovulationDay + 1 // 1 day after ovulation

  // If we're showing a future month, we'll mark days as predicted
  const isPredictedMonth = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth())

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    // Determine if this day is part of the period
    const isPeriod = i >= periodStartDay && i < periodStartDay + periodLength

    // Determine intensity based on day of period
    let intensity = 0
    if (isPeriod) {
      const periodDay = i - periodStartDay + 1
      if (periodDay <= 2)
        intensity = 3 // Heavy
      else if (periodDay <= 4)
        intensity = 2 // Medium
      else intensity = 1 // Light
    }

    days.push({
      date,
      isCurrentMonth: true,
      isToday,
      isPeriod,
      isOvulation: i === ovulationDay,
      isFertileWindow: i >= fertileWindowStart && i <= fertileWindowEnd && i !== ovulationDay,
      isPredicted: isPredictedMonth,
      intensity: isPeriod ? intensity : undefined,
      symptoms: isPeriod ? ["cramps", "fatigue"] : i === ovulationDay ? ["spotting"] : undefined,
    })
  }

  // Add days from next month to complete the grid (always show 6 weeks)
  const totalDaysNeeded = 42 // 6 weeks * 7 days
  const daysFromNextMonth = totalDaysNeeded - days.length
  const nextMonth = month === 11 ? 0 : month + 1
  const nextMonthYear = month === 11 ? year + 1 : year

  for (let i = 1; i <= daysFromNextMonth; i++) {
    days.push({
      date: new Date(nextMonthYear, nextMonth, i),
      isCurrentMonth: false,
      isToday: false,
      isPeriod: false,
      isOvulation: false,
      isFertileWindow: false,
      isPredicted: false,
    })
  }

  return {
    month,
    year,
    days,
  }
}

// Format date as Month YYYY
const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export function PeriodCalendar() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [cycleData, setCycleData] = useState({
    averageCycleLength: 28,
    averagePeriodLength: 5,
    lastPeriodStart: new Date(today.getFullYear(), today.getMonth(), 2),
  })

  const calendarData = generateCalendarMonth(currentDate.getFullYear(), currentDate.getMonth(), cycleData)

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Period Calendar</CardTitle>
            <CardDescription>Track and predict your menstrual cycle</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <h3 className="text-xl font-medium">{formatMonthYear(currentDate)}</h3>
          </div>

          <div className="grid grid-cols-7 text-center text-sm font-medium">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarData.days.map((day, index) => (
              <div key={index} className={cn("aspect-square p-1 relative", !day.isCurrentMonth && "opacity-40")}>
                <div
                  className={cn(
                    "h-full w-full flex flex-col items-center justify-center rounded-md relative",
                    day.isToday && "border-2 border-rose-500",
                    day.isPeriod && !day.isToday && "bg-rose-100 dark:bg-rose-900/30",
                    day.isOvulation && "bg-blue-100 dark:bg-blue-900/30",
                    day.isFertileWindow && "bg-blue-50 dark:bg-blue-900/20",
                  )}
                >
                  <span className={cn("text-sm font-medium", day.isToday && "text-rose-600 dark:text-rose-400")}>
                    {day.date.getDate()}
                  </span>

                  {/* Period intensity indicator */}
                  {day.isPeriod && (
                    <div className="flex mt-1 space-x-0.5">
                      {Array.from({ length: day.intensity || 0 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-rose-500 dark:bg-rose-400" />
                      ))}
                    </div>
                  )}

                  {/* Ovulation indicator */}
                  {day.isOvulation && <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 dark:bg-blue-400" />}

                  {/* Fertile window indicator */}
                  {day.isFertileWindow && <div className="w-1 h-1 mt-1 rounded-full bg-blue-400 dark:bg-blue-300" />}

                  {/* Predicted indicator */}
                  {day.isPredicted && (day.isPeriod || day.isOvulation || day.isFertileWindow) && (
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 rounded-sm bg-rose-100 dark:bg-rose-900/30" />
              <span>Period</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 rounded-sm bg-blue-100 dark:bg-blue-900/30" />
              <span>Ovulation</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 rounded-sm bg-blue-50 dark:bg-blue-900/20" />
              <span>Fertile Window</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 rounded-sm border-2 border-rose-500" />
              <span>Today</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 rounded-sm bg-gray-100 dark:bg-gray-800 relative">
                <div className="absolute top-0 right-0 w-1 h-1 rounded-full bg-gray-400" />
              </div>
              <span>Predicted</span>
            </div>
          </div>

          {/* Cycle statistics */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Badge variant="outline" className="bg-background">
              Cycle Length: 28 days
            </Badge>
            <Badge variant="outline" className="bg-background">
              Period Length: 5 days
            </Badge>
            <Badge variant="outline" className="bg-background">
              Next Period: Jun 30
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
