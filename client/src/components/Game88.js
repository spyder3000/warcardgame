import React, { useEffect, useState } from "react";
import PACK_OF_CARDS from "../utils/packOfCards";
import shuffleArray from "../utils/shuffleArray";
import queryString from "query-string";
import Spinner from "./Spinner";
import PlayerCard from "./PlayerCard";

//NUMBER CODES FOR ACTION CARDS
//SKIP - 404
//DRAW 2 - 252
//WILD - 300
//DRAW 4 WILD - 600

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
	});

	const [player1Status, setPlayer1Status] = useState("active");
	const [player2Status, setPlayer2Status] = useState("active");
	const [player3Status, setPlayer3Status] = useState("active");
	const [player4Status, setPlayer4Status] = useState("active");

	const [player1Deck, setPlayer1Deck] = useState([]);
	const [player2Deck, setPlayer2Deck] = useState([]);
	const [player3Deck, setPlayer3Deck] = useState([]);
	const [player4Deck, setPlayer4Deck] = useState([]);

	const [player1WinPile, setPlayer1WinPile] = useState([]);
	const [player2WinPile, setPlayer2WinPile] = useState([]);
	const [player3WinPile, setPlayer3WinPile] = useState([]);
	const [player4WinPile, setPlayer4WinPile] = useState([]);

	const [player1CurrPlay, setPlayer1CurrPlay] = useState([]);
	const [player2CurrPlay, setPlayer2CurrPlay] = useState([]);
	const [player3CurrPlay, setPlayer3CurrPlay] = useState([]);
	const [player4CurrPlay, setPlayer4CurrPlay] = useState([]);

	const [player1RndResult, setPlayer1RndResult] = useState("");
	const [player2RndResult, setPlayer2RndResult] = useState("");
	const [player3RndResult, setPlayer3RndResult] = useState("");
	const [player4RndResult, setPlayer4RndResult] = useState("");

	const [currentRoundCards, setCurrentRoundCards] = useState([]);

	console.log(typeof player1CurrPlay);
	console.log(typeof player1Deck);

	//runs once on component mount
	useEffect(() => {
		//shuffle PACK_OF_CARDS array
		const shuffledCards = shuffleArray(PACK_OF_CARDS);
		const numPlayers = 4;
		const activePlayers = []; // keeps track of which players are still in the game
		const playerDeck = [];
		const playerWinPile = []; // the win pile for each player

		// create Card arrays based on number of players
		for (let i = 0; i < numPlayers; i++) {
			playerWinPile[i] = [];
			playerDeck[i] = [];
			activePlayers.push(i);
		}

		for (let i = 0; i < shuffledCards.length; i++) {
			let j = i % 4;
			playerDeck[j].push(shuffledCards[i]);
		}
		setPlayer1Deck(playerDeck[0]);
		setPlayer2Deck(playerDeck[1]);
		setPlayer3Deck(playerDeck[2]);
		setPlayer4Deck(playerDeck[3]);

		setPlayer1WinPile(playerWinPile[0]);
		setPlayer2WinPile(playerWinPile[1]);
		setPlayer3WinPile(playerWinPile[2]);
		setPlayer4WinPile(playerWinPile[3]);

		setPlayer1CurrPlay([]);
		setPlayer2CurrPlay([]);
		setPlayer3CurrPlay([]);
		setPlayer4CurrPlay([]);

		setPlayer1Data((prevState) => ({
			...prevState,
			deck: playerDeck[0],
			winpile: playerWinPile[0],
			currPlay: [],
		}));
		// setPlayer1Data({
		// 	deck: playerDeck[0],
		// 	winpile: playerWinPile[0],
		// 	currPlay: [],
		// });

		console.log("playerDeck[0] = " + player1Deck);
		console.log("player1Data.deck = " + player1Data.deck);
		console.log(typeof player1CurrPlay);
		console.log(typeof player1Deck);
	}, []);

	//some util functions
	const checkGameOver = (arr) => {
		return arr.length === 1;
	};

	const checkWinner = (arr, player) => {
		return arr.length === 1 ? player : "";
	};

	//driver functions
	const onCardPlayedHandler = (played_card) => {
		console.log("onCardPlayedHandler");
		console.log(played_card);
	};

	const onCardDrawnHandler = () => {
		console.log("onCardDrawnHandler");
	};

	const checkCards = (cardData) => {
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
				data: [{ id: redTwo[0].id, card: redTwo[0].card, status: "win" }],
			};
			console.log(results2);
			return results2;
		} else if (blackTwo.length > 0 && totBlacks == 1) {
			var results2 = {
				outcome: "win",
				data: [{ name: blackTwo[0].id, card: blackTwo[0].card, status: "win" }],
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
			var results = { outcome: "tie", data: tmparray };
			console.log(results);
		} else {
			var results = {
				outcome: "win",
				data: [{ id: topvals[0].id, card: topvals[0].card, status: "win" }],
			};
			console.log(results);
		}
		return results;

		// Check if just 2 players left and both have a 2 of different colors -- no winner in this case
		// Check if 1 red 2 and all black -- red 2 wins
		// check if 1 black 2 and all red -- black 2 wins
		// Sort cards in descending order
		// Check if 1 card is winner -- send all cards to winning player.  make sure winning card is added last
		// Identify all tied cards -- set variable for nextRound & which players will participate

		// return win player, win card OR tie players
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
		//extract player who drew the card
		console.log("Next button click");
		let card = player1Deck[0];
		let temp = player1Deck.slice(1);
		let tempCurrRound = [];

		console.log(player1CurrPlay);
		setPlayer1Deck(temp);
		// setPlayer1CurrPlay(["4s", "3h", "2d"]);
		setPlayer1CurrPlay((player1CurrPlay) => [...player1CurrPlay, card]);
		if (player1Status == "active")
			tempCurrRound.push({
				id: 1,
				card: card,
				cardNum: getNum(card),
				color: getColor(card),
			});

		// setCurrentRoundCards((currentRoundCards) => [
		// 	...currentRoundCards,
		// 	{ id: 1, card: card },
		// ]);
		console.log("card = " + card);
		console.log(player1CurrPlay);

		let card2 = player2Deck[0];
		let temp2 = player2Deck.slice(1);
		setPlayer2Deck(temp2);
		setPlayer2CurrPlay((player2CurrPlay) => [...player2CurrPlay, card2]);
		if (player1Status == "active")
			tempCurrRound.push({
				id: 2,
				card: card2,
				cardNum: getNum(card2),
				color: getColor(card2),
			});

		let card3 = player3Deck[0];
		let temp3 = player3Deck.slice(1);
		setPlayer3Deck(temp3);
		setPlayer3CurrPlay((player3CurrPlay) => [...player3CurrPlay, card3]);
		if (player3Status == "active")
			tempCurrRound.push({
				id: 3,
				card: card3,
				cardNum: getNum(card3),
				color: getColor(card3),
			});

		let card4 = player4Deck[0];
		let temp4 = player4Deck.slice(1);
		setPlayer4Deck(temp4);
		setPlayer4CurrPlay((player4CurrPlay) => [...player4CurrPlay, card4]);
		if (player4Status == "active")
			tempCurrRound.push({
				id: 4,
				card: card4,
				cardNum: getNum(card4),
				color: getColor(card4),
			});

		const roundResults = checkCards(tempCurrRound);
		console.log("roundResults RETURN");
		console.log(roundResults);
		if (roundResults.outcome == "win") {
			if (roundResults.data[0].id == 1) setPlayer1RndResult("win");
			else if (roundResults.data[0].id == 2) setPlayer2RndResult("win");
			else if (roundResults.data[0].id == 3) setPlayer3RndResult("win");
			else if (roundResults.data[0].id == 4) setPlayer4RndResult("win");
		}

		// Modify to have roundResults include winArray w/ winning card in position 0
		let tArray = [];
		tArray.push(card, card2, card3, card4, ...player1Data.winpile);

		// from https://stackoverflow.com/questions/54150783/react-hooks-usestate-with-object
		setPlayer1Data({
			...player1Data,
			deck: temp,
			currPlay: card,
			winpile: tArray,
		});
	};

	return (
		<div className="mainView">
			<h1>WAR CardGame</h1>
			<div className="playerSection">
				<PlayerCard
					data={player1Data}
					deck={player1Deck}
					winpile={player1WinPile}
					name={"Player 1"}
					currPlay={player1CurrPlay}
					rndResult={player1RndResult}
				/>
				<PlayerCard
					data={player1Data}
					deck={player2Deck}
					winpile={player2WinPile}
					name={"Player 2"}
					currPlay={player2CurrPlay}
					rndResult={player2RndResult}
				/>
				<PlayerCard
					data={player1Data}
					deck={player3Deck}
					winpile={player3WinPile}
					name={"Player 3"}
					currPlay={player3CurrPlay}
					rndResult={player3RndResult}
				/>
				<PlayerCard
					data={player1Data}
					deck={player4Deck}
					winpile={player4WinPile}
					name={"Player 4"}
					currPlay={player4CurrPlay}
					rndResult={player4RndResult}
				/>
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
