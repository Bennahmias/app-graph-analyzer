import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateGraphDto } from './dto/create-graph.dto';

@Injectable()
export class GraphsService {
  private graphs = new Map<string, CreateGraphDto>();

  create(dto: CreateGraphDto) {
  if (this.graphs.has(dto.graphId)) {
    throw new HttpException(
        `Graph with ID ${dto.graphId} already exists`,
        HttpStatus.BAD_REQUEST,
      );
  }

  const nodeIds = new Set(dto.nodes.map(n => n.id));
  for (const edge of dto.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      throw new HttpException(
          `Invalid edge: ${edge.from} -> ${edge.to} (node not found)`,
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  this.graphs.set(dto.graphId, dto);
  return { message: 'Graph created', graphId: dto.graphId };
}


  findOne(id: string) {
    return this.graphs.get(id);
  }

  findAll() {
    return Array.from(this.graphs.values());
  }
}
