import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
]

export function SymptomsChart() {
  // Group data by phase for better visualization
  const phaseData = [
    {
      phase: "Menstruation",
      cramps: symptomData.filter((d) => d.phase === "Menstruation").reduce((sum, d) => sum + d.cramps, 0) / 5,
      mood: symptomData.filter((d) => d.phase === "Menstruation").reduce((sum, d) => sum + d.mood, 0) / 5,
      energy: symptomData.filter((d) => d.phase === "Menstruation").reduce((sum, d) => sum + d.energy, 0) / 5,
      headache: symptomData.filter((d) => d.phase === "Menstruation").reduce((sum, d) => sum + d.headache, 0) / 5,
      bloating: symptomData.filter((d) => d.phase === "Menstruation").reduce((sum, d) => sum + d.bloating, 0) / 5,
    },
    {
      phase: "Follicular",
      cramps: symptomData.filter((d) => d.phase === "Follicular").reduce((sum, d) => sum + d.cramps, 0) / 8,
      mood: symptomData.filter((d) => d.phase === "Follicular").reduce((sum, d) => sum + d.mood, 0) / 8,
      energy: symptomData.filter((d) => d.phase === "Follicular").reduce((sum, d) => sum + d.energy, 0) / 8,
      headache: symptomData.filter((d) => d.phase === "Follicular").reduce((sum, d) => sum + d.headache, 0) / 8,
      bloating: symptomData.filter((d) => d.phase === "Follicular").reduce((sum, d) => sum + d.bloating, 0) / 8,
    },
    {
      phase: "Ovulation",
      cramps: symptomData.filter((d) => d.phase === "Ovulation").reduce((sum, d) => sum + d.cramps, 0) / 1,
      mood: symptomData.filter((d) => d.phase === "Ovulation").reduce((sum, d) => sum + d.mood, 0) / 1,
      energy: symptomData.filter((d) => d.phase === "Ovulation").reduce((sum, d) => sum + d.energy, 0) / 1,
      headache: symptomData.filter((d) => d.phase === "Ovulation").reduce((sum, d) => sum + d.headache, 0) / 1,
      bloating: symptomData.filter((d) => d.phase === "Ovulation").reduce((sum, d) => sum + d.bloating, 0) / 1,
    },
    {
      phase: "Luteal",
      cramps: symptomData.filter((d) => d.phase === "Luteal").reduce((sum, d) => sum + d.cramps, 0) / 14,
      mood: symptomData.filter((d) => d.phase === "Luteal").reduce((sum, d) => sum + d.mood, 0) / 14,
      energy: symptomData.filter((d) => d.phase === "Luteal").reduce((sum, d) => sum + d.energy, 0) / 14,
      headache: symptomData.filter((d) => d.phase === "Luteal").reduce((sum, d) => sum + d.headache, 0) / 14,
      bloating: symptomData.filter((d) => d.phase === "Luteal").reduce((sum, d) => sum + d.bloating, 0) / 14,
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Symptoms Tracking</CardTitle>
            <CardDescription>Monitor your symptoms throughout your cycle</CardDescription>
          </div>
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">Current Cycle</Badge>
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
              <BarChart data={phaseData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="phase" />
                <YAxis domain={[0, 10]} label={{ value: "Intensity (0-10)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="font-medium">{label} Phase</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {payload.map((p) => (
                              <div key={p.dataKey} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1">
                                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                                  <span>{p.name}</span>
                                </div>
                                <div>{p.value.toFixed(1)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
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
  )
}
