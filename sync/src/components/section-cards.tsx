import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Average Cycle Length</CardTitle>
          <CardDescription>Based on the last 6 cycles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">28.3 days</div>
          <Badge variant="outline" className="mt-2">+0.5 days</Badge>
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
          <div className="text-2xl font-bold">3 symptoms</div>
          <Badge variant="outline" className="mt-2">Cramps, Mood Swings</Badge>
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
          <div className="text-2xl font-bold">Low Variance</div>
          <Badge variant="outline" className="mt-2">+2.5%</Badge>
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
          <div className="text-2xl font-bold">92%</div>
          <Badge variant="outline" className="mt-2">+4%</Badge>
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