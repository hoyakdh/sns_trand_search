import { randomUUID } from "crypto";
import type { AnalysisJob, AnalysisResult, JobStatus } from "./types";

const jobs = new Map<string, AnalysisJob>();

export function createJob(username: string): AnalysisJob {
  const job: AnalysisJob = {
    id: randomUUID(),
    username: username.toLowerCase(),
    status: "pending",
    progress: 0,
    message: "분석 준비 중...",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobs.set(job.id, job);
  return job;
}

export function getJob(jobId: string): AnalysisJob | undefined {
  return jobs.get(jobId);
}

export function updateJob(
  jobId: string,
  updates: Partial<Pick<AnalysisJob, "status" | "progress" | "message" | "result" | "error">>
): AnalysisJob | undefined {
  const job = jobs.get(jobId);
  if (!job) return undefined;

  Object.assign(job, updates, { updatedAt: new Date().toISOString() });
  jobs.set(jobId, job);
  return job;
}

export function completeJob(jobId: string, result: AnalysisResult): void {
  updateJob(jobId, {
    status: "completed",
    progress: 100,
    message: "분석 완료",
    result,
  });
}

export function failJob(jobId: string, error: string): void {
  updateJob(jobId, {
    status: "failed",
    progress: 0,
    message: error,
    error,
  });
}

export function setJobStatus(
  jobId: string,
  status: JobStatus,
  progress: number,
  message: string
): void {
  updateJob(jobId, { status, progress, message });
}

// Clean up jobs older than 1 hour
export function cleanupOldJobs(): void {
  const oneHourAgo = Date.now() - 3600000;
  for (const [id, job] of jobs) {
    if (new Date(job.createdAt).getTime() < oneHourAgo) {
      jobs.delete(id);
    }
  }
}
