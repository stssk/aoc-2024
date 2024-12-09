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

// function compressBlocks(blocks: DataBlock[]): DataBlock[] {
//     let compressed: DataBlock[] = blocks.map(b => ({ fileId: b.fileId, data: b.data, whitespace: b.whitespace }))
//     for (const block of blocks.toReversed()) {
//         console.log(block.fileId)
//         for (const [i, mem] of compressed.entries()) {
//             if (mem.whitespace >= block.data) {
//                 const toMove = { fileId: block.fileId, data: block.data, whitespace: mem.whitespace - block.data }
//                 mem.whitespace = 0
//                 compressed = compressed.filter(p => p.fileId !== toMove.fileId)
//                 compressed.splice(i + 1, 1, toMove)
//                 writeMemory(buildMemory(compressed))
//                 break
//             }
//         }
//     }
//     return compressed
// }

type MemoryBlock = FileId | undefined

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

function isAvailable(index: number, size: number, memory: MemoryBlock[]): boolean {
    for (const i of range(index, size)) {
        if (memory.at(i) !== undefined) return false
    }
    return true
}

function moveFile(index: number, size: number, id: FileId, memory: MemoryBlock[]) {
    for (const i of range(0, memory.length)) {
        if (memory[i] === id) {
            memory[i] = undefined
        }
    }
    for (const i of range(index, size)) {
        memory[i] = id
    }
}

function compressMemory(memory: MemoryBlock[], blocks: DataBlock[]): MemoryBlock[] {
    const compressed: MemoryBlock[] = [...memory]
    for (const block of blocks.toReversed()) {
        // console.log(block.fileId)
        for (const [i, e] of compressed.entries()) {
            if (e === block.fileId) {
                break
            }
            if (isAvailable(i, block.data, compressed)) {
                moveFile(i, block.data, block.fileId, compressed)
                // writeMemory(compressed)
                break
            }
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

const blocks = getBlocks(data)
const memory = buildMemory(blocks)
writeMemory(memory)
const compressed = compressMemory(memory, blocks)
writeMemory(compressed)
const checksum = calculateChecksum(compressed)
console.log(checksum)
