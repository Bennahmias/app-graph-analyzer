import { Body, Controller, Param, Post } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalyzeGraphDto } from './dto/analyze-graph.dto';

@Controller('graphs/:id/analyze')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // Analyze a specific graph
  @Post()
  analyze(
    @Param('id') id: string,
    @Body() dto: AnalyzeGraphDto,
  ) {
    return this.analysisService.analyze(id, dto.maxPathLength);
  }
}


