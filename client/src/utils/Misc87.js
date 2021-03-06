import shuffleArray from "./shuffleArray";

export default class Misc {
	static getRandomNum = (min, max) => {
		let diff = max - min + 1; // e.g. 1000 - 1 + 1 will = 1000;
		return Math.floor(Math.random() * diff) + min; // e.g. 0-999 + 1 to give num from 1-1000
	};

	//some util functions
	static getNum = (crd) => {
		if (crd == "none") return "-99";
		return crd.substring(0, crd.length - 1);
	};
	static getColor = (crd) => {
		let color = crd.substring(crd.length - 1).toLowerCase();
		if (color == "s" || color == "c") return "black";
		else return "red";
	};
	// return 2-10, J, Q, K, A
	static getCardValue = (crd) => {
		if (crd == "none") return "-99";
		let tmp = crd.substring(0, crd.length - 1);
		if (parseInt(tmp) < 11) return tmp;
		if (tmp == "11") return "J";
		if (tmp == "12") return "Q";
		if (tmp == "13") return "K";
		if (tmp == "14") return "A";
		return "ERROR";
	};
	static getSuit = (crd) => {
		let suit = crd.substring(crd.length - 1).toLowerCase();
		if (suit == "s") return "suit-spades";
		else if (suit == "h") return "suit-hearts";
		else if (suit == "c") return "suit-clubs";
		else return "suit-diams";
	};
	static getSuitNum = (crd) => {
		let suit = crd.substring(crd.length - 1).toLowerCase();
		if (suit == "s") return 1;
		else if (suit == "h") return 2;
		else if (suit == "c") return 3;
		else return 4;
	};

	static getTopCard = (arr) => {
		if (arr.length == 0) return;
		return arr[arr.length - 1];
	};

	static fixWinOrder = (allCards, winCard) => {
		var idx = allCards.findIndex((el) => el == winCard);
		var removed = allCards.splice(idx, 1);
		allCards.push(removed[0]);
		return allCards;
	};

	static checkCards = (cardData, oldCards) => {
		let allCards = [];

		// Add the flipped card to the allCards array (all cards that can be won by eventual winner)
		cardData.forEach((val) => {
			if (val.card !== "none") allCards.push(val.card); // = 'none' check should only occur for tiebreaker where player out of cards
		});

		// Add the downcards (for tie-breaker scenario) to the allCards array
		cardData.forEach((val) => {
			if (val.downcards.length > 0) {
				val.downcards.forEach((val2) => {
					if (val2 !== "none") allCards.push(val2);
				});
			}
			// if (val !== "none") allCards.push(val); // = 'none' means player ran out of cards
		});

		if (oldCards) allCards.push(...oldCards); // any cards in Holding from prev rounds for the eventual winner

		// id, card, cardNum, color
		console.log("curr round cards = " + JSON.stringify(cardData));
		const totFours = cardData.filter((dat) => dat.cardNum == 4).length;
		// determine total number of Red cards
		const totReds = cardData.filter(
			(dat) => dat.color == "red" && dat.card !== "none"
		).length;
		console.log("totReds = " + totReds);
		const totBlacks = cardData.filter(
			(dat) => dat.color == "black" && dat.card !== "none"
		).length;
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
						totFours,
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
						totFours,
					},
				],
			};
			console.log(results2);
			return results2;
		}

		cardData.sort(
			(firstItem, secondItem) => secondItem.cardNum - firstItem.cardNum
		);

		// get the value for the highest card in this round
		const topvals = cardData.filter(
			(dat) => dat.cardNum == cardData[0].cardNum
		);
		console.log("Total high scores = " + topvals.length);
		if (topvals.length > 1) {
			let tmparray = [];
			topvals.forEach((val) =>
				tmparray.push({
					id: val.id,
					card: val.card,
					status: "tie",
					allCards,
					totFours,
				})
			);
			var results = { outcome: "tie", data: tmparray };
			console.log(results);
		} else if (topvals.length == 0) {
			var results = {
				outcome: "lossall",
				data: [
					{
						status: "lossall",
						allCards,
						totFours,
					},
				],
			};
		} else {
			var results = {
				outcome: "win",
				data: [
					{
						id: topvals[0].id,
						card: topvals[0].card,
						status: "win",
						allCards: Misc.fixWinOrder(allCards, topvals[0].card),
						totFours,
					},
				],
			};
			console.log(results);
		}
		return results;
		// Identify all tied cards -- set variable for nextRound & which players will participate
		// return win player, win card OR tie players
	};

	static checkEliminated = (player) => {
		if (Misc.getTotCards(player) == 0) return true;
		else return false;
	};

	static getTotCards = (player) => {
		return player.deck.length + player.winpile.length;
	};

	static shufflePile = (player) => {
		player.deck = [...player.deck, ...shuffleArray(player.winpile)];
		player.winpile = [];
		player.activity = "y";
	};

	// static tieProcess = (p) => {
	// 	let tot = Misc.getTotCards(p);
	// 	p.activity = "y";
	// 	if (tot < 3) {
	// 		console.log("LOSS (tieProcess) for player - " + p.id);
	// 		p.status = "loss";
	// 		p.modCurr = [];
	// 		if (tot == 0) p.modCurr.push("none", "none", "none");
	// 		else if (tot == 1)
	// 			p.modCurr.push(...p.deck, ...p.winpile, "none", "none");
	// 		else if (tot == 2) p.modCurr.push(...p.deck, ...p.winpile, "none");
	// 		p.deck = [];
	// 	} else {
	// 		if (p.deck.length < 3) Misc.shufflePile(p);
	// 		let cards = [p.deck[0], p.deck[1], p.deck[2]];
	// 		p.deck = p.deck.slice(3);
	// 		p.modCurr = [];
	// 		p.modCurr.push(...p.currplay, ...cards);
	// 	}
	// };

	static checkNumCards = (p) => {
		if (Misc.getTotCards(p) == 0) {
			console.log("LOSS (checkNumCards) for player - " + p.id);
			p.status = "loss";
			p.activity = "y";
			return;
		}
		if (p.deck.length == 0 || (p.deck.length < 3 && p.rndResult == "tie")) {
			Misc.shufflePile(p);
			p.activity = "y";
		}
	};

	// static removeCardsRule4 = (p, tot) => {
	// 	const tmpRemoves = [];
	// 	p.activity = "y";
	// 	if (Misc.getTotCards(p) <= tot) {
	// 		tmpRemoves.push(...p.deck, ...p.winpile);
	// 		console.log("LOSS (rules4) for player - " + p.id);
	// 		p.deck = [];
	// 		p.winpile = [];
	// 		p.status = "loss";
	// 		return tmpRemoves;
	// 	}
	// 	if (p.deck.length <= tot) {
	// 		Misc.shufflePile(p);
	// 	}
	// 	let x = 0;
	// 	while (x < tot) {
	// 		let card = p.deck[0]; // get Top card from Deck
	// 		p.deck = p.deck.slice(1); // Remove that card from pile
	// 		tmpRemoves.push(card);
	// 		x++;
	// 	}
	// 	return tmpRemoves;
	// };

	// static getCard = (p, typ) => {
	// 	p.activity = "y";
	// 	if (typ == "new") p.modCurr = []; // new round;  start with empty array for Current Round cards

	// 	if (Misc.getTotCards(p) == 0) {
	// 		console.log("LOSS (getCard) for player - " + p.id);
	// 		p.status = "loss";
	// 		return;
	// 	}
	// 	if (p.deck == 0) {
	// 		Misc.shufflePile(p);
	// 	}

	// 	let card = p.deck[0]; // get Top card from Deck
	// 	p.deck = p.deck.slice(1); // Remove that card from pile
	// 	p.modCurr.push(card); // set modCurr to include this card
	// 	return card;
	// };

	static addCardDetails = (arr) => {
		const bigarray = [];
		for (let i = 0; i < arr.length; i++) {
			let color = Misc.getColor(arr[i]);
			let num = parseInt(Misc.getNum(arr[i]));
			let cardValue = Misc.getCardValue(arr[i]);
			let suit = Misc.getSuit(arr[i]);
			let suitNum = Misc.getSuitNum(arr[i]);
			bigarray.push({ color, num, suit, suitNum, cardValue, orig: arr[i] });
		}
		bigarray.sort(function (a, b) {
			if (a.num === b.num) {
				// Price is only important when cities are the same
				return a.suitNum - b.suitNum;
			}
			return b.num > a.num ? 1 : -1;
		});
		return bigarray;
	};

	static stealPile = (p, iwin, ilose) => {
		console.log(
			"Steal Pile -- player " + iwin + " steals from player " + ilose
		);
		let crd = p[iwin].currplay[p[iwin].currplay.length - 1];
		p[iwin].winpile.push(...p[ilose].winpile, crd);
		p[ilose].winpile = [];
		p[iwin].currplay.push(Misc.getCard(p[iwin]));
		// p.activity = "y";
		// if (typ == "new") p.modCurr = []; // new round;  start with empty array for Current Round cards

		// if (Misc.getTotCards(p) == 0) {
		// 	console.log("LOSS (getCard) for player - " + p.id);
		// 	p.status = "loss";
		// 	return;
		// }
		// if (p.deck == 0) {
		// 	Misc.shufflePile(p);
		// }

		// let card = p.deck[0]; // get Top card from Deck
		// p.deck = p.deck.slice(1); // Remove that card from pile
		// p.modCurr.push(card); // set modCurr to include this card
		// return card;
	};

	static async tempDelay(dat) {
		console.log("ONE");
		await new Promise((resolve) => setTimeout(resolve, 3000));
		console.log("TWO");
	}
}
