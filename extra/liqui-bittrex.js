// Bittrex - All trades are charged 0.25% of the profits of the trade.  This is calculated by taking the (amount * purchase price * .0025).
// Liqui taker 0.25%
// total 0.5%

const Fetch = require('node-fetch')

async function fkuRick(){

	// these coins are in both liqui and bittrex
	const commonCoins = ['ltc_btc','dash_btc','eth_btc','btc_usdt','steem_btc','dgd_btc','dgd_eth','waves_btc','sbd_btc','sngls_btc','rep_btc','xzc_btc','golos_btc','gbg_btc','time_btc','mln_btc','incnt_btc','gnt_btc','edg_btc','trst_btc','gnt_eth','rep_eth','eth_usdt','wings_eth','wings_btc','rlc_btc','gno_btc','gup_btc','lun_btc','gup_eth','rlc_eth','lun_eth','sngls_eth','gno_eth','tkn_btc','tkn_eth','hmq_btc','hmq_eth','ant_btc','trst_eth','ant_eth','bat_eth','bat_btc','1st_btc','qrl_btc','1st_eth','qrl_eth','ptoy_btc','ptoy_eth','myst_btc','myst_eth','cfi_btc','cfi_eth','bnt_btc','bnt_eth','time_eth','ltc_eth','snt_btc','snt_eth','dct_btc','mco_btc','mco_eth','pay_btc','pay_eth','storj_btc','storj_eth','adx_btc','adx_eth','dash_eth','ltc_usdt','omg_btc','omg_eth','cvc_btc','cvc_eth','qtum_btc','qtum_eth','dash_usdt','bcc_eth','bcc_usdt','bcc_btc','waves_eth']
	
	// get bittrex data
	const bittrex = 
		await Fetch('https://bittrex.com/api/v1.1/public/getmarketsummaries')
		.then(res => {return res.json()})
		.then(res => {return res.result})


	// get liqui data
	let liqui = {}
	for (let i in commonCoins){
		const data = await Fetch(`https://api.liqui.io/api/3/ticker/${commonCoins[i]}`)
			.then(res => {return res.json()})
		
		liqui[commonCoins[i]] = data
	}


	// compare bittrex vs liqui
	let returnObject = {}
	for (let index in bittrex){
		const bittrexCoinPair = bittrex[index].MarketName.split('-').reverse().join('_').toLowerCase()
		
		// compare bittrex vs liqui
		for (let liquiCoinPair in liqui){
			
			// get price and volume
			const liquiPrice   = liqui[liquiCoinPair][liquiCoinPair].last
			const liquiVol = liqui[liquiCoinPair][liquiCoinPair].vol
			const bittrexPrice = bittrex[index].Last
			const bittrexVol = bittrex[index].Volume

			// if pairs match, then find the difference
			// if difference is > 1%
			if (liquiCoinPair === bittrexCoinPair 
				&& (bittrexPrice - liquiPrice)/liquiPrice > 1 // <=== THIS IS WHAT MATTERS
				){
				

				// then store
				returnObject[liquiCoinPair] = {
					percentDifference: (bittrexPrice - liquiPrice)/liquiPrice,
					liquiPrice: liquiPrice,
					bittrexPrice: bittrexPrice,
					liquiVol: liquiVol,
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