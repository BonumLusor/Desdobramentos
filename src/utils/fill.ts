import { origin } from 'bun';
import { postData } from '../types/types.ts'
import shamble from './shamble.ts';

function hasSpecificDuplicate(array: number[], specificNumber: number): boolean {

    let counts: { [key: number]: number } = {};

    for (let i = 0; i < array.length; i++) {
        if(array[i] === 0) continue;
        if (counts[array[i]]) {
            counts[array[i]]++;
        } else {
            counts[array[i]] = 1;
        }
    }

    return counts[specificNumber] > 1;
}

function sequencial(array:number[], limit:number) {
    
    let lineSequencial = 1;
    let lineSequence = [];
    let collumSequencial = 1;
    let collumSequence = [];
    
    let units = array.map((number) => number % 10);

    array.sort((a, b) => a - b);

    for (let i = 1; i < array.length; i++) {

        if (units[i] == units[i - 1]) {
            collumSequencial++;
        } else {
            collumSequence.push(collumSequencial);
            collumSequencial = 1;
        }

        if (array[i] - array[i - 1] == 1) {
            lineSequencial++;   
        } else {
            lineSequence.push(lineSequencial);
            lineSequencial = 1;
        }

    }
    lineSequence.push(lineSequencial);  
    
    const maxSequenceCollum = Math.max(...collumSequence);
    const maxSequenceLine = Math.max(...lineSequence);

    if (maxSequenceLine > limit || maxSequenceCollum > limit) return false;
    else if (maxSequenceCollum === limit && hasSpecificDuplicate(collumSequence, maxSequenceCollum) && limit !== 1) return false;
    else if (maxSequenceLine === limit && hasSpecificDuplicate(lineSequence, maxSequenceLine) && limit !== 1) return false;
    else return true;
}

export default function fill(array:number[], attributes:postData) {

    const evenNumbers = array.filter((number) => number % 2 == 0).length;
    const oddNumbers = array.filter((number) => number % 2 != 0).length;
    let fail = false;
    if (evenNumbers > attributes.even || oddNumbers > attributes.odd) return null;

    const notIncludedNumbers = attributes.selectedNumbers.filter((number) => !array.includes(number));
    let evenNumbersToFill = attributes.even - evenNumbers; 
    let oddNumbersToFill = attributes.odd - oddNumbers;
    let unitsToAdd: { [key: number]: number } = {};
    let decadesToAdd: { [key: number]: number } = {};
    let filledArray = [...array];

    let unitCounts: { [key: number]: number } = {};

    array.forEach(num => {
        let unit = num % 10;
        if (unitCounts[unit]) {
            unitCounts[unit]++;
        } else {
            unitCounts[unit] = 1;
        }
    });

    Object.entries(unitCounts).forEach(([key, value]) => {
        if (value > attributes.collum) {
            fail = true;
        }
        else if (value <= attributes.collum) {
            unitsToAdd[parseInt(key)] = attributes.collum - value;
        }
    });

    if (fail) return null;


    let decadeCounts: { [key: number]: number } = {};

    array.forEach(num => {
        let decade = Math.floor((num - 1) / 10);
        if (decadeCounts[decade]) {
            decadeCounts[decade]++;
        } else {
            decadeCounts[decade] = 1;
        }
    });

    Object.entries(decadeCounts).forEach(([key, value]) => {
        if (value > attributes.line) {
            fail = true;
        }
        else if (value <= attributes.line) {
            decadesToAdd[parseInt(key)] = attributes.line - value;
        }
    }); 

    if (fail) return null;

    shamble(notIncludedNumbers);

    let notEnoughNumbers = false;
    
    for (let i = 0; filledArray.length < attributes.numbersPerTicket; i++) {

        if (i == notIncludedNumbers.length) {
            notEnoughNumbers = true;
            break;
        }

        if( 
            notIncludedNumbers[i] % 2 == 0 && 
            evenNumbersToFill > 0 &&
            unitsToAdd[notIncludedNumbers[i] % 10] > 0 &&
            decadesToAdd[Math.floor((notIncludedNumbers[i] - 1) / 10)] > 0 &&
            sequencial([...filledArray, notIncludedNumbers[i]], attributes.sequencial)
        ) {
            filledArray.push(notIncludedNumbers[i]);
            evenNumbersToFill--;
            unitsToAdd[notIncludedNumbers[i] % 10]--;
            decadesToAdd[Math.floor((notIncludedNumbers[i] - 1) / 10)]--;
        }
        else if (
            notIncludedNumbers[i] % 2 != 0 &&
            oddNumbersToFill > 0 &&
            unitsToAdd[notIncludedNumbers[i] % 10] > 0 &&
            decadesToAdd[Math.floor((notIncludedNumbers[i] - 1) / 10)] > 0 &&
            sequencial([...filledArray, notIncludedNumbers[i]], attributes.sequencial)
        ) {
            filledArray.push(notIncludedNumbers[i]);
            oddNumbersToFill--;
            unitsToAdd[notIncludedNumbers[i] % 10]--;
            decadesToAdd[Math.floor((notIncludedNumbers[i] - 1) / 10)]--;
        } else {
            continue;
        }
    }
    
    if (notEnoughNumbers) return null;
    else {
        filledArray.sort((a, b) => a - b);
        return filledArray;
    };

}