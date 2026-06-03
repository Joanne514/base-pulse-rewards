import hre from 'hardhat';

async function main() {
  const contract = await hre.viem.deployContract('BasePoll');
  console.log(`BasePoll deployed to ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
