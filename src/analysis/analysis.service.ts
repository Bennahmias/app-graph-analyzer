import { Injectable } from '@nestjs/common';
import { GraphsService } from '../graphs/graphs.service';
import { GraphAnalysisResult } from '../common/types';
import { GraphUtils } from '../common/utils';
import { AnalyzeGraphDto } from './dto/analyze-graph.dto';

@Injectable()
export class AnalysisService {
  constructor(private readonly graphsService: GraphsService) {}

  /**
   * Analyze a graph with various metrics
   * @param analyzeGraphDto Analysis parameters
   * @returns Analysis results
   */
  analyze(analyzeGraphDto: AnalyzeGraphDto): GraphAnalysisResult {
    const graph = this.graphsService.findOne(analyzeGraphDto.graphId);
    
    if (!graph) {
      throw new Error('Graph not found');
    }

    const result: GraphAnalysisResult = {
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
    };

    // Calculate shortest path if requested and both nodes are provided
    if (
      analyzeGraphDto.includeShortestPath &&
      analyzeGraphDto.startNodeId &&
      analyzeGraphDto.endNodeId
    ) {
      const shortestPath = GraphUtils.bfs(
        graph,
        analyzeGraphDto.startNodeId,
        analyzeGraphDto.endNodeId
      );
      result.shortestPath = shortestPath.length > 0 ? shortestPath : undefined;
    }

    // Calculate connected components if requested
    if (analyzeGraphDto.includeConnectedComponents) {
      result.connectedComponents = GraphUtils.findConnectedComponents(graph);
    }

    // Calculate diameter if requested
    if (analyzeGraphDto.includeDiameter) {
      result.diameter = GraphUtils.calculateDiameter(graph);
    }

    return result;
  }

  /**
   * Get shortest path between two nodes
   * @param graphId Graph ID
   * @param startNodeId Starting node ID
   * @param endNodeId Target node ID
   * @returns Shortest path as array of node IDs
   */
  getShortestPath(graphId: string, startNodeId: string, endNodeId: string): string[] {
    const graph = this.graphsService.findOne(graphId);
    
    if (!graph) {
      throw new Error('Graph not found');
    }

    return GraphUtils.bfs(graph, startNodeId, endNodeId);
  }

  /**
   * Get connected components of a graph
   * @param graphId Graph ID
   * @returns Array of connected components
   */
  getConnectedComponents(graphId: string): string[][] {
    const graph = this.graphsService.findOne(graphId);
    
    if (!graph) {
      throw new Error('Graph not found');
    }

    return GraphUtils.findConnectedComponents(graph);
  }

  /**
   * Get the diameter of a graph
   * @param graphId Graph ID
   * @returns The diameter of the graph
   */
  getDiameter(graphId: string): number {
    const graph = this.graphsService.findOne(graphId);
    
    if (!graph) {
      throw new Error('Graph not found');
    }

    return GraphUtils.calculateDiameter(graph);
  }
}