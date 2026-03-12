import { TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const cards = [
  {
    title: 'Total Revenue',
    value: '$1,250.00',
    trend: '+12.5%',
    positive: true,
    desc: 'Trending up this month',
    sub: 'Visitors for the last 6 months',
  },
  {
    title: 'New Customers',
    value: '1,234',
    trend: '-20%',
    positive: false,
    desc: 'Down 20% this period',
    sub: 'Acquisition needs attention',
  },
  {
    title: 'Active Accounts',
    value: '45,678',
    trend: '+12.5%',
    positive: true,
    desc: 'Strong user retention',
    sub: 'Engagement exceed targets',
  },
  {
    title: 'Growth Rate',
    value: '+4.5%',
    trend: '+4.5%',
    positive: true,
    desc: 'Steady performance increase',
    sub: 'Meets growth projections',
  },
] as const

export function Home() {
  return (
    <>

      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, trend, positive, desc, sub }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Badge
                variant={positive ? 'default' : 'destructive'}
                className={
                  positive
                    ? 'gap-1 border-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'gap-1 border-0'
                }
              >
                {positive ? (
                  <TrendingUp className="size-3.5" />
                ) : (
                  <TrendingDown className="size-3.5" />
                )}
                {trend}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{desc}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="min-h-[400px] flex-1 rounded-xl md:min-h-min">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>최근 문서</CardTitle>
            <CardDescription>샘플 테이블입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>검토자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cover page</TableCell>
                  <TableCell>Cover page</TableCell>
                  <TableCell>
                    <Badge variant="secondary">In Process</Badge>
                  </TableCell>
                  <TableCell>Eddie Lake</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Table of contents</TableCell>
                  <TableCell>Table of contents</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400">Done</Badge>
                  </TableCell>
                  <TableCell>Eddie Lake</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Executive summary</TableCell>
                  <TableCell>Narrative</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400">Done</Badge>
                  </TableCell>
                  <TableCell>Eddie Lake</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Technical approach</TableCell>
                  <TableCell>Narrative</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400">Done</Badge>
                  </TableCell>
                  <TableCell>Jamik Tashpulatov</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Design</TableCell>
                  <TableCell>Narrative</TableCell>
                  <TableCell>
                    <Badge variant="secondary">In Process</Badge>
                  </TableCell>
                  <TableCell>Jamik Tashpulatov</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
