import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { CreateGraphDto } from './dto/create-graph.dto';

@Controller('graphs')
export class GraphsController {
  constructor(private readonly graphsService: GraphsService) {}

  /**
   * Create a new graph
   * @param createGraphDto Graph data
   * @returns Created graph with ID
   */
  @Post()
  create(@Body() createGraphDto: CreateGraphDto) {
    try {
      return this.graphsService.create(createGraphDto);
    } catch (error) {
      throw new HttpException('Failed to create graph', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Get all graphs
   * @returns Array of all graphs
   */
  @Get()
  findAll() {
    return this.graphsService.findAll();
  }

  /**
   * Get a specific graph by ID
   * @param id Graph ID
   * @returns The requested graph
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    const graph = this.graphsService.findOne(id);
    if (!graph) {
      throw new HttpException('Graph not found', HttpStatus.NOT_FOUND);
    }
    return { id, graph };
  }

  /**
   * Update a graph
   * @param id Graph ID
   * @param updateGraphDto Updated graph data
   * @returns Updated graph
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGraphDto: CreateGraphDto) {
    const updatedGraph = this.graphsService.update(id, updateGraphDto);
    if (!updatedGraph) {
      throw new HttpException('Graph not found', HttpStatus.NOT_FOUND);
    }
    return { id, graph: updatedGraph };
  }

  /**
   * Delete a graph
   * @param id Graph ID
   * @returns Success message
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    const deleted = this.graphsService.remove(id);
    if (!deleted) {
      throw new HttpException('Graph not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Graph deleted successfully' };
  }
}