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
	const [winner, setWinner] = useState("");
	const [turn, setTurn] = useState("");

	// Display Toggle state vars
	const [helpToggle, setHelpToggle] = useState("hideMe");
	const [stealToggle, setStealToggle] = useState("hideMe");

	// Steals State vars
	const [stealTurn, setStealTurn] = useState(-1);
	const [availSteals, setAvailSteals] = useState([2, 3]);

	// Removed Cards state vars
	const [removedCards, setRemovedCards] = useState([]);
	const [removedCardsPlus, setRemovedCardsPlus] = useState([]);

	// Message Data state vars
	const [msgData, setMsgData] = useState({
		msgLoser: "",
		msgWinner: "",
		msgRemoved: "",
		msgRoundWin: "",
		msgMisc: "",
		wonCards: [],
	});

	// Round State vars
	const [currentRoundCards, setCurrentRoundCards] = useState([]);
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
		console.log("Mod Player = " + i);
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
		else Misc.stealPile(tmpPlayer, 0, val);

		setStealToggle("hideMe");
	};

	const playerCopy = () => {
		// Setup temporary arrays to hold data until time to apply changes via setState
		const tmpPlayer = [];
		tmpPlayer[0] = new Player(player1Data);
		tmpPlayer[1] = new Player(player2Data);
		tmpPlayer[2] = new Player(player3Data);
		tmpPlayer[3] = new Player(player4Data);
		return tmpPlayer;
	};

	const onNextHandler = () => {
		console.log("Next button click");
		const tmpPlayer = playerCopy();
		const tmpRemoves = [];

		// Initial check that all players have cards to continue
		for (let i = 0; i < numPlayers; i++) {
			if (tmpPlayer[i].status == "active") {
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

					// Add logic to remove cards via setState HERE
				}
			}
		}

		// Draw Cards for Active players
		const tempCurrRound = new GameRound();
		for (let i = 0; i < numPlayers; i++) {
			// Only Draw Cards for Active Players;  If a Tie from prev round, only include players that are part of the tie;
			if (tmpPlayer[i].status == "active") {
				if (lastRound.result !== "tie" || lastRound.tiedPlayers.includes(i)) {
					tmpPlayer[i].currRound = "yes";
					let card;
					let downcards = [];
					// IF starting a New Round
					if (lastRound.result !== "tie") {
						card = tmpPlayer[i].getCard("new"); // param indicates this is a new round;  clear out modCurr array
					}
					// TIE scenario (tie from prev round)
					else {
						tmpPlayer[i].getTieCards();
						card = tmpPlayer[i].modCurr[tmpPlayer[i].modCurr.length - 1]; // get last card in current array
						downcards.push(
							tmpPlayer[i].modCurr[tmpPlayer[i].modCurr.length - 2],
							tmpPlayer[i].modCurr[tmpPlayer[i].modCurr.length - 3]
						);
					}

					console.log("TEMPCurrRound = " + i + "; card = " + card);
					tempCurrRound.addPlayerCards({ id: i, card, downcards });

					// Modify current cards shown
					modPlayer(i, {
						currplay: tmpPlayer[i].modCurr,
						deck: tmpPlayer[i].deck,
						status: tmpPlayer[i].status,
					});
				}
			}
		}

		/* ---  STEAL SECTION  --- */
		// Check if Steal possibility for Player 1
		const tmpSteals = [];
		if (tmpPlayer[0].currRound == "yes") {
			// gets current card for player 1
			let curr_crd = parseInt(
				Misc.getNum(Misc.getTopCard(tmpPlayer[0].modCurr))
			);
			for (let i = 0; i < tmpPlayer.length; i++) {
				if (i == 0) continue;
				if (tmpPlayer[i].winpile.length == 0) continue;

				// if current card matches top pile on other player's win pile
				if (Misc.getNum(Misc.getTopCard(tmpPlayer[i].winpile)) == curr_crd) {
					tmpPlayer[0].stealOption = "yes";
					tmpSteals.push(i);
					console.log("Steal Pile -- from player " + i);
				}
			}
		}
		if (tmpPlayer[0].stealOption == "yes") {
			console.log("WAIT for Steal response");
			setStealToggle("showMe");
			setAvailSteals(tmpSteals);
			return;
			// Misc.tempDelay();
			// console.log("return from WAIT");
		}
		console.log("continue");

		// Get Results from the Current Round
		const roundResults = Misc.checkCards(
			tempCurrRound.data,
			lastRound.allCards
		);
		console.log("roundResults RETURN");
		console.log(roundResults);
		const tmpResults = {};
		const tmpMessage = { msgRemoved: "", msgRoundWin: "", msgMisc: "" };
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
		}
		// msgLoser: "",
		// msgWinner: "",
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
		if (activePlayers.length == 1) {
			tmpPlayer[activePlayers[0].id].status = "win";
			tmpMessage.msgWinner = "Player " + (activePlayers[0].id + 1) + " Wins!!!";
		} else if (activePlayers.length == 0) {
			tmpMessage.msgWinner = "Game Over -- No winner";
		}
		if (activePlayers.length <= 1) {
			setGameOver("true");
			tmpMessage.msgRemoved = "";
			tmpMessage.msgMisc = "";
			tmpMessage.msgRoundWin = "";
		}

		/* Modify MESSAGE section */
		let wonCardsBigArray = Misc.addCardDetails([...tmpWonCards]);
		setMsgData({ ...msgData, ...tmpMessage, wonCards: wonCardsBigArray });

		/* REMOVE pile logic -- add removed cards from Rule 4 & from ties with no winners */
		console.log("** tmpRemoves = " + tmpRemoves);
		let removedBigArray = Misc.addCardDetails([...removedCards, ...tmpRemoves]);
		setRemovedCardsPlus([...removedBigArray]);
		setRemovedCards([...removedCards, ...tmpRemoves]);

		// from https://stackoverflow.com/questions/54150783/react-hooks-usestate-with-object
		// Only update if player participated in the last round
		if (tmpPlayer[0].activity == "y") {
			setPlayer1Data({
				...player1Data,
				status: tmpPlayer[0].status,
				deck: tmpPlayer[0].deck,
				currplay: tmpPlayer[0].modCurr,
				winpile: tmpPlayer[0].winpile,
				rndResult: tmpPlayer[0].rndResult,
				rndRemoves:
					activePlayers.length > 1
						? Misc.addCardDetails(tmpPlayer[0].rndRemoves)
						: [],
				showTie:
					lastRound.tiedPlayers.includes(0) && tmpPlayer[0].status !== "win"
						? "showTie"
						: "",
				hideRound:
					lastRound.result == "tie" || tmpPlayer[0].status == "win"
						? "hideme"
						: "",
				showLoserText: tmpPlayer[0].status == "loss" ? "showLoserText" : "",
				showWinnerText: tmpPlayer[0].status == "win" ? "showWinnerText" : "",
			});
		} else {
			setPlayer1Data({
				...player1Data,
				status: tmpPlayer[0].status,
				showTie: "",
				hideRound: "hideme",
				rndRemoves: [],
			});
		}

		if (tmpPlayer[1].activity == "y") {
			setPlayer2Data({
				...player2Data,
				status: tmpPlayer[1].status,
				deck: tmpPlayer[1].deck,
				currplay: tmpPlayer[1].modCurr,
				winpile: tmpPlayer[1].winpile,
				rndResult: tmpPlayer[1].rndResult,
				rndRemoves:
					activePlayers.length > 1
						? Misc.addCardDetails(tmpPlayer[1].rndRemoves)
						: [],
				showTie:
					lastRound.tiedPlayers.includes(1) && tmpPlayer[1].status !== "win"
						? "showTie"
						: "",
				hideRound:
					lastRound.result == "tie" || tmpPlayer[1].status == "win"
						? "hideme"
						: "",
				showLoserText: tmpPlayer[1].status == "loss" ? "showLoserText" : "",
				showWinnerText: tmpPlayer[1].status == "win" ? "showWinnerText" : "",
			});
		} else {
			setPlayer2Data({
				...player2Data,
				status: tmpPlayer[1].status,
				showTie: "",
				hideRound: "hideme",
				rndRemoves: [],
			});
		}

		if (tmpPlayer[2].activity == "y") {
			setPlayer3Data({
				...player3Data,
				status: tmpPlayer[2].status,
				deck: tmpPlayer[2].deck,
				currplay: tmpPlayer[2].modCurr,
				winpile: tmpPlayer[2].winpile,
				rndResult: tmpPlayer[2].rndResult,
				rndRemoves:
					activePlayers.length > 1
						? Misc.addCardDetails(tmpPlayer[2].rndRemoves)
						: [],
				showTie:
					lastRound.tiedPlayers.includes(2) && tmpPlayer[2].status !== "win"
						? "showTie"
						: "",
				hideRound:
					lastRound.result == "tie" || tmpPlayer[2].status == "win"
						? "hideme"
						: "",
				showLoserText: tmpPlayer[2].status == "loss" ? "showLoserText" : "",
				showWinnerText: tmpPlayer[2].status == "win" ? "showWinnerText" : "",
			});
		} else {
			setPlayer3Data({
				...player3Data,
				status: tmpPlayer[2].status,
				showTie: "",
				hideRound: "hideme",
				rndRemoves: [],
			});
		}

		if (tmpPlayer[3].activity == "y") {
			setPlayer4Data({
				...player4Data,
				status: tmpPlayer[3].status,
				deck: tmpPlayer[3].deck,
				currplay: tmpPlayer[3].modCurr,
				winpile: tmpPlayer[3].winpile,
				rndResult: tmpPlayer[3].rndResult,
				rndRemoves:
					activePlayers.length > 1
						? Misc.addCardDetails(tmpPlayer[3].rndRemoves)
						: [],
				showTie:
					lastRound.tiedPlayers.includes(3) && tmpPlayer[3].status !== "win"
						? "showTie"
						: "",
				hideRound:
					lastRound.result == "tie" || tmpPlayer[3].status == "win"
						? "hideme"
						: "",
				showLoserText: tmpPlayer[3].status == "loss" ? "showLoserText" : "",
				showWinnerText: tmpPlayer[3].status == "win" ? "showWinnerText" : "",
			});
		} else {
			setPlayer4Data({
				...player4Data,
				status: tmpPlayer[3].status,
				showTie: "",
				hideRound: "hideme",
				rndRemoves: [],
			});
		}

		// reset data from the current round to be accessed at start of next round
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
		setStealTurn(-1);
	};

	return (
		<div className="mainView">
			<header className="header">
				<h1 className="h1_title">WAR CardGame</h1>
				<div className="nav_buttons">
					<button className="btn_options" onClick={onEditHandler}>
						{" "}
						<ion-icon class="feature-icon" name="book-outline">
							{" "}
						</ion-icon>
					</button>
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
				<div className="intro-remove">Removed Cards: </div>
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
					<button className="nextButton" onClick={onNextHandler}>
						NEXT
					</button>
				</div>
			)}
		</div>
	);
};

export default Game;
