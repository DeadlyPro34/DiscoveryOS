/**
 * Product Evidence Graph - Custom Hooks
 * Reusable logic for graph interaction, filtering, and search
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useGraphStore } from '@/lib/stores/graphStore';
import type {
  GraphNode,
  ConfidenceEdge,
  FilterCriteria,
  GraphNodeType,
  SentimentLevel,
  PriorityLevel,
} from '@/lib/graphTypes';

/**
 * Hook for managing node selection
 */
export const useNodeSelection = () => {
  const selectedNodeId = useGraphStore((state) => state.selectedNodeId);
  const selectNode = useGraphStore((state) => state.selectNode);
  const getNodeById = useGraphStore((state) => state.getNodeById);

  const selectedNode = useMemo(
    () => (selectedNodeId ? getNodeById(selectedNodeId) : null),
    [selectedNodeId, getNodeById]
  );

  const handleSelectNode = useCallback(
    (nodeId: string | null) => {
      selectNode(nodeId);
    },
    [selectNode]
  );

  return {
    selectedNodeId,
    selectedNode,
    selectNode: handleSelectNode,
  };
};

/**
 * Hook for managing search and filtering
 */
export const useGraphSearch = () => {
  const searchTerm = useGraphStore((state) => state.searchTerm);
  const filterCriteria = useGraphStore((state) => state.filterCriteria);
  const filteredNodeIds = useGraphStore((state) => state.filteredNodeIds);
  const setSearchTerm = useGraphStore((state) => state.setSearchTerm);
  const setFilterCriteria = useGraphStore((state) => state.setFilterCriteria);
  const resetFilters = useGraphStore((state) => state.resetFilters);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
    },
    [setSearchTerm]
  );

  const handleFilterByType = useCallback(
    (types: GraphNodeType[]) => {
      setFilterCriteria({ nodeTypes: types.length > 0 ? types : undefined });
    },
    [setFilterCriteria]
  );

  const handleFilterByPriority = useCallback(
    (priorities: PriorityLevel[]) => {
      setFilterCriteria({ priorityLevels: priorities.length > 0 ? priorities : undefined });
    },
    [setFilterCriteria]
  );

  const handleFilterBySentiment = useCallback(
    (sentiments: SentimentLevel[]) => {
      setFilterCriteria({ sentimentLevels: sentiments.length > 0 ? sentiments : undefined });
    },
    [setFilterCriteria]
  );

  const handleFilterByPersona = useCallback(
    (personaIds: string[]) => {
      setFilterCriteria({ personaIds: personaIds.length > 0 ? personaIds : undefined });
    },
    [setFilterCriteria]
  );

  const handleFilterByTheme = useCallback(
    (themeIds: string[]) => {
      setFilterCriteria({ themeIds: themeIds.length > 0 ? themeIds : undefined });
    },
    [setFilterCriteria]
  );

  const handleFilterByConfidence = useCallback(
    (minConfidence: number) => {
      setFilterCriteria({ minConfidence: minConfidence > 0 ? minConfidence : undefined });
    },
    [setFilterCriteria]
  );

  const handleReset = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const isFiltered = useMemo(() => {
    return searchTerm.length > 0 || Object.keys(filterCriteria).length > 0;
  }, [searchTerm, filterCriteria]);

  return {
    searchTerm,
    filterCriteria,
    filteredNodeIds,
    isFiltered,
    handleSearch,
    handleFilterByType,
    handleFilterByPriority,
    handleFilterBySentiment,
    handleFilterByPersona,
    handleFilterByTheme,
    handleFilterByConfidence,
    handleReset,
  };
};

/**
 * Hook for node relationships
 */
export const useNodeRelationships = (nodeId: string | null) => {
  const getRelatedNodes = useGraphStore((state) => state.getRelatedNodes);
  const getDownstreamNodes = useGraphStore((state) => state.getDownstreamNodes);
  const getUpstreamNodes = useGraphStore((state) => state.getUpstreamNodes);
  const getNodeStats = useGraphStore((state) => state.getNodeStats);

  const relatedNodes = useMemo(
    () => (nodeId ? getRelatedNodes(nodeId) : []),
    [nodeId, getRelatedNodes]
  );

  const downstreamNodes = useMemo(
    () => (nodeId ? getDownstreamNodes(nodeId) : []),
    [nodeId, getDownstreamNodes]
  );

  const upstreamNodes = useMemo(
    () => (nodeId ? getUpstreamNodes(nodeId) : []),
    [nodeId, getUpstreamNodes]
  );

  const stats = useMemo(
    () => (nodeId ? getNodeStats(nodeId) : { connections: 0, downstreamNodes: 0, upstreamNodes: 0 }),
    [nodeId, getNodeStats]
  );

  return {
    relatedNodes,
    downstreamNodes,
    upstreamNodes,
    stats,
  };
};

/**
 * Hook for graph layout and zoom
 */
export const useGraphLayout = () => {
  const zoom = useGraphStore((state) => state.zoom);
  const setZoom = useGraphStore((state) => state.setZoom);

  const handleZoomIn = useCallback(() => {
    setZoom(Math.min(zoom + 0.1, 2));
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  }, [zoom, setZoom]);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, [setZoom]);

  const handleFitToScreen = useCallback(() => {
    // This would be handled by React Flow's fitView
  }, []);

  return {
    zoom,
    setZoom,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleFitToScreen,
  };
};

/**
 * Hook for expanded panels state
 */
export const useExpandedPanels = () => {
  const expandedPanels = useGraphStore((state) => state.expandedPanels);
  const toggleExpandedPanel = useGraphStore((state) => state.toggleExpandedPanel);

  const isExpanded = useCallback(
    (panelId: string) => expandedPanels.has(panelId),
    [expandedPanels]
  );

  const handleToggle = useCallback(
    (panelId: string) => {
      toggleExpandedPanel(panelId);
    },
    [toggleExpandedPanel]
  );

  return {
    expandedPanels,
    isExpanded,
    handleToggle,
  };
};

/**
 * Hook for getting visible nodes and edges based on filters
 */
export const useVisibleGraphElements = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const filteredNodeIds = useGraphStore((state) => state.filteredNodeIds);

  const visibleNodes = useMemo(
    () => nodes.filter((node) => filteredNodeIds.has(node.id)),
    [nodes, filteredNodeIds]
  );

  const visibleEdges = useMemo(() => {
    return edges.filter(
      (edge) => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
  }, [edges, filteredNodeIds]);

  const nodeTypeCount = useMemo(() => {
    const counts: Record<GraphNodeType, number> = {} as Record<GraphNodeType, number>;
    visibleNodes.forEach((node) => {
      counts[node.type] = (counts[node.type] || 0) + 1;
    });
    return counts;
  }, [visibleNodes]);

  const confidenceStats = useMemo(() => {
    if (visibleNodes.length === 0) {
      return { average: 0, min: 0, max: 0 };
    }

    const confidences = visibleNodes
      .map((node) => (node.data as any).confidence || 0)
      .sort((a, b) => a - b);

    const average = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    const min = confidences[0];
    const max = confidences[confidences.length - 1];

    return { average: Math.round(average), min, max };
  }, [visibleNodes]);

  return {
    visibleNodes,
    visibleEdges,
    nodeTypeCount,
    confidenceStats,
    totalVisible: visibleNodes.length,
    hiddenCount: nodes.length - visibleNodes.length,
  };
};

/**
 * Hook for node path tracing (upstream to downstream)
 */
export const useNodePath = (nodeId: string | null) => {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const getUpstreamNodes = useGraphStore((state) => state.getUpstreamNodes);
  const getDownstreamNodes = useGraphStore((state) => state.getDownstreamNodes);

  const getFullPath = useCallback((): string[] => {
    if (!nodeId) return [];

    const upstreamNodes = getUpstreamNodes(nodeId);
    const downstreamNodes = getDownstreamNodes(nodeId);

    return [...upstreamNodes.map((n) => n.id), nodeId, ...downstreamNodes.map((n) => n.id)];
  }, [nodeId, getUpstreamNodes, getDownstreamNodes]);

  const pathNodes = useMemo(() => {
    return getFullPath()
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean) as GraphNode[];
  }, [getFullPath, nodes]);

  const pathConfidence = useMemo(() => {
    if (pathNodes.length === 0) return 0;
    const confidences = pathNodes.map((n) => (n.data as any).confidence || 0);
    return Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length);
  }, [pathNodes]);

  return {
    pathNodes,
    pathConfidence,
    pathLength: pathNodes.length,
  };
};
