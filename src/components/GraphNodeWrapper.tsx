/**
 * Product Evidence Graph - Custom Node Components
 * Renders different node types with appropriate styling and content
 */

'use client';

import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import {
  Quote2,
  AlertCircle,
  Layers,
  Users,
  SmilePlus,
  Lightbulb,
  TrendingUp,
  Zap,
  Target,
  CheckCircle,
  FileText,
  Map,
} from 'lucide-react';
import type {
  GraphNode as GraphNodeType,
  NodeData,
  GraphNodeType as NodeTypeEnum,
} from '@/lib/graphTypes';

interface BaseNodeProps {
  data: NodeData;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
}

const getNodeIcon = (nodeType: NodeTypeEnum) => {
  const iconProps = { className: 'w-4 h-4' };
  switch (nodeType) {
    case 'customerQuote':
      return <Quote2 {...iconProps} />;
    case 'painPoint':
      return <AlertCircle {...iconProps} />;
    case 'theme':
      return <Layers {...iconProps} />;
    case 'persona':
      return <Users {...iconProps} />;
    case 'sentiment':
      return <SmilePlus {...iconProps} />;
    case 'featureRequest':
      return <Lightbulb {...iconProps} />;
    case 'businessImpact':
      return <TrendingUp {...iconProps} />;
    case 'frequency':
      return <Zap {...iconProps} />;
    case 'opportunity':
      return <Target {...iconProps} />;
    case 'priority':
      return <CheckCircle {...iconProps} />;
    case 'prd':
      return <FileText {...iconProps} />;
    case 'roadmap':
      return <Map {...iconProps} />;
    default:
      return null;
  }
};

const getNodeColor = (nodeType: NodeTypeEnum) => {
  switch (nodeType) {
    case 'customerQuote':
      return { bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-200 dark:border-blue-800' };
    case 'painPoint':
      return { bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-200 dark:border-red-800' };
    case 'theme':
      return { bg: 'bg-purple-50 dark:bg-purple-950', border: 'border-purple-200 dark:border-purple-800' };
    case 'persona':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800' };
    case 'sentiment':
      return { bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-200 dark:border-amber-800' };
    case 'featureRequest':
      return { bg: 'bg-cyan-50 dark:bg-cyan-950', border: 'border-cyan-200 dark:border-cyan-800' };
    case 'businessImpact':
      return { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-200 dark:border-green-800' };
    case 'frequency':
      return { bg: 'bg-indigo-50 dark:bg-indigo-950', border: 'border-indigo-200 dark:border-indigo-800' };
    case 'opportunity':
      return { bg: 'bg-rose-50 dark:bg-rose-950', border: 'border-rose-200 dark:border-rose-800' };
    case 'priority':
      return { bg: 'bg-violet-50 dark:bg-violet-950', border: 'border-violet-200 dark:border-violet-800' };
    case 'prd':
      return { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950', border: 'border-fuchsia-200 dark:border-fuchsia-800' };
    case 'roadmap':
      return { bg: 'bg-teal-50 dark:bg-teal-950', border: 'border-teal-200 dark:border-teal-800' };
    default:
      return { bg: 'bg-slate-50 dark:bg-slate-950', border: 'border-slate-200 dark:border-slate-800' };
  }
};

const getIconColor = (nodeType: NodeTypeEnum) => {
  switch (nodeType) {
    case 'customerQuote':
      return 'text-blue-600 dark:text-blue-400';
    case 'painPoint':
      return 'text-red-600 dark:text-red-400';
    case 'theme':
      return 'text-purple-600 dark:text-purple-400';
    case 'persona':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'sentiment':
      return 'text-amber-600 dark:text-amber-400';
    case 'featureRequest':
      return 'text-cyan-600 dark:text-cyan-400';
    case 'businessImpact':
      return 'text-green-600 dark:text-green-400';
    case 'frequency':
      return 'text-indigo-600 dark:text-indigo-400';
    case 'opportunity':
      return 'text-rose-600 dark:text-rose-400';
    case 'priority':
      return 'text-violet-600 dark:text-violet-400';
    case 'prd':
      return 'text-fuchsia-600 dark:text-fuchsia-400';
    case 'roadmap':
      return 'text-teal-600 dark:text-teal-400';
    default:
      return 'text-slate-600 dark:text-slate-400';
  }
};

/**
 * Generic Node Wrapper - Used for all node types
 */
export const GraphNodeWrapper: React.FC<{
  nodeType: NodeTypeEnum;
  data: NodeData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ nodeType, data, isSelected, onSelect }) => {
  const colors = getNodeColor(nodeType);
  const iconColor = getIconColor(nodeType);
  const nodeData = data as any;
  const nodeId = nodeData.id;

  // Determine what content to show based on node type
  const getContent = () => {
    switch (nodeType) {
      case 'customerQuote':
        return (
          <>
            <p className="text-sm font-medium line-clamp-3 text-slate-900 dark:text-slate-100">{nodeData.quote}</p>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2">
              <span className="font-medium">{nodeData.customerName}</span>
              <span className="text-slate-500">{nodeData.sourceType}</span>
            </div>
          </>
        );
      case 'painPoint':
        return (
          <>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{nodeData.title}</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{nodeData.description}</p>
            <div className="flex items-center gap-2 text-xs pt-2">
              <span
                className={`px-2 py-1 rounded font-semibold ${
                  nodeData.severity === 'critical'
                    ? 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100'
                    : nodeData.severity === 'high'
                      ? 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100'
                      : 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100'
                }`}
              >
                {nodeData.severity}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs pt-1 border-t border-red-200 dark:border-red-800">
              <span>👥 {nodeData.affectedCustomers} customers</span>
            </div>
          </>
        );
      case 'theme':
        return (
          <>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{nodeData.name}</h3>
            <div className="text-xs text-slate-600 dark:text-slate-400 pt-2">
              <span className="inline-block bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 px-2 py-1 rounded text-xs font-medium">
                {nodeData.category}
              </span>
            </div>
          </>
        );
      case 'persona':
        return (
          <>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{nodeData.name}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">{nodeData.title}</p>
            {nodeData.company && <p className="text-xs text-slate-500 dark:text-slate-500">{nodeData.company}</p>}
          </>
        );
      case 'sentiment':
        return (
          <>
            <div
              className={`inline-block px-3 py-1 rounded font-bold text-sm ${
                nodeData.sentiment === 'positive'
                  ? 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100'
                  : nodeData.sentiment === 'negative'
                    ? 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100'
                    : nodeData.sentiment === 'mixed'
                      ? 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100'
                      : 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              }`}
            >
              {nodeData.sentiment}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 pt-2">{nodeData.reasoning}</p>
          </>
        );
      case 'featureRequest':
        return (
          <>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{nodeData.title}</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{nodeData.description}</p>
            <div className="text-xs text-slate-600 dark:text-slate-400 pt-2">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  nodeData.implementationEffort === 'low'
                    ? 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100'
                    : nodeData.implementationEffort === 'medium'
                      ? 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100'
                      : 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100'
                }`}
              >
                {nodeData.implementationEffort}
              </span>
            </div>
          </>
        );
      case 'businessImpact':
        return (
          <>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Score: <span className="text-lg">{nodeData.totalImpactScore}</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>
                ROI: <span className="font-bold">{nodeData.roiScore.toFixed(1)}x</span>
              </div>
              <div>
                Cost: <span className="font-bold">{nodeData.estimatedImplementationCost}</span>
              </div>
            </div>
          </>
        );
      case 'frequency':
        return (
          <>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              {nodeData.frequency}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-2">
              <div>
                Mentions: <span className="font-bold">{nodeData.mentionCount}</span>
              </div>
              <div>
                Customers: <span className="font-bold">{nodeData.percentageOfCustomers}%</span>
              </div>
            </div>
          </>
        );
      case 'opportunity':
        return (
          <>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{nodeData.title}</h3>
            <div className="text-xs text-slate-600 dark:text-slate-400 pt-2">
              <span className="inline-block bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100 px-2 py-1 rounded text-xs font-medium">
                {nodeData.opportunityType}
              </span>
            </div>
            {nodeData.marketSize && (
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 pt-1">
                Market: {nodeData.marketSize}
              </div>
            )}
          </>
        );
      case 'priority':
        return (
          <>
            <div
              className={`inline-block px-3 py-1 rounded font-bold text-sm uppercase ${
                nodeData.priority === 'critical'
                  ? 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100'
                  : nodeData.priority === 'high'
                    ? 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100'
                    : nodeData.priority === 'medium'
                      ? 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100'
                      : 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100'
              }`}
            >
              {nodeData.priority}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 pt-2">
              Score: <span className="text-lg">{nodeData.priorityScore}</span>
            </div>
          </>
        );
      case 'prd':
        return (
          <>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{nodeData.title}</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 pt-2">{nodeData.userStory}</p>
            <div className="text-xs pt-2">
              <span
                className={`inline-block px-2 py-1 rounded font-medium ${
                  nodeData.estimatedEffort === 'low'
                    ? 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100'
                    : nodeData.estimatedEffort === 'medium'
                      ? 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100'
                      : 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100'
                }`}
              >
                {nodeData.estimatedEffort}
              </span>
            </div>
          </>
        );
      case 'roadmap':
        return (
          <>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{nodeData.title}</h3>
            <div
              className={`inline-block px-2 py-1 rounded font-semibold text-xs uppercase pt-2 ${
                nodeData.status === 'delivered'
                  ? 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100'
                  : nodeData.status === 'in_progress'
                    ? 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100'
                    : 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              }`}
            >
              {nodeData.status}
            </div>
            {nodeData.quarter && (
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 pt-2">{nodeData.quarter}</div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(nodeId)}
      className={`
        rounded-lg border-2 p-3 cursor-pointer transition-all
        ${colors.bg} ${colors.border}
        ${isSelected ? `ring-2 ring-offset-2 dark:ring-offset-slate-950` : 'hover:shadow-md'}
        ${nodeType === 'customerQuote' ? 'w-64' : 'w-56'}
      `}
      style={
        isSelected
          ? {
              boxShadow: '0 0 0 3px rgba(var(--ring-color), 0.5)',
            }
          : undefined
      }
    >
      <Handle type="target" position={Position.Top} />

      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${iconColor}`}>
          {getNodeIcon(nodeType)}
          <span className="text-xs font-semibold uppercase tracking-wide">
            {nodeType
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())
              .trim()}
          </span>
        </div>

        {getContent()}

        <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
          <span>🎯 {nodeData.confidence}%</span>
          {nodeData.evidenceCount && <span>📊 {nodeData.evidenceCount}</span>}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
