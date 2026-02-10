
export enum UserRole {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Task {
  id: string;
  projectId: string;
  assigneeId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  progressPercent: number;
  weight: number; // 업무별 가중치 (전체 진행률 계산용)
  fileAttachments: Attachment[];
}
