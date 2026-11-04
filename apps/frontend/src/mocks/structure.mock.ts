import type { Employee } from "../features/structure/types/structure";

/** Heron Run leadership tree: CEO → department heads → leads → individual contributors. */
export const structureEmployees: Employee[] = [
  { id: "ceo", name: "Hanna Berg", title: "Chief Executive Officer", department: "Executive", email: "hanna.berg@heronrun.id", location: "Jakarta" },
  { id: "cto", parent: "ceo", name: "Rafael Mahendra", title: "Chief Technology Officer", department: "Engineering", email: "rafael.mahendra@heronrun.id", location: "Jakarta" },
  { id: "cpo", parent: "ceo", name: "Maya Lestari", title: "Chief Product Officer", department: "Product", email: "maya.lestari@heronrun.id", location: "Jakarta" },
  { id: "cro", parent: "ceo", name: "Darmawan Putra", title: "Chief Revenue Officer", department: "Sales", email: "darmawan.putra@heronrun.id", location: "Surabaya" },
  { id: "cfo", parent: "ceo", name: "Elena Siregar", title: "Chief Financial Officer", department: "Finance", email: "elena.siregar@heronrun.id", location: "Jakarta" },
  { id: "people", parent: "ceo", name: "Sofia Rahmawati", title: "Head of People", department: "People", email: "sofia.rahmawati@heronrun.id", location: "Bandung" },
  { id: "eng-platform", parent: "cto", name: "Kenji Wibowo", title: "Engineering Manager, Platform", department: "Engineering", email: "kenji.wibowo@heronrun.id", location: "Jakarta" },
  { id: "eng-mobile", parent: "cto", name: "Priya Anandita", title: "Engineering Manager, Mobile", department: "Engineering", email: "priya.anandita@heronrun.id", location: "Bandung" },
  { id: "eng-1", parent: "eng-platform", name: "Yoga Prasetyo", title: "Senior Backend Engineer", department: "Engineering", email: "yoga.prasetyo@heronrun.id", location: "Jakarta" },
  { id: "eng-2", parent: "eng-platform", name: "Ines Darmadi", title: "Site Reliability Engineer", department: "Engineering", email: "ines.darmadi@heronrun.id", location: "Remote" },
  { id: "eng-3", parent: "eng-mobile", name: "Tomi Hardianto", title: "Mobile Engineer", department: "Engineering", email: "tomi.hardianto@heronrun.id", location: "Bandung" },
  { id: "pm-lead", parent: "cpo", name: "Nadia Shafira", title: "Lead Product Manager", department: "Product", email: "nadia.shafira@heronrun.id", location: "Jakarta" },
  { id: "design-lead", parent: "cpo", name: "Amir Qureshi", title: "Design Lead", department: "Design", email: "amir.qureshi@heronrun.id", location: "Jakarta" },
  { id: "designer", parent: "design-lead", name: "Ji-woo Park", title: "Product Designer", department: "Design", email: "jiwoo.park@heronrun.id", location: "Remote" },
  { id: "sales-jkt", parent: "cro", name: "Andi Saputra", title: "Regional Sales Manager, Jakarta", department: "Sales", email: "andi.saputra@heronrun.id", location: "Jakarta" },
  { id: "sales-sby", parent: "cro", name: "Citra Dewi", title: "Regional Sales Manager, Surabaya", department: "Sales", email: "citra.dewi@heronrun.id", location: "Surabaya" },
  { id: "ae-1", parent: "sales-jkt", name: "Budi Hartono", title: "Account Executive", department: "Sales", email: "budi.hartono@heronrun.id", location: "Jakarta" },
  { id: "fin-1", parent: "cfo", name: "Dian Permata", title: "Finance Controller", department: "Finance", email: "dian.permata@heronrun.id", location: "Jakarta" },
  { id: "hr-1", parent: "people", name: "Fitri Handayani", title: "Talent Acquisition Partner", department: "People", email: "fitri.handayani@heronrun.id", location: "Bandung" },
];
