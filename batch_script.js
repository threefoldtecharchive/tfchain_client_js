const { Client } = require('./lib/client');

async function syncBatch() {
	try {
		const cl = new Client(
			'wss://tfchain.dev.grid.tf/ws',
			'priority remain raw spice degree head retire fan syrup modify helmet uniform',
			'sr25519',
		);

		await cl.init();
		console.log('cl.api.tx.utility', cl.api.tx.utility.batch);
		console.log('client initialized');
		const names = ['testvm2', 'testvm3', 'testvm4'];
		const extrinsics = [];
		console.log('typeof extrensics is', extrinsics);
		for (const name of names) {
			const createdContract = await cl
				.createNameContract(name, (res) => {
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
				.catch((err) => console.log(err.message));
			console.log('createdContract', createdContract);
			extrinsics.push(createdContract);
			console.log(`new contract with name ${name} pushed`);
		}

		const batchCreate = await cl.api.tx.utility.batch(extrinsics);
		console.log('batchCreate', batchCreate);
		console.log(`extrinsics are ${extrinsics}`, typeof extrinsics);
	} catch (error) {
		console.log(error);
	}
}

syncBatch();
