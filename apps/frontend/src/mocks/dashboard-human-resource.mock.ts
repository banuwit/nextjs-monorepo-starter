// Data contoh untuk dashboard Human Resource; belum terhubung ke API.
import type { KpiItem } from "@/features/dashboard/human-resource/types/dashboard";
import type {
  HumanResourceDepartment,
  HumanResourceEmployee,
  HumanResourceEngagementPoint,
  HumanResourceHeadcountPoint,
  HumanResourceLeaveEntry,
  HumanResourcePipelineStage,
} from "@/features/dashboard/human-resource/types/human-resource";

export const humanResourceMetrics = [
  {
    label: "Headcount",
    value: "1,248",
    delta: { value: "+3.2%", direction: "up", sentiment: "good" },
    context: "vs 1,209 a year ago",
    trend: [1209, 1214, 1221, 1226, 1232, 1241, 1248],
  },
  {
    label: "Attrition rate (12 mo)",
    value: "9.4%",
    delta: { value: "+0.8 pts", direction: "up", sentiment: "bad" },
    context: "target under 8%",
    trend: [7.9, 8.1, 8.4, 8.6, 9.0, 9.2, 9.4],
  },
  {
    label: "Open positions",
    value: "37",
    delta: { value: "-5", direction: "down", sentiment: "good" },
    context: "12 in final stages",
    trend: [48, 45, 44, 42, 40, 39, 37],
  },
  {
    label: "Avg time to hire",
    value: "31 days",
    delta: { value: "-4 days", direction: "down", sentiment: "good" },
    context: "vs 35 last quarter",
    trend: [38, 37, 35, 36, 33, 32, 31],
  },
] as const satisfies readonly KpiItem[];

const months = [
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
];

// [hires, exits] per month; headcount is accumulated from the opening figure.
const movements = [
  [14, 9],
  [22, 11],
  [18, 10],
  [16, 13],
  [20, 8],
  [12, 14],
  [25, 9],
  [19, 12],
  [15, 10],
  [21, 7],
  [17, 11],
  [13, 9],
] as const;

function buildHeadcount(): HumanResourceHeadcountPoint[] {
  let headcount = 1178;
  return movements.map(([hires, exits], index) => {
    headcount += hires - exits;
    return { month: months[index] ?? "", hires, exits, headcount };
  });
}

export const humanResourceHeadcountTrend = buildHeadcount();

export const humanResourceDepartments = [
  { id: "eng", name: "Engineering", headcount: 412, openRoles: 14 },
  { id: "sales", name: "Sales", headcount: 236, openRoles: 8 },
  { id: "ops", name: "Operations", headcount: 198, openRoles: 4 },
  { id: "cs", name: "Customer success", headcount: 154, openRoles: 5 },
  { id: "product", name: "Product & design", headcount: 96, openRoles: 3 },
  { id: "finance", name: "Finance & legal", headcount: 84, openRoles: 1 },
  { id: "people", name: "People", headcount: 68, openRoles: 2 },
] as const satisfies readonly HumanResourceDepartment[];

export const humanResourcePipeline = [
  { key: "applied", label: "Applied", count: 642 },
  { key: "screening", label: "Screening", count: 218 },
  { key: "interview", label: "Interview", count: 94 },
  { key: "offer", label: "Offer", count: 31 },
  { key: "hired", label: "Hired", count: 24 },
] as const satisfies readonly HumanResourcePipelineStage[];

export const humanResourceLeaveToday = [
  {
    id: "l1",
    name: "Rina Marlina",
    department: "Engineering",
    type: "annual",
    backOn: "2026-11-16",
  },
  {
    id: "l2",
    name: "Agus Prasetyo",
    department: "Sales",
    type: "sick",
    backOn: "2026-11-09",
  },
  {
    id: "l3",
    name: "Dewi Lestari",
    department: "Product & design",
    type: "remote",
    backOn: "2026-11-09",
  },
  {
    id: "l4",
    name: "Bambang Susilo",
    department: "Operations",
    type: "parental",
    backOn: "2027-01-04",
  },
  {
    id: "l5",
    name: "Sari Wulandari",
    department: "Customer success",
    type: "annual",
    backOn: "2026-11-11",
  },
  {
    id: "l6",
    name: "Hendra Gunawan",
    department: "Finance & legal",
    type: "remote",
    backOn: "2026-11-09",
  },
] as const satisfies readonly HumanResourceLeaveEntry[];

export const humanResourceLeaveApprovals = { pending: 7, total: 20 } as const;

export const humanResourceEngagement = [
  { dimension: "Manager support", current: 82, previous: 78 },
  { dimension: "Growth", current: 68, previous: 71 },
  { dimension: "Recognition", current: 74, previous: 69 },
  { dimension: "Workload", current: 61, previous: 64 },
  { dimension: "Belonging", current: 85, previous: 83 },
  { dimension: "Compensation", current: 66, previous: 62 },
] as const satisfies readonly HumanResourceEngagementPoint[];

export const humanResourceEngagementResponse = {
  responded: 1061,
  invited: 1248,
} as const;

export const humanResourceEmployees: HumanResourceEmployee[] = [
  {
    id: "EMP-1042",
    name: "Maya Puspita",
    department: "Engineering",
    role: "Senior engineer",
    location: "Jakarta",
    tenureYears: 4.3,
    status: "active",
  },
  {
    id: "EMP-1107",
    name: "Yudi Kurniawan",
    department: "Engineering",
    role: "Engineering manager",
    location: "Jakarta",
    tenureYears: 6.1,
    status: "active",
  },
  {
    id: "EMP-1215",
    name: "Lina Hartati",
    department: "Sales",
    role: "Account executive",
    location: "Surabaya",
    tenureYears: 2.7,
    status: "active",
  },
  {
    id: "EMP-1288",
    name: "Rizky Ramadhan",
    department: "Engineering",
    role: "Frontend engineer",
    location: "Bandung",
    tenureYears: 0.3,
    status: "probation",
  },
  {
    id: "EMP-1301",
    name: "Nadia Safitri",
    department: "Product & design",
    role: "Product designer",
    location: "Jakarta",
    tenureYears: 3.4,
    status: "on-leave",
  },
  {
    id: "EMP-1319",
    name: "Fajar Nugroho",
    department: "Operations",
    role: "Logistics lead",
    location: "Surabaya",
    tenureYears: 5.5,
    status: "active",
  },
  {
    id: "EMP-1356",
    name: "Intan Permata",
    department: "Customer success",
    role: "Support specialist",
    location: "Yogyakarta",
    tenureYears: 1.8,
    status: "active",
  },
  {
    id: "EMP-1377",
    name: "Doni Saputra",
    department: "Sales",
    role: "Sales development rep",
    location: "Medan",
    tenureYears: 1.1,
    status: "notice",
  },
  {
    id: "EMP-1402",
    name: "Wati Rahayu",
    department: "Finance & legal",
    role: "Accountant",
    location: "Jakarta",
    tenureYears: 7.9,
    status: "active",
  },
  {
    id: "EMP-1418",
    name: "Eko Setiawan",
    department: "Engineering",
    role: "Backend engineer",
    location: "Bandung",
    tenureYears: 2.2,
    status: "active",
  },
  {
    id: "EMP-1433",
    name: "Citra Anggraini",
    department: "People",
    role: "HR business partner",
    location: "Jakarta",
    tenureYears: 3.9,
    status: "active",
  },
  {
    id: "EMP-1450",
    name: "Bayu Wicaksono",
    department: "Operations",
    role: "Warehouse supervisor",
    location: "Surabaya",
    tenureYears: 0.5,
    status: "probation",
  },
  {
    id: "EMP-1471",
    name: "Mega Utami",
    department: "Customer success",
    role: "Customer success manager",
    location: "Jakarta",
    tenureYears: 4.6,
    status: "on-leave",
  },
  {
    id: "EMP-1489",
    name: "Taufik Hidayat",
    department: "Sales",
    role: "Regional sales manager",
    location: "Medan",
    tenureYears: 8.2,
    status: "active",
  },
  {
    id: "EMP-1503",
    name: "Ayu Kusuma",
    department: "Product & design",
    role: "Product manager",
    location: "Jakarta",
    tenureYears: 2.9,
    status: "active",
  },
  {
    id: "EMP-1520",
    name: "Galih Pratama",
    department: "Engineering",
    role: "Data engineer",
    location: "Yogyakarta",
    tenureYears: 1.4,
    status: "active",
  },
  {
    id: "EMP-1538",
    name: "Siska Amelia",
    department: "Finance & legal",
    role: "Legal counsel",
    location: "Jakarta",
    tenureYears: 5.0,
    status: "active",
  },
  {
    id: "EMP-1552",
    name: "Novi Andriani",
    department: "People",
    role: "Recruiter",
    location: "Bandung",
    tenureYears: 0.2,
    status: "probation",
  },
  {
    id: "EMP-1569",
    name: "Arif Budiman",
    department: "Operations",
    role: "Procurement analyst",
    location: "Surabaya",
    tenureYears: 3.1,
    status: "notice",
  },
  {
    id: "EMP-1584",
    name: "Putri Maharani",
    department: "Customer success",
    role: "Onboarding specialist",
    location: "Yogyakarta",
    tenureYears: 2.0,
    status: "active",
  },
  {
    id: "EMP-1601",
    name: "Irfan Hakim",
    department: "Engineering",
    role: "QA engineer",
    location: "Jakarta",
    tenureYears: 1.6,
    status: "active",
  },
  {
    id: "EMP-1617",
    name: "Lia Kartika",
    department: "Sales",
    role: "Account executive",
    location: "Jakarta",
    tenureYears: 0.8,
    status: "active",
  },
  {
    id: "EMP-1630",
    name: "Wahyu Santoso",
    department: "Operations",
    role: "Fleet coordinator",
    location: "Medan",
    tenureYears: 6.7,
    status: "on-leave",
  },
  {
    id: "EMP-1648",
    name: "Ratna Dewi",
    department: "Product & design",
    role: "UX researcher",
    location: "Bandung",
    tenureYears: 2.4,
    status: "active",
  },
];
