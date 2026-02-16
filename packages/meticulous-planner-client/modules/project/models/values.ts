export type ProjectId = string & { readonly __brand: 'ProjectId' };
export const ProjectId = (value: string) => value as ProjectId;
