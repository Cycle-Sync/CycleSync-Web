import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for a 28-day cycle
const generateCycleData = () => {
  const data = []

  // Estrogen pattern: rises in follicular phase, peaks before ovulation, smaller rise in luteal phase
  // Progesterone pattern: low in follicular phase, rises after ovulation, peaks mid-luteal phase
  // Testosterone: relatively stable with slight mid-cycle rise

  for (let day = 1; day <= 28; day++) {
    let estrogen, progesterone, testosterone

    // Follicular phase (days 1-14)
    if (day <= 14) {
      estrogen = 20 + day * 5 // Rising from low to high
      progesterone = 2 + (day < 12 ? day * 0.2 : day * 0.5) // Low and stable, slight rise near end
      testosterone = 25 + (day > 10 ? (day - 10) * 2 : 0) // Slight rise near ovulation
    }
    // Luteal phase (days 15-28)
    else {
      const lutealDay = day - 14
      estrogen = 90 - lutealDay * 2 + (lutealDay > 5 ? 20 : 0) // Drop after ovulation, small secondary rise
      progesterone = 10 + lutealDay * 4 - (lutealDay > 7 ? (lutealDay - 7) * 6 : 0) // Rises then falls
      testosterone = 35 - lutealDay * 0.7 // Gradual decline
    }

    // Add some natural variation
    estrogen += Math.random() * 10 - 5
    progesterone += Math.random() * 4 - 2
    testosterone += Math.random() * 3 - 1.5

    // Ensure no negative values
    estrogen = Math.max(estrogen, 5)
    progesterone = Math.max(progesterone, 1)
    testosterone = Math.max(testosterone, 15)

    data.push({
      day,
      estrogen: Math.round(estrogen),
      progesterone: Math.round(progesterone),
      testosterone: Math.round(testosterone),
      phase: day === 14 ? "Ovulation" : day < 14 ? "Follicular Phase" : "Luteal Phase",
    })
  }

  return data
}

const cycleData = generateCycleData()

export function HormonalChart() {
  const [timeframe, setTimeframe] = useState("cycle")

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hormonal Analytics</CardTitle>
            <CardDescription>Track your hormone levels throughout your cycle</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Tabs value={timeframe} onValueChange={setTimeframe} defaultValue="cycle">
              <TabsList>
                <TabsTrigger
                  value="cycle"
                  className={timeframe === "cycle" ? "bg-rose-100 text-rose-800 hover:bg-rose-100" : ""}
                >
                  Cycle
                </TabsTrigger>
                <TabsTrigger
                  value="3months"
                  className={timeframe === "3months" ? "bg-rose-100 text-rose-800 hover:bg-rose-100" : ""}
                >
                  3 Months
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ChartContainer
            config={{
              estrogen: {
                label: "Estrogen (pg/mL)",
                color: "hsl(340, 82%, 52%)",
              },
              progesterone: {
                label: "Progesterone (ng/mL)",
                color: "hsl(262, 80%, 50%)",
              },
              testosterone: {
                label: "Testosterone (ng/dL)",
                color: "hsl(221, 83%, 53%)",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cycleData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" label={{ value: "Cycle Day", position: "insideBottom", offset: -20 }} />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Day {data.day}</div>
                            <div className="font-medium text-right">{data.phase}</div>
                            {payload.map((p) => (
                              <div key={p.dataKey} className="col-span-2 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1">
                                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                                  <span>{p.name}</span>
                                </div>
                                <div>{p.value}</div>
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
                <Line
                  type="monotone"
                  dataKey="estrogen"
                  stroke="var(--color-estrogen)"
                  strokeWidth={2}
                  dot={{ r: 0 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="progesterone"
                  stroke="var(--color-progesterone)"
                  strokeWidth={2}
                  dot={{ r: 0 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="testosterone"
                  stroke="var(--color-testosterone)"
                  strokeWidth={2}
                  dot={{ r: 0 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
