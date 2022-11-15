import { Student } from './student';

export class GradeBook {
    public teacherName: string;

    // readonly just marks this variable as not being modifiable outside of object construction
    public readonly students: Student[] = []; // initialize our students array to an empty array
}