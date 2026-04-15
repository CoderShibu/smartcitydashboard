import React from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { DashboardData, ZoneData } from '@/hooks/useSimulatedData';

interface ChartsProps {
  data: DashboardData;
  zones: ZoneData[];
  selectedZone: string | null;
}

const chartTooltipStyle = {
  contentStyle: {
    background: 'hsl(220 40% 10%)',
    border: '1px solid hsl(220 30% 18%)',
    borderRadius: '8px',
    color: 'hsl(200 20% 90%)',
    fontSize: '12px',
  },
};

const DashboardCharts: React.FC<ChartsProps> = ({ data, zones, selectedZone }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Traffic Trend */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Traffic Congestion Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.trafficHistory}>
            <defs>
              <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(185, 80%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(185, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(215 15% 55%)', fontSize: 10 }} />
            <YAxis tick={{ fill: 'hsl(215 15% 55%)', fontSize: 10 }} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="value" stroke="hsl(185, 80%, 50%)" fill="url(#trafficGrad)" strokeWidth={2} name="Congestion %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AQI Trend */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Air Quality Index Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.aqiHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(215 15% 55%)', fontSize: 10 }} />
            <YAxis tick={{ fill: 'hsl(215 15% 55%)', fontSize: 10 }} />
            <Tooltip {...chartTooltipStyle} />
            <Line type="monotone" dataKey="value" stroke="hsl(38, 92%, 55%)" strokeWidth={2} dot={false} name="AQI" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
