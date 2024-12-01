import { group1, group2 } from "./readFile.ts";

let res = 0

group1.forEach(g1 => {
    let count = 0
    group2.forEach(g2 => {
        if (g1 === g2) count++
    })
    res += g1 * count
})

console.log(res)