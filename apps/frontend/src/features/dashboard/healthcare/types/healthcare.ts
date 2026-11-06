export type HealthcareFlowPoint = {
  hour: string;
  arrivals: number;
  seen: number;
};

export type HealthcareDepartment = {
  id: string;
  name: string;
  occupied: number;
  capacity: number;
  waiting: number;
};

export type HealthcareWard = "A" | "B" | "ICU";

export type HealthcareBedState =
  "available" | "occupied" | "cleaning" | "reserved";

export type HealthcareBed = {
  id: string;
  ward: HealthcareWard;
  state: HealthcareBedState;
  patient?: string;
  since?: string;
};

export type HealthcareDoctorStatus =
  "in-consult" | "available" | "on-break" | "off";

export type HealthcareDoctor = {
  id: string;
  name: string;
  department: string;
  shift: readonly [string, string];
  status: HealthcareDoctorStatus;
  room: string;
};

export type HealthcareQueueStatus =
  "waiting" | "in-consult" | "done" | "no-show";

export type HealthcareAppointment = {
  id: string;
  patient: string;
  department: string;
  doctorId: string;
  scheduled: string;
  waitedMinutes: number;
  status: HealthcareQueueStatus;
};

export type HealthcareAlert = {
  id: string;
  severity: "danger" | "warning" | "info";
  title: string;
  detail: string;
};

/** Emergency Severity Index level, 1 = most urgent. */
export type HealthcareTriageLevel = {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  waiting: number;
  /** Longest current wait in minutes. */
  longestWaitMinutes: number;
  /** Target time to be seen, in minutes. */
  targetMinutes: number;
};
