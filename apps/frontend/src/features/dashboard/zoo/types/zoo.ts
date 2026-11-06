import type { Delta } from "./dashboard";

export type ZooFlowPoint = {
  hour: string;
  entries: number;
  exits: number;
};

export type ZooTicketTypeId = "adult" | "child" | "family" | "member" | "group";

export type ZooTicketType = {
  id: ZooTicketTypeId;
  label: string;
  count: number;
};

export type ZooEnclosureStatus =
  "open" | "cleaning" | "vet-check" | "keeper-talk";

export type ZooEnclosure = {
  id: string;
  name: string;
  zone: string;
  species: number;
  status: ZooEnclosureStatus;
  /** Last 12 readings, oldest first. */
  temp: readonly number[];
  maxTemp: number;
  /** Last 12 readings, oldest first. */
  humidity: readonly number[];
  maxHumidity: number;
};

export type ZooScheduleKind = "feeding" | "talk";

export type ZooScheduleItem = {
  id: string;
  time: string;
  title: string;
  enclosure: string;
  keeper: string;
  kind: ZooScheduleKind;
};

export type ZooAnimalStatus =
  "healthy" | "observation" | "treatment" | "quarantine";

export type ZooAnimal = {
  id: string;
  name: string;
  species: string;
  enclosure: string;
  zone: string;
  keeper: string;
  lastCheck: string;
  weight: Delta;
  status: ZooAnimalStatus;
};

export type ZooAlert = {
  id: string;
  severity: "danger" | "warning" | "info";
  title: string;
  detail: string;
};
