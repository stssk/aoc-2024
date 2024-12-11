import { TextLineStream } from "https://deno.land/std@0.224.0/streams/mod.ts";

const baseFile = Deno.args.at(0) === "-e"
    ? "./example.txt"
    : "./task.txt"


async function writeZero() {
    const data = (await Deno.readTextFile(baseFile)).split(" ").join("\n")
    await Deno.writeTextFile("./stones/0", data)
}

async function blink(iteration: number): Promise<number> {
    const prev = await Deno.open(`./stones/${iteration - 1}`, { read: true })
    const reader = prev.readable.pipeThrough(new TextDecoderStream());
    const lines = reader.pipeThrough(new TextLineStream());

    const next = await Deno.create(`./stones/${iteration}`)
    const writer = next.writable.getWriter();
    let numLines = 0
    const writeLine = async (line: string) => {
        numLines++
        await writer.write(new TextEncoder().encode(line + "\n"))
    }

    for await (const stone of lines) {
        if (stone === "0") {
            await writeLine("1")
            continue
        }
        const stoneStr = stone.toString()
        if (stoneStr.length % 2 === 0) {
            const middle = stoneStr.length / 2
            await writeLine(BigInt(stoneStr.slice(0, middle)).toString())
            await writeLine(BigInt(stoneStr.slice(middle)).toString())
            continue
        }
        await writeLine((BigInt(stone) * 2024n).toString())
    }

    writer.close()
    return numLines
}

async function blinkMultiple(from: number, to: number) {
    for (let i = from; i <= to; i++) {
        console.log(`${i}: ${await blink(i)}`)
    }
}

await writeZero()
await blinkMultiple(44, 75)