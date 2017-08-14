// Bittrex - All trades are charged .25% of the profits of the trade.  This is calculated by taking the (amount * purchase price * .0025).
// Yobit.net fulfils exchange transactions and charges a comission from each transaction. Comission amount depends upon the currency type however does not exceed 0.2% of the transaction amount as a rule.
// total 0.45%

const Fetch = require('node-fetch')

async function fkuRick(){

	// these coins are in both yobit and bittrex
	const commonCoins = ['synx_btc','zec_btc','game_btc','2give_btc','aur_btc','rby_btc','xmg_btc','mco_btc','hmq_btc','bts_btc','etc_btc','xem_btc','rise_btc','bcc_btc','waves_btc','lsk_btc','exp_btc','eth_btc','aby_btc','bta_btc','snrg_btc','pkb_btc','spr_btc','ok_btc','dgb_btc','geo_btc','start_btc','via_btc','cann_btc','doge_btc','dash_btc','ppc_btc','vtc_btc','sys_btc','ltc_btc','clam_btc','rdd_btc','egc_btc','cpc_btc','nlg_btc','sls_btc','mue_btc','dcr_btc','pivx_btc','draco_btc','club_btc','cloak_btc','crw_btc','tx_btc','ioc_btc','emc_btc','gcr_btc','infx_btc']
	
	// get bittrex data
	const bittrex = 
		await Fetch('https://bittrex.com/api/v1.1/public/getmarketsummaries')
		.then(res => {return res.json()})
		.then(res => {return res.result})


	// get yobit data
	let yobit = {}
	for (let i in commonCoins){
		const data = await Fetch(`https://yobit.net/api/3/ticker/${commonCoins[i]}`)
			.then(res => {return res.json()})
		
		yobit[commonCoins[i]] = data
	}


	// compare bittrex vs yobit
	let returnObject = {}
	for (let index in bittrex){
		const bittrexCoinPair = bittrex[index].MarketName.split('-').reverse().join('_').toLowerCase()
		
		// compare bittrex vs yobit
		for (let yobitCoinPair in yobit){
			
			// get price and volume
			const yobitPrice   = yobit[yobitCoinPair][yobitCoinPair].last
			const yobitVol = yobit[yobitCoinPair][yobitCoinPair].vol
			const bittrexPrice = bittrex[index].Last
			const bittrexVol = bittrex[index].Volume

			// if pairs match, then find the difference
			// if difference is > 1%
			if (yobitCoinPair === bittrexCoinPair 
				&& (bittrexPrice - yobitPrice)/yobitPrice > 1 // <=== THIS IS WHAT MATTERS
				){
				

				// then store
				returnObject[yobitCoinPair] = {
					percentDifference: (bittrexPrice - yobitPrice)/yobitPrice,
					yobitPrice: yobitPrice,
					bittrexPrice: bittrexPrice,
					yobitVol: yobitVol,
					bittrexVol : bittrexVol
				}					
			


				break
			}
		}
	}

	return(returnObject)


}


fkuRick()
.then(data => console.log(data))
.catch(err => {
	fkuRick()
})