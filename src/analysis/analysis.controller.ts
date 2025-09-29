import { Controller, Get, Post, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalyzeGraphDto } from './dto/analyze-graph.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  /**
   * Perform comprehensive graph analysis
   * @param analyzeGraphDto Analysis parameters
   * @returns Analysis results
   */
  @Post()
  analyze(@Body() analyzeGraphDto: AnalyzeGraphDto) {
    try {
      return this.analysisService.analyze(analyzeGraphDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Analysis failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get shortest path between two nodes
   * @param graphId Graph ID
   * @param startNodeId Starting node ID
   * @param endNodeId Target node ID
   * @returns Shortest path
   */
  @Get(':graphId/shortest-path')
  getShortestPath(
    @Param('graphId') graphId: string,
    @Query('start') startNodeId: string,
    @Query('end') endNodeId: string
  ) {
    if (!startNodeId || !endNodeId) {
      throw new HttpException(
        'Both start and end node IDs are required',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const path = this.analysisService.getShortestPath(graphId, startNodeId, endNodeId);
      return {
        graphId,
        startNodeId,
        endNodeId,
        path,
        pathLength: path.length > 0 ? path.length - 1 : -1,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to calculate shortest path',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get connected components of a graph
   * @param graphId Graph ID
   * @returns Connected components
   */
  @Get(':graphId/connected-components')
  getConnectedComponents(@Param('graphId') graphId: string) {
    try {
      const components = this.analysisService.getConnectedComponents(graphId);
      return {
        graphId,
        connectedComponents: components,
        componentCount: components.length,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to calculate connected components',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get the diameter of a graph
   * @param graphId Graph ID
   * @returns Graph diameter
   */
  @Get(':graphId/diameter')
  getDiameter(@Param('graphId') graphId: string) {
    try {
      const diameter = this.analysisService.getDiameter(graphId);
      return {
        graphId,
        diameter,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to calculate diameter',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}