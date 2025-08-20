
export enum Generation {
  GEN_ALPHA = 'Gen α',
  GEN_Z = 'Gen Z',
  MILLENNIAL = 'Millennial',
  GEN_X = 'Gen X',
  BOOMER = 'Boomer',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface Persona {
  generation: Generation;
  gender: Gender;
}

export interface Theme {
  name: string;
  bg: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  font: string;
  botName: string;
  avatar: string;
  placeholder: string;
  prompt: string;
}

export interface PersonaProfile {
  botName: string;
  avatar: string;
  prompt: string;
}