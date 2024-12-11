#!/usr/bin/env deno run --allow-read

import { range } from "../helpers/array.ts";

const data = Deno.args.at(0) === "-e"
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

const stones = data.split(" ").map(p => Number(p))

function blink(stones: number[]): number[] {
    const next: number[] = []

    for (const stone of stones) {
        if (stone === 0) {
            next.push(1)
            continue
        }
        const stoneStr = stone.toString()
        if (stoneStr.length % 2 === 0) {
            const middle = stoneStr.length / 2
            next.push(Number(stoneStr.slice(0, middle)))
            next.push(Number(stoneStr.slice(middle)))
            continue
        }
        next.push(stone * 2024)
    }
    return next
}

function blinkMultiple(stones: number[], times: number) {
    console.log(`${0}: ${stones.join(" ")}`)
    for (const i of range(1, times)) {
        stones = blink(stones)
        console.log(`${i}: ${stones.join(" ")}`)
    }
    console.log(stones.length)
}

blinkMultiple(stones, 25)