import { IsOptional, IsNumber, Min, Max, IsBoolean } from 'class-validator';

export class AnalyzeGraphDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  maxPathLength?: number = 6;

  @IsOptional()
  @IsBoolean()
  includeAllPaths?: boolean = true;

  @IsOptional()
  @IsBoolean()
  calculateRiskLevels?: boolean = true;
}