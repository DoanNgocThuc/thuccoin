import { ethers } from "hardhat"

async function main() {
  const initialSupply = ethers.parseEther("1000000") // 1 million tokens

  const ThucToken = await ethers.getContractFactory("ThucToken")
  const token = await ThucToken.deploy(initialSupply)

  await token.waitForDeployment()
  console.log("ThucToken deployed to:", token.target)

  const Exchange = await ethers.getContractFactory("ThucTokenExchange")
  const exchange = await Exchange.deploy(token.target)
  await exchange.waitForDeployment()
  console.log("Exchange deployed to:", exchange.target)

  // Approve exchange to transfer tokens on behalf of owner (so it can sell)
  await token.approve(exchange.target, initialSupply)
  console.log("Approved exchange to use tokens")

  const PoS = await ethers.getContractFactory("ProofOfStake")
  const pos = await PoS.deploy()
  await pos.waitForDeployment()
  console.log("ProofOfStake deployed to:", pos.target)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
