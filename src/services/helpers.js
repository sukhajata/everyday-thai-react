export function  shuffle (arr) {
    //clone array
    let array = arr.slice(0);
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

export function checkCase(word) {
    if (word === "I" || word === "I'm" || word === "I've") {
        return word;
    }
    return word.toLowerCase();
}

export function ucFirst(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}