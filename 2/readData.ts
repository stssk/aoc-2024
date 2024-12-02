import { parse } from "jsr:@std/csv";

const fileName = Deno.args.at(0);
if (!fileName) {
    throw Error("No file name found");
}
const fileContent = await Deno.readTextFile(fileName);

const dataStrings = parse(fileContent, { separator: " " });
export const data = dataStrings.map(r => r.map(c => Number.parseInt(c)))