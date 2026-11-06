// Data contoh untuk dashboard Healthcare; belum terhubung ke API.
import type { KpiItem } from "@/features/dashboard/healthcare/types/dashboard";
import type {
  HealthcareAlert,
  HealthcareAppointment,
  HealthcareBed,
  HealthcareBedState,
  HealthcareDepartment,
  HealthcareDoctor,
  HealthcareFlowPoint,
  HealthcareTriageLevel,
  HealthcareWard,
} from "@/features/dashboard/healthcare/types/healthcare";

export const healthcareMetrics = [
  {
    label: "Patients today",
    value: "148",
    delta: { value: "+9%", direction: "up", sentiment: "neutral" },
    context: "vs 136 yesterday",
    trend: [122, 131, 128, 140, 136, 144, 148],
  },
  {
    label: "Average wait",
    value: "23 min",
    delta: { value: "+4 min", direction: "up", sentiment: "bad" },
    context: "target under 20 min",
    trend: [18, 17, 21, 19, 20, 22, 23],
  },
  {
    label: "Bed occupancy",
    value: "81%",
    delta: { value: "+3 pts", direction: "up", sentiment: "neutral" },
    context: "39 of 48 beds",
    trend: [72, 75, 78, 74, 79, 78, 81],
  },
  {
    label: "No-show rate",
    value: "6.1%",
    delta: { value: "-1.2 pts", direction: "down", sentiment: "good" },
    context: "vs 7.3% last week",
    trend: [8.4, 7.9, 7.3, 7.5, 6.8, 6.4, 6.1],
  },
] as const satisfies readonly KpiItem[];

const hours = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const flowToday = [
  [6, 4],
  [14, 11],
  [19, 16],
  [22, 19],
  [18, 20],
  [9, 12],
  [15, 13],
  [20, 17],
  [16, 18],
  [7, 10],
  [2, 4],
] as const;

const flowYesterday = [
  [5, 3],
  [12, 10],
  [17, 15],
  [20, 18],
  [16, 17],
  [8, 11],
  [13, 12],
  [18, 16],
  [14, 15],
  [8, 9],
  [3, 4],
] as const;

function toFlow(
  points: ReadonlyArray<readonly [number, number]>,
): HealthcareFlowPoint[] {
  return points.map(([arrivals, seen], index) => ({
    hour: hours[index] ?? "",
    arrivals,
    seen,
  }));
}

export const healthcareFlowToday = toFlow(flowToday);
export const healthcareFlowYesterday = toFlow(flowYesterday);

export const healthcareDepartments = [
  {
    id: "general",
    name: "General practice",
    occupied: 11,
    capacity: 12,
    waiting: 7,
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    occupied: 6,
    capacity: 8,
    waiting: 4,
  },
  {
    id: "cardiology",
    name: "Cardiology",
    occupied: 5,
    capacity: 6,
    waiting: 3,
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    occupied: 4,
    capacity: 6,
    waiting: 2,
  },
  { id: "dental", name: "Dental", occupied: 3, capacity: 5, waiting: 1 },
  { id: "radiology", name: "Radiology", occupied: 2, capacity: 4, waiting: 2 },
] as const satisfies readonly HealthcareDepartment[];

const patientNames = [
  "Rina Marlina",
  "Agus Prasetyo",
  "Dewi Lestari",
  "Bambang Susilo",
  "Sari Wulandari",
  "Hendra Gunawan",
  "Maya Puspita",
  "Yudi Kurniawan",
  "Lina Hartati",
  "Rizky Ramadhan",
  "Nadia Safitri",
  "Fajar Nugroho",
  "Intan Permata",
  "Doni Saputra",
  "Wati Rahayu",
  "Eko Setiawan",
  "Citra Anggraini",
  "Bayu Wicaksono",
  "Mega Utami",
  "Taufik Hidayat",
  "Ayu Kusuma",
  "Galih Pratama",
  "Siska Amelia",
  "Ridwan Kamil",
  "Novi Andriani",
  "Arif Budiman",
  "Putri Maharani",
  "Dian Sastro",
  "Irfan Hakim",
  "Lia Kartika",
  "Wahyu Santoso",
  "Ratna Dewi",
  "Andi Firmansyah",
  "Nia Ramadhani",
  "Joko Widodo",
  "Sinta Dewi",
  "Reza Rahadian",
  "Tika Panggabean",
  "Hadi Sucipto",
] as const;

// State per bed, written as a compact string so the pattern is easy to read:
// o = occupied, a = available, c = cleaning, r = reserved.
const bedPlan: Record<HealthcareWard, string> = {
  A: "oooaoocooaorooooaooc",
  B: "ooaooorooaooocooaooo",
  ICU: "ooooooao",
};

const stateByCode: Record<string, HealthcareBedState> = {
  o: "occupied",
  a: "available",
  c: "cleaning",
  r: "reserved",
};

const sinceTimes = [
  "06:40",
  "07:15",
  "08:05",
  "08:50",
  "09:20",
  "10:10",
  "11:35",
  "12:00",
  "13:25",
  "14:10",
];

function buildBeds(): HealthcareBed[] {
  const beds: HealthcareBed[] = [];
  let patientIndex = 0;
  for (const ward of ["A", "B", "ICU"] as const) {
    const plan = bedPlan[ward];
    for (let index = 0; index < plan.length; index += 1) {
      const state = stateByCode[plan[index] ?? "a"] ?? "available";
      const id = `${ward}-${String(index + 1).padStart(2, "0")}`;
      if (state === "occupied") {
        beds.push({
          id,
          ward,
          state,
          patient: patientNames[patientIndex % patientNames.length],
          since: sinceTimes[patientIndex % sinceTimes.length],
        });
        patientIndex += 1;
      } else {
        beds.push({ id, ward, state });
      }
    }
  }
  return beds;
}

export const healthcareBeds = buildBeds();

export const healthcareDoctors = [
  {
    id: "d1",
    name: "Dr. Sari Handayani",
    department: "General practice",
    shift: ["08:00", "16:00"],
    status: "in-consult",
    room: "R-101",
  },
  {
    id: "d2",
    name: "Dr. Budi Santoso",
    department: "Pediatrics",
    shift: ["08:00", "14:00"],
    status: "in-consult",
    room: "R-204",
  },
  {
    id: "d3",
    name: "Dr. Maria Kristina",
    department: "Cardiology",
    shift: ["09:00", "17:00"],
    status: "available",
    room: "R-305",
  },
  {
    id: "d4",
    name: "Dr. Ahmad Fauzi",
    department: "Orthopedics",
    shift: ["10:00", "18:00"],
    status: "on-break",
    room: "R-310",
  },
  {
    id: "d5",
    name: "Dr. Lita Permadi",
    department: "Dental",
    shift: ["08:00", "12:00"],
    status: "in-consult",
    room: "R-112",
  },
  {
    id: "d6",
    name: "Dr. Yosef Tampubolon",
    department: "Radiology",
    shift: ["13:00", "20:00"],
    status: "available",
    room: "R-021",
  },
  {
    id: "d7",
    name: "Dr. Nina Rahmawati",
    department: "General practice",
    shift: ["14:00", "22:00"],
    status: "off",
    room: "R-102",
  },
] as const satisfies readonly HealthcareDoctor[];

export const healthcareSlotGoal = { booked: 112, capacity: 128 } as const;

export const healthcareQueue: HealthcareAppointment[] = [
  {
    id: "Q-1041",
    patient: "Rina Marlina",
    department: "General practice",
    doctorId: "d1",
    scheduled: "09:00",
    waitedMinutes: 0,
    status: "done",
  },
  {
    id: "Q-1042",
    patient: "Agus Prasetyo",
    department: "Pediatrics",
    doctorId: "d2",
    scheduled: "09:10",
    waitedMinutes: 12,
    status: "done",
  },
  {
    id: "Q-1043",
    patient: "Dewi Lestari",
    department: "Cardiology",
    doctorId: "d3",
    scheduled: "09:20",
    waitedMinutes: 0,
    status: "no-show",
  },
  {
    id: "Q-1044",
    patient: "Bambang Susilo",
    department: "General practice",
    doctorId: "d1",
    scheduled: "09:30",
    waitedMinutes: 18,
    status: "done",
  },
  {
    id: "Q-1045",
    patient: "Sari Wulandari",
    department: "Dental",
    doctorId: "d5",
    scheduled: "09:40",
    waitedMinutes: 9,
    status: "done",
  },
  {
    id: "Q-1046",
    patient: "Hendra Gunawan",
    department: "Orthopedics",
    doctorId: "d4",
    scheduled: "10:00",
    waitedMinutes: 26,
    status: "done",
  },
  {
    id: "Q-1047",
    patient: "Maya Puspita",
    department: "General practice",
    doctorId: "d1",
    scheduled: "10:10",
    waitedMinutes: 31,
    status: "in-consult",
  },
  {
    id: "Q-1048",
    patient: "Yudi Kurniawan",
    department: "Pediatrics",
    doctorId: "d2",
    scheduled: "10:20",
    waitedMinutes: 14,
    status: "in-consult",
  },
  {
    id: "Q-1049",
    patient: "Lina Hartati",
    department: "Cardiology",
    doctorId: "d3",
    scheduled: "10:30",
    waitedMinutes: 22,
    status: "waiting",
  },
  {
    id: "Q-1050",
    patient: "Rizky Ramadhan",
    department: "Dental",
    doctorId: "d5",
    scheduled: "10:40",
    waitedMinutes: 8,
    status: "in-consult",
  },
  {
    id: "Q-1051",
    patient: "Nadia Safitri",
    department: "General practice",
    doctorId: "d1",
    scheduled: "10:50",
    waitedMinutes: 27,
    status: "waiting",
  },
  {
    id: "Q-1052",
    patient: "Fajar Nugroho",
    department: "Orthopedics",
    doctorId: "d4",
    scheduled: "11:00",
    waitedMinutes: 35,
    status: "waiting",
  },
  {
    id: "Q-1053",
    patient: "Intan Permata",
    department: "Pediatrics",
    doctorId: "d2",
    scheduled: "11:10",
    waitedMinutes: 19,
    status: "waiting",
  },
  {
    id: "Q-1054",
    patient: "Doni Saputra",
    department: "Radiology",
    doctorId: "d6",
    scheduled: "13:00",
    waitedMinutes: 0,
    status: "waiting",
  },
  {
    id: "Q-1055",
    patient: "Wati Rahayu",
    department: "General practice",
    doctorId: "d1",
    scheduled: "11:20",
    waitedMinutes: 0,
    status: "no-show",
  },
  {
    id: "Q-1056",
    patient: "Eko Setiawan",
    department: "Cardiology",
    doctorId: "d3",
    scheduled: "11:30",
    waitedMinutes: 11,
    status: "waiting",
  },
  {
    id: "Q-1057",
    patient: "Citra Anggraini",
    department: "Dental",
    doctorId: "d5",
    scheduled: "11:40",
    waitedMinutes: 4,
    status: "waiting",
  },
  {
    id: "Q-1058",
    patient: "Bayu Wicaksono",
    department: "General practice",
    doctorId: "d1",
    scheduled: "11:50",
    waitedMinutes: 2,
    status: "waiting",
  },
];

export const healthcareAlerts = [
  {
    id: "h1",
    severity: "danger",
    title: "Critical lab result for Q-1049",
    detail:
      "Troponin above threshold. Dr. Maria Kristina has not acknowledged yet.",
  },
  {
    id: "h2",
    severity: "warning",
    title: "Dr. Sari overbooked 14:00 to 15:00",
    detail: "5 slots booked in a 4-slot hour. Move one to Dr. Nina at 14:00.",
  },
  {
    id: "h3",
    severity: "warning",
    title: "ICU at 7 of 8 beds",
    detail: "One bed left. Two step-down candidates in Ward A.",
  },
  {
    id: "h4",
    severity: "info",
    title: "Radiology opens at 13:00",
    detail: "2 patients already waiting for imaging.",
  },
] as const satisfies readonly HealthcareAlert[];

export const healthcareTriage: HealthcareTriageLevel[] = [
  {
    level: 1,
    label: "Resuscitation",
    waiting: 0,
    longestWaitMinutes: 0,
    targetMinutes: 0,
  },
  {
    level: 2,
    label: "Emergent",
    waiting: 2,
    longestWaitMinutes: 6,
    targetMinutes: 10,
  },
  {
    level: 3,
    label: "Urgent",
    waiting: 7,
    longestWaitMinutes: 41,
    targetMinutes: 30,
  },
  {
    level: 4,
    label: "Less urgent",
    waiting: 9,
    longestWaitMinutes: 52,
    targetMinutes: 60,
  },
  {
    level: 5,
    label: "Non-urgent",
    waiting: 5,
    longestWaitMinutes: 38,
    targetMinutes: 120,
  },
];
