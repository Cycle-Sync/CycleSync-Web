// src/components/symptoms-chart.tsx
import * as React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type {  TooltipProps } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample data for symptoms tracking
const symptomData = [
  { day: 1, cramps: 8, mood: 3, energy: 2, headache: 6, bloating: 7, phase: "Menstruation" },
  { day: 2, cramps: 7, mood: 4, energy: 3, headache: 5, bloating: 6, phase: "Menstruation" },
  { day: 3, cramps: 5, mood: 5, energy: 4, headache: 3, bloating: 5, phase: "Menstruation" },
  { day: 4, cramps: 3, mood: 6, energy: 5, headache: 2, bloating: 4, phase: "Menstruation" },
  { day: 5, cramps: 1, mood: 7, energy: 6, headache: 1, bloating: 3, phase: "Menstruation" },
  { day: 6, cramps: 0, mood: 7, energy: 7, headache: 0, bloating: 2, phase: "Follicular" },
  { day: 7, cramps: 0, mood: 8, energy: 8, headache: 0, bloating: 1, phase: "Follicular" },
  { day: 8, cramps: 0, mood: 8, energy: 8, headache: 0, bloating: 0, phase: "Follicular" },
  { day: 9, cramps: 0, mood: 9, energy: 9, headache: 0, bloating: 0, phase: "Follicular" },
  { day: 10, cramps: 0, mood: 9, energy: 9, headache: 0, bloating: 0, phase: "Follicular" },
  { day: 11, cramps: 0, mood: 9, energy: 10, headache: 0, bloating: 0, phase: "Follicular" },
  { day: 12, cramps: 0, mood: 10, energy: 10, headache: 0, bloating: 0, phase: "Follicular" },
  { day: 13, cramps: 1, mood: 10, energy: 10, headache: 0, bloating: 0, phase: "Follicular" },
  { day: 14, cramps: 2, mood: 9, energy: 9, headache: 1, bloating: 1, phase: "Ovulation" },
  { day: 15, cramps: 1, mood: 8, energy: 8, headache: 2, bloating: 2, phase: "Luteal" },
  { day: 16, cramps: 0, mood: 7, energy: 7, headache: 1, bloating: 3, phase: "Luteal" },
  { day: 17, cramps: 0, mood: 7, energy: 6, headache: 0, bloating: 3, phase: "Luteal" },
  { day: 18, cramps: 0, mood: 6, energy: 6, headache: 0, bloating: 4, phase: "Luteal" },
  { day: 19, cramps: 0, mood: 6, energy: 5, headache: 1, bloating: 4, phase: "Luteal" },
  { day: 20, cramps: 0, mood: 5, energy: 5, headache: 2, bloating: 5, phase: "Luteal" },
  { day: 21, cramps: 0, mood: 5, energy: 4, headache: 3, bloating: 5, phase: "Luteal" },
  { day: 22, cramps: 1, mood: 4, energy: 4, headache: 4, bloating: 6, phase: "Luteal" },
  { day: 23, cramps: 2, mood: 4, energy: 3, headache: 5, bloating: 6, phase: "Luteal" },
  { day: 24, cramps: 3, mood: 3, energy: 3, headache: 6, bloating: 7, phase: "Luteal" },
  { day: 25, cramps: 4, mood: 3, energy: 2, headache: 7, bloating: 7, phase: "Luteal" },
  { day: 26, cramps: 5, mood: 2, energy: 2, headache: 7, bloating: 8, phase: "Luteal" },
  { day: 27, cramps: 6, mood: 2, energy: 1, headache: 8, bloating: 8, phase: "Luteal" },
  { day: 28, cramps: 7, mood: 1, energy: 1, headache: 8, bloating: 8, phase: "Luteal" },
];

type PhaseDataItem = {
  phase: string;
  cramps: number;
  mood: number;
  energy: number;
  headache: number;
  bloating: number;
};

export function SymptomsChart() {
  // Group data by phase for better visualization
  const phaseData: PhaseDataItem[] = React.useMemo(() => {
    const group = ["Menstruation", "Follicular", "Ovulation", "Luteal"].map((phase) => {
      const items = symptomData.filter((d) => d.phase === phase);
      const count = items.length || 1;
      const sum = items.reduce(
        (acc, d) => {
          acc.cramps += d.cramps;
          acc.mood += d.mood;
          acc.energy += d.energy;
          acc.headache += d.headache;
          acc.bloating += d.bloating;
          return acc;
        },
        { cramps: 0, mood: 0, energy: 0, headache: 0, bloating: 0 }
      );
      return {
        phase,
        cramps: sum.cramps / count,
        mood: sum.mood / count,
        energy: sum.energy / count,
        headache: sum.headache / count,
        bloating: sum.bloating / count,
      };
    });
    return group;
  }, []);

  // Custom tooltip to guard against undefined and non-number values
  const renderTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && Array.isArray(payload) && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="font-medium">{label} Phase</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {payload.map((p) => {
              // p.value may be number or string or undefined
              const raw = p.value;
              let num: number | null = null;
              if (typeof raw === "number") {
                num = raw;
              } else if (typeof raw === "string") {
                const parsed = Number(raw);
                num = isNaN(parsed) ? null : parsed;
              }
              const display = num != null ? num.toFixed(1) : "-";
              return (
                <div
                  key={String(p.dataKey)}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.color as string }}
                    />
                    <span>{p.name}</span>
                  </div>
                  <div>{display}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Symptoms Tracking</CardTitle>
            <CardDescription>Monitor your symptoms throughout your cycle</CardDescription>
          </div>
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">
            Current Cycle
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ChartContainer
            config={{
              cramps: {
                label: "Cramps",
                color: "hsl(340, 82%, 52%)",
              },
              mood: {
                label: "Mood",
                color: "hsl(262, 80%, 50%)",
              },
              energy: {
                label: "Energy",
                color: "hsl(221, 83%, 53%)",
              },
              headache: {
                label: "Headache",
                color: "hsl(43, 96%, 56%)",
              },
              bloating: {
                label: "Bloating",
                color: "hsl(142, 71%, 45%)",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={phaseData}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="phase" />
                <YAxis
                  domain={[0, 10]}
                  label={{
                    value: "Intensity (0-10)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={renderTooltip} />
                <Legend />
                <Bar dataKey="cramps" fill="var(--color-cramps)" />
                <Bar dataKey="mood" fill="var(--color-mood)" />
                <Bar dataKey="energy" fill="var(--color-energy)" />
                <Bar dataKey="headache" fill="var(--color-headache)" />
                <Bar dataKey="bloating" fill="var(--color-bloating)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
