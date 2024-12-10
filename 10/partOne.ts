import { distinct, sum } from "../helpers/array.ts";
import { getGrid, inGrid, printGrid } from "../helpers/grid.ts";


const grid = await getGrid()

const map = grid.map(row => row.map(p => Number(p)))

interface Coord {
    x: number
    y: number
}

printGrid(map)

function findZeros(map: number[][]): Coord[] {
    const coords: Coord[] = []
    for (const [y, row] of map.entries()) {
        for (const [x, e] of row.entries()) {
            if (e === 0) {
                coords.push({ x, y })
            }
        }
    }
    return coords
}

const zeros = findZeros(map)

// console.log(zeros)

function findPath(to: number, position: Coord, map: number[][]): Coord[] {
    if (!inGrid(map, position.x, position.y)) {
        return []
    }
    if (map[position.y][position.x] !== to) {
        return []
    }
    if (to === 9) {
        return [position]
    }
    // printG(map, position.x, position.y)
    const up = findPath(to + 1, { x: position.x, y: position.y - 1 }, map)
    const right = findPath(to + 1, { x: position.x + 1, y: position.y }, map)
    const down = findPath(to + 1, { x: position.x, y: position.y + 1 }, map)
    const left = findPath(to + 1, { x: position.x - 1, y: position.y }, map)
    // console.log({ to, position, up, right, down, left })
    return distinct([...up, ...right, ...down, ...left], (a, b) => a.x === b.x && a.y === b.y)
}

// console.log(findPath(0, zeros[0], map))

const trailEnds = zeros.map(z => findPath(0, z, map))
const trailWeights = trailEnds.map(p => p.length)
console.log(trailWeights)
console.log({ sum: sum(trailWeights) })