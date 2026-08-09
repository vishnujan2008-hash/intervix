import curriculumRaw from '../../data/curriculum.json';
import { CurriculumModule, CurriculumDay } from '../../types/data';

class CurriculumServiceClass {
  private modulesCache: CurriculumModule[] = [];
  private dayMapCache: Map<number, CurriculumDay> = new Map();

  constructor() {
    this.init();
  }

  private init(): void {
    this.modulesCache = (curriculumRaw as any).modules || [];
    for (const mod of this.modulesCache) {
      for (const day of mod.days) {
        this.dayMapCache.set(day.dayNumber, day as CurriculumDay);
      }
    }
  }

  public getModules(): CurriculumModule[] {
    return this.modulesCache;
  }

  public getDay(dayNumber: number): CurriculumDay | undefined {
    return this.dayMapCache.get(dayNumber);
  }

  public getObjectives(dayNumber: number): string[] {
    const day = this.getDay(dayNumber);
    return day ? day.objectives : [];
  }

  public getTools(dayNumber: number): string[] {
    const day = this.getDay(dayNumber);
    return day ? day.tools : [];
  }

  public getCurrentModule(dayNumber: number): CurriculumModule | undefined {
    const day = this.getDay(dayNumber);
    if (!day) return undefined;
    return this.modulesCache.find(m => m.moduleNumber === day.moduleNumber);
  }

  public getAllDays(): CurriculumDay[] {
    return Array.from(this.dayMapCache.values());
  }
}

export const CurriculumService = new CurriculumServiceClass();
