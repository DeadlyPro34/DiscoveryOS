/**
 * Product Evidence Graph - Zustand Store
 * Centralized state management for graph visualization and interaction
 */

'use client';

import { create } from 'zustand';
import type {
  GraphNode,
  ConfidenceEdge,
  FilterCriteria,
  GraphNodeType,
  SentimentLevel,
  PriorityLevel,
} from '@/lib/graphTypes';
import { MOCK_NODES, MOCK_EDGES } from '@/lib/mock-data/evidenceGraphMockData';

interface GraphStore {
  // State
  nodes: GraphNode[];
  edges: ConfidenceEdge[];
  selectedNodeId: string | null;
  filteredNodeIds: Set<string>;
  searchTerm: string;
  filterCriteria: FilterCriteria;
  zoom: number;
  expandedPanels: Set<string>;

  // Actions
  setNodes: (nodes: GraphNode[]) => void;
  setEdges: (edges: ConfidenceEdge[]) => void;
  selectNode: (nodeId: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFilterCriteria: (criteria: Partial<FilterCriteria>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  setZoom: (zoom: number) => void;
  toggleExpandedPanel: (panelId: string) => void;

  // Helpers
  getNodeById: (id: string) => GraphNode | undefined;
  getRelatedNodes: (nodeId: string) => GraphNode[];
  getDownstreamNodes: (nodeId: string) => GraphNode[];
  getUpstreamNodes: (nodeId: string) => GraphNode[];
  getNodeStats: (nodeId: string) => {
    connections: number;
    downstreamNodes: number;
    upstreamNodes: number;
  };
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  // Initial state
  nodes: MOCK_NODES,
  edges: MOCK_EDGES,
  selectedNodeId: null,
  filteredNodeIds: new Set(MOCK_NODES.map((n) => n.id)),
  searchTerm: '',
  filterCriteria: {},
  zoom: 1,
  expandedPanels: new Set(),

  // Basic actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },

  setFilterCriteria: (criteria) => {
    set((state) => ({
      filterCriteria: { ...state.filterCriteria, ...criteria },
    }));
    get().applyFilters();
  },

  resetFilters: () => {
    const { nodes } = get();
    set({
      searchTerm: '',
      filterCriteria: {},
      filteredNodeIds: new Set(nodes.map((n) => n.id)),
    });
  },

  applyFilters: () => {
    const { nodes, edges, searchTerm, filterCriteria } = get();
    let filtered = new Set(nodes.map((n) => n.id));

    // Search filter
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = new Set(
        nodes
          .filter((node) => {
            const data = node.data as any;
            const quote = data.quote?.toLowerCase() || '';
            const title = data.title?.toLowerCase() || '';
            const name = data.name?.toLowerCase() || '';
            const customerName = data.customerName?.toLowerCase() || '';
            const description = data.description?.toLowerCase() || '';

            return (
              quote.includes(lowerSearchTerm) ||
              title.includes(lowerSearchTerm) ||
              name.includes(lowerSearchTerm) ||
              customerName.includes(lowerSearchTerm) ||
              description.includes(lowerSearchTerm)
            );
          })
          .map((n) => n.id)
      );
    }

    // Node type filter
    if (filterCriteria.nodeTypes && filterCriteria.nodeTypes.length > 0) {
      filtered = new Set([
        ...Array.from(filtered).filter((id) => {
          const node = nodes.find((n) => n.id === id);
          return node && filterCriteria.nodeTypes?.includes(node.type as GraphNodeType);
        }),
      ]);
    }

    // Confidence filter
    if (filterCriteria.minConfidence !== undefined) {
      filtered = new Set([
        ...Array.from(filtered).filter((id) => {
          const node = nodes.find((n) => n.id === id);
          if (!node) return false;
          const data = node.data as any;
          return data.confidence >= filterCriteria.minConfidence!;
        }),
      ]);
    }

    // Priority filter
    if (filterCriteria.priorityLevels && filterCriteria.priorityLevels.length > 0) {
      filtered = new Set([
        ...Array.from(filtered).filter((id) => {
          const node = nodes.find((n) => n.id === id);
          if (!node || node.type !== 'priority') return false;
          const data = node.data as any;
          return filterCriteria.priorityLevels?.includes(data.priority as PriorityLevel);
        }),
      ]);
    }

    // Sentiment filter
    if (filterCriteria.sentimentLevels && filterCriteria.sentimentLevels.length > 0) {
      filtered = new Set([
        ...Array.from(filtered).filter((id) => {
          const node = nodes.find((n) => n.id === id);
          if (!node || node.type !== 'sentiment') return false;
          const data = node.data as any;
          return filterCriteria.sentimentLevels?.includes(data.sentiment as SentimentLevel);
        }),
      ]);
    }

    // Persona filter
    if (filterCriteria.personaIds && filterCriteria.personaIds.length > 0) {
      filtered = new Set([
        ...Array.from(filtered).filter((id) => {
          const node = nodes.find((n) => n.id === id);
          if (!node || node.type !== 'persona') return false;
          return filterCriteria.personaIds?.includes(node.id);
        }),
      ]);
    }

    // Theme filter
    if (filterCriteria.themeIds && filterCriteria.themeIds.length > 0) {
      filtered = new Set([
        ...Array.from(filtered).filter((id) => {
          const node = nodes.find((n) => n.id === id);
          if (!node || node.type !== 'theme') return false;
          return filterCriteria.themeIds?.includes(node.id);
        }),
      ]);
    }

    set({ filteredNodeIds: filtered });
  },

  setZoom: (zoom) => set({ zoom }),

  toggleExpandedPanel: (panelId) => {
    set((state) => {
      const newPanels = new Set(state.expandedPanels);
      if (newPanels.has(panelId)) {
        newPanels.delete(panelId);
      } else {
        newPanels.add(panelId);
      }
      return { expandedPanels: newPanels };
    });
  },

  // Helper methods
  getNodeById: (id) => {
    const { nodes } = get();
    return nodes.find((n) => n.id === id);
  },

  getRelatedNodes: (nodeId) => {
    const { nodes, edges } = get();
    const relatedIds = new Set<string>();
    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        relatedIds.add(edge.target);
      } else if (edge.target === nodeId) {
        relatedIds.add(edge.source);
      }
    });
    return Array.from(relatedIds)
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean) as GraphNode[];
  },

  getDownstreamNodes: (nodeId) => {
    const { nodes, edges } = get();
    const visited = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      edges.forEach((edge) => {
        if (edge.source === currentId && !visited.has(edge.target)) {
          queue.push(edge.target);
        }
      });
    }

    visited.delete(nodeId);
    return Array.from(visited)
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean) as GraphNode[];
  },

  getUpstreamNodes: (nodeId) => {
    const { nodes, edges } = get();
    const visited = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      edges.forEach((edge) => {
        if (edge.target === currentId && !visited.has(edge.source)) {
          queue.push(edge.source);
        }
      });
    }

    visited.delete(nodeId);
    return Array.from(visited)
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean) as GraphNode[];
  },

  getNodeStats: (nodeId) => {
    const { nodes, edges } = get();
    const relatedIds = new Set<string>();
    let connections = 0;

    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        relatedIds.add(edge.target);
        connections++;
      } else if (edge.target === nodeId) {
        relatedIds.add(edge.source);
        connections++;
      }
    });

    const downstreamNodes = get().getDownstreamNodes(nodeId);
    const upstreamNodes = get().getUpstreamNodes(nodeId);

    return {
      connections,
      downstreamNodes: downstreamNodes.length,
      upstreamNodes: upstreamNodes.length,
    };
  },
}));
