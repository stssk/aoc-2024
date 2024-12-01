import { group1, group2 } from "./readFile.ts";

group1.sort((a, b) => (a - b))
group2.sort((a, b) => (a - b))

const diff = (a: number, b: number) => a > b ? a - b : b - a

let total = 0
for (let i = 0; i < group1.length; i++) {
    total += diff(group1.at(i) ?? 0, group2.at(i) ?? 0)
}

console.log(total)