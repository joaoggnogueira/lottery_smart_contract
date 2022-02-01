//Unit Test Libraries
const assert = require("assert")

//Ganache Interface
const ganache = require("ganache-cli")

//Web3 Constructor
const Web3 = require("web3")

const web3 = new Web3(ganache.provider())

const compile = require("../compile")

const compiled = compile("Campaign")

let accounts
let lottery

beforeEach("get a list of all accounts", async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  //Use one of those accounts to deploy the contract
  const contract = new web3.eth.Contract(JSON.parse(compiled['interface']))
  lottery = await contract
    .deploy({ data: compiled['bytecode'], arguments: [] })
    .send({ from: accounts[0], gas: "1000000" })
})

describe("Campaign", () => {
  let required_wei
  it("deploys a contract", () => {
    assert.ok(lottery.options.address)
  })
  it("has the default contract", async () => {
    const manager = await lottery.methods.manager().call()
    assert.ok(manager)
  })
})
