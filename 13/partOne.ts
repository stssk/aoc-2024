#!/usr/bin/env deno run --allow-read

import { range, sum } from "../helpers/array.ts";

const rawData = Deno.args.at(0) === "-e"
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

const machineData = rawData.split("\n\n")

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
        prize: { x: prizeLine?.at(0) ?? 0, y: prizeLine?.at(1) ?? 0 }
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

function bruteForceGame(g: MachineGame): Result | undefined {
    const results: Result[] = []
    for (const a of range(0, 100)) {
        for (const b of range(0, 100)) {
            const totalX = g.a.x * a + g.b.x * b;
            const totalY = g.a.y * a + g.b.y * b;
            if (totalX === g.prize.x && totalY === g.prize.y) {
                results.push({ a, b })
            }
        }
    }
    return results.toSorted((a, b) => calculatePrize(a) - calculatePrize(b)).at(0)
}

const results: Result[] = []

for (const g of machines) {
    const result = bruteForceGame(g)
    if (result) {
        results.push(result)
        console.log({ result })
    }
}

const res = sum(results.map(calculatePrize))
console.log({ res })