const useExample = Deno.args.at(0) === "-e"

const rawData = useExample
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

interface Task {
    test: number
    numbers: number[]
}

const data: Task[] = rawData
    .split("\n")
    .map(p => ({
        test: Number(p.split(":").at(0) ?? 0),
        numbers: p.split(":").at(1)?.trim().split(" ").map(n => Number(n)) ?? []
    }))

const operators = ["+", "*"]

function getSequences(len: number) {
    let sequences: string[][] = [[]]
    for (let i = 0; i < len; i++) {
        const oldSequences = [...sequences]
        sequences = []
        for (const op of operators) {

            sequences.push(...oldSequences.map(seq => [...seq, op]))
        }
    }
    return sequences
}

function doOps(arr: number[], op: string[]) {
    let res = arr[0]
    for (let i = 1; i < arr.length; i++) {
        if (op[i - 1] === "+")
            res += arr[i]
        else
            res *= arr[i]
    }
    return res
}

let sum = 0

for (const { test, numbers } of data) {
    const ops = getSequences(numbers.length - 1)
    for (const op of ops) {
        const res = doOps(numbers, op)
        if (res === test) {
            console.log({ test, numbers, op })
            sum += res
            break
        }
    }
}

console.log(sum)
