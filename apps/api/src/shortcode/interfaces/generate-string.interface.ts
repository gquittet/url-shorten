export interface GenerateString {
  next(): string;
}

export const GenerateString = Symbol('GenerateString');
