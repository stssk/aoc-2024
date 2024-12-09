import { range } from "../helpers/array.ts";

const data = Deno.args.at(0) === "-e"
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

type FileId = number

interface DataBlock {
    fileId: FileId
    data: number
    whitespace: number
}

function getBlocks(data: string): DataBlock[] {
    const arr = data.split("")
    const blocks: DataBlock[] = []
    for (let i = 0; i < arr.length; i = i + 2) {
        blocks.push({
            fileId: i / 2,
            data: Number(arr.at(i)),
            whitespace: Number(arr.at(i + 1) ?? 0)
        })
    }
    return blocks
}

type MemoryBlock = FileId | undefined

// console.log(getBlocks(data))

function buildMemory(blocs: DataBlock[]): MemoryBlock[] {
    const memory: MemoryBlock[] = []
    for (const b of blocs) {
        for (const _ of range(0, b.data)) {
            memory.push(b.fileId)
        }
        for (const _ of range(0, b.whitespace)) {
            memory.push(undefined)
        }
    }
    return memory
}

function writeMemory(memory: MemoryBlock[]) {
    console.log(memory.map(m => m ?? ".").join(""))
}

function compressMemory(memory: MemoryBlock[]): MemoryBlock[] {
    const compressed: MemoryBlock[] = [...memory]
    for (const i of range(0, memory.length)) {
        const m = compressed.at(i)
        if (m !== undefined) {
            continue
        }
        const lastBlock = compressed.findLastIndex(p => p !== undefined)
        if (lastBlock <= i) {
            break
        }
        if (lastBlock >= 0) {
            compressed[i] = compressed.at(lastBlock)
            compressed[lastBlock] = undefined
            // writeMemory(compressed)
        }
    }
    return compressed
}

function calculateChecksum(memory: MemoryBlock[]): number {
    let sum = 0
    for (const [i, e] of memory.entries()) {
        if (e) sum += e * i
    }
    return sum
}

const memory = buildMemory(getBlocks(data))
writeMemory(memory)
const compressed = compressMemory(memory)
writeMemory(compressed)
const checksum = calculateChecksum(compressed)
console.log(checksum)
