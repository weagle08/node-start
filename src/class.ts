import { Gradebook } from "./gradebook";
import { Student } from "./student";

export class Class {
    name: string;
    gradebook: Gradebook;
    students: Student[];
}