export type AcademyEnrollmentPoint = {
  week: string;
  new: number;
  returning: number;
  active: number;
};

export type AcademyFunnelStep = {
  id: string;
  label: string;
  count: number;
};

export type AcademyCourseStatus = "live" | "draft" | "archived";

export type AcademyCourseCategory =
  "Engineering" | "Design" | "Data" | "Business" | "Leadership";

export type AcademyCourse = {
  id: string;
  title: string;
  category: AcademyCourseCategory;
  instructorId: string;
  learners: number;
  completion: number;
  rating: number;
  status: AcademyCourseStatus;
};

export type AcademyInstructor = {
  id: string;
  name: string;
  specialty: string;
  courses: number;
  rating: number;
};

export type AcademySession = {
  id: string;
  time: string;
  courseId: string;
  seatsBooked: number;
  seatsTotal: number;
};

export type AcademyScoreBucket = {
  range: string;
  min: number;
  learners: number;
};
