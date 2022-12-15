const { Client } = require('./lib/client');

async function syncBatch() {
	try {
		const cl = new Client(
			'wss://tfchain.dev.grid.tf/ws',
			'priority remain raw spice degree head retire fan syrup modify helmet uniform',
			'sr25519',
		);

		await cl.init();
		const names = ['testvm8', 'testvm9', 'testvm10'];
		const extrinsics = [];
		for (const name of names) {
			const createdContract = await cl.api.tx.smartContractModule.createNameContract(name)
			extrinsics.push(createdContract);
		}

		const batchCreate = await cl.batch(extrinsics, (res) => {
      if (res instanceof Error) {
        console.log(res);
      }
      const { events, status } = res;
      switch (status.type) {
        case 'Ready':
          console.log('done');
      }
      if (status.isFinalized) {
        console.log('finalized');
      } else {
        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        });
      }
    })
    .catch((err) => console.log(err.message))
		console.log(`extrinsics are ${extrinsics}`, typeof extrinsics);
	} catch (error) {
		console.log(error);
	}
}

syncBatch();
