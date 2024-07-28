import { type facultyType } from "../faculty";
import { type departmentType } from "../department";

export interface OfficersFormType {
  faculty: facultyType | null;
  department: departmentType | null;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
