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
let campaign

beforeEach("get a list of all accounts", async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  //Use one of those accounts to deploy the contract
  const contract = new web3.eth.Contract(JSON.parse(compiled["interface"]))
  campaign = await contract
    .deploy({ data: compiled["bytecode"], arguments: [10000] })
    .send({ from: accounts[0], gas: "1000000" })
})

describe("Campaign", () => {
  let required_wei

  it("deploys a contract", () => {
    assert.ok(campaign.options.address)
  })

  it("has the default contract", async () => {
    const manager = await campaign.methods.manager().call()
    assert.ok(manager)
  })

  it("singup as approver", async () => {
    let approvers = await campaign.methods.getApprovers().call()
    assert.ok(Array.isArray(approvers))
    assert.equal(approvers.length, 0)

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 10000,
    })

    approvers = await campaign.methods.getApprovers().call()
    assert.ok(Array.isArray(approvers))
    assert.equal(approvers[0], accounts[1])
    assert.equal(approvers.length, 1)

    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: 10,
      })
      assert.ok(false)
    } catch (e) {
      assert.ok(e)
    }
  })

  it("create an request", async () => {
    await campaign.methods.createRequest("Loren Ipsun dolor a sit amet", 15000, accounts[0]).send({
      from: accounts[0],
      gas: 3000000,
    })

    const request = await campaign.methods.requests(0).call()

    assert.ok(request)
    assert.equal(request.value, 15000)
    assert.equal(request.recipient, accounts[0])
    assert.equal(request.description, "Loren Ipsun dolor a sit amet")
    assert.equal(request.totalVotes, 0)
  })

  it("approve an request", async () => {
    await campaign.methods.createRequest("Loren Ipsun dolor a sit amet", 15000, accounts[0]).send({
      from: accounts[0],
      gas: 3000000,
    })

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 10000,
    })

    await campaign.methods.contribute().send({
      from: accounts[2],
      value: 10000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[1],
      gas: 3000000,
    })

    let request = await campaign.methods.requests(0).call()

    assert.ok(request)
    assert.equal(request.totalVotes, 1)

    await campaign.methods.approve(0).send({
      from: accounts[2],
      gas: 3000000,
    })

    request = await campaign.methods.requests(0).call()

    assert.ok(request)
    assert.equal(request.totalVotes, 2)

    try {
      //try to approve twice
      await campaign.methods.approve(0).send({
        from: accounts[1],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }
    try {
      //try to approve a false request
      await campaign.methods.approve(1).send({
        from: accounts[1],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }
    try {
      //try to approve without contribute
      await campaign.methods.approve(0).send({
        from: accounts[3],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }
  })

  it("finalize an request", async () => {
    await campaign.methods.createRequest("Loren Ipsun dolor a sit amet", 15000, accounts[0]).send({
      from: accounts[0],
      gas: 3000000,
    })

    try {
      //try to approve without enought votes
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 10000,
    })

    await campaign.methods.contribute().send({
      from: accounts[2],
      value: 10000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[1],
      gas: 3000000,
    })

    await campaign.methods.approve(0).send({
      from: accounts[2],
      gas: 3000000,
    })

    try {
      //try to approve without be the owner
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[1],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }

    let request = await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: 3000000,
    })

    request = await campaign.methods.requests(0).call()

    assert.ok(request)
    assert.equal(request.completed, true)

    try {
      //try to approve twice
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: 3000000,
      })
      assert(false)
    } catch (e) {
      assert.ok(e)
    }
  })
})
