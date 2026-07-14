import { useState } from 'react';
import type { AuditIssue, GroupedIssue } from '@/services/home/types';
import { FindingCard } from '@/components/home/FindingCard';

interface FindingsListProps {
  issues: AuditIssue[];
}

export function FindingsList({ issues }: FindingsListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'serious' | 'moderate' | 'minor'>('all');
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});

  const toggleRuleExpanded = (ruleId: string) => {
    setExpandedRules(prev => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  const filteredIssues = issues.filter(issue => {
    if (activeTab === 'all') return true;
    return issue.impact === activeTab;
  });

  // Group filtered issues by ruleId (stored in issue.title)
  const groupedIssues = filteredIssues.reduce((acc, issue) => {
    const key = issue.title;
    if (!acc[key]) {
      acc[key] = {
        ruleId: key,
        translatedName: issue.translatedName || key,
        translatedDescription: issue.translatedDescription || issue.description,
        impact: issue.impact,
        category: issue.category,
        disabilities: issue.disabilities || [],
        recommendation: issue.recommendation,
        instances: []
      };
    }
    acc[key].instances.push(issue);
    return acc;
  }, {} as Record<string, GroupedIssue>);

  const getIssuesCount = (severity: 'critical' | 'serious' | 'moderate' | 'minor' | 'all') => {
    if (severity === 'all') return issues.length;
    return issues.filter(i => i.impact === severity).length;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-bold text-base text-foreground">Detalle de Hallazgos</h3>

        {/* Tabs */}
        <div className="flex bg-muted p-1 rounded-lg border border-border flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-card text-foreground shadow-sm font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Todos ({getIssuesCount('all')})
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'critical'
                ? 'bg-destructive text-destructive-foreground shadow-sm font-bold'
                : 'text-muted-foreground hover:text-destructive'
            }`}
          >
            Críticos ({getIssuesCount('critical')})
          </button>
          <button
            onClick={() => setActiveTab('serious')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'serious'
                ? 'bg-orange-500 text-white shadow-sm border border-orange-500/20 font-bold'
                : 'text-muted-foreground hover:text-orange-500'
            }`}
          >
            Serios ({getIssuesCount('serious')})
          </button>
          <button
            onClick={() => setActiveTab('moderate')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'moderate'
                ? 'bg-yellow-500 text-white shadow-sm border border-yellow-500/20 font-bold'
                : 'text-muted-foreground hover:text-yellow-500'
            }`}
          >
            Moderados ({getIssuesCount('moderate')})
          </button>
          <button
            onClick={() => setActiveTab('minor')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'minor'
                ? 'bg-secondary text-secondary-foreground shadow-sm border border-border font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Menores ({getIssuesCount('minor')})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {Object.values(groupedIssues).map((group) => (
          <FindingCard
            key={group.ruleId}
            group={group}
            isExpanded={!!expandedRules[group.ruleId]}
            onToggleExpand={() => toggleRuleExpanded(group.ruleId)}
          />
        ))}

        {Object.keys(groupedIssues).length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground text-sm">No se encontraron elementos de este tipo en la auditoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}
