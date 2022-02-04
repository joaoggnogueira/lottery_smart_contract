// compile code will go here
const solc = require("solc")
const fs = require("fs-extra")
const path = require("path")

const contract = "Campaign"

const buildPath = path.resolve(__dirname, "build")
console.log("cleaning ", buildPath)
fs.removeSync(buildPath)

const contractPath = path.resolve(__dirname, "contracts", contract + ".sol")
const source = fs.readFileSync(contractPath, "utf8")
console.log("compiling ", contractPath)
const compiled = solc.compile(source, 1)

if (compiled.errors) {
  console.error(...compiled.errors)
}

console.log(Object.keys(compiled.contracts).length, "contracts compiled, writing in", buildPath)

fs.ensureDirSync(buildPath)

for (let contract in compiled.contracts) {
  console.log("writing build of", contract)
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    compiled.contracts[contract]
  )
}

console.log("compile finished!")

module.exports = compiled.contracts
