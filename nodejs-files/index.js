const path = require("path");


async function calculateSalesTotal(salesFiles) {

  // Final sales total
  let salesTotal = 0;

  // (1) Tterates over the `salesFiles` array.
  for (file of salesFiles) {

    // (2) Reads the file.
    const fileContents = await fs.readFile(file)

    // (3) Parses the content as JSON.
    const data = JSON.parse(fileContents);

    // (4) Increments the `salesTotal` variable with the `total` value from the file.
    salesTotal += data.total;
  }
  return salesTotal;
}




const fs = require("fs").promises;

async function findSalesFiles(folderName) {

  let results = [];

  const items = await fs.readdir(folderName, { withFileTypes: true });

  for (const item of items) {


    if (item.isDirectory()) {

      const resultsReturned = await findSalesFiles(path.join(folderName,item.name));
      results = results.concat(resultsReturned);
    } else {
  
      if (path.extname(item.name) === ".json") {
        results.push(`${folderName}/${item.name}`);
      }
    }
  }

  return results;
}

async function main() {
  const salesDir = path.join(__dirname, "stores");
  const salesTotalsDir = path.join(__dirname, "salesTotals");

  try {
    await fs.mkdir(salesTotalsDir);
  } catch {
    console.log(`${salesTotalsDir} already exists.`);
  }

  const salesFiles = await findSalesFiles(salesDir);

  // (1) Add a call to the `calculateSalesTotals` function just above the `fs.writeFile` call.
  const salesTotal = await calculateSalesTotal(salesFiles);

  // (2) Modify the `fs.writeFile` block to write the value of the `salesTotal` variable to the *totals.txt* file.
  await fs.writeFile(
    path.join(salesTotalsDir, "totals.txt"),
    `${salesTotal}\r\n`,
    { flag: "a" }
  );
}

main();











