export type PasswordRequirement = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_MIN_LENGTH = 8;

export const passwordRequirements: readonly PasswordRequirement[] = [
  {
    id: "length",
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password) => /\d/.test(password),
  },
  {
    id: "symbol",
    label: "One symbol",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export function countMetRequirements(password: string) {
  return passwordRequirements.filter((requirement) =>
    requirement.test(password),
  ).length;
}
