export const AppStatus = { LOADING: 0, SUCCESS: 1, ERROR: 2 } as const;
export const UserRole = { ASSOCIATE: 'Associate', MANAGER: 'Manager' } as const;
// Set the default role here to switch app persona without using the UI toggle
export const DEFAULT_USER_ROLE: string = UserRole.ASSOCIATE; // change to UserRole.MANAGER to default to Executive
export const HomeTabs = { DASHBOARD: 'Dashboard', TASK: 'Task', LEARNING: 'Learning' } as const;
export const ResourceTabs = { DOC: 'Doc Course', VIDEO: 'Video Course' } as const;
export const TaskPriority = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 } as const;
export const TaskStatus = { YET_TO_START: 1, IN_PROGRESS: 2, COMPLETED: 3, OVER_DUE: 4 } as const;
export const TrainingStatus = { IN_PROGRESS: 1, COMPLETED: 2 } as const;
export const TrainingType = { WEEKLY: 1, ASSIGNED: 2 } as const;
export const ResourceType = { MP4: '.mp4', PDF: '.pdf' } as const;
