export function printGrid<T>(g: T[][], separator = "") {
    console.log()
    g.forEach(r => console.log(r.join(separator)))
    console.log()
}

export function countOccurrences<T>(g: T[][], value: T): number {
    let sum = 0
    for (const row of g)
        for (const e of row)
            if (e === value)
                sum++
    return sum
}

export async function getGrid(separator = ""): Promise<string[][]> {
    const useExample = Deno.args.at(0) === "-e"
    const fileContent = useExample
        ? await Deno.readTextFile("example.txt")
        : await Deno.readTextFile("task.txt")

    return fileContent.split("\n").map(r => r.split(separator));
}

export function inGrid<T>(grid: T[][], x: number, y: number) {
    return y >= 0 &&
        x >= 0 &&
        y < grid.length &&
        x < grid[y].length
}