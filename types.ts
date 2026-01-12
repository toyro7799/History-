export type FormAnswers = Record<string, string>;

export interface SectionProps {
  answers: FormAnswers;
  onChange: (id: string, value: string) => void;
}