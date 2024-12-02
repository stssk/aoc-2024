import { data } from "./readData.ts"

let counter = 0
data.map(row => {
    if (checkRow(row) || tryDampener(row)) {
        counter++
    } else {
        console.log(row)
    }
})

console.log(`Counter at ${counter}`)

function checkRow(row: number[]) {
    let safe = true
    const decreasing = (row.at(0) ?? 0) > (row.at(1) ?? 0)
    for (let i = 1; i < row.length; i++) {
        const diff = ((row.at(i - 1))! - row.at(i)!) * (decreasing ? 1 : -1)
        if (diff < 1 || diff > 3) {
            safe = false
        }
    }
    return safe
}

function tryDampener(row: number[]) {
    const tries = row.map((_, i) => row.filter((_, j) => i !== j))
    const checked = tries.map(checkRow)
    return checked.some(p => p)
}