import { countOccurrences, getGrid, printGrid } from "../helpers/grid.ts";

const grid = await getGrid()

const antinodes = grid.map(r => r.map(_ => "."))

printGrid(grid)
// printGrid(antinodes)

const AntinodeSymbol = "#"
const SpaceSymbol = "."

interface Antenna {
    y: number
    x: number
    type: string
}

interface Antinode {
    y: number
    x: number
    outOfGrid: boolean
    pair: AntennaPair
}

interface AntennaPair {
    first: Antenna
    second: Antenna
}

function addAntinode(p: AntennaPair, antinodes: string[][]): Antinode {
    const x = p.second.x + (p.second.x - p.first.x)
    const y = p.second.y + (p.second.y - p.first.y)
    const outOfGrid = y < 0 || x < 0 || y >= antinodes.length || x >= antinodes[y].length
    if (!outOfGrid) {
        antinodes[y][x] = AntinodeSymbol
    }
    return { y, x, outOfGrid, pair: p }
}

function findPairs(a: Antenna, grid: string[][]): AntennaPair[] {
    const pairs: AntennaPair[] = []
    for (const [y, _] of grid.entries()) {
        for (const [x, e] of grid[y].entries()) {
            if (a.y === y && a.x === x) {
                continue
            }
            if (e === a.type) {
                pairs.push({ first: a, second: { y: y, x: x, type: a.type } })
            }
        }
    }
    return pairs
}

function findAntennae(grid: string[][]): Antenna[] {
    const antennae: Antenna[] = []
    for (const [y, _] of grid.entries()) {
        for (const [x, type] of grid[y].entries()) {
            if (type !== SpaceSymbol)
                antennae.push({ y, x, type })
        }
    }
    return antennae
}

const antennae = findAntennae(grid)
// console.log(antennae)

const antennaePairs = antennae.flatMap(a => findPairs(a, grid))
// console.log(antennaePairs)

const antinodeValues: Antinode[] = []
for (const e of antennaePairs) {
    antinodeValues.push(addAntinode(e, antinodes))
}
printGrid(antinodes)
// console.log(antinodeValues)

console.log(countOccurrences(antinodes, AntinodeSymbol))

const combined = [...antinodes.map(row => [...row])]
for (const [y, row] of grid.entries()) {
    for (const [x, e] of row.entries())
        if (e !== SpaceSymbol)
            combined[y][x] = e
}

printGrid(combined)