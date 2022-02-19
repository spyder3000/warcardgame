export default class Misc {
	static getRandomNum = (min, max) => {
		let diff = max - min + 1; // e.g. 1000 - 1 + 1 will = 1000;
		return Math.floor(Math.random() * diff) + min; // e.g. 0-999 + 1 to give num from 1-1000
	};

	static fixWinOrder = (allCards, winCard) => {
		var idx = allCards.findIndex((el) => el == winCard);
		var removed = allCards.splice(idx, 1);
		allCards.push(removed[0]);
		return allCards;
	};

	static checkCards = (cardData, oldCards) => {
		let allCards = [];
		cardData.forEach((val) => allCards.push(val.card));
		if (oldCards) cardData.push(...oldCards); // any cards in Holding for the eventual winner
		// id, card, cardNum, color
		console.log("curr round cards = " + JSON.stringify(cardData));
		// determine total number of Red cards
		const totReds = cardData.filter((dat) => dat.color == "red").length;
		console.log("totReds = " + totReds);
		const totBlacks = cardData.filter((dat) => dat.color == "black").length;
		console.log("totBlacks = " + totBlacks);

		const redTwo = cardData.filter(
			(dat) => dat.cardNum == 2 && dat.color == "red"
		);
		if (redTwo.length > 0) console.log("redTwo = " + redTwo[0].id);

		const blackTwo = cardData.filter(
			(dat) => dat.cardNum == 2 && dat.color == "black"
		);
		if (blackTwo.length > 0) console.log("blackTwo = " + blackTwo[0].id);

		if (redTwo.length > 0 && blackTwo.length > 0 && totReds + totBlacks == 2) {
			console.log("matching 2s - do nothing");
		} else if (redTwo.length > 0 && totReds == 1) {
			var results2 = {
				outcome: "win",
				data: [
					{
						id: redTwo[0].id,
						card: redTwo[0].card,
						status: "win",
						allCards: Misc.fixWinOrder(allCards, redTwo[0].card),
					},
				],
			};
			console.log(results2);
			return results2;
		} else if (blackTwo.length > 0 && totBlacks == 1) {
			var results2 = {
				outcome: "win",
				data: [
					{
						id: blackTwo[0].id,
						card: blackTwo[0].card,
						status: "win",
						allCards: Misc.fixWinOrder(allCards, blackTwo[0].card),
					},
				],
			};
			console.log(results2);
			return results2;
		}

		cardData.sort(
			(firstItem, secondItem) => secondItem.cardNum - firstItem.cardNum
		);
		//console.log(students[0].score);
		const topvals = cardData.filter(
			(dat) => dat.cardNum == cardData[0].cardNum
		);
		console.log("Total high scores = " + topvals.length);
		if (topvals.length > 1) {
			let tmparray = [];
			topvals.forEach((val) =>
				tmparray.push({ id: val.id, card: val.card, status: "tie" })
			);
			var results = { outcome: "tie", data: tmparray, allCards };
			console.log(results);
		} else {
			var results = {
				outcome: "win",
				data: [
					{
						id: topvals[0].id,
						card: topvals[0].card,
						status: "win",
						allCards: Misc.fixWinOrder(allCards, topvals[0].card),
					},
				],
			};
			console.log(results);
		}
		return results;
		// Identify all tied cards -- set variable for nextRound & which players will participate
		// return win player, win card OR tie players
	};
}
