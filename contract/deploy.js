// deploy code will go here
const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")

const compile = require("./compile")
const compiled = compile("Campaign")

const provider = new HDWalletProvider(
  "check cash ecology setup expose vital desert scan amount deputy what force",
  "https://rinkeby.infura.io/v3/78b2cbbbd6b04c0ca5e41fdd89ce9a7b"
)

const web3 = new Web3(provider)

async function deploy() {
  //   const accounts = await web3.eth.getAccounts()
  //   console.log(accounts)

  const account = "0xA8B72A1ef5dA73D9AcDDe7eFD8E19944c600d527"

  console.log("Attempting to deploy from account", account)

  const result = await new web3.eth.Contract(JSON.parse(compiled["interface"]))
    .deploy({
      data: compiled["bytecode"],
      arguments: [],
    })
    .send({ gas: "1000000", from: account })

  console.log("Contract deployed to", result.options.address)
  console.log(JSON.stringify(JSON.parse(compiled["interface"]), null, 2))
  provider.engine.stop()
}

deploy()
