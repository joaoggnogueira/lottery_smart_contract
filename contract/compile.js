// compile code will go here
const solc = require("solc")
const fs = require("fs")
const path = require("path")

function compile(contract) {
  const contractPath = path.resolve(__dirname, "contracts", contract + ".sol")
  const source = fs.readFileSync(contractPath, "utf8")
  const compiled = solc.compile(source, 1)
  if (compiled.errors) {
    console.error(...compiled.errors)
  }
  const contracts = compiled.contracts
  return contracts[":" + contract]
}

module.exports = compile
