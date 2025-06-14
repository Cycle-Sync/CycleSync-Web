import * as React from "react";
import { format } from "date-fns";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import api from "@/api/api";

interface CycleDay {
  date: string;
  day_num: number;
  phase: string;
  is_past: boolean;
  is_today: boolean;
  new_month: boolean;
  angle: number;
  fertility_chance?: number; // Optional until backend provides it
}

interface MonthDay {
  date: string;
  phase: string;
  is_today: boolean;
  is_past: boolean;
}

export default function CycleCalendarPage() {
  const [cycleData, setCycleData] = React.useState<CycleDay[]>([]);
  const [monthData, setMonthData] = React.useState<MonthDay[]>([]);
  const [selectedDay, setSelectedDay] = React.useState<CycleDay | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // Fetch data on mount and when month changes
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch cycle data
        const { data: cycleResponse } = await api.get("/calendar/");
        const enrichedCycleData = cycleResponse.days_list.map((day: CycleDay) => ({
          ...day,
          fertility_chance: calculateFertilityChance(day.phase, day.day_num, cycleResponse.days_list.length),
        }));
        setCycleData(enrichedCycleData);
        // Set default selected day to today or first day
        const todayDay = enrichedCycleData.find((day: CycleDay) => day.is_today);
        setSelectedDay(todayDay || enrichedCycleData[0]);

        // Fetch month data
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1; // 1-based for API
        const { data: monthResponse } = await api.get(`/cycle-calendar/${year}/${month}/`);
        setMonthData(monthResponse.days_list);

        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load calendar data");
        setLoading(false);
      }
    };
    fetchData();
  }, [currentMonth]);

  // Fertility chance heuristic
  const calculateFertilityChance = (phase: string, dayNum: number, cycleLength: number): number => {
    const ovDay = cycleLength / 2;
    if (phase === "ovulation") return 0.9;
    if (phase === "fertile") return 0.6 + ((dayNum - (ovDay - 5)) / 5) * 0.2;
    if (phase === "follicular") return 0.1 + ((dayNum - 5) / (ovDay - 5)) * 0.2;
    if (phase === "menstrual" || phase === "luteal") return 0.05;
    return 0;
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-col gap-6 p-4 lg:gap-8 lg:p-6">
          <h1 className="text-2xl font-bold">Cycle Calendar</h1>
          <TooltipProvider>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Circular Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Cycle Progress</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <CircularCalendar days={cycleData} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
                  {selectedDay && (
                    <div className="text-center">
                      <p className="font-semibold">{format(new Date(selectedDay.date), "PPP")}</p>
                      <p>Phase: {selectedDay.phase.charAt(0).toUpperCase() + selectedDay.phase.slice(1)}</p>
                      <p>Fertility Chance: {(selectedDay.fertility_chance! * 100).toFixed(0)}%</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Grid Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <GridCalendar
                    days={monthData}
                    currentMonth={currentMonth}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                  />
                </CardContent>
              </Card>
            </div>
          </TooltipProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

interface CircularCalendarProps {
  days: CycleDay[];
  selectedDay: CycleDay | null;
  onSelectDay: (day: CycleDay) => void;
}

function CircularCalendar({ days, selectedDay, onSelectDay }: CircularCalendarProps) {
  const radius = 100;
  const center = 120;
  const strokeWidth = 20;
  const pointerLength = radius - 10;

  // Phase colors
  const phaseColors: Record<string, string> = {
    menstrual: "hsl(0, 70%, 50%)", // Red
    follicular: "hsl(200, 70%, 50%)", // Blue
    fertile: "hsl(120, 70%, 50%)", // Green
    ovulation: "hsl(60, 70%, 50%)", // Yellow
    luteal: "hsl(300, 70%, 50%)", // Purple
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={240} height={240} viewBox="0 0 240 240">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Day arcs */}
        {days.map((day, index) => {
          const startAngle = (day.angle * Math.PI) / 180;
          const endAngle = ((days[index + 1]?.angle || day.angle + 360 / days.length) * Math.PI) / 180;
          const x1 = center + radius * Math.cos(startAngle);
          const y1 = center + radius * Math.sin(startAngle);
          const x2 = center + radius * Math.cos(endAngle);
          const y2 = center + radius * Math.sin(endAngle);
          const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
          const isSelected = selectedDay?.date === day.date;

          return (
            <Tooltip key={day.date}>
              <TooltipTrigger asChild>
                <path
                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={phaseColors[day.phase] || "hsl(var(--foreground))"}
                  strokeWidth={strokeWidth}
                  strokeLinecap="butt"
                  className={`cursor-pointer hover:opacity-80 ${isSelected ? "opacity-100" : "opacity-70"}`}
                  onClick={() => onSelectDay(day)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Date: {format(new Date(day.date), "PPP")}</p>
                <p>Day: {day.day_num}</p>
                <p>Phase: {day.phase.charAt(0).toUpperCase() + day.phase.slice(1)}</p>
                <p>Fertility Chance: {(day.fertility_chance! * 100).toFixed(0)}%</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {/* Pointer for selected day */}
        {selectedDay && (
          <line
            x1={center}
            y1={center}
            x2={center + pointerLength * Math.cos((selectedDay.angle * Math.PI) / 180)}
            y2={center + pointerLength * Math.sin((selectedDay.angle * Math.PI) / 180)}
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}
        {/* Today indicator */}
        {days.find((day) => day.is_today) && (
          <circle
            cx={center + radius * Math.cos((days.find((day) => day.is_today)!.angle * Math.PI) / 180)}
            cy={center + radius * Math.sin((days.find((day) => day.is_today)!.angle * Math.PI) / 180)}
            r={8}
            fill="hsl(var(--primary))"
          />
        )}
        {/* Day numbers */}
        {days.map((day) => {
          const angleRad = (day.angle * Math.PI) / 180;
          const textRadius = radius + 30;
          const x = center + textRadius * Math.cos(angleRad);
          const y = center + textRadius * Math.sin(angleRad);
          return (
            <text
              key={`text-${day.date}`}
              x={x}
              y={y}
              textAnchor="middle"
              dy="0.35em"
              className="text-sm"
              fill="hsl(var(--foreground))"
            >
              {day.day_num}
            </text>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-2">
        {Object.entries(phaseColors).map(([phase, color]) => (
          <div key={phase} className="flex items-center gap-1 text-sm">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
}

interface GridCalendarProps {
  days: MonthDay[];
  currentMonth: Date;
  prevMonth: () => void;
  nextMonth: () => void;
}

function GridCalendar({ days, currentMonth, prevMonth, nextMonth }: GridCalendarProps) {
  const monthName = format(currentMonth, "MMMM");
  const year = currentMonth.getFullYear();
  const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();

  // Phase colors
  const phaseColors: Record<string, string> = {
    menstrual: "bg-red-100 text-red-800",
    follicular: "bg-blue-100 text-blue-800",
    fertile: "bg-green-100 text-green-800",
    ovulation: "bg-yellow-100 text-yellow-800",
    luteal: "bg-purple-100 text-purple-800",
    unknown: "bg-gray-100 text-gray-800",
  };

  // Generate calendar grid
  const calendarDays = [];
  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayData = days.find((d) => new Date(d.date).getDate() === i);
    calendarDays.push(dayData);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{monthName} {year}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={`relative h-10 flex items-center justify-center rounded-md ${
                  day
                    ? `${phaseColors[day.phase] || phaseColors.unknown} ${
                        day.is_today ? "border-2 border-primary" : ""
                      } ${day.is_past ? "opacity-50" : ""}`
                    : "bg-transparent"
                }`}
              >
                {day && (
                  <>
                    <span>{new Date(day.date).getDate()}</span>
                    {day.is_past && (
                      <IconX className="absolute h-6 w-6 text-muted-foreground opacity-70" />
                    )}
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {day ? (
                <>
                  <p>Date: {format(new Date(day.date), "PPP")}</p>
                  <p>Phase: {day.phase.charAt(0).toUpperCase() + day.phase.slice(1)}</p>
                </>
              ) : (
                <p>Empty</p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(phaseColors).map(([phase]) => (
          <div key={phase} className="flex items-center gap-1 text-sm">
            <div className={`h-3 w-3 rounded-full ${phaseColors[phase].split(" ")[0]}`} />
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
}