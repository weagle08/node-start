import { Teacher } from './teacher';
import { Student } from './student';
import { Class } from './class';
import { Gradebook } from './gradebook';
import { Assignment } from './assignment';

let teacher = new Teacher('miriam');

// teacher.name = 'bob'; // error, name is not settable and _name is private to class teacher
console.log(teacher.name);