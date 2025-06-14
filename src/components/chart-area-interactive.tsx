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
import type { ChartConfig } from "@/components/ui/chart";
import {
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
import api from "@/api/api"; // Your axios instance

export const description = "An interactive area chart";

const chartConfig = {
  fsh: { label: "FSH (mIU/mL)", color: "hsl(30, 100%, 50%)" }, // Orange
  lh: { label: "LH (mIU/mL)", color: "hsl(45, 100%, 50%)" }, // Yellow
  estradiol: { label: "Estradiol (pg/mL)", color: "hsl(39, 100%, 50%)" }, // Orange-yellow
  progesterone: { label: "Progesterone (ng/mL)", color: "hsl(51, 100%, 50%)" }, // Shiny gold
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("full");
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    const fetchHormoneData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/dashboard/");
        // Transform backend data to chart format
        const transformedData = data.days.map((day: number, index: number) => ({
          day: `Day ${day}`,
          fsh: data.fsh[index],
          lh: data.lh[index],
          estradiol: data.estradiol[index],
          progesterone: data.progesterone[index],
        }));
        setChartData(transformedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load hormone data");
        setLoading(false);
      }
    };
    fetchHormoneData();
  }, []);

  const filteredData = React.useMemo(() => {
    let daysToShow = chartData.length; // Default to full cycle
    switch (timeRange) {
      case "30d":
        daysToShow = Math.min(30, chartData.length);
        break;
      case "14d":
        daysToShow = Math.min(14, chartData.length);
        break;
      case "7d":
        daysToShow = Math.min(7, chartData.length);
        break;
      case "full":
        daysToShow = chartData.length;
        break;
    }
    return chartData.slice(-daysToShow);
  }, [chartData, timeRange]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            <ToggleGroupItem value="full">Full Cycle</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last Month</ToggleGroupItem>
            <ToggleGroupItem value="14d">Last 2 Weeks</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last Week</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 @[767px]/card:hidden"
              size="sm"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Full Cycle" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="full" className="rounded-lg">
                Full Cycle
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last Month
              </SelectItem>
              <SelectItem value="14d" className="rounded-lg">
                Last 2 Weeks
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last Week
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillFSH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.fsh.color} stopOpacity={1.0} />
                <stop offset="95%" stopColor={chartConfig.fsh.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillLH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.lh.color} stopOpacity={1.0} />
                <stop offset="95%" stopColor={chartConfig.lh.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillEstradiol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.estradiol.color} stopOpacity={1.0} />
                <stop offset="95%" stopColor={chartConfig.estradiol.color} stopOpacity={0.1} />
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
            <Area
              dataKey="fsh"
              type="natural"
              fill="url(#fillFSH)"
              stroke={chartConfig.fsh.color}
              stackId="a"
            />
            <Area
              dataKey="lh"
              type="natural"
              fill="url(#fillLH)"
              stroke={chartConfig.lh.color}
              stackId="a"
            />
            <Area
              dataKey="estradiol"
              type="natural"
              fill="url(#fillEstradiol)"
              stroke={chartConfig.estradiol.color}
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