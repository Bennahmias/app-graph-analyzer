import { Body, Controller, Param, Post } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('graphs/:id/analyze')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // Analyze a specific graph
  @Post()
  analyze(
    @Param('id') id: string,
    @Body('maxPathLength') maxPathLength?: number,
  ) {
    return this.analysisService.analyze(id, maxPathLength);
  }
}


