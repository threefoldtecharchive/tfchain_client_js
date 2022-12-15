const { Client } = require('./lib/client')


async function syncBatch(){

  try {
    const cl = new Client("wss://tfchain.dev.grid.tf/ws", "priority remain raw spice degree head retire fan syrup modify helmet uniform", "sr25519");

    await cl.init();
    console.log("cl.api.tx.utility", cl.api.tx.utility.batch);
    console.log("client initialized");
    const names = ["testvm2", "testvm3", "testvm4"];
    const extrinsics = [];
    console.log("typeof extrensics is", extrinsics);
    for(const name of names){
      const createdContract = await cl.createNameContract(name);
      console.log("createdContract", createdContract);
      extrinsics.push(createdContract);
      console.log(`new contract with name ${name} pushed`);
    }
  
    const batchCreate = await cl.api.tx.utility.batch(extrinsics);
    console.log("batchCreate", batchCreate);
    console.log(`extrinsics are ${extrinsics}`, typeof extrinsics);
  } catch (error) {
    console.log(error);
  }
}
  
syncBatch();