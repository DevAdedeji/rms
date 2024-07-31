import { type User } from "../auth/user";
import type { departmentType } from "../department";
import { type facultyType } from "../faculty";

export interface CourseType {
  id: Number | String;
  lecturer: User;
  title: String;
  course_code: String;
  level: Number | String;
  semester: String;
  faculty: Partial<facultyType>;
  department: Partial<departmentType>;
  unit: Number | number;
}

export interface CourseFormType {
  lecturer: User | null;
  title: String;
  course_code: String;
  level: Number | string | null;
  semester: String;
  faculty: Partial<facultyType> | null;
  department: Partial<departmentType> | null;
  unit: Number | null;
}
