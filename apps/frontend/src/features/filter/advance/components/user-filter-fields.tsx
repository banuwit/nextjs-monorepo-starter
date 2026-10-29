import {
  AtSignIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CalendarClockIcon,
  CalendarIcon,
  CalendarRangeIcon,
  CircleDotIcon,
  GaugeIcon,
  HashIcon,
  IdCardIcon,
  KeyRoundIcon,
  LayersIcon,
  LockKeyholeIcon,
  MapIcon,
  MapPinIcon,
  MonitorSmartphoneIcon,
  NetworkIcon,
  ShieldCheckIcon,
  ShieldIcon,
  TagsIcon,
  TextSearchIcon,
  TrendingUpIcon,
  UserRoundSearchIcon,
  WalletIcon,
} from "lucide-react";

import type {
  FilterField,
  FilterOption,
} from "@/components/reui/filters/filters-types";
import { cities, departments } from "@/mocks/user.mock";
import {
  devices,
  employmentTypes,
  permissions,
  type UserProfile,
} from "@/mocks/user-profile.mock";
import {
  fetchUsersByIds,
  formatRupiahShort,
  NO_MANAGER,
  REGIONS,
  searchUserDirectory,
  slugify,
} from "../utils/user-profile-filter";
import { getJoinMonthOptions } from "../utils/join-month-options";
import { LEVEL_TONES, STATUS_TONES } from "../utils/user-tones";
import { createDateField } from "@/components/filter/advanced/date-editor";
import {
  CheckboxListEditor,
  NativeSelectEditor,
  PickedLabels,
  RadioEditor,
  SwitchEditor,
  ToggleGroupEditor,
} from "@/components/filter/advanced/choice-editors";
import { createSliderField } from "@/components/filter/advanced/slider-editor";
import {
  CodeEditor,
  createAmountEditor,
  DomainEditor,
  TermListEditor,
} from "@/components/filter/advanced/typed-editors";
import {
  BadgesOrStack,
  Face,
  NoFace,
  StackedFaces,
  toneOptions,
} from "@/components/filter/advanced/value-displays";

const toPersonOption = (user: UserProfile): FilterOption => ({
  value: user.id,
  label: user.name,
  description: `${user.id} · ${user.role}`,
  keywords: [user.email],
  icon: <Face name={user.name} />,
});

const toOptions = (labels: readonly string[]): FilterOption[] =>
  labels.map((label) => ({ value: slugify(label), label }));

const capitalized = (labels: readonly string[]): FilterOption[] =>
  labels.map((label) => ({
    value: label,
    label: label.charAt(0).toUpperCase() + label.slice(1),
  }));

const EMPLOYMENT_HINTS: Record<(typeof employmentTypes)[number], string> = {
  "full-time": "Karyawan tetap",
  contract: "Kontrak per proyek",
  intern: "Program magang",
};

const SalaryEditor = createAmountEditor({ prefix: "Rp", suffix: "/bln" });

/**
 * The schema for `/filter/advance`. Each field shows one capability of the
 * ReUI filter examples:
 * - c1: pinned picks, an exclusive row, avatars, paged async options, nested
 *   groups, text, number and boolean fields;
 * - c2: drill-down groups with search synonyms (`keywords`) and leaf icons;
 * - c3: tinted badges that fold into a dot stack;
 * - c4: avatar options resolved by id after a saved view is restored;
 * - c5 date + range editors, c6 sliders, c8 choice controls, c9 typed inputs.
 */
export function createUserFilterFields(users: UserProfile[]): FilterField[] {
  const managerIds = new Set(users.map((user) => user.managerId));
  const managers = users.filter((user) => managerIds.has(user.id));

  return [
    {
      id: "user",
      column: "search_text",
      label: "Name or email",
      type: "text",
      placeholder: "ID, name, or email...",
      keywords: ["search", "nama", "email"],
      icon: <TextSearchIcon />,
    },
    {
      // c4: paged directory search, ids resolved back to names on restore.
      id: "person",
      column: "id",
      label: "Person",
      type: "select",
      defaultOperator: "is_any_of",
      placeholder: "Search people...",
      pinSelected: true,
      icon: <UserRoundSearchIcon />,
      loadOptions: (query, { signal, cursor }) =>
        searchUserDirectory(users, query, signal, cursor).then(
          ({ items, nextCursor }) => ({
            items: items.map(toPersonOption),
            nextCursor,
          }),
        ),
      resolveValues: (ids) =>
        fetchUsersByIds(users, ids).then((found) => found.map(toPersonOption)),
      renderValue: ({ values, options, labels }) => (
        <StackedFaces
          options={options}
          values={values}
          empty="anyone"
          countLabel={labels.valueCount}
        />
      ),
    },
    {
      // c3: tinted badges, folding to dots after two picks.
      id: "status",
      column: "status",
      label: "Status",
      type: "select",
      defaultOperator: "is_any_of",
      searchable: false,
      pinSelected: true,
      icon: <CircleDotIcon />,
      options: toneOptions(STATUS_TONES),
      renderValue: ({ options }) => (
        <BadgesOrStack
          options={options}
          tones={STATUS_TONES}
          fallback="any status"
        />
      ),
    },
    {
      id: "level",
      column: "level",
      label: "Level",
      type: "select",
      defaultOperator: "is_any_of",
      placeholder: "Search level...",
      pinSelected: true,
      icon: <TrendingUpIcon />,
      options: toneOptions(LEVEL_TONES),
      renderValue: ({ options }) => (
        <BadgesOrStack
          options={options}
          tones={LEVEL_TONES}
          fallback="any level"
        />
      ),
    },
    {
      // c1: avatars, picks pinned on top, and an exclusive "No manager" row.
      id: "manager",
      column: "manager_id",
      label: "Manager",
      type: "select",
      defaultOperator: "is_any_of",
      placeholder: "Search managers...",
      pinSelected: true,
      sortSelected: "label",
      className: "w-64",
      icon: <NetworkIcon />,
      options: [
        ...managers.map(toPersonOption),
        {
          value: NO_MANAGER,
          label: "No manager",
          icon: <NoFace />,
          exclusive: true,
        },
      ],
      renderValue: ({ values, options, labels }) => (
        <StackedFaces
          options={options}
          values={values}
          empty="anyone"
          countLabel={labels.valueCount}
        />
      ),
    },
    // c5: one day (typed phrase or calendar) and a range with presets.
    createDateField({
      id: "joined",
      column: "join_date",
      label: "Joined",
      defaultOperator: "is_on_or_after",
      keywords: ["join date", "tanggal masuk"],
      icon: <CalendarIcon />,
    }),
    {
      // From /filter/base: one month, newest first, grouped by year there.
      id: "joinMonth",
      column: "join_month",
      label: "Join month",
      type: "select",
      defaultOperator: "is_any_of",
      placeholder: "Search month...",
      keywords: ["bulan masuk", "month"],
      icon: <CalendarRangeIcon />,
      options: getJoinMonthOptions(users).map(({ value, label }) => ({
        value,
        label,
      })),
      pinSelected: true,
    },
    createDateField({
      id: "lastActive",
      column: "last_active_at",
      label: "Last active",
      defaultOperator: "between",
      keywords: ["last seen", "login"],
      icon: <CalendarClockIcon />,
    }),
    // c6: a two-thumb range and a single-thumb lower bound.
    createSliderField({
      id: "score",
      column: "performance_score",
      label: "Performance score",
      type: "range",
      defaultOperator: "between",
      scale: { min: 0, max: 100, step: 1, format: String },
      empty: "any score",
      icon: <GaugeIcon />,
    }),
    createSliderField({
      id: "experienceYears",
      column: "experience_years",
      label: "Experience",
      type: "number",
      defaultOperator: "gte",
      scale: { min: 0, max: 15, step: 1, format: (value) => `${value} th` },
      empty: "any experience",
      keywords: ["years", "tahun"],
      icon: <BriefcaseBusinessIcon />,
    }),
    {
      // c9: currency box with a unit, one or two boxes by operator.
      id: "salary",
      column: "salary_idr",
      label: "Salary",
      type: "number",
      defaultOperator: "between",
      placeholder: "0",
      keywords: ["gaji", "pay"],
      icon: <WalletIcon />,
      editor: SalaryEditor,
      renderValue: ({ value, labels }) =>
        Array.isArray(value)
          ? labels.valueRange(
              formatRupiahShort(Number(value[0])),
              formatRupiahShort(Number(value[1])),
            )
          : typeof value === "number"
            ? formatRupiahShort(value)
            : "any amount",
    },
    {
      // c9: free terms, one per line.
      id: "skills",
      column: "skills",
      label: "Skills",
      type: "multiselect",
      defaultOperator: "has_any_of",
      placeholder: "react\nsql\nfigma",
      keywords: ["keahlian", "tags"],
      icon: <TagsIcon />,
      editor: TermListEditor,
      renderValue: ({ values }) => {
        const [first] = values;
        if (first === undefined) return "none";
        return (
          <span className="flex items-center gap-1.5">
            {String(first)}
            {values.length > 1 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                +{values.length - 1}
              </span>
            )}
          </span>
        );
      },
    },
    {
      // c8: radios with a hint line, closing after the pick.
      id: "employmentType",
      column: "employment_type",
      label: "Employment",
      type: "select",
      defaultOperator: "is",
      icon: <IdCardIcon />,
      options: employmentTypes.map((type) => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        description: EMPLOYMENT_HINTS[type],
      })),
      editor: RadioEditor,
    },
    {
      // c2: a drill-down group; `keywords` answer synonyms like "kota".
      id: "organization",
      label: "Organization",
      count: 4,
      keywords: ["org", "team"],
      icon: <Building2Icon />,
      fields: [
        {
          id: "department",
          column: "department",
          label: "Department",
          type: "select",
          defaultOperator: "is_any_of",
          placeholder: "Search department...",
          keywords: ["division", "divisi", "team"],
          icon: <LayersIcon />,
          options: toOptions(departments),
          pinSelected: true,
        },
        {
          id: "city",
          column: "city",
          label: "City",
          type: "select",
          defaultOperator: "is_any_of",
          placeholder: "Search city...",
          keywords: ["town", "kota", "location"],
          icon: <MapPinIcon />,
          options: toOptions(cities),
          pinSelected: true,
          sortSelected: "label",
        },
        {
          // c8: the platform select as the editor.
          id: "region",
          column: "region",
          label: "Region",
          type: "select",
          defaultOperator: "is",
          keywords: ["island", "pulau", "wilayah"],
          icon: <MapIcon />,
          options: REGIONS.map((region) => ({ ...region })),
          editor: NativeSelectEditor,
        },
        {
          id: "role",
          column: "role",
          label: "Role",
          type: "select",
          defaultOperator: "is_any_of",
          searchable: false,
          icon: <ShieldIcon />,
          options: capitalized(["admin", "editor", "viewer"]),
        },
      ],
    },
    {
      id: "account",
      label: "Account",
      count: 5,
      keywords: ["security", "akses"],
      icon: <KeyRoundIcon />,
      fields: [
        {
          // c8: toggle buttons that stay open.
          id: "devices",
          column: "devices",
          label: "Devices",
          type: "multiselect",
          defaultOperator: "has_any_of",
          keywords: ["platform", "perangkat"],
          icon: <MonitorSmartphoneIcon />,
          options: devices.map((device) => ({
            value: device,
            label:
              device === "ios"
                ? "iOS"
                : device.charAt(0).toUpperCase() + device.slice(1),
          })),
          editor: ToggleGroupEditor,
          renderValue: ({ options }) => (
            <PickedLabels options={options} empty="any device" />
          ),
        },
        {
          // c8: a checklist with count and Clear.
          id: "permissions",
          column: "permissions",
          label: "Permissions",
          type: "multiselect",
          defaultOperator: "has_all_of",
          keywords: ["access", "hak akses"],
          icon: <LockKeyholeIcon />,
          options: capitalized(permissions),
          editor: CheckboxListEditor,
          renderValue: ({ options }) => (
            <PickedLabels options={options} empty="any permission" />
          ),
        },
        {
          // c8: a switch for a boolean.
          id: "twoFactor",
          column: "two_factor_enabled",
          label: "2FA enabled",
          type: "boolean",
          defaultOperator: "is",
          keywords: ["two factor", "mfa", "otp"],
          icon: <ShieldCheckIcon />,
          editor: SwitchEditor,
          renderValue: ({ value }) => (value === true ? "on" : "off"),
        },
        {
          // c9: code slots that commit when full.
          id: "employeeCode",
          column: "employee_code",
          label: "Employee code",
          type: "text",
          operators: [
            { value: "is", label: "is", inverse: "is_not" },
            { value: "is_not", label: "is not", inverse: "is" },
          ],
          defaultOperator: "is",
          keywords: ["badge", "nik", "kode"],
          icon: <HashIcon />,
          editor: CodeEditor,
          renderValue: ({ value }) =>
            typeof value === "string" && value ? (
              <span className="font-mono tracking-wider">{value}</span>
            ) : (
              "any code"
            ),
        },
        {
          // c9: a validated domain.
          id: "emailDomain",
          column: "email_domain",
          label: "Email domain",
          type: "text",
          defaultOperator: "is",
          placeholder: "acme.co.id",
          keywords: ["domain", "company email"],
          icon: <AtSignIcon />,
          editor: DomainEditor,
        },
      ],
    },
  ];
}
