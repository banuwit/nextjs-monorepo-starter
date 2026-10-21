import { initialCrudData } from "./crud.mock";
import type { MockEntity } from "./crud-model";

// A separate copy of Parameter records for the four frontend-only CRUD examples.
export const initialCrudExamples = initialCrudData.parameters.map((record) => ({
  ...record,
  id: `example-${record.id}`,
})) satisfies MockEntity<"parameters">[];
