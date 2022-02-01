// compile code will go here
const solc = require("solc")
const fs = require("fs")
const path = require("path")

function compile(contract) {
  const contractPath = path.resolve(__dirname, "contracts", contract + ".sol")
  const source = fs.readFileSync(contractPath, "utf8")

  return solc.compile(source, 1).contracts[":" + contract]
}

module.exports = compile
