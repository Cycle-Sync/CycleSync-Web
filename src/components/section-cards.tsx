// import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

// import { Badge } from "@/components/ui/badge"
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card"

// export function SectionCards() {
//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Average Cycle Length</CardTitle>
//           <CardDescription>Based on the last 6 cycles</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">28.3 days</div>
//           <Badge variant="outline" className="mt-2">+0.5 days</Badge>
//         </CardContent>
//         <CardFooter>
//           <div className="flex gap-2 leading-none font-medium">
//             Stable cycle duration
//             <IconTrendingUp className="size-4" />
//           </div>
//         </CardFooter>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Symptom Frequency</CardTitle>
//           <CardDescription>Common symptoms this cycle</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">3 symptoms</div>
//           <Badge variant="outline" className="mt-2">Cramps, Mood Swings</Badge>
//         </CardContent>
//         <CardFooter>
//           <div className="flex gap-2 leading-none font-medium">
//             Monitor for patterns
//             <IconTrendingDown className="size-4" />
//           </div>
//         </CardFooter>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Hormone Stability</CardTitle>
//           <CardDescription>Estrogen & Progesterone variance</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">Low Variance</div>
//           <Badge variant="outline" className="mt-2">+2.5%</Badge>
//         </CardContent>
//         <CardFooter>
//           <div className="flex gap-2 leading-none font-medium">
//             Within normal range
//             <IconTrendingUp className="size-4" />
//           </div>
//         </CardFooter>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Prediction Accuracy</CardTitle>
//           <CardDescription>Ovulation & period predictions</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">92%</div>
//           <Badge variant="outline" className="mt-2">+4%</Badge>
//         </CardContent>
//         <CardFooter>
//           <div className="flex gap-2 leading-none font-medium">
//             Reliable predictions
//             <IconTrendingUp className="size-4" />
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
"use client";

import * as React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import api from "@/api/api";

interface MetricsData {
  average_cycle_length: {
    days: number;
    change: number;
  };
  symptom_frequency: {
    count: number;
    common_symptoms: string[];
  };
  hormone_stability: {
    variance: string;
    change_percent: number;
  };
  prediction_accuracy: {
    accuracy_percent: number;
    change_percent: number;
  };
}

export function SectionCards() {
  const [data, setData] = React.useState<MetricsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // Fetch cycles and daily entries
        const [cyclesResponse, entriesResponse, hormoneResponse] = await Promise.all([
          api.get("/cycles/"),
          api.get("/daily-entries/"),
          api.get("/dashboard/"),
        ]);
        const cycles = cyclesResponse.data;
        const entries = entriesResponse.data;
        const hormoneData = hormoneResponse.data;

        // Compute average cycle length
        const lastSixCycles = cycles.slice(-6);
        const avgCycleLength = lastSixCycles.length
          ? lastSixCycles.reduce((sum: number, cycle: any) => sum + cycle.cycle_length, 0) / lastSixCycles.length
          : 28;
        const prevAvgCycleLength = lastSixCycles.length > 1
          ? lastSixCycles.slice(0, -1).reduce((sum: number, cycle: any) => sum + cycle.cycle_length, 0) / (lastSixCycles.length - 1)
          : avgCycleLength;
        const cycleLengthChange = avgCycleLength - prevAvgCycleLength;

        // Compute symptom frequency
        const currentCycle = cycles[cycles.length - 1];
        const cycleEntries = entries.filter((entry: any) => entry.cycle?.id === currentCycle?.id);
        const symptoms = cycleEntries.flatMap((entry: any) =>
          [
            entry.cramps ? `Cramps: ${entry.cramps}` : null,
            entry.bloating ? `Bloating: ${entry.bloating}` : null,
            entry.mood ? `Mood: ${entry.mood}` : null,
            entry.cervical_mucus ? `Cervical Mucus: ${entry.cervical_mucus}` : null,
          ].filter(Boolean)
        );
        const symptomCount = symptoms.length;
        const commonSymptoms = [...new Set(symptoms.map((s: string) => s.split(":")[0]))].slice(0, 2);

        // Compute hormone stability (simplified variance)
        const estradiolVariance = calculateVariance(hormoneData.estradiol);
        const progesteroneVariance = calculateVariance(hormoneData.progesterone);
        const varianceLevel = estradiolVariance + progesteroneVariance < 100 ? "Low" : "High";
        const prevEstradiol = hormoneData.estradiol.slice(0, -1);
        const prevProgesterone = hormoneData.progesterone.slice(0, -1);
        const prevVariance = prevEstradiol.length ? calculateVariance(prevEstradiol) + calculateVariance(prevProgesterone) : 0;
        const varianceChange = prevVariance ? ((estradiolVariance + progesteroneVariance - prevVariance) / prevVariance) * 100 : 0;

        // Compute prediction accuracy (placeholder)
        const accuracy = 92; // Replace with actual logic if available
        const accuracyChange = 4; // Placeholder

        setData({
          average_cycle_length: {
            days: avgCycleLength,
            change: cycleLengthChange,
          },
          symptom_frequency: {
            count: symptomCount,
            common_symptoms: commonSymptoms,
          },
          hormone_stability: {
            variance: varianceLevel,
            change_percent: varianceChange,
          },
          prediction_accuracy: {
            accuracy_percent: accuracy,
            change_percent: accuracyChange,
          },
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load metrics");
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Helper function to calculate variance
  const calculateVariance = (values: number[]) => {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Average Cycle Length</CardTitle>
          <CardDescription>Based on the last 6 cycles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.average_cycle_length.days.toFixed(1)} days</div>
          <Badge variant="outline" className="mt-2">
            {data.average_cycle_length.change >= 0 ? "+" : ""}
            {data.average_cycle_length.change.toFixed(1)} days
          </Badge>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 leading-none font-medium">
            Stable cycle duration
            <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Symptom Frequency</CardTitle>
          <CardDescription>Common symptoms this cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.symptom_frequency.count} symptoms</div>
          <Badge variant="outline" className="mt-2">
            {data.symptom_frequency.common_symptoms.join(", ")}
          </Badge>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 leading-none font-medium">
            Monitor for patterns
            <IconTrendingDown className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hormone Stability</CardTitle>
          <CardDescription>Estrogen & Progesterone variance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.hormone_stability.variance}</div>
          <Badge variant="outline" className="mt-2">
            {data.hormone_stability.change_percent >= 0 ? "+" : ""}
            {data.hormone_stability.change_percent.toFixed(1)}%
          </Badge>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 leading-none font-medium">
            Within normal range
            <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Prediction Accuracy</CardTitle>
          <CardDescription>Ovulation & period predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.prediction_accuracy.accuracy_percent}%</div>
          <Badge variant="outline" className="mt-2">
            {data.prediction_accuracy.change_percent >= 0 ? "+" : ""}
            {data.prediction_accuracy.change_percent.toFixed(1)}%
          </Badge>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 leading-none font-medium">
            Reliable predictions
            <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}