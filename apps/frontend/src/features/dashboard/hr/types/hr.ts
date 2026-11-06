export type HrHeadcountPoint = {
  month: string;
  hires: number;
  /** Leavers in the month, stored as a positive count. */
  exits: number;
  /** Headcount at month end. */
  headcount: number;
};

export type HrDepartment = {
  id: string;
  name: string;
  headcount: number;
  openRoles: number;
};

export type HrPipelineStageKey =
  "applied" | "screening" | "interview" | "offer" | "hired";

export type HrPipelineStage = {
  key: HrPipelineStageKey;
  label: string;
  count: number;
};

export type HrLeaveType = "annual" | "sick" | "remote" | "parental";

export type HrLeaveEntry = {
  id: string;
  name: string;
  department: string;
  type: HrLeaveType;
  /** ISO date (yyyy-mm-dd) the person is expected back. */
  backOn: string;
};

export type HrEngagementPoint = {
  dimension: string;
  current: number;
  previous: number;
};

export type HrEmployeeStatus = "active" | "on-leave" | "probation" | "notice";

export type HrEmployee = {
  id: string;
  name: string;
  department: string;
  role: string;
  location: string;
  /** Whole and fractional years with the company. */
  tenureYears: number;
  status: HrEmployeeStatus;
};
