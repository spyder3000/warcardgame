import React, { useEffect, useState } from "react";
import PACK_OF_CARDS from "../utils/packOfCards";
import shuffleArray from "../utils/shuffleArray";
import Misc from "../utils/Misc";
import queryString from "query-string";
import Spinner from "./Spinner";
import PlayerCard from "./PlayerCard";
import RemovedCards from "./RemovedCards";
import Messages from "./Messages";
import HelpPage from "./HelpPage";
import StealCheck from "./StealCheck";
import Player from "../utils/Player";
import GameRound from "../utils/GameRound";

const Game = (props) => {
	// const data = queryString.parse(props.location.search);

	//initialize game state
	const [numPlayers, setNumPlayers] = useState(4);
	const [gameOver, setGameOver] = useState("false");
	const [roundNumber, setRoundNumber] = useState(1);
	const [winner, setWinner] = useState("");
	const [turn, setTurn] = useState("");
	const [nextDisabled, setNextDisabled] = useState(false);

	// Display Toggle state vars...
	const [helpToggle, setHelpToggle] = useState("hideMe");
	const [stealToggle, setStealToggle] = useState("hideMe");

	// Steals State vars
	const [stealTurn, setStealTurn] = useState(-1);
	const [drawTurn, setDrawTurn] = useState(-1); // for when processing is waiting for a single player to draw a card (after steal)
	const [availSteals, setAvailSteals] = useState([]);
	const [finishSteal, setFinishSteal] = useState({ win: -1, lose: -1 }); // used when computer steals pile;  finishes steal in next round
	const [stealInd, setStealInd] = useState(-1); // used to indicate which player is doing the steal (for Text display)

	// finishSteal,  SETDRAW -- for computer !!!

	// Removed Cards state vars
	const [removedCards, setRemovedCards] = useState([]);
	const [removedCardsPlus, setRemovedCardsPlus] = useState([]);

	// Message Data state vars
	const [msgData, setMsgData] = useState({
		msgLoser: "",
		msgWinner: "",
		msgRemoved: "",
		msgRoundWin: "",
		msgSteal: "",
		msgSteal2: "",
		msgMisc: "",
		wonCards: [],
	});

	// Round State vars
	const [currentRoundCards, setCurrentRoundCards] = useState([]);
	const [currRound, setCurrRound] = useState([]);
	const [lastRound, setLastRound] = useState({
		result: "", // win or tie or all-lose (if all players in tiebreaker cannot continue)
		id: -1, // win player id OR -1
		allCards: [], // cards from previous round if TIE, else []
		tiedPlayers: [], // ids of tied players
		totFours: 0,
	});

	// Initialize Player Data states
	const [player1Data, setPlayer1Data] = useState({
		id: 0,
		name: "Player 1",
		deck: [], // downpile
		winpile: [], // up-pile
		currplay: [], // cards played during the current round
		status: "active",
		rndResult: "", // e.g. win, tie, ''
		rndRemoves: [], // will hold the cards discarded in a round due to Rule 4
		showTie: "", // Show Tie section;  empty unless player is in tiebreaker situation
		hideRound: "", // Hide Round data (for players not in tiebreaker, or if eliminated from game)
	});
	const [player2Data, setPlayer2Data] = useState({
		id: 1,
		name: "Player 2",
		deck: [],
		winpile: [],
		currplay: [],
		status: "active",
		rndResult: "",
		rndRemoves: [],
		showTie: "",
		hideRound: "",
	});
	const [player3Data, setPlayer3Data] = useState({
		id: 2,
		name: "Player 3",
		deck: [],
		winpile: [],
		currplay: [],
		status: "active",
		rndResult: "",
		rndRemoves: [],
		showTie: "",
		hideRound: "",
	});
	const [player4Data, setPlayer4Data] = useState({
		id: 3,
		name: "Player 4",
		deck: [],
		winpile: [],
		currplay: [],
		status: "active",
		rndResult: "",
		rndRemoves: [],
		showTie: "",
		hideRound: "",
	});

	//runs once on component mount
	useEffect(() => {
		//shuffle PACK_OF_CARDS array
		const shuffledCards = shuffleArray(PACK_OF_CARDS);
		const playerDeck = [];
		const playerStatus = []; // the player status (e.g. active, inactive, loser, winner)

		// create Card arrays based on number of players
		for (let i = 0; i < numPlayers; i++) {
			playerDeck[i] = [];
		}

		for (let i = 0; i < shuffledCards.length; i++) {
			let j = i % numPlayers;
			playerDeck[j].push(shuffledCards[i]);
		}

		setPlayer1Data((prevState) => ({
			...prevState,
			deck: playerDeck[0],
		}));
		setPlayer2Data((prevState) => ({
			...prevState,
			deck: playerDeck[1],
		}));
		setPlayer3Data((prevState) => ({
			...prevState,
			deck: playerDeck[2],
		}));
		setPlayer4Data((prevState) => ({
			...prevState,
			deck: playerDeck[3],
		}));
	}, []);

	// Functions to update State
	const modPlayer = (i, dat) => {
		if (i == 0) {
			setPlayer1Data({
				...player1Data,
				...dat,
			});
		} else if (i == 1) {
			setPlayer2Data({
				...player2Data,
				...dat,
			});
		} else if (i == 2) {
			setPlayer3Data({
				...player3Data,
				...dat,
			});
		} else if (i == 3) {
			setPlayer4Data({
				...player4Data,
				...dat,
			});
		}
	};

	/* REMOVE pile logic -- add removed cards from Rule 4 & from ties with no winners */

	// JV NOTE -- modify this to fn -- in case we have 2 modRemoves called in the same action ???
	const modRemoves = (tmpRemoves) => {
		console.log("** tmpRemoves = " + tmpRemoves);
		let removedBigArray = Misc.addCardDetails([...removedCards, ...tmpRemoves]);
		setRemovedCardsPlus([...removedBigArray]);
		setRemovedCards([...removedCards, ...tmpRemoves]);
	};

	const modLastRound = (tmpLast) => {
		console.log("called ModLastRound");
		setLastRound({ ...lastRound, ...tmpLast });
	};

	// COPY function
	const playerCopy = () => {
		// Setup temporary arrays to hold data until time to apply changes via setState
		const tmpPlayer = [];
		tmpPlayer[0] = new Player(player1Data);
		tmpPlayer[1] = new Player(player2Data);
		tmpPlayer[2] = new Player(player3Data);
		tmpPlayer[3] = new Player(player4Data);
		return tmpPlayer;
	};

	// EVENT HANDLERS
	const onNewGame = () => {
		console.log("New Game click");
		window.location.reload();
	};
	const onEditHandler = () => {
		console.log("Edit button click");
	};
	const onHelpHandler = () => {
		console.log("Help button click");
		if (helpToggle == "showMe") setHelpToggle("hideMe");
		else setHelpToggle("showMe");
	};
	const onCloseHelp = () => {
		console.log("Help Close click");
		setHelpToggle("hideMe");
	};
	const onStealOpen = () => {
		console.log("Steal popup Open");
	};
	// interpret returned value (if 1, 2, or 3), steal from that player;  if 'cancel', modify stealTurn to move past player[0] decision
	const onSteal = (val) => {
		console.log("onSteal click = " + val);
		const tmpPlayer = playerCopy();
		if (val == "cancel") setStealTurn(1);
		// steal option moves to player 2
		else {
			// stealPile(tmpPlayer, 0, parseInt(val));
			stealPileMsg(tmpPlayer[0], tmpPlayer[parseInt(val)]);
			stealPile(tmpPlayer[0], tmpPlayer[parseInt(val)]);
			setStealTurn(0); // steal option remains with player 0, pending next card they turn up
			setDrawTurn(0);
			setStealInd(0);
			modPlayer(0, {
				currplay: tmpPlayer[0].currplay,
				winpile: tmpPlayer[0].winpile,
				deck: tmpPlayer[0].deck,
				activity: tmpPlayer[0].activity,
				// rndResult: "Steal",
			});
			modPlayer(val, {
				winpile: tmpPlayer[val].winpile,
				activity: tmpPlayer[val].activity,
				// rndResult: "",
			});
		}
		setStealToggle("hideMe");
		setNextDisabled(false);
	};

	const stealPile = (pwin, plose) => {
		console.log("Steal Pile -- " + pwin.name + " steals from " + plose.name);
		let crd = Misc.getTopCard(pwin.currplay);
		pwin.winpile.push(...plose.winpile, crd);
		plose.winpile = [];
		// p[iwin].currplay.push(Misc.getCard(p[iwin]));
		pwin.currplay = pwin.currplay.slice(1); // Remove that card from pile
		pwin.getCard();
		console.log("p-iwin array = " + pwin.currplay);
	};
	const stealPileMsg = (pwin, plose) => {
		console.log(
			"Steal Pile Message -- " + pwin.name + " steals from " + plose.name
		);
		let w = pwin.name + " steals from " + plose.name;
		let w2 = " -- Total cards won = " + plose.winpile.length;
		setMsgData({
			...msgData,
			msgRemoved: "",
			msgRoundWin: "",
			msgMisc: "",
			wonCards: [],
			msgSteal: w,
			msgSteal2: w2,
		});
	};

	// called for computer steal when finishSteal values are populated;  p0 is win player; p1 is lose player
	const doComputerSteal = (p0, p1) => {
		let i = p0.id; // winner id
		let j = p1.id; // loser id
		stealPile(p0, p1);
		modPlayer(i, {
			currplay: p0.currplay,
			winpile: p0.winpile,
			deck: p0.deck,
			activity: p0.activity,
		});
		modPlayer(j, {
			winpile: p1.winpile,
			activity: p1.activity,
		});
	};

	const onNextHandler = () => {
		console.log("Next button click");
		console.log("* LASTROUND *");
		console.log(lastRound);

		const tmpPlayer = playerCopy();
		const tmpRemoves = [];

		// This needs to be reset so we're not suppressing the 1st drawn cards in round
		if (lastRound.result == "win") {
			for (let i = 0; i < numPlayers; i++) {
				console.log("Cleanup prev round");
				tmpPlayer[i].hideRound = "";
				tmpPlayer[i].rndResult = "";
				tmpPlayer[i].showTie = "";
			}
		}

		// Initial check that all players have cards to continue
		for (let i = 0; i < numPlayers; i++) {
			// only check cards if not a continuation of a previous round
			if (tmpPlayer[i].status == "active" && currRound.length == 0) {
				Misc.checkNumCards(tmpPlayer[i], lastRound.result); // 2nd param unneeded?
			}
		}

		// Rule 4 process -- remove 1 card from each player for each 4 played in prev round
		if (lastRound.totFours > 0) {
			for (let j = 0; j < numPlayers; j++) {
				if (tmpPlayer[j].status == "active") {
					// let tmp_arr = Misc.removeCardsRule4(tmpPlayer[j], lastRound.totFours);
					let tmp_arr = tmpPlayer[j].removeCardsRule4(lastRound.totFours);
					tmpRemoves.push(...tmp_arr);

					// Modify player based on Remove Cards
					modPlayer(j, {
						deck: tmpPlayer[j].deck,
						// status: tmpPlayer[j].status,
						winpile: tmpPlayer[j].winpile,
						rndRemoves: Misc.addCardDetails(tmpPlayer[j].rndRemoves),
						activity: tmpPlayer[j].activity,
						rndResult: "",
					});
					modRemoves(tmpRemoves);
					modLastRound({ totFours: 0 });
				}
			}
			return;
		}

		// Draw Cards for Active players
		const tempCurrRound = new GameRound(currRound); // empty if a new round;  otherwise currRound is saved from prior to steal

		// For player that just stole pile, draw a new card
		if (currRound.length > 0) {
			console.log("CURR RUOUND " + currRound.length);

			// Computer Steal from previous round;  Finish steal
			if (finishSteal.win > -1)
				doComputerSteal(
					tmpPlayer[finishSteal.win],
					tmpPlayer[finishSteal.lose]
				);

			console.log("drawTurn = " + drawTurn);
			if (drawTurn > -1) {
				let card = Misc.getTopCard(tmpPlayer[drawTurn].currplay);
				console.log("get Top Card after finish steal = " + card);

				// failsafe for if player steals with their last card;  will shuffle won cards & continue (I think)
				if (card == undefined) {
					window.alert("possible bug -- FIX ME");

					card = tmpPlayer[drawTurn].getCard();
					console.log("get Top Card (TRY 2) after finish steal = " + card);
				}
				tempCurrRound.replaceTopCard(drawTurn, card);
			}
		} else {
			for (let i = 0; i < numPlayers; i++) {
				// Only Draw Cards for Active Players;  If a Tie from prev round, only include players that are part of the tie;
				if (tmpPlayer[i].status == "active") {
					if (lastRound.result !== "tie" || lastRound.tiedPlayers.includes(i)) {
						tmpPlayer[i].currRound = "yes";
						let card;
						let downcards = [];
						// IF starting a New Round
						if (lastRound.result !== "tie") {
							card = tmpPlayer[i].getCard("new"); // param indicates this is a new round;  clear out currplay array
							tmpPlayer[i].hideRound = "";
						}
						// TIE scenario (tie from prev round)
						else {
							tmpPlayer[i].getTieCards();
							card = tmpPlayer[i].currplay[tmpPlayer[i].currplay.length - 1]; // get last card in current array
							downcards.push(
								tmpPlayer[i].currplay[tmpPlayer[i].currplay.length - 2],
								tmpPlayer[i].currplay[tmpPlayer[i].currplay.length - 3]
							);
							tmpPlayer[i].hideRound = "hideme";
							tmpPlayer[i].showTie = "showTie";
						}

						console.log("TEMPCurrRound = " + i + "; card = " + card);
						tempCurrRound.addPlayerCards({ id: i, card, downcards });

						// Modify current cards shown -- MAYBE ADD THIS back??? OR include later??
						console.log("ModiFY player " + i);
						// modPlayer(i, {
						// 	currplay: tmpPlayer[i].currplay,
						// 	deck: tmpPlayer[i].deck,
						// 	status: tmpPlayer[i].status,
						// 	activity: tmpPlayer[i].activity,
						// 	rndResult: "",
						// 	hideRound: tmpPlayer[i].hideRound,
						// 	showTie: tmpPlayer[i].showTie,
						// });
					}
				}
			}
		}

		/* ---  STEAL SECTION  --- */

		// Check if Steal possibility for Player 1
		const tmpSteals = [];
		console.log(
			"card0 = " +
				tmpPlayer[0].currplay[0] +
				"; steal = " +
				tempCurrRound.hasPlayer(0)
		);
		if (tempCurrRound.hasPlayer(0) > 0 && stealTurn <= 0) {
			// if (tmpPlayer[0].currRound == "yes" && stealTurn <= 0) {
			tmpSteals.push(...Misc.checkSteals(0, tmpPlayer)); // returns an array of player indexes where pile can be stolen
			if (tmpSteals.length > 0) {
				console.log("WAIT for Steal response - Player 0");
				setStealToggle("showMe");
				setAvailSteals(tmpSteals);
				setCurrRound([...tempCurrRound.data]);
				setNextDisabled(true);
				for (let j = 0; j < tmpPlayer.length; j++) {
					modPlayer(j, {
						rndRemoves: [],
						currplay: tmpPlayer[j].currplay,
						deck: tmpPlayer[j].deck,
						status: tmpPlayer[j].status,
						activity: tmpPlayer[j].activity,
						rndResult: "",
						hideRound: tmpPlayer[j].hideRound,
						showTie: tmpPlayer[j].showTie,
					});
				}
				return;
			}
			// CAPTURE current round data -- for resume once steal decision is resolved
			// Misc.tempDelay();
			// console.log("return from WAIT");
		}
		console.log("continue");

		// Check if Steal possibility for Players 2 thru 4
		for (let i = 1; i < tmpPlayer.length; i++) {
			// if (tmpPlayer[i].currRound == "yes") {
			// if (tempCurrRound.data.some((val) => val.id == tmpPlayer[i].id).length > 0 &&
			if (
				tempCurrRound.hasPlayer(tmpPlayer[i].id) > 0 &&
				tmpPlayer[i].id >= stealTurn
			) {
				let victim = Misc.checkSteals(i, tmpPlayer, "computer");
				if (victim.length == 0) continue;
				console.log("COMPUTER Steal");
				// Check if advantageous to steal pile OR (if winning card) to win round
				// ADD logic
				setCurrRound([...tempCurrRound.data]);
				let val = victim[0];
				stealPileMsg(tmpPlayer[i], tmpPlayer[val]);
				setFinishSteal({ win: i, lose: val });
				setStealTurn(i); // steal option remains with current player
				setDrawTurn(i);
				setStealInd(i);
				// modPlayer(i, { rndResult: "Steal" });
				for (let j = 0; j < tmpPlayer.length; j++) {
					modPlayer(j, { ...tmpPlayer[j], rndRemoves: [], rndResult: "" });
				}
				return;
			}
		}
		//
		//

		// Get Results from the Current Round
		const roundResults = Misc.checkCards(
			tempCurrRound.data,
			lastRound.allCards
		);
		console.log("roundResults RETURN");
		console.log(roundResults);
		const tmpResults = {};
		tmpResults.totFours = roundResults.data[0].totFours;

		// DEBUG Alert -- to find 'none' error
		if (roundResults.data[0].allCards.filter((val) => val == "none").length > 0)
			alert("none found");

		if (roundResults.outcome == "win") {
			// modify Winner with cards won
			for (let j = 0; j < 4; j++) {
				if (roundResults.data[0].id == j) {
					tmpPlayer[j].rndResult = "win";
					tmpPlayer[j].winpile.push(...roundResults.data[0].allCards); // MOVE to begin of next Round
					tmpResults.result = "win";
					tmpResults.id = j;
					tmpResults.allCards = roundResults.data[0].allCards;
					tmpResults.tiedPlayers = [];
				} else {
					tmpPlayer[j].rndResult = "";
				}
			}
		}
		// var results = { outcome: "tie", data: tmparray, allCards };
		else if (roundResults.outcome == "tie") {
			// modify Winner with cards won
			let tmpTies = [];
			for (let j = 0; j < roundResults.data.length; j++) {
				let idx = roundResults.data[j].id;
				tmpPlayer[idx].rndResult = "tie";
				tmpTies.push(idx);
			}
			tmpResults.result = "tie";
			tmpResults.id = -1;
			tmpResults.allCards = roundResults.data[0].allCards;
			tmpResults.tiedPlayers = tmpTies;
		} else if (roundResults.outcome == "lossall") {
			/* All Tied players were eliminated due to insufficient cards */
			tmpResults.result = "lossall";
			tmpResults.id = -99;
			tmpRemoves.push(...roundResults.data[0].allCards); // no winner, so all cards in this round sent to Removed Cards
			tmpResults.tiedPlayers = [];
			modRemoves(tmpRemoves); // Possibility that this will be 2nd call to modRemoves in same action -- FIX!!!!
		}

		/* MESSAGES Section */
		const tmpMessage = {
			msgRemoved: "",
			msgRoundWin: "",
			msgMisc: "",
			msgSteal: "",
			msgSteal2: "",
		};
		var tmpWonCards = [];
		if (tmpRemoves.length > 0)
			tmpMessage.msgRemoved = tmpRemoves.length + " cards removed";
		if (roundResults.outcome == "lossall")
			tmpMessage.msgMisc =
				"Not enough cards for tie-breaker - all players eliminated";
		else if (roundResults.outcome == "tie") tmpMessage.msgMisc = "TIE-BREAKER";
		else if (roundResults.outcome == "win") {
			tmpMessage.msgRoundWin =
				"Player " +
				(tmpResults.id + 1) +
				" wins " +
				tmpResults.allCards.length +
				" cards: ";
			tmpWonCards.push(...tmpResults.allCards);
		}
		/* Check for END of GAME -- trigger Winner if there is one & modify buttons to prevent future moves */
		let activePlayers = tmpPlayer.filter((arr) => arr.status == "active");
		let expectedCards = (roundNumber - 1) * 3 + 1; // e.g. 1 card if round 1, 4 cards if round 2, etc
		let hasCards = tmpPlayer.filter(
			(arr) => arr.currplay.length >= expectedCards
		);
		if (activePlayers.length == 1 && hasCards.length <= 1) {
			tmpPlayer[activePlayers[0].id].status = "win";
			tmpMessage.msgWinner = "Player " + (activePlayers[0].id + 1) + " Wins!!!";
		} else if (activePlayers.length == 0) {
			tmpMessage.msgWinner = "Game Over -- No winner";
		}
		if (activePlayers.length <= 1 && hasCards.length <= 1) {
			setGameOver("true");
			tmpMessage.msgRemoved = "";
			tmpMessage.msgMisc = "";
			tmpMessage.msgRoundWin = "";
			tmpMessage.steal = "";
			tmpMessage.steal2 = "";
		}

		/* Check if deck is empty;  if so, re-shuffle deck & reset winpile (prevents people stealing for player w/ 0 deck cards) */
		for (let i = 0; i < tmpPlayer.length; i++) {
			if (tmpPlayer[i].status == "active" && tmpPlayer[i].deck.length == 0) {
				Misc.shufflePile(tmpPlayer[i]); // 2nd param unneeded?
			}
		}

		/* Modify MESSAGE section */
		let wonCardsBigArray = Misc.addCardDetails([...tmpWonCards]);
		setMsgData({ ...msgData, ...tmpMessage, wonCards: wonCardsBigArray });

		/* REMOVE pile logic -- add removed cards from Rule 4 & from ties with no winners */
		// console.log("** tmpRemoves = " + tmpRemoves);
		// let removedBigArray = Misc.addCardDetails([...removedCards, ...tmpRemoves]);
		// setRemovedCardsPlus([...removedBigArray]);
		// setRemovedCards([...removedCards, ...tmpRemoves]);

		// from https://stackoverflow.com/questions/54150783/react-hooks-usestate-with-object
		// Only update if player participated in the last round

		console.log("END of round -- lastRound.result = " + lastRound.result);
		for (let i = 0; i < tmpPlayer.length; i++) {
			if (tmpPlayer[i].activity == "y") {
				modPlayer(i, {
					status: tmpPlayer[i].status,
					deck: tmpPlayer[i].deck,
					currplay: tmpPlayer[i].currplay,
					winpile: tmpPlayer[i].winpile,
					rndResult: tmpPlayer[i].rndResult,
					rndRemoves:
						activePlayers.length > 1
							? Misc.addCardDetails(tmpPlayer[i].rndRemoves)
							: [],
					showTie:
						lastRound.tiedPlayers.includes(i) && tmpPlayer[i].status !== "win"
							? "showTie"
							: "",
					hideRound:
						lastRound.result == "tie" || tmpPlayer[i].status == "win"
							? "hideme"
							: "",
					showLoserText:
						tmpPlayer[i].status == "loss" && tmpPlayer[i].currplay.length == 0
							? "showLoserText"
							: "",
					showWinnerText: tmpPlayer[i].status == "win" ? "showWinnerText" : "",
					activity: "",
				});
			} else {
				modPlayer(i, {
					status: tmpPlayer[i].status,
					showTie: "",
					hideRound: "hideme",
					rndRemoves: [],
					currplay: [],
					showLoserText: tmpPlayer[i].status == "loss" ? "showLoserText" : "",
					activity: "",
				});
			}
		}

		// reset data from the current round to be accessed at start of next round
		console.log("EndRound tmpResults = " + tmpResults);
		setLastRound({
			...lastRound,
			result: tmpResults.result,
			id: tmpResults.id,
			allCards: tmpResults.result == "win" ? [] : tmpResults.allCards,
			tiedPlayers: tmpResults.tiedPlayers,
			wonCards: tmpResults.result == "win" ? tmpResults.allCards : [],
			totFours: tmpResults.totFours,
		});
		//setPlayer4CurrPlay((player4CurrPlay) => [...player4CurrPlay, card4]);

		// Reset all intermediate variables;  Prepare for next Round
		setStealTurn(-1);
		setDrawTurn(-1);
		setStealInd(-1);
		setCurrRound([]);
		setFinishSteal({ win: -1, lose: -1 });
		setNextDisabled(true);
		setTimeout(() => setNextDisabled(false), 500);
		if (tmpResults.result == "win") setRoundNumber(1);
		else if (tmpResults.result == "tie") setRoundNumber(roundNumber + 1);
	};

	return (
		<div className="mainView">
			<header className="header">
				<h1 className="h1_title">WAR CardGame</h1>
				<div className="nav_buttons">
					{/* <button className="btn_options" onClick={onEditHandler}>
						{" "}
						<ion-icon class="feature-icon" name="book-outline">
							{" "}
						</ion-icon>
					</button> */}
					<button className="btn_help" onClick={onHelpHandler}>
						{" "}
						<ion-icon class="feature-icon" name="help-outline">
							{" "}
						</ion-icon>
					</button>
					<HelpPage helpToggle={helpToggle} closeHelp={onCloseHelp} />
					{/* <div class="fullscreen-container">
						<div id="popdiv">
							<h1>Dialog content!</h1>
							<button id="but2">Close dialog</button>
						</div>
					</div> */}
				</div>
			</header>
			<div className="playerSection">
				<PlayerCard data={player1Data} name={"Player 1"} id={0} />
				<PlayerCard data={player2Data} name={"Player 2"} id={1} />
				<PlayerCard data={player3Data} name={"Player 3"} id={2} />
				<PlayerCard data={player4Data} name={"Player 4"} id={3} />
				<StealCheck
					data={availSteals}
					onSteal={onSteal}
					stealToggle={stealToggle}
				/>
				{/* <div className="fullscreen-container">
					<div id="popdiv">
						<h1>Dialog content!</h1>
						<button id="but2">Close dialog</button>
					</div>
				</div> */}
			</div>
			<div className="messageSection">
				<Messages data={msgData} />
			</div>

			<div className="removedCardSection">
				<div className="intro-remove">
					Removed Cards
					<span className="totRemovedCards">[{removedCardsPlus.length}]</span>
				</div>
				<RemovedCards data={removedCardsPlus} />
			</div>

			<br />
			{(gameOver == "true" && (
				<div className="newGame-Button-div">
					<button className="newGame-Button" onClick={onNewGame}>
						NEW GAME
					</button>
				</div>
			)) || (
				<div className="nextButton-div">
					<button
						className="nextButton"
						disabled={nextDisabled}
						onClick={onNextHandler}
					>
						NEXT
					</button>
				</div>
			)}
		</div>
	);
};

export default Game;
