export const randomInt = (max) => {
    return Math.floor(Math.random() * max);
}

export const getRandomItem = (arr) => {
    return arr[randomInt(arr.length)];
}

export const shuffle = (arr) => {
    const n = arr.length
    for (let i = 0; i < n * 20; i++) {
        let r1 = randomInt(n)
        let r2 = randomInt(n)
        const temp = arr[r1];
        arr[r1] = arr[r2]
        arr[r2] = temp
    }
}

export const itemInArray = (item, arr) => {
    for (let a of arr) {
        if (a === item) return true
    }
    return false
}