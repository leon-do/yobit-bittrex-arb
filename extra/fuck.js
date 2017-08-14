const Fetch = require('node-fetch')

async function fuck(){

	const bittrex = 
		await Fetch('https://bittrex.com/api/v1.1/public/getmarkets')
		.then(res => {return res.json()})
		.then(res => {return res.result})


	const liqui = 
		await Fetch('https://api.liqui.io/api/3/info')
		.then(res => {return res.json()})
		.then(res => {return res.pairs})


	for (let i in bittrex){
		const base = bittrex[i].MarketCurrency.toLowerCase()
		const quote = bittrex[i].BaseCurrency.toLowerCase()
		const bittrexPair = `${base}_${quote}`

			for (let liquiPair in liqui){
				if (liquiPair === bittrexPair){
					console.log(liquiPair)
				}
			}

	}

}



fuck()