import Misc from "./Misc";

export default class GameRounc {
	constructor(dat) {
		if (dat) this.data = [...dat];
		else this.data = [];
	}

	// After Steal Pile, replace the Up card for the specified player
	replaceCard = (p, crd) => {
		// this.activity = "y";
	};

	addPlayerCards = (dat) => {
		this.data.push({
			id: dat.id,
			card: dat.card,
			cardNum: parseInt(Misc.getNum(dat.card)),
			color: Misc.getColor(dat.card),
			downcards: dat.downcards,
		});
	};

	replaceTopCard = (num, card) => {
		var foundIndex = this.data.findIndex((x) => x.id == num);
		this.data[foundIndex] = {
			...this.data[foundIndex],
			card: card,
			cardNum: parseInt(Misc.getNum(card)),
			color: Misc.getColor(card),
		};
	};
	hasPlayer = (id) => {
		return this.data.some((val) => val.id == id);
	};
}
