import { origin } from 'bun';
import { postData } from '../types/types.ts'
import shamble from './shamble.ts';

export default function fill(array:number[], attributes:postData) {

    const notIncludedNumbers = attributes.selectedNumbers.filter((number) => !array.includes(number));
    let evenNumbersToFill = attributes.even - array.filter((number) => number % 2 == 0).length; 
    let oddNumbersToFill = attributes.odd - array.filter((number) => number % 2 != 0).length;
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
            return null;
        }
        else if (value <= attributes.line) {
            unitsToAdd[parseInt(key)] = attributes.collum - value;
        }
    });

    let decadeCounts: { [key: number]: number } = {};

    array.forEach(num => {
        let decade = Math.floor(num / 10);
        if (decadeCounts[decade]) {
            decadeCounts[decade]++;
        } else {
            decadeCounts[decade] = 1;
        }
    });

    Object.entries(decadeCounts).forEach(([key, value]) => {
        if (value > attributes.line) {
            return null;
        }
        else if (value <= attributes.line) {
            decadesToAdd[parseInt(key)] = attributes.line - value;
        }
    });

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
            decadesToAdd[Math.floor(notIncludedNumbers[i] / 10)] > 0
        ) {
            filledArray.push(notIncludedNumbers[i]);
            evenNumbersToFill--;
            unitsToAdd[notIncludedNumbers[i] % 10]--;
            decadesToAdd[Math.floor(notIncludedNumbers[i] / 10)]--;
        }
        else if (
            notIncludedNumbers[i] % 2 != 0 &&
            oddNumbersToFill > 0 &&
            unitsToAdd[notIncludedNumbers[i] % 10] > 0 &&
            decadesToAdd[Math.floor(notIncludedNumbers[i] / 10)] > 0
        ) {
            filledArray.push(notIncludedNumbers[i]);
            oddNumbersToFill--;
            unitsToAdd[notIncludedNumbers[i] % 10]--;
            decadesToAdd[Math.floor(notIncludedNumbers[i] / 10)]--;
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