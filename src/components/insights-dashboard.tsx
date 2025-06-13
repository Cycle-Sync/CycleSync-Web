"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  CalendarIcon,
  ActivityIcon,
  BrainIcon,
  HeartIcon,
} from "lucide-react"

// Sample insights data
const insightsData = [
  {
    title: "Cycle Length",
    value: "28 days",
    change: "+1 day",
    description: "Your cycle is regular and consistent",
    icon: CalendarIcon,
    trend: "neutral",
  },
  {
    title: "Luteal Phase",
    value: "14 days",
    change: "No change",
    description: "Healthy luteal phase length",
    icon: ActivityIcon,
    trend: "neutral",
  },
  {
    title: "Follicular Phase",
    value: "14 days",
    change: "+1 day",
    description: "Slightly longer than your average",
    icon: BrainIcon,
    trend: "up",
  },
  {
    title: "Period Length",
    value: "5 days",
    change: "No change",
    description: "Consistent with your previous cycles",
    icon: HeartIcon,
    trend: "neutral",
  },
]

// Personalized recommendations based on cycle phase
const recommendations = [
  {
    title: "Current Phase: Follicular (Day 8)",
    items: [
      "Your energy is rising - great time for starting new projects",
      "Estrogen is increasing - focus on strength training for better results",
      "Mood is typically elevated - schedule social activities",
      "Immune system is strong - good time for vaccinations if needed",
    ],
  },
  {
    title: "Upcoming: Ovulation (in 6 days)",
    items: [
      "Prepare for energy peak around day 14",
      "Communication skills will be enhanced - schedule important conversations",
      "Libido will likely increase",
      "Track cervical fluid changes for fertility awareness",
    ],
  },
]

export function InsightsDashboard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Personalized Insights</CardTitle>
            <CardDescription>Your cycle patterns and recommendations</CardDescription>
          </div>
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">Updated Today</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {insightsData.map((insight, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                  <insight.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{insight.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {insight.trend === "up" ? (
                      <ArrowUpIcon className="mr-1 h-3 w-3 text-emerald-500" />
                    ) : insight.trend === "down" ? (
                      <ArrowDownIcon className="mr-1 h-3 w-3 text-rose-500" />
                    ) : (
                      <ArrowRightIcon className="mr-1 h-3 w-3 text-amber-500" />
                    )}
                    <span>{insight.change}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4">
            {recommendations.map((rec, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {rec.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
