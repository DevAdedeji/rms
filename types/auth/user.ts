import { type departmentType } from "../department";
import { type facultyType } from "../faculty";

export enum UserTypes {
  student = "student",
  faculty = "exam_officer",
  school = "school_admin",
  hod = "hod",
}

export interface Certificate {
  id: String | number;
  name: String;
  full_name: String;
}

export interface User {
  id: String;
  matric_no?: String;
  role: UserTypes.faculty | UserTypes.school | UserTypes.school;
  first_name: String;
  last_name: String;
  created_at?: String;
  level?: String | number;
  department?: departmentType;
  faculty?: facultyType;
  cert?: Certificate;
  year_of_admission?: number;
  email: string;
}
