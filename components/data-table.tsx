import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface KeywordData {
  keyword: string
  opportunityScore: number
  trends: {
    interest: number
    growthRate: number
    region: string
  }
  aliexpress: {
    productCount: number
    avgPrice: number
    avgOrders: number
  }
  amazon: {
    productCount: number
    avgPrice: number
    avgRating: number
  }
}

interface DataTableProps {
  keyword: KeywordData
}

export function DataTable({ keyword }: DataTableProps) {
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-slate-300">Metric</TableHead>
            <TableHead className="text-slate-300">Value</TableHead>
            <TableHead className="text-slate-300">Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableCell className="text-slate-300">Search Interest</TableCell>
            <TableCell className="text-white font-medium">{keyword.trends.interest}/100</TableCell>
            <TableCell className="text-slate-400">Google Trends</TableCell>
          </TableRow>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableCell className="text-slate-300">Growth Rate</TableCell>
            <TableCell className={`font-medium ${keyword.trends.growthRate > 0 ? "text-green-400" : "text-red-400"}`}>
              {keyword.trends.growthRate > 0 ? "+" : ""}
              {keyword.trends.growthRate}%
            </TableCell>
            <TableCell className="text-slate-400">Google Trends</TableCell>
          </TableRow>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableCell className="text-slate-300">AliExpress Products</TableCell>
            <TableCell className="text-white font-medium">{keyword.aliexpress.productCount.toLocaleString()}</TableCell>
            <TableCell className="text-slate-400">AliExpress</TableCell>
          </TableRow>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableCell className="text-slate-300">AliExpress Avg Price</TableCell>
            <TableCell className="text-white font-medium">${keyword.aliexpress.avgPrice}</TableCell>
            <TableCell className="text-slate-400">AliExpress</TableCell>
          </TableRow>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableCell className="text-slate-300">Amazon Products</TableCell>
            <TableCell className="text-white font-medium">{keyword.amazon.productCount.toLocaleString()}</TableCell>
            <TableCell className="text-slate-400">Amazon</TableCell>
          </TableRow>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableCell className="text-slate-300">Amazon Avg Price</TableCell>
            <TableCell className="text-white font-medium">${keyword.amazon.avgPrice}</TableCell>
            <TableCell className="text-slate-400">Amazon</TableCell>
          </TableRow>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableCell className="text-slate-300">Amazon Avg Rating</TableCell>
            <TableCell className="text-white font-medium">{keyword.amazon.avgRating}/5.0</TableCell>
            <TableCell className="text-slate-400">Amazon</TableCell>
          </TableRow>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableCell className="text-slate-300 font-semibold">Opportunity Score</TableCell>
            <TableCell className="text-indigo-400 font-bold text-lg">{keyword.opportunityScore}/100</TableCell>
            <TableCell className="text-slate-400">Calculated</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
