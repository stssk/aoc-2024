import { data } from "./readData.ts";

let counter = 0
data.map(row => {
    let safe = true
    const decreasing = (row.at(0) ?? 0) > (row.at(1) ?? 0)
    for (let i = 1; i < row.length; i++) {
        const diff = ((row.at(i - 1))! - row.at(i)!) * (decreasing ? 1 : -1)
        if (diff < 1 || diff > 3) {
            safe = false
        }
    }
    if (safe) counter++
    console.log(row, safe)
})

console.log(`Counter at ${counter}`)