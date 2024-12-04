const useExample = Deno.args.at(0) === "-e"

const data = useExample
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

const tables = data
    .split("\n")
    .map(line => line.split(""))

const at = (h: number, w: number) => {
    if (h < 0) return ""
    if (h > tables.length - 1) return ""
    if (w < 0) return ""
    if (w > tables[h].length) return ""

    return tables[h][w]
}

const lookUpLeft = (h: number, w: number) =>
    at(h - 1, w - 1) === "M" &&
        at(h - 2, w - 2) === "A" &&
        at(h - 3, w - 3) === "S" ? 1 : 0

const lookUp = (h: number, w: number) =>
    at(h - 1, w) === "M" &&
        at(h - 2, w) === "A" &&
        at(h - 3, w) === "S" ? 1 : 0

const lookUpRight = (h: number, w: number) =>
    at(h - 1, w + 1) === "M" &&
        at(h - 2, w + 2) === "A" &&
        at(h - 3, w + 3) === "S" ? 1 : 0

const lookRight = (h: number, w: number) =>
    at(h, w + 1) === "M" &&
        at(h, w + 2) === "A" &&
        at(h, w + 3) === "S" ? 1 : 0

const lookDownRight = (h: number, w: number) =>
    at(h + 1, w + 1) === "M" &&
        at(h + 2, w + 2) === "A" &&
        at(h + 3, w + 3) === "S" ? 1 : 0

const lookDown = (h: number, w: number) =>
    at(h + 1, w) === "M" &&
        at(h + 2, w) === "A" &&
        at(h + 3, w) === "S" ? 1 : 0

const lookDownLeft = (h: number, w: number) =>
    at(h + 1, w - 1) === "M" &&
        at(h + 2, w - 2) === "A" &&
        at(h + 3, w - 3) === "S" ? 1 : 0

const lookLeft = (h: number, w: number) =>
    at(h, w - 1) === "M" &&
        at(h, w - 2) === "A" &&
        at(h, w - 3) === "S" ? 1 : 0

const isXMAS = (h: number, w: number) =>
    tables[h][w] === "X" ? (
        lookUpLeft(h, w) +
        lookUp(h, w) +
        lookUpRight(h, w) +
        lookRight(h, w) +
        lookDownRight(h, w) +
        lookDown(h, w) +
        lookDownLeft(h, w) +
        lookLeft(h, w)
    ) : 0

let sum = 0

for (let h = 0; h < tables.length; h++) {
    const row = []
    for (let w = 0; w < tables[h].length; w++) {
        const xmas = isXMAS(h, w);
        row.push(xmas)
        sum += xmas
    }
    console.log(row.join(""))
}

console.log(sum)