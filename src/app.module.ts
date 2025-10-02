import { Module } from '@nestjs/common';
import { GraphsModule } from './graphs/graphs.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [GraphsModule, AnalysisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
