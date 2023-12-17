export default function guarantee(array:number[], guarantee:number) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    let rejectedNumbers = [];

    while(array.length > guarantee) {
        rejectedNumbers.push(array[array.length - 1])
        array.pop()
    }

    return {
        rejectedNumbers: rejectedNumbers,
        array: array
    }

}