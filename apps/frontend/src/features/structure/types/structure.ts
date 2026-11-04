export type Department =
  | "Executive"
  | "Engineering"
  | "Product"
  | "Design"
  | "Sales"
  | "Finance"
  | "People";

export type Employee = {
  id: string;
  name: string;
  title: string;
  department: Department;
  email: string;
  location: string;
  /** Direct manager; the root employee has none. */
  parent?: string;
};
