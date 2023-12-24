/**
* Shamble an array
* @param {Array} array
* @return {Array}
**/


export default function shamble(array:number[]) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array

}