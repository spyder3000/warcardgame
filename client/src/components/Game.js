import React, { useEffect, useState } from "react";
import PACK_OF_CARDS from "../utils/packOfCards";
import shuffleArray from "../utils/shuffleArray";
import Misc from "../utils/Misc";
import queryString from "query-string";
import Spinner from "./Spinner";
import PlayerCard from "./PlayerCard";

let socket;
// const ENDPOINT = 'http://localhost:5000'
// const ENDPOINT = "https://uno-online-multiplayer.herokuapp.com/";

const Game = (props) => {
	const data = queryString.parse(props.location.search);

	//initialize game state
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState("");
	const [turn, setTurn] = useState("");

	const [player1Data, setPlayer1Data] = useState({
		deck: [],
		winpile: [],
		currplay: [],
		status: "active",
		rndResult: "",
		showTie: "",
		hideRound: "",
	});
	const [player2Data, setPlayer2Data] = useState({
		deck: [],
		winpile: [],
		currplay: [],
		status: "active",
		rndResult: "",
		showTie: "",
		hideRound: "",
	});
	const [player3Data, setPlayer3Data] = useState({
		deck: [],
		winpile: [],
		currplay: [],
		status: "active",
		rndResult: "",
		showTie: "",
		hideRound: "",
	});
	const [player4Data, setPlayer4Data] = useState({
		deck: [],
		winpile: [],
		currplay: [],
		status: "active",
		rndResult: "",
		showTie: "",
		hideRound: "",
	});

	const [currentRoundCards, setCurrentRoundCards] = useState([]);
	const [lastRound, setLastRound] = useState({
		result: "",
		id: -1,
		allCards: [],
		tiedPlayers: [],
	});

	console.log("MISC RANDOM = " + Misc.getRandomNum(0, 100));
	console.log(typeof player1Data.currplay);
	console.log(typeof player1Data.deck);

	//runs once on component mount
	useEffect(() => {
		//shuffle PACK_OF_CARDS array
		const shuffledCards = shuffleArray(PACK_OF_CARDS);
		const numPlayers = 4;
		const activePlayers = []; // keeps track of which players are still in the game
		const playerDeck = [];
		const playerWinPile = []; // the win pile for each player
		const playerCurr = []; // the current round cards for a player
		const playerStatus = []; // the player status (e.g. active, inactive, loser, winner)

		// create Card arrays based on number of players
		for (let i = 0; i < numPlayers; i++) {
			playerWinPile[i] = [];
			playerDeck[i] = [];
			playerCurr[i] = [];
			playerStatus[i] = "active";
			activePlayers.push(i);
		}

		for (let i = 0; i < shuffledCards.length; i++) {
			let j = i % 4;
			playerDeck[j].push(shuffledCards[i]);
		}

		setPlayer1Data((prevState) => ({
			...prevState,
			deck: playerDeck[0],
			winpile: playerWinPile[0],
		}));
		setPlayer2Data((prevState) => ({
			...prevState,
			deck: playerDeck[1],
			winpile: playerWinPile[1],
		}));
		setPlayer3Data((prevState) => ({
			...prevState,
			deck: playerDeck[2],
			winpile: playerWinPile[2],
		}));
		setPlayer4Data((prevState) => ({
			...prevState,
			deck: playerDeck[3],
			winpile: playerWinPile[3],
		}));
	}, []);

	//some util functions
	const checkGameOver = (arr) => {
		return arr.length === 1;
	};

	const checkWinner = (arr, player) => {
		return arr.length === 1 ? player : "";
	};

	const getNum = (crd) => {
		return crd.substring(0, crd.length - 1);
	};
	const getColor = (crd) => {
		let color = crd.substring(crd.length - 1).toLowerCase();
		if (color == "s" || color == "c") return "black";
		else return "red";
	};

	const onNextHandler = () => {
		console.log("Next button click");

		// Setup temporary arrays to hold data until time to apply changes via setState
		const tmpPlayer = [];
		tmpPlayer.push({ ...player1Data });
		tmpPlayer.push({ ...player2Data });
		tmpPlayer.push({ ...player3Data });
		tmpPlayer.push({ ...player4Data });

		const tempCurrRound2 = [];
		// Only Draw Cards for Active Players;  If a Tie result, only include players that are part of the tie;
		for (let i = 0; i < 4; i++) {
			if (tmpPlayer[i].status == "active") {
				if (lastRound.result !== "tie" || lastRound.tiedPlayers.includes(i)) {
					let card = tmpPlayer[i].deck[0];
					tmpPlayer[i].modDeck = tmpPlayer[i].deck.slice(1);
					tmpPlayer[i].modCurr = [];

					// modCurr array should be cleared except for new card UNLESS we're in tie-breaker scenario
					if (lastRound.result !== "tie") tmpPlayer[i].modCurr.push(card);
					else tmpPlayer[i].modCurr.push(...tmpPlayer[i].currplay, card);

					tempCurrRound2.push({
						id: i,
						card: card,
						cardNum: getNum(card),
						color: getColor(card),
					});
				}
			}
		}

		// Get Results from the Current Round
		const roundResults = Misc.checkCards(tempCurrRound2, lastRound.allCards);
		console.log("roundResults RETURN");
		console.log(roundResults);
		const tmpResults = {};
		if (roundResults.outcome == "win") {
			// modify Winner with cards won
			for (let j = 0; j < 4; j++) {
				if (roundResults.data[0].id == j) {
					tmpPlayer[j].rndResult = "win";
					tmpPlayer[j].winpile.push(...roundResults.data[0].allCards);
					tmpResults.result = "win";
					tmpResults.id = j;
					tmpResults.allCards = tmpPlayer[j].winpile;
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
			tmpResults.allCards = roundResults.allCards;
			tmpResults.tiedPlayers = tmpTies;
		}

		// from https://stackoverflow.com/questions/54150783/react-hooks-usestate-with-object
		// Only update if player participated in the last round
		if (tmpPlayer[0].modDeck) {
			setPlayer1Data({
				...player1Data,
				deck: tmpPlayer[0].modDeck,
				currplay: tmpPlayer[0].modCurr,
				winpile: tmpPlayer[0].winpile,
				rndResult: tmpPlayer[0].rndResult,
				showTie: lastRound.tiedPlayers.includes(0) ? "showTie" : "",
				hideRound: lastRound.result == "tie" ? "hideme" : "",
			});
		} else {
			setPlayer1Data({
				...player1Data,
				showTie: "",
				hideRound: "hideme",
			});
		}

		if (tmpPlayer[1].modDeck) {
			setPlayer2Data({
				...player2Data,
				deck: tmpPlayer[1].modDeck,
				currplay: tmpPlayer[1].modCurr,
				winpile: tmpPlayer[1].winpile,
				rndResult: tmpPlayer[1].rndResult,
				showTie: lastRound.tiedPlayers.includes(1) ? "showTie" : "",
				hideRound: lastRound.result == "tie" ? "hideme" : "",
			});
		} else {
			setPlayer2Data({
				...player2Data,
				showTie: "",
				hideRound: "hideme",
			});
		}

		if (tmpPlayer[2].modDeck) {
			setPlayer3Data({
				...player3Data,
				deck: tmpPlayer[2].modDeck,
				currplay: tmpPlayer[2].modCurr,
				winpile: tmpPlayer[2].winpile,
				rndResult: tmpPlayer[2].rndResult,
				showTie: lastRound.tiedPlayers.includes(2) ? "showTie" : "",
				hideRound: lastRound.result == "tie" ? "hideme" : "",
			});
		} else {
			setPlayer3Data({
				...player3Data,
				showTie: "",
				hideRound: "hideme",
			});
		}

		if (tmpPlayer[3].modDeck) {
			setPlayer4Data({
				...player4Data,
				deck: tmpPlayer[3].modDeck,
				currplay: tmpPlayer[3].modCurr,
				winpile: tmpPlayer[3].winpile,
				rndResult: tmpPlayer[3].rndResult,
				showTie: lastRound.tiedPlayers.includes(3) ? "showTie" : "",
				hideRound: lastRound.result == "tie" ? "hideme" : "",
			});
		} else {
			setPlayer4Data({
				...player4Data,
				showTie: "",
				hideRound: "hideme",
			});
		}

		// reset data from the current round to be accessed at start of next round
		setLastRound({
			...lastRound,
			result: tmpResults.result,
			id: tmpResults.id,
			allCards: tmpResults == "win" ? [] : tmpResults.allCards,
			tiedPlayers: tmpResults.tiedPlayers,
		});
		//setPlayer4CurrPlay((player4CurrPlay) => [...player4CurrPlay, card4]);
	};

	return (
		<div className="mainView">
			<h1>WAR CardGame</h1>
			<div className="playerSection">
				<PlayerCard data={player1Data} name={"Player 1"} id={0} />
				<PlayerCard data={player2Data} name={"Player 2"} id={1} />
				<PlayerCard data={player3Data} name={"Player 3"} id={2} />
				<PlayerCard data={player4Data} name={"Player 4"} id={3} />
			</div>

			<br />
			<div className="nextButton-div">
				<button className="nextButton" onClick={onNextHandler}>
					NEXT
				</button>
			</div>
		</div>
	);
};

export default Game;
