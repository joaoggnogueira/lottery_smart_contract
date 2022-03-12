import web3 from "./web3"
import CampaignFactory from "./contract/build/CampaignFactory.json"

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x07e40068A3610d555Ce1fd03bf5e3820Bf10f0BC"
)

export default instance
