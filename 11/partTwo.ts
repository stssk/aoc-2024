#!/usr/bin/env deno run --allow-read

const data = Deno.args.at(0) === "-e"
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

const stones = data.split(" ")

const targetDepth = 75

const memo = new Map<string, bigint>();

function blink(stone: string, depth: number): bigint {
    const key = `${stone}-${depth}`;

    if (memo.has(key)) {
        return memo.get(key)!;
    }

    let result: bigint;
    if (depth === targetDepth) {
        result = 1n;
    } else if (stone === "0") {
        result = blink("1", depth + 1);
    } else if (stone.length % 2 === 0) {
        const middle = stone.length / 2;
        result = blink(stone.slice(0, middle), depth + 1) + blink(BigInt(stone.slice(middle)).toString(), depth + 1);
    } else {
        result = blink((BigInt(stone) * 2024n).toString(), depth + 1);
    }

    memo.set(key, result);

    return result;
}

let sum = 0n
stones.forEach(s => {
    const res = blink(s, 0)
    // console.log({ s, res })
    sum += res
})
console.log(sum)
