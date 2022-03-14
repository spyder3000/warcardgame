import shuffleArray from "./shuffleArray";
import Misc from "./Misc";

export default class Player {
	constructor(dat) {
		this.id = dat.id;
		this.name = dat.name;
		this.deck = dat.deck;
		this.winpile = dat.winpile;
		this.currplay = dat.currplay; // cards played during the current round
		this.status = dat.status;
		this.rndResult = dat.rndResult; // e.g. win, tie, ''
		this.rndRemoves = []; // will hold the cards discarded in a round due to Rule 4
		this.showTie = dat.showTie; // Show Tie section;  empty unless player is in tiebreaker situation
		this.hideRound = dat.hideRound; // Hide Round data (for players not in tiebreaker, or if eliminated from game)
		this.activity = dat.activity ? dat.activity : "";
	}

	// Remove cards from players deck = to number of 4s from previous round;
	removeCardsRule4 = (tot) => {
		const tmpRemoves = [];
		this.activity = "y";
		if (Misc.getTotCards(this) < tot) {
			tmpRemoves.push(...this.deck, ...this.winpile);
			console.log("LOSS (rules4) for player - " + this.id);
			this.deck = [];
			this.winpile = [];
			this.status = "loss";
			this.rndRemoves.push(...tmpRemoves);
			return tmpRemoves;
		}
		if (this.deck.length < tot) {
			Misc.shufflePile(this);
		}
		let x = 0;
		while (x < tot) {
			let card = this.deck[0]; // get Top card from Deck
			this.deck = this.deck.slice(1); // Remove that card from pile
			tmpRemoves.push(card);
			x++;
		}
		this.rndRemoves.push(...tmpRemoves);
		return tmpRemoves;
	};

	// Get Next Card for Player
	getCard = (typ) => {
		this.activity = "y";
		if (typ == "new") this.currplay = []; // new round;  start with empty array for Current Round cards

		if (Misc.getTotCards(this) == 0) {
			console.log("LOSS (getCard) for player - " + this.id);
			this.status = "loss";
			return;
		}
		if (this.deck == 0) {
			Misc.shufflePile(this);
		}

		let card = this.deck[0]; // get Top card from Deck
		this.deck = this.deck.slice(1); // Remove that card from pile
		this.currplay.push(card); // set currplay to include this card
		return card;
	};

	// Tiebreaker round -- get 2 down cards & 1 up card for player
	getTieCards = () => {
		let tot = Misc.getTotCards(this);
		this.activity = "y";
		if (tot < 3) {
			console.log("LOSS (tieProcess) for player - " + this.id);
			this.status = "loss";
			// this.currplay = [];
			if (tot == 0) this.currplay.push("none", "none", "none");
			else if (tot == 1)
				this.currplay.push(...this.deck, ...this.winpile, "none", "none");
			else if (tot == 2)
				this.currplay.push(...this.deck, ...this.winpile, "none");
			this.deck = [];
		} else {
			if (this.deck.length < 3) Misc.shufflePile(this);
			let cards = [this.deck[0], this.deck[1], this.deck[2]];
			this.deck = this.deck.slice(3);
			// this.currplay = [];
			this.currplay.push(...this.currplay, ...cards);
		}
	};
}
