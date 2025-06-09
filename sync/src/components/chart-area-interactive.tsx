"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartData = Array.from({ length: 28 }, (_, i) => ({
  day: `Day ${i + 1}`,
  estrogen: Math.random() * 300 + 50, // Simulated estrogen levels (50-350 pg/mL)
  progesterone: Math.random() * 15 + 0.5, // Simulated progesterone levels (0.5-15 ng/mL)
}));

// Define hardcoded HSL colors for estrogen and progesterone
const chartConfig = {
  estrogen: { label: "Estrogen (pg/mL)", color: "hsl(39, 100%, 50%)" }, // Orange-yellow
  progesterone: { label: "Progesterone (ng/mL)", color: "hsl(51, 100%, 50%)" }, // Shiny gold
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("28d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item, index) => {
    let daysToShow = 28;
    if (timeRange === "14d") daysToShow = 14;
    else if (timeRange === "7d") daysToShow = 7;
    return index >= chartData.length - daysToShow;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Hormone Levels</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Hormone trends for the current cycle
          </span>
          <span className="@[540px]/card:hidden">Current Cycle</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="28d">Full Cycle</ToggleGroupItem>
            <ToggleGroupItem value="14d">Last 14 Days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 Days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Full Cycle" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="28d" className="rounded-lg">
                Full Cycle
              </SelectItem>
              <SelectItem value="14d" className="rounded-lg">
                Last 14 Days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 Days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              {/* Gradients using hardcoded colors from chartConfig */}
              <linearGradient id="fillEstrogen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.estrogen.color} stopOpacity={1.0} />
                <stop offset="95%" stopColor={chartConfig.estrogen.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillProgesterone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.progesterone.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.progesterone.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {/* Area components with hardcoded stroke colors */}
            <Area
              dataKey="estrogen"
              type="natural"
              fill="url(#fillEstrogen)"
              stroke={chartConfig.estrogen.color}
              stackId="a"
            />
            <Area
              dataKey="progesterone"
              type="natural"
              fill="url(#fillProgesterone)"
              stroke={chartConfig.progesterone.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}