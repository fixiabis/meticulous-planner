export type ProjectId = string & { _type: 'project-id' };
export const ProjectId = (value: string) => value as ProjectId;
