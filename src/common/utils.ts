import { Graph, Node, Edge } from './types';

export class GraphUtils {
  /**
   * Breadth-First Search algorithm
   * @param graph The graph to search
   * @param startNodeId Starting node ID
   * @param endNodeId Target node ID
   * @returns Array of node IDs representing the shortest path
   */
  static bfs(graph: Graph, startNodeId: string, endNodeId: string): string[] {
    if (startNodeId === endNodeId) {
      return [startNodeId];
    }

    const visited = new Set<string>();
    const queue: { nodeId: string; path: string[] }[] = [
      { nodeId: startNodeId, path: [startNodeId] }
    ];

    // Create adjacency list for faster lookups
    const adjacencyList = this.createAdjacencyList(graph);

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;

      if (visited.has(nodeId)) {
        continue;
      }

      visited.add(nodeId);

      if (nodeId === endNodeId) {
        return path;
      }

      const neighbors = adjacencyList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({
            nodeId: neighbor,
            path: [...path, neighbor]
          });
        }
      }
    }

    return []; // No path found
  }

  /**
   * Create an adjacency list representation of the graph
   * @param graph The graph to convert
   * @returns Map of node ID to array of connected node IDs
   */
  static createAdjacencyList(graph: Graph): Map<string, string[]> {
    const adjacencyList = new Map<string, string[]>();

    // Initialize all nodes
    graph.nodes.forEach(node => {
      adjacencyList.set(node.id, []);
    });

    // Add edges
    graph.edges.forEach(edge => {
      const fromNeighbors = adjacencyList.get(edge.from) || [];
      fromNeighbors.push(edge.to);
      adjacencyList.set(edge.from, fromNeighbors);

      // For undirected graph, add reverse edge
      const toNeighbors = adjacencyList.get(edge.to) || [];
      toNeighbors.push(edge.from);
      adjacencyList.set(edge.to, toNeighbors);
    });

    return adjacencyList;
  }

  /**
   * Find all connected components in the graph
   * @param graph The graph to analyze
   * @returns Array of arrays, each containing node IDs of a connected component
   */
  static findConnectedComponents(graph: Graph): string[][] {
    const visited = new Set<string>();
    const components: string[][] = [];
    const adjacencyList = this.createAdjacencyList(graph);

    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        const component = this.dfsComponent(node.id, adjacencyList, visited);
        components.push(component);
      }
    }

    return components;
  }

  /**
   * Depth-First Search to find a connected component
   * @param nodeId Starting node ID
   * @param adjacencyList Graph adjacency list
   * @param visited Set of visited nodes
   * @returns Array of node IDs in the connected component
   */
  private static dfsComponent(
    nodeId: string,
    adjacencyList: Map<string, string[]>,
    visited: Set<string>
  ): string[] {
    const component: string[] = [];
    const stack = [nodeId];

    while (stack.length > 0) {
      const currentNode = stack.pop()!;

      if (!visited.has(currentNode)) {
        visited.add(currentNode);
        component.push(currentNode);

        const neighbors = adjacencyList.get(currentNode) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }

    return component;
  }

  /**
   * Calculate the diameter of the graph (longest shortest path)
   * @param graph The graph to analyze
   * @returns The diameter of the graph
   */
  static calculateDiameter(graph: Graph): number {
    let maxDistance = 0;

    for (const startNode of graph.nodes) {
      for (const endNode of graph.nodes) {
        if (startNode.id !== endNode.id) {
          const path = this.bfs(graph, startNode.id, endNode.id);
          if (path.length > 0) {
            maxDistance = Math.max(maxDistance, path.length - 1);
          }
        }
      }
    }

    return maxDistance;
  }
}