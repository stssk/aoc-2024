#!/usr/bin/env deno -R

import { contains, sum } from "../helpers/array.ts";
import { getGrid, inGrid, printGrid } from "../helpers/grid.ts";


const map = await getGrid()

printGrid(map)

interface Cord {
    x: number
    y: number
}

enum Side {
    Up,
    Right,
    Left,
    Down
}

interface FieldCord {
    x: number
    y: number
    fences: Side[] | undefined
}

interface Field {
    start: Cord
    type: string
    cords: FieldCord[]
}

function fence(c: FieldCord[]): boolean {
    return c.length === 0
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
    const fences: Side[] = []
    const up = checkField(x, y - 1, f, map)
    if (fence(up)) fences.push(Side.Up)
    const right = checkField(x + 1, y, f, map)
    if (fence(right)) fences.push(Side.Right)
    const down = checkField(x, y + 1, f, map)
    if (fence(down)) fences.push(Side.Down)
    const left = checkField(x - 1, y, f, map)
    if (fence(left)) fences.push(Side.Left)

    me.fences = fences
    return [...up, ...right, ...down, ...left]
}

function checkPrice(field: Field): number {
    return findCorners(field) * field.cords.length
}

function findCorners(f: Field): number {
    if (f.cords.length === 1) return 4
    const threeSided = f.cords.filter(p => p.fences?.length === 3)
    const twoSided = f.cords.filter(p => innerCorner(p))
    const outerCorners = f.cords.map(p => outerCorner(p.x, p.y, f))
    // console.log({ type: f.type, threeSided, twoSided, outerCorners, corners: threeSided.length * 2 + twoSided.length + outerCorners.length })
    return threeSided.length * 2 + twoSided.length + sum(outerCorners)
}

function innerCorner(f: FieldCord): boolean {
    if (f?.fences?.length !== 2) return false
    const up = contains(f?.fences, Side.Up)
    const right = contains(f?.fences, Side.Right)
    const down = contains(f?.fences, Side.Down)
    const left = contains(f?.fences, Side.Left)

    return up && right || right && down || down && left || left && up

}

function outerCorner(x: number, y: number, f: Field): number {
    const up = f.cords.find(p => p.x === x && p.y === y - 1)
    const right = f.cords.find(p => p.x === x + 1 && p.y === y)
    const down = f.cords.find(p => p.x === x && p.y === y + 1)
    const left = f.cords.find(p => p.x === x - 1 && p.y === y)
    // console.log({ up, right, down, left })
    // console.log(contains(up?.fences ?? [], Side.Right), contains(right?.fences ?? [], Side.Up))

    return (contains(up?.fences ?? [], Side.Right) && contains(right?.fences ?? [], Side.Up) ? 1 : 0)
        + (contains(right?.fences ?? [], Side.Down) && contains(down?.fences ?? [], Side.Right) ? 1 : 0)
        + (contains(down?.fences ?? [], Side.Left) && contains(left?.fences ?? [], Side.Down) ? 1 : 0)
        + (contains(left?.fences ?? [], Side.Up) && contains(up?.fences ?? [], Side.Left) ? 1 : 0)
}

const fields: Field[] = []

function inField(x: number, y: number): boolean {
    return !!fields.find(f => !!f.cords.find(c => c.x === x && c.y === y))
}

let res = 0

for (const [y, row] of map.entries()) {
    for (const [x, e] of row.entries()) {
        if (inField(x, y)) continue
        const field = { start: { x, y }, type: e, cords: [] }
        checkField(x, y, field, map)
        fields.push(field)
        // console.log(field)
        const price = checkPrice(field)
        console.log({ e, price })
        res += price
    }
}

console.log({ res })
