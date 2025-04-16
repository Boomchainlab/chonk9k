import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  label: string;
  value: string;
  change?: string;
  period?: string;
}

interface TokenStatsProps {
  stats: Stat[];
}

const TokenStats: React.FC<TokenStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
      {stats.map((stat, index) => (
        <Card key={index} className="card-gradient border border-gray-800 hover:translate-y-[-5px] transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="text-gray-400 font-medium mb-2">{stat.label}</h3>
            <div className="text-2xl font-['Montserrat'] font-bold text-white">{stat.value}</div>
            {stat.change && (
              <div className="flex items-center mt-2">
                <span className="text-accent font-medium">{stat.change}</span>
                {stat.period && <span className="text-gray-400 text-sm ml-2">{stat.period}</span>}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TokenStats;
