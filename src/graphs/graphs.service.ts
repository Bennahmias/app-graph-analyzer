import { Injectable } from '@nestjs/common';
import { Graph } from '../common/types';
import { CreateGraphDto } from './dto/create-graph.dto';

@Injectable()
export class GraphsService {
  private graphs: Map<string, Graph> = new Map();

  /**
   * Create a new graph
   * @param createGraphDto Graph data
   * @returns The created graph with an ID
   */
  create(createGraphDto: CreateGraphDto): { id: string; graph: Graph } {
    const id = this.generateId();
    const graph: Graph = {
      nodes: createGraphDto.nodes,
      edges: createGraphDto.edges,
    };

    this.graphs.set(id, graph);
    return { id, graph };
  }

  /**
   * Get all graphs
   * @returns Array of graphs with their IDs
   */
  findAll(): { id: string; graph: Graph }[] {
    const result: { id: string; graph: Graph }[] = [];
    this.graphs.forEach((graph, id) => {
      result.push({ id, graph });
    });
    return result;
  }

  /**
   * Get a specific graph by ID
   * @param id Graph ID
   * @returns The graph or undefined if not found
   */
  findOne(id: string): Graph | undefined {
    return this.graphs.get(id);
  }

  /**
   * Update a graph
   * @param id Graph ID
   * @param updateGraphDto Updated graph data
   * @returns The updated graph or undefined if not found
   */
  update(id: string, updateGraphDto: CreateGraphDto): Graph | undefined {
    if (!this.graphs.has(id)) {
      return undefined;
    }

    const updatedGraph: Graph = {
      nodes: updateGraphDto.nodes,
      edges: updateGraphDto.edges,
    };

    this.graphs.set(id, updatedGraph);
    return updatedGraph;
  }

  /**
   * Delete a graph
   * @param id Graph ID
   * @returns True if deleted, false if not found
   */
  remove(id: string): boolean {
    return this.graphs.delete(id);
  }

  /**
   * Generate a unique ID for a graph
   * @returns A unique string ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}