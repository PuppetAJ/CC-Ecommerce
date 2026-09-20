'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/**
 * One measure, one axis. Revenue and sessions are different scales, so they are two charts
 * sharing an x-axis rather than one chart with two y-axes — which is the commonest way to
 * make a chart say something untrue.
 *
 * A single series needs no legend: the heading names it.
 */
export function TrendChart({
  data,
  dataKey,
  label,
  money = false,
}: {
  data: { day: string; [key: string]: string | number }[]
  dataKey: string
  label: string
  money?: boolean
}) {
  const config = { [dataKey]: { label, color: 'var(--chart-1)' } } satisfies ChartConfig
  const short = (day: string) =>
    new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  const money0 = (value: number) => `$${Math.round(value / 100).toLocaleString('en-US')}`

  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        {/* Recessive: the grid is a reading aid, not a thing to look at. */}
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
        <XAxis
          dataKey="day"
          tickFormatter={short}
          tickLine={false}
          axisLine={false}
          minTickGap={28}
          tickMargin={10}
          className="text-xs"
        />
        <YAxis
          tickFormatter={(value: number) => (money ? money0(value) : String(value))}
          tickLine={false}
          axisLine={false}
          width={money ? 52 : 34}
          className="text-xs"
        />
        <ChartTooltip
          cursor={{ stroke: 'var(--chart-grid)', strokeWidth: 2 }}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => short(String(value))}
              formatter={(value) => (money ? money0(Number(value)) : String(value))}
            />
          }
        />
        <Area
          dataKey={dataKey}
          type="monotone"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill={`url(#fill-${dataKey})`}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
