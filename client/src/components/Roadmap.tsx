import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RoadmapItem {
  phase: string;
  title: string;
  period: string;
  items: string[];
  completed: boolean;
}

interface RoadmapProps {
  items: RoadmapItem[];
}

const Roadmap: React.FC<RoadmapProps> = ({ items }) => {
  return (
    <div className="relative max-w-4xl mx-auto">
      {items.map((item, index) => (
        <div key={index} className="timeline-item relative pl-10 pb-12 last:pb-0">
          <div className={`timeline-dot w-8 h-8 absolute left-0 top-0 rounded-full ${item.completed ? 'bg-primary' : index === 1 ? 'bg-secondary' : 'bg-gray-700'} flex items-center justify-center`}>
            <i className={`fas fa-${item.completed ? 'check' : index === 1 ? 'cog' : 'rocket'} text-white text-sm`}></i>
          </div>
          
          <Card className="card-gradient border border-gray-800 rounded-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center mb-4 md:space-x-4">
                <div className={`${item.completed ? 'bg-primary/20 text-primary' : index === 1 ? 'bg-secondary/20 text-secondary' : 'bg-gray-700/30 text-gray-300'} px-3 py-1 rounded-lg text-sm font-medium inline-block`}>
                  {item.phase} - {item.period}
                </div>
                <h3 className="font-['Montserrat'] font-semibold text-white text-xl mt-2 md:mt-0">{item.title}</h3>
              </div>
              
              <div className="space-y-3 text-gray-300">
                {item.items.map((listItem, idx) => (
                  <div key={idx} className="flex items-start">
                    <i className={`fas fa-${item.completed ? 'check-circle text-accent' : 'circle text-gray-600'} mt-1 mr-3`}></i>
                    <p>{listItem}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Roadmap;
