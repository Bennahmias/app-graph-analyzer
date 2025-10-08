import { bfs } from '../src/common/utils';
import { Graph } from '../src/common/types';

describe('Utils', () => {
  describe('bfs', () => {
    const mockGraph: Graph = {
      graphId: 'test-graph',
      nodes: [
        { id: 'node1', name: 'Node 1', sensitive: false },
        { id: 'node2', name: 'Node 2', sensitive: true },
        { id: 'node3', name: 'Node 3', sensitive: false },
        { id: 'node4', name: 'Node 4', sensitive: true },
      ],
      edges: [
        { from: 'node1', to: 'node2' },
        { from: 'node2', to: 'node3' },
        { from: 'node3', to: 'node4' },
      ],
    };

    it('should find direct path to sensitive node', () => {
      const result = bfs(mockGraph, 'node1', ['node2'], 6);

      expect(result.reachable).toBe(true);
      expect(result.path).toEqual(['node1', 'node2']);
    });

    it('should find path to sensitive node through multiple hops', () => {
      const result = bfs(mockGraph, 'node1', ['node4'], 6);

      expect(result.reachable).toBe(true);
      expect(result.path).toEqual(['node1', 'node2', 'node3', 'node4']);
    });

    it('should return false when no path exists', () => {
      const disconnectedGraph: Graph = {
        ...mockGraph,
        edges: [{ from: 'node1', to: 'node2' }], // node3 and node4 disconnected
      };

      const result = bfs(disconnectedGraph, 'node1', ['node4'], 6);

      expect(result.reachable).toBe(false);
      expect(result.path).toBeUndefined();
    });

    it('should respect maxLength parameter', () => {
      const result = bfs(mockGraph, 'node1', ['node4'], 2);

      expect(result.reachable).toBe(false);
      expect(result.path).toBeUndefined();
    });

    it('should return true if start node is sensitive', () => {
      const result = bfs(mockGraph, 'node2', ['node2'], 6);

      expect(result.reachable).toBe(true);
      expect(result.path).toEqual(['node2']);
    });

    it('should handle empty sensitive nodes array', () => {
      const result = bfs(mockGraph, 'node1', [], 6);

      expect(result.reachable).toBe(false);
      expect(result.path).toBeUndefined();
    });
  });
});