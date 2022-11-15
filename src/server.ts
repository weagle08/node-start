import ReadLine from 'readline';
import { GradeBook } from './grade-book';
import { Student } from './student';

const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

// print list students
// add a new student

const gradeBook = new GradeBook();
gradeBook.teacherName = 'Ben Johnson';

const printStudents = () => {
    for (let student of gradeBook.students) {
        console.log(student.name);
    }
    console.log();
};

const addStudent = () => {
    rl.question('Student name?\n', (name: string) => {
        let student = new Student();
        student.name = name;

        gradeBook.students.push(student);
        console.log('\nStudent succesfully added!\n');
        gradeBookActions();
    });
};

const gradeBookActions = () => {
    rl.question(`What would you like to do in ${gradeBook.teacherName} gradebook?\n\t1. Print students\n\t2. Add student\n`, (selStr: string) => {
        let selNum = parseInt(selStr);

        if (selNum == 1) {
            printStudents();
        } else if (selNum == 2) {
            addStudent();
        }
        gradeBookActions();
    });
};

gradeBookActions();