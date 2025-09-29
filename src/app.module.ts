import { Module } from '@nestjs/common';
import { GraphsController } from './graphs/graphs.controller';
import { GraphsService } from './graphs/graphs.service';
import { AnalysisController } from './analysis/analysis.controller';
import { AnalysisService } from './analysis/analysis.service';

@Module({
  imports: [],
  controllers: [GraphsController, AnalysisController],
  providers: [GraphsService, AnalysisService],
})
export class AppModule {}