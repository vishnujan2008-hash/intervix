import { INITIAL_CURRICULUM } from '../data/mockData';
import { CurriculumTopic } from '../types';

export class CurriculumEngine {
  private curriculum: CurriculumTopic[] = INITIAL_CURRICULUM;

  public getTopicByDay(day: number): CurriculumTopic | undefined {
    return this.curriculum.find(c => c.day === day);
  }

  public getCurriculum(): CurriculumTopic[] {
    return [...this.curriculum];
  }

  public updateTopicStatus(day: number, status: 'pending' | 'current' | 'completed'): void {
    this.curriculum = this.curriculum.map(c => c.day === day ? { ...c, status } : c);
  }
}
