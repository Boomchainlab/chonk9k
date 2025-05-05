import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

interface TokenDistributionChartProps {
  data: DistributionItem[];
}

const TokenDistributionChart: React.FC<TokenDistributionChartProps> = ({ data }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <CardTitle className="text-lg font-bold text-[#ff00ff] flex items-center">
          <span className="mr-2">🌈</span>
          Token Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="w-full h-64 sm:w-3/5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    borderColor: '#ff00ff',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="sm:w-2/5 mt-4 sm:mt-0">
            {data.map((item, index) => (
              <div key={index} className="flex items-center mb-3">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color, borderRadius: '3px' }}></div>
                <div className="flex justify-between w-full">
                  <span className="text-sm text-gray-300">{item.name}</span>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-400">
                Total Token Supply: <span className="text-white">1,000,000,000 CHONK9K</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Circulating Supply: <span className="text-white">652,420,000 CHONK9K</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenDistributionChart;