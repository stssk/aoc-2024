#!/usr/bin/env deno run --allow-read

import { inv, multiply } from "npm:mathjs";

import { range, sum } from "../helpers/array.ts";

const rawData = Deno.args.at(0) === "-e"
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

const machineData = rawData.split("\n\n")
const dataError = 10000000000000

interface Prize {
    x: number
    y: number
}

interface Button {
    x: number
    y: number
}

interface MachineGame {
    a: Button
    b: Button
    prize: Prize
}

const findNumbers = /\d+/g

function getGame(data: string): MachineGame {
    const lines = data.split("\n")
    const aLine = lines.at(0)?.match(findNumbers)?.map(p => Number(p))
    const bLine = lines.at(1)?.match(findNumbers)?.map(p => Number(p))
    const prizeLine = lines.at(2)?.match(findNumbers)?.map(p => Number(p))
    return {
        a: { x: aLine?.at(0) ?? 0, y: aLine?.at(1) ?? 0 },
        b: { x: bLine?.at(0) ?? 0, y: bLine?.at(1) ?? 0 },
        prize: { x: dataError + (prizeLine?.at(0) ?? 0), y: dataError + (prizeLine?.at(1) ?? 0) }
    }
}

const machines = machineData.map(getGame)

console.log({ machines })

interface Result {
    a: number
    b: number
}

function calculatePrize(result: Result): number {
    return result.a * 3 + result.b
}

function checkResult({ a, b }: Result, g: MachineGame): boolean {
    const x = g.a.x * a + g.b.x * b
    const y = g.a.y * a + g.b.y * b
    // console.log({ x, y, a, b, prize: g.prize })
    return x === g.prize.x && y === g.prize.y
}

function solveGame(g: MachineGame): Result | undefined {
    const A = [
        [g.a.x, g.b.x],
        [g.a.y, g.b.y]
    ]
    const b = [g.prize.x, g.prize.y]

    const A_inverse = inv(A);
    const solution = multiply(A_inverse, b);
    // console.log(solution)
    const res = { a: Math.round(solution[0]), b: Math.round(solution[1]) }
    if (checkResult(res, g))
        return res
    return undefined
}

const results: Result[] = []

for (const g of machines) {
    const result = solveGame(g)
    if (result) {
        results.push(result)
        console.log({ result })
    }
}

const res = sum(results.map(calculatePrize))
console.log({ res })