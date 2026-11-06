export type HumanResourceHeadcountPoint = {
  month: string;
  hires: number;
  /** Leavers in the month, stored as a positive count. */
  exits: number;
  /** Headcount at month end. */
  headcount: number;
};

export type HumanResourceDepartment = {
  id: string;
  name: string;
  headcount: number;
  openRoles: number;
};

export type HumanResourcePipelineStageKey =
  "applied" | "screening" | "interview" | "offer" | "hired";

export type HumanResourcePipelineStage = {
  key: HumanResourcePipelineStageKey;
  label: string;
  count: number;
};

export type HumanResourceLeaveType = "annual" | "sick" | "remote" | "parental";

export type HumanResourceLeaveEntry = {
  id: string;
  name: string;
  department: string;
  type: HumanResourceLeaveType;
  /** ISO date (yyyy-mm-dd) the person is expected back. */
  backOn: string;
};

export type HumanResourceEngagementPoint = {
  dimension: string;
  current: number;
  previous: number;
};

export type HumanResourceEmployeeStatus =
  "active" | "on-leave" | "probation" | "notice";

export type HumanResourceEmployee = {
  id: string;
  name: string;
  department: string;
  role: string;
  location: string;
  /** Whole and fractional years with the company. */
  tenureYears: number;
  status: HumanResourceEmployeeStatus;
};
