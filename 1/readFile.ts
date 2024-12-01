const fileName = Deno.args.at(0);
if (!fileName) {
    throw Error("No file name found");
}
const fileContent = await Deno.readTextFile(fileName);
const rows = fileContent.split("\n");
export const group1: number[] = [];
export const group2: number[] = [];
rows.forEach(e => {
    console.log(e);
    const pair = e.split(" ");
    group1.push(Number(pair.at(0)));
    group2.push(Number(pair.at(-1)));
});
