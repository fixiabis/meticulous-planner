import { Model } from '../../model/models/model';
import { CodeFile } from '../models/code-file';
import { CodeLanguage } from '../models/values';

export interface CodeFileGenerator {
  generateCodeFile(language: CodeLanguage, models: Model[]): Promise<CodeFile>;
}
