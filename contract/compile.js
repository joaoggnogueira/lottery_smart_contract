// compile code will go here
const solc = require("solc")
const fs = require("fs-extra")
const path = require("path")

const contract = "Campaign"

const buildPath = path.resolve(__dirname, "build")
fs.removeSync(buildPath)

const contractPath = path.resolve(__dirname, "contracts", contract + ".sol")
const source = fs.readFileSync(contractPath, "utf8")
const compiled = solc.compile(source, 1)

fs.ensureDirSync(buildPath)

for (let contract in compiled.contracts) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.substring(1) + ".json"),
    compiled.contracts[contract]
  )
}

if (compiled.errors) {
  console.error(...compiled.errors)
}
const contracts = compiled.contracts

module.exports = contracts
