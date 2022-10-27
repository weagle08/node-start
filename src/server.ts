import ReadLine from 'readline';

const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

let maxNum = 1;

rl.question('Choose your max number: ', (maxNumStr: string) => {
    maxNum = parseInt(maxNumStr);

    guessNumber(maxNum);
});

function guessNumber(max: number) {
    rl.question(`Guess a number between 1 and ${max}: `, (guessStr: string) => {
        let randNum = Math.floor(Math.random() * max) + 1;
        let guessNum = parseInt(guessStr);

        if (guessNum == randNum) {
            console.log('you guessed it!!!!');
        } else {
            console.log(`${guessNum} is not equal to ${randNum}`);
        }

        rl.question('Would you like to try again? ', (answer: string) => {
            if (answer == 'yes') {
                guessNumber(maxNum);
            } else {
                rl.close();
            }
        });
    });
}