import { postData } from '../types/types.ts'

export default function filter(array:number[], attributes:postData, rejectedNumbers:number[]) {

    let evenQty = array.filter(num => num % 2 === 0).length
    
    let oddQty = array.filter(num => num % 2 === 1).length

    let unitCounts: { [key: number]: number } = {};

    array.forEach(num => {
        let unit = num % 10;
        if (unitCounts[unit]) {
            unitCounts[unit]++;
        } else {
            unitCounts[unit] = 1;
        }
    });

    let maxUnit: number | null = null;
    let maxUnitValue = -1;

    for (const unit in unitCounts) {
        if (unitCounts.hasOwnProperty(unit)) {
            const count = unitCounts[unit];

            if (count > maxUnitValue) {
                maxUnitValue = count;
                maxUnit = parseInt(unit, 10); // Converte a chave de string para número
            }
        }
    }

    let decadeCounts: { [key: number]: number } = {};

    array.forEach(num => {
        let decade = Math.floor(num / 10);
        if (decadeCounts[decade]) {
            decadeCounts[decade]++;
        } else {
            decadeCounts[decade] = 1;
        }
    });

    let maxDecade: number | null = null;
    let maxDecadeValue = -1;

    for (const decade in decadeCounts) {
        if (decadeCounts.hasOwnProperty(decade)) {
            const count = decadeCounts[decade];

            if (count > maxDecadeValue) {
                maxDecadeValue = count;
                maxDecade = parseInt(decade, 10); // Converte a chave de string para número
            }
        }
    }
    
    if (evenQty > attributes.even) return null;
    if (oddQty > attributes.odd) return null;
    if(Math.max(...Object.values(unitCounts)) > attributes.line) return null;
    if(Math.max(...Object.values(unitCounts)) > attributes.collum) return null;

    if (array.length < attributes.numbersPerTicket) {
        for (let i = rejectedNumbers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [rejectedNumbers[i], rejectedNumbers[j]] = [rejectedNumbers[j], rejectedNumbers[i]];
        }
  
        for (let i = 0; array.length < attributes.numbersPerTicket && i < rejectedNumbers.length; i++ ) {
            if (
                (rejectedNumbers[i] % 10 == maxUnitValue || Math.max(...Object.values(unitCounts)) != attributes.line) &&
                (Math.floor(rejectedNumbers[i]/10) == maxDecadeValue || Math.max(...Object.values(decadeCounts)) != attributes.collum)
            ) {
                if (
                    oddQty != attributes.odd && rejectedNumbers[i] % 2 == 1
                ) 
                array.push(rejectedNumbers[i])
                else if (
                    evenQty != attributes.even && rejectedNumbers[i] % 2 == 0 
                )
                array.push(rejectedNumbers[i])
            }
        }
    }

    return array;

}