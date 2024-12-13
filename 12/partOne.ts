#!/usr/bin/env deno run --allow-read

import { sum } from "../helpers/array.ts";
import { getGrid, inGrid } from "../helpers/grid.ts";


const map = await getGrid()

interface Cord {
    x: number
    y: number
}

interface FieldCord {
    x: number
    y: number
    fences: number | undefined
}

interface Field {
    start: Cord
    type: string
    cords: FieldCord[]
}

function fence(c: FieldCord[]): number {
    return c.length === 0
        ? 1
        : 0
}

function checkField(x: number, y: number, f: Field, map: string[][]): FieldCord[] {
    if (!inGrid(map, x, y)) return []
    if (map[y][x] !== f.type) return []

    let me = f.cords.find(p => p.x === x && p.y === y)
    if (me) {
        return [me]
    }
    me = { x, y, fences: undefined }
    f.cords.push(me)
    const up = checkField(x, y - 1, f, map)
    const right = checkField(x + 1, y, f, map)
    const down = checkField(x, y + 1, f, map)
    const left = checkField(x - 1, y, f, map)
    const fences = fence(up) + fence(right) + fence(down) + fence(left)
    // console.log({ up, down, right, left, fences })

    me.fences = fences
    return [...up, ...right, ...down, ...left]
}

function checkPrice(field: Field): number {
    return sum(field.cords.map(p => p.fences ?? 0)) * field.cords.length
}




const fields: Field[] = []

function inField(x: number, y: number): boolean {
    return !!fields.find(f => !!f.cords.find(c => c.x === x && c.y === y))
}

let res = 0

for (const [y, row] of map.entries()) {
    for (const [x, e] of row.entries()) {
        if (inField(x, y)) continue
        const field = { start: { x, y }, type: map[y][x], cords: [] }
        checkField(x, y, field, map)
        fields.push(field)
        // console.log(field)
        const price = checkPrice(field)
        console.log({ e, price })
        res += price
    }
}

console.log({ res })
