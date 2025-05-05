import React from 'react';
import { Shield, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AuditStatus } from '@/services/tokenMarketService';

interface TokenAuditStatusProps {
  auditData: AuditStatus;
  className?: string;
}

const TokenAuditStatus: React.FC<TokenAuditStatusProps> = ({ auditData, className = '' }) => {
  const getStatusIcon = () => {
    switch (auditData.status) {
      case 'passed':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (auditData.status) {
      case 'passed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-amber-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center">
            <Shield className="mr-2 h-5 w-5 text-[#ff00ff]" />
            Contract Audit Status
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`capitalize font-medium ${auditData.status === 'passed' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 
              auditData.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 
              auditData.status === 'failed' ? 'bg-red-500/20 text-red-300 border-red-500/50' : 
              'bg-gray-500/20 text-gray-300 border-gray-500/50'}`}
          >
            {auditData.status}
          </Badge>
        </div>
        <CardDescription className="text-gray-400">
          {auditData.audited 
            ? `Audited by ${auditData.auditor}` 
            : "Token contract has not been audited yet"}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        {auditData.audited ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Security Score</span>
              <span className="text-white font-medium">{auditData.score}/100</span>
            </div>
            
            <Progress 
              value={auditData.score} 
              max={100} 
              className="h-2 bg-gray-700"
              indicatorClassName={getStatusColor()}
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                <div className="text-sm text-gray-400 mb-1">Issues Found</div>
                <div className="text-white font-medium">{auditData.issueCount || 0}</div>
              </div>
              
              <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                <div className="text-sm text-gray-400 mb-1">Audit Date</div>
                <div className="text-white font-medium">{formatDate(auditData.lastAuditDate)}</div>
              </div>
            </div>
            
            {auditData.reportUrl && (
              <a 
                href={auditData.reportUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-[#00e0ff] hover:underline flex items-center mt-2"
              >
                View full audit report
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
            <p className="text-amber-300 font-medium">Not Audited</p>
            <p className="text-gray-400 text-sm mt-2">
              This token has not been audited by any security firms.
              Exercise caution when investing.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenAuditStatus;