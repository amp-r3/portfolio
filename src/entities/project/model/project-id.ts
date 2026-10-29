export const projectIds = ['palma', 'store'] as const;
export type ProjectId = typeof projectIds[number];

export function isProjectId(id: string): id is ProjectId {
  return projectIds.some((projectId) => projectId === id);
}
