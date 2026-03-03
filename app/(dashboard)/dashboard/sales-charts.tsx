"use client";

import { SalesMetricData } from "@/lib/types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

interface SalesChartsProps {
  metrics: SalesMetricData[];
}

export default function SalesCharts({ metrics }: SalesChartsProps) {
  const chartData = [...(metrics ?? [])]
    ?.sort?.((a, b) => new Date(a?.date ?? 0).getTime() - new Date(b?.date ?? 0).getTime())
    ?.map?.((m) => ({
      date: new Date(m?.date ?? 0).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
      satis: m?.totalSales ?? 0,
      kar: m?.netProfit ?? 0,
      siparis: m?.orderCount ?? 0,
      yeniMusteri: m?.newCustomers ?? 0,
      tekrarMusteri: m?.repeatCustomers ?? 0
    })) ?? [];

  if ((chartData?.length ?? 0) === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-gray-400">Henüz veri bulunmuyor. Yeni veri ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Satış & Kar Trendi</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorSatis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorKar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                tickFormatter={(v) => `₺${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: 11,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ padding: '2px 0' }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: 11, paddingBottom: 20 }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="satis"
                name="Satış"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6 shadow-lg' }}
              />
              <Line
                type="monotone"
                dataKey="kar"
                name="Kar"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#22c55e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Müşteri Dağılımı</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: 11
                }}
              />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="yeniMusteri" name="Yeni" fill="#60B5FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tekrarMusteri" name="Tekrar" fill="#FF9149" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
