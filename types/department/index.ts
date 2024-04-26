import { type facultyType } from "../faculty";

export interface departmentType {
  id: Number | String;
  created_at?: String;
  name: String;
  faculty: facultyType | null;
}
