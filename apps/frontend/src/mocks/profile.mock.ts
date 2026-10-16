export const profile = {
  name: "Arham Khan",
  initials: "AK",
  avatar: "https://avatars.githubusercontent.com/u/43849669",
  workEmail: "hello@arhamkhnz.com",
  jobTitle: "Software Engineer",
  employmentType: "Contractor",
  workplace: "Remote",
  timeZone: "UTC+5:30",
  bio: "Arham is a software engineer on the product team, building bids and tender management software, including autonomous bid agents that streamline opportunity discovery, requirement analysis, document preparation, compliance checks, pricing, and submission. He focuses on turning complex tender workflows into reliable, easy-to-use products that help teams work faster and make better bidding decisions.",
  manager: { name: "Pravi K.", role: "Head of Product", initials: "PK" },
  nextLeave: "August 24–28, 2026",
  lastWorkingDay: "October 3, 2026",
  updatedAt: "August 8, 2026",
  overview: [
    [{ label: "Contractor ID", value: "WS-2301" }, { label: "Engagement status", value: "Active" }, { label: "Job level", value: "Senior" }],
    [{ label: "Department", value: "Product" }, { label: "Team", value: "Product" }, { label: "Current project", value: "Autonomous Bid Agent" }],
    [{ label: "Start date", value: "March 18, 2022" }, { label: "Engagement length", value: "4 years, 4 months" }],
  ],
  personal: [
    {
      title: "Personal information",
      private: true,
      columns: [
        [{ label: "Preferred name", value: "Arham" }, { label: "Date of birth", value: "September 9, 1993" }],
        [{ label: "Legal name", value: "Arham Khan" }, { label: "Personal email", value: "arhamkhnz@gmail.com" }],
        [{ label: "Pronouns", value: "He / him" }, { label: "Work phone", value: "+1 (415) 555-0148" }],
      ],
    },
    {
      title: "Address and emergency contact",
      private: true,
      columns: [
        [{ label: "Home address", value: "1842 Valencia Street, San Francisco, CA 94110" }],
        [{ label: "Emergency contact", value: "Ammar K. · Brother" }],
        [{ label: "Emergency phone", value: "+1 (510) 555-0177" }],
      ],
    },
  ],
  employment: [
    {
      title: "Role and organization",
      columns: [
        [{ label: "Job title", value: "Software Engineer" }, { label: "Team", value: "Product" }],
        [{ label: "Job level", value: "Senior" }, { label: "Manager", value: "Pravi K." }],
        [{ label: "Department", value: "Product" }, { label: "Current project", value: "Autonomous Bid Agent" }],
      ],
    },
    {
      title: "Contract details",
      columns: [
        [{ label: "Contractor ID", value: "WS-2301" }, { label: "Engagement status", value: "Active" }, { label: "Employment type", value: "Contractor" }],
        [{ label: "Contracting entity", value: "Studio Technologies Pte. Ltd." }, { label: "Start date", value: "March 18, 2022" }, { label: "Last working day", value: "October 3, 2026" }],
        [{ label: "Notice period", value: "30 days" }],
      ],
    },
    {
      title: "Work arrangement",
      columns: [
        [{ label: "Workplace", value: "Remote" }, { label: "Time zone", value: "UTC+5:30" }],
        [{ label: "Weekly hours", value: "40 hours" }],
        [{ label: "Schedule", value: "Monday–Friday · 9:00 AM–5:30 PM" }],
      ],
    },
  ],
  timeOff: [
    {
      title: "Leave balance",
      columns: [
        [{ label: "Policy", value: "Contract leave allowance" }, { label: "Carried over", value: "0 days" }],
        [{ label: "Annual allowance", value: "25 days" }, { label: "Used this year", value: "7 days" }],
        [{ label: "Remaining", value: "18 days" }, { label: "Scheduled", value: "5 days" }],
      ],
    },
    {
      title: "Upcoming and approvals",
      columns: [
        [{ label: "Next leave", value: "August 24–28, 2026" }, { label: "Pending requests", value: "0" }],
        [{ label: "Leave year", value: "January 1–December 31, 2026" }],
        [{ label: "Approver", value: "Pravi K." }],
      ],
    },
  ],
  documents: [
    { name: "Contractor agreement", category: "Contract", updatedAt: "Mar 18, 2022", status: "Signed", restricted: false },
    { name: "Confidentiality agreement", category: "Compliance", updatedAt: "Mar 18, 2022", status: "Signed", restricted: true },
    { name: "Information security policy acknowledgement", category: "Policy", updatedAt: "Jan 8, 2026", status: "Current", restricted: false },
  ],
} as const;
