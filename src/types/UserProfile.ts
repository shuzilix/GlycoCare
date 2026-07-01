export type DiabetesType = 'type1' | 'type2' | 'prediabetes' | 'gestational';

export interface UserProfile {
  diabetesType: DiabetesType;
  dailyCarbLimitG: number;
  onboardingComplete: boolean;
}
