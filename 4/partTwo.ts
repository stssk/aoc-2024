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

const lookRight = (h: number, w: number) =>
    at(h - 1, w - 1) === "M" &&
    at(h + 1, w - 1) === "M" &&
    at(h - 1, w + 1) === "S" &&
    at(h + 1, w + 1) === "S"

const lookDown = (h: number, w: number) =>
    at(h - 1, w - 1) === "M" &&
    at(h - 1, w + 1) === "M" &&
    at(h + 1, w - 1) === "S" &&
    at(h + 1, w + 1) === "S"

const lookLeft = (h: number, w: number) =>
    at(h - 1, w + 1) === "M" &&
    at(h + 1, w + 1) === "M" &&
    at(h - 1, w - 1) === "S" &&
    at(h + 1, w - 1) === "S"

const lookUp = (h: number, w: number) =>
    at(h + 1, w - 1) === "M" &&
    at(h + 1, w + 1) === "M" &&
    at(h - 1, w - 1) === "S" &&
    at(h - 1, w + 1) === "S"

const isXMAS = (h: number, w: number) =>
    tables[h][w] === "A" && (
        lookRight(h, w) ||
        lookLeft(h, w) ||
        lookUp(h, w) ||
        lookDown(h, w)
    )

let sum = 0

for (let h = 0; h < tables.length; h++) {
    const row = []
    for (let w = 0; w < tables[h].length; w++) {
        const xmas = isXMAS(h, w);
        row.push(xmas ? "X" : ".")
        sum += xmas ? 1 : 0
    }
    console.log(row.join(""))
}

console.log(sum)