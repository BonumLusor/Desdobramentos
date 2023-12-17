/**
 * @param {Array} array
 * @param {number} size
 * @return {Array}
**/


export default function getCombinations(array:number[], size:number) {
    const result:number[][] = [];

    function combination(start:number, combo:number[]) {
        if (combo.length === size) {
            result.push([...combo]);
            return;
        }

        for (let i = start; i < array.length; i++) {
            combo.push(array[i]);
            combination(i + 1, combo);
            combo.pop();
        }
    }

    combination(0, []);

    return result;
}