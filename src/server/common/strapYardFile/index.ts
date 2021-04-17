export interface ParsedDefinitionStep {
  name?: string;
  command: string;
}

export interface ParsedDefinitionFile {
  repositoryUrl: string;
  rawFile: string;
  name?: string;
  description?: string;
  steps: ParsedDefinitionStep[];
}

export interface ValidDefinitionFile {
  name?: string;
  description?: string;
  steps: (string | ParsedDefinitionStep)[];
}

export { parseDefinition } from "./parseDefinition";
