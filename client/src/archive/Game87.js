/*import React, { useEffect, useState } from "react";
import PACK_OF_CARDS from "../utils/packOfCards";
import shuffleArray from "../utils/shuffleArray";
import queryString from "query-string";
import Spinner from "./Spinner";

//NUMBER CODES FOR ACTION CARDS
//SKIP - 404
//DRAW 2 - 252
//WILD - 300
//DRAW 4 WILD - 600

let socket;
// const ENDPOINT = 'http://localhost:5000'
const ENDPOINT = "https://uno-online-multiplayer.herokuapp.com/";

const Game = (props) => {
	const data = queryString.parse(props.location.search);

	//initialize game state
	const [gameOver, setGameOver] = useState(true);
	const [winner, setWinner] = useState("");
	const [turn, setTurn] = useState("");
	const [player1Deck, setPlayer1Deck] = useState([]);
	const [player2Deck, setPlayer2Deck] = useState([]);
	const [currentColor, setCurrentColor] = useState("");
	const [currentNumber, setCurrentNumber] = useState("");
	const [playedCardsPile, setPlayedCardsPile] = useState([]);
	const [drawCardPile, setDrawCardPile] = useState([]);

	const [isUnoButtonPressed, setUnoButtonPressed] = useState(false);

	//runs once on component mount
	useEffect(() => {
		//shuffle PACK_OF_CARDS array
		const shuffledCards = shuffleArray(PACK_OF_CARDS);
		const numPlayers = 4;
		const playerDeck = [];

		for (let i = 0; i < numPlayers; i++) {
			let j = i % 4;
			playerDeck[j] = shuffledCards[i];
		}

		//extract first 7 elements to player1Deck
		const player1Deck = shuffledCards.splice(0, 7);

		//extract first 7 elements to player2Deck
		const player2Deck = shuffledCards.splice(0, 7);

		//extract random card from shuffledCards and check if its not an action card
		let startingCardIndex;
		while (true) {
			startingCardIndex = Math.floor(Math.random() * 94);
			if (
				shuffledCards[startingCardIndex] === "skipR" ||
				shuffledCards[startingCardIndex] === "_R" ||
				shuffledCards[startingCardIndex] === "D2R" ||
				shuffledCards[startingCardIndex] === "skipG" ||
				shuffledCards[startingCardIndex] === "_G" ||
				shuffledCards[startingCardIndex] === "D2G" ||
				shuffledCards[startingCardIndex] === "skipB" ||
				shuffledCards[startingCardIndex] === "_B" ||
				shuffledCards[startingCardIndex] === "D2B" ||
				shuffledCards[startingCardIndex] === "skipY" ||
				shuffledCards[startingCardIndex] === "_Y" ||
				shuffledCards[startingCardIndex] === "D2Y" ||
				shuffledCards[startingCardIndex] === "W" ||
				shuffledCards[startingCardIndex] === "D4W"
			) {
				continue;
			} else break;
		}

		//extract the card from that startingCardIndex into the playedCardsPile
		const playedCardsPile = shuffledCards.splice(startingCardIndex, 1);

		//store all remaining cards into drawCardPile
		const drawCardPile = shuffledCards;
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
		//extract player who played the card
		const cardPlayedBy = turn;
		switch (played_card) {
			//if card played was a number card
			case "0R":
			case "1R":
			case "2R":
			case "3R":
			case "4R":
			case "5R":
			case "6R":
			case "7R":
			case "8R":
			case "9R":
			case "_R":
			case "0G":
			case "1G":
			case "2G":
			case "3G":
			case "4G":
			case "5G":
			case "6G":
			case "7G":
			case "8G":
			case "9G":
			case "_G":
			case "0B":
			case "1B":
			case "2B":
			case "3B":
			case "4B":
			case "5B":
			case "6B":
			case "7B":
			case "8B":
			case "9B":
			case "_B":
			case "0Y":
			case "1Y":
			case "2Y":
			case "3Y":
			case "4Y":
			case "5Y":
			case "6Y":
			case "7Y":
			case "8Y":
			case "9Y":
			case "_Y": {
				//extract number and color of played card
				const numberOfPlayedCard = played_card.charAt(0);
				const colorOfPlayedCard = played_card.charAt(1);
				//check for color match
				if (currentColor === colorOfPlayedCard) {
					console.log("colors matched!");
					//check who played the card and return new state accordingly
					if (cardPlayedBy === "Player 1") {
						//remove the played card from player1's deck and add it to playedCardsPile (immutably)
						//then update turn, currentColor and currentNumber
						const removeIndex = player1Deck.indexOf(played_card);
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player1Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//make a copy of drawCardPile array
							const copiedDrawCardPileArray = [...drawCardPile];
							//pull out last two elements from it
							const drawCard1 = copiedDrawCardPileArray.pop();
							const drawCard2 = copiedDrawCardPileArray.pop();
							const updatedPlayer1Deck = [
								...player1Deck.slice(0, removeIndex),
								...player1Deck.slice(removeIndex + 1),
							];
							updatedPlayer1Deck.push(drawCard1);
							updatedPlayer1Deck.push(drawCard2);
						} else {
						}
					} else {
						//remove the played card from player2's deck and add it to playedCardsPile (immutably)
						//then update turn, currentColor and currentNumber
						const removeIndex = player2Deck.indexOf(played_card);
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player2Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//make a copy of drawCardPile array
							const copiedDrawCardPileArray = [...drawCardPile];
							//pull out last two elements from it
							const drawCard1 = copiedDrawCardPileArray.pop();
							const drawCard2 = copiedDrawCardPileArray.pop();
							const updatedPlayer2Deck = [
								...player2Deck.slice(0, removeIndex),
								...player2Deck.slice(removeIndex + 1),
							];
							updatedPlayer2Deck.push(drawCard1);
							updatedPlayer2Deck.push(drawCard2);
						} else {
						}
					}
				}
				//check for number match
				else if (currentNumber === numberOfPlayedCard) {
					console.log("numbers matched!");
					//check who played the card and return new state accordingly
					if (cardPlayedBy === "Player 1") {
						//remove the played card from player1's deck and add it to playedCardsPile (immutably)
						//then update turn, currentColor and currentNumber
						const removeIndex = player1Deck.indexOf(played_card);
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player1Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//make a copy of drawCardPile array
							const copiedDrawCardPileArray = [...drawCardPile];
							//pull out last two elements from it
							const drawCard1 = copiedDrawCardPileArray.pop();
							const drawCard2 = copiedDrawCardPileArray.pop();
							const updatedPlayer1Deck = [
								...player1Deck.slice(0, removeIndex),
								...player1Deck.slice(removeIndex + 1),
							];
							updatedPlayer1Deck.push(drawCard1);
							updatedPlayer1Deck.push(drawCard2);
						} else {
						}
					} else {
						//remove the played card from player2's deck and add it to playedCardsPile (immutably)
						//then update turn, currentColor and currentNumber
						const removeIndex = player2Deck.indexOf(played_card);
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player2Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//make a copy of drawCardPile array
							const copiedDrawCardPileArray = [...drawCardPile];
							//pull out last two elements from it
							const drawCard1 = copiedDrawCardPileArray.pop();
							const drawCard2 = copiedDrawCardPileArray.pop();
							const updatedPlayer2Deck = [
								...player2Deck.slice(0, removeIndex),
								...player2Deck.slice(removeIndex + 1),
							];
							updatedPlayer2Deck.push(drawCard1);
							updatedPlayer2Deck.push(drawCard2);
						}
					}
				}
				//if no color or number match, invalid move - do not update state
				else {
					alert("Invalid Move!");
				}
				break;
			}
			//if card played was a skip card
			case "skipR":
			case "skipG":
			case "skipB":
			case "skipY": {
				//extract color of played skip card
				const colorOfPlayedCard = played_card.charAt(4);
				//check for color match
				if (currentColor === colorOfPlayedCard) {
					console.log("colors matched!");
					//check who played the card and return new state accordingly
					if (cardPlayedBy === "Player 1") {
						//remove the played card from player1's deck and add it to playedCardsPile (immutably)
						//then update currentColor and currentNumber
						const removeIndex = player1Deck.indexOf(played_card);
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player1Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//make a copy of drawCardPile array
							const copiedDrawCardPileArray = [...drawCardPile];
							//pull out last two elements from it
							const drawCard1 = copiedDrawCardPileArray.pop();
							const drawCard2 = copiedDrawCardPileArray.pop();
							const updatedPlayer1Deck = [
								...player1Deck.slice(0, removeIndex),
								...player1Deck.slice(removeIndex + 1),
							];
							updatedPlayer1Deck.push(drawCard1);
							updatedPlayer1Deck.push(drawCard2);
						}
					} else {
						//remove the played card from player2's deck and add it to playedCardsPile (immutably)
						//then update currentColor and currentNumber
						const removeIndex = player2Deck.indexOf(played_card);
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player2Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//make a copy of drawCardPile array
							const copiedDrawCardPileArray = [...drawCardPile];
							//pull out last two elements from it
							const drawCard1 = copiedDrawCardPileArray.pop();
							const drawCard2 = copiedDrawCardPileArray.pop();
							const updatedPlayer2Deck = [
								...player2Deck.slice(0, removeIndex),
								...player2Deck.slice(removeIndex + 1),
							];
							updatedPlayer2Deck.push(drawCard1);
							updatedPlayer2Deck.push(drawCard2);
						}
					}
				}
				//check for number match - if skip card played on skip card
				else if (currentNumber === 404) {
					console.log("Numbers matched!");
					//check who played the card and return new state accordingly
					if (cardPlayedBy === "Player 1") {
						//remove the played card from player1's deck and add it to playedCardsPile (immutably)
						//then update currentColor and currentNumber - turn will remain same
						const removeIndex = player1Deck.indexOf(played_card);
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player1Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//make a copy of drawCardPile array
							const copiedDrawCardPileArray = [...drawCardPile];
							//pull out last two elements from it
							const drawCard1 = copiedDrawCardPileArray.pop();
							const drawCard2 = copiedDrawCardPileArray.pop();
							const updatedPlayer1Deck = [
								...player1Deck.slice(0, removeIndex),
								...player1Deck.slice(removeIndex + 1),
							];
							updatedPlayer1Deck.push(drawCard1);
							updatedPlayer1Deck.push(drawCard2);
						}
					} else {
						//remove the played card from player2's deck and add it to playedCardsPile (immutably)
						//then update currentColor and currentNumber - turn will remain same
						const removeIndex = player2Deck.indexOf(played_card);
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player2Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//make a copy of drawCardPile array
							const copiedDrawCardPileArray = [...drawCardPile];
							//pull out last two elements from it
							const drawCard1 = copiedDrawCardPileArray.pop();
							const drawCard2 = copiedDrawCardPileArray.pop();
							const updatedPlayer2Deck = [
								...player2Deck.slice(0, removeIndex),
								...player2Deck.slice(removeIndex + 1),
							];
							updatedPlayer2Deck.push(drawCard1);
							updatedPlayer2Deck.push(drawCard2);
						}
					}
				}
				//if no color or number match, invalid move - do not update state
				else {
					alert("Invalid Move!");
				}
				break;
			}
			//if card played was a draw 2 card
			case "D2R":
			case "D2G":
			case "D2B":
			case "D2Y": {
				//extract color of played skip card
				const colorOfPlayedCard = played_card.charAt(2);
				//check for color match
				if (currentColor === colorOfPlayedCard) {
					console.log("colors matched!");
					//check who played the card and return new state accordingly
					if (cardPlayedBy === "Player 1") {
						//remove the played card from player1's deck and add it to playedCardsPile (immutably)
						//remove 2 new cards from drawCardPile and add them to player2's deck (immutably)
						//then update currentColor and currentNumber - turn will remain same
						const removeIndex = player1Deck.indexOf(played_card);
						//make a copy of drawCardPile array
						const copiedDrawCardPileArray = [...drawCardPile];
						//pull out last two elements from it
						const drawCard1 = copiedDrawCardPileArray.pop();
						const drawCard2 = copiedDrawCardPileArray.pop();
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player1Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//pull out last two elements from drawCardPile
							const drawCard1X = copiedDrawCardPileArray.pop();
							const drawCard2X = copiedDrawCardPileArray.pop();
							const updatedPlayer1Deck = [
								...player1Deck.slice(0, removeIndex),
								...player1Deck.slice(removeIndex + 1),
							];
							updatedPlayer1Deck.push(drawCard1X);
							updatedPlayer1Deck.push(drawCard2X);
						}
					} else {
						//remove the played card from player2's deck and add it to playedCardsPile (immutably)
						//remove 2 new cards from drawCardPile and add them to player1's deck (immutably)
						//then update currentColor and currentNumber - turn will remain same
						const removeIndex = player2Deck.indexOf(played_card);
						//make a copy of drawCardPile array
						const copiedDrawCardPileArray = [...drawCardPile];
						//pull out last two elements from it
						const drawCard1 = copiedDrawCardPileArray.pop();
						const drawCard2 = copiedDrawCardPileArray.pop();
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player2Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//pull out last two elements from drawCardPile
							const drawCard1X = copiedDrawCardPileArray.pop();
							const drawCard2X = copiedDrawCardPileArray.pop();
							const updatedPlayer2Deck = [
								...player2Deck.slice(0, removeIndex),
								...player2Deck.slice(removeIndex + 1),
							];
							updatedPlayer2Deck.push(drawCard1X);
							updatedPlayer2Deck.push(drawCard2X);
						}
					}
				}
				//check for number match - if draw 2 card played on draw 2 card
				else if (currentNumber === 252) {
					console.log("number matched!");
					//check who played the card and return new state accordingly
					if (cardPlayedBy === "Player 1") {
						//remove the played card from player1's deck and add it to playedCardsPile (immutably)
						//remove 2 new cards from drawCardPile and add them to player2's deck (immutably)
						//then update currentColor and currentNumber - turn will remain same
						const removeIndex = player1Deck.indexOf(played_card);
						//make a copy of drawCardPile array
						const copiedDrawCardPileArray = [...drawCardPile];
						//pull out last two elements from it
						const drawCard1 = copiedDrawCardPileArray.pop();
						const drawCard2 = copiedDrawCardPileArray.pop();
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player1Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//pull out last two elements from drawCardPile
							const drawCard1X = copiedDrawCardPileArray.pop();
							const drawCard2X = copiedDrawCardPileArray.pop();
							const updatedPlayer1Deck = [
								...player1Deck.slice(0, removeIndex),
								...player1Deck.slice(removeIndex + 1),
							];
							updatedPlayer1Deck.push(drawCard1X);
							updatedPlayer1Deck.push(drawCard2X);
						}
					} else {
						//remove the played card from player2's deck and add it to playedCardsPile (immutably)
						//remove 2 new cards from drawCardPile and add them to player1's deck (immutably)
						//then update currentColor and currentNumber - turn will remain same
						const removeIndex = player2Deck.indexOf(played_card);
						//make a copy of drawCardPile array
						const copiedDrawCardPileArray = [...drawCardPile];
						//pull out last two elements from it
						const drawCard1 = copiedDrawCardPileArray.pop();
						const drawCard2 = copiedDrawCardPileArray.pop();
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player2Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//pull out last two elements from drawCardPile
							const drawCard1X = copiedDrawCardPileArray.pop();
							const drawCard2X = copiedDrawCardPileArray.pop();
							const updatedPlayer2Deck = [
								...player2Deck.slice(0, removeIndex),
								...player2Deck.slice(removeIndex + 1),
							];
							updatedPlayer2Deck.push(drawCard1X);
							updatedPlayer2Deck.push(drawCard2X);
						}
					}
				}
				//if no color or number match, invalid move - do not update state
				else {
					alert("Invalid Move!");
				}
				break;
			}
			//if card played was a wild card
			case "W": {
				//check who played the card and return new state accordingly
				if (cardPlayedBy === "Player 1") {
					//ask for new color
					const newColor = prompt(
						"Enter first letter of new color (R/G/B/Y)"
					).toUpperCase();
					//remove the played card from player1's deck and add it to playedCardsPile (immutably)
					const removeIndex = player1Deck.indexOf(played_card);
					//then update turn, currentColor and currentNumber
					//if two cards remaining check if player pressed UNO button
					//if not pressed add 2 cards as penalty
					if (player1Deck.length === 2 && !isUnoButtonPressed) {
						alert(
							"Oops! You forgot to press UNO. You drew 2 cards as penalty."
						);
						//make a copy of drawCardPile array
						const copiedDrawCardPileArray = [...drawCardPile];
						//pull out last two elements from it
						const drawCard1 = copiedDrawCardPileArray.pop();
						const drawCard2 = copiedDrawCardPileArray.pop();
						const updatedPlayer1Deck = [
							...player1Deck.slice(0, removeIndex),
							...player1Deck.slice(removeIndex + 1),
						];
						updatedPlayer1Deck.push(drawCard1);
						updatedPlayer1Deck.push(drawCard2);
					}
				} else {
					//ask for new color
					const newColor = prompt(
						"Enter first letter of new color (R/G/B/Y)"
					).toUpperCase();
					//remove the played card from player2's deck and add it to playedCardsPile (immutably)
					const removeIndex = player2Deck.indexOf(played_card);
					//then update turn, currentColor and currentNumber
					//if two cards remaining check if player pressed UNO button
					//if not pressed add 2 cards as penalty
					if (player2Deck.length === 2 && !isUnoButtonPressed) {
						alert(
							"Oops! You forgot to press UNO. You drew 2 cards as penalty."
						);
						//make a copy of drawCardPile array
						const copiedDrawCardPileArray = [...drawCardPile];
						//pull out last two elements from it
						const drawCard1 = copiedDrawCardPileArray.pop();
						const drawCard2 = copiedDrawCardPileArray.pop();
						const updatedPlayer2Deck = [
							...player2Deck.slice(0, removeIndex),
							...player2Deck.slice(removeIndex + 1),
						];
						updatedPlayer2Deck.push(drawCard1);
						updatedPlayer2Deck.push(drawCard2);
					}
				}
				break;
			}
			//if card played was a draw four wild card
			case "D4W":
				{
					//check who played the card and return new state accordingly
					if (cardPlayedBy === "Player 1") {
						//ask for new color
						const newColor = prompt(
							"Enter first letter of new color (R/G/B/Y)"
						).toUpperCase();
						//remove the played card from player1's deck and add it to playedCardsPile (immutably)
						const removeIndex = player1Deck.indexOf(played_card);
						//remove 2 new cards from drawCardPile and add them to player2's deck (immutably)
						//make a copy of drawCardPile array
						const copiedDrawCardPileArray = [...drawCardPile];
						//pull out last four elements from it
						const drawCard1 = copiedDrawCardPileArray.pop();
						const drawCard2 = copiedDrawCardPileArray.pop();
						const drawCard3 = copiedDrawCardPileArray.pop();
						const drawCard4 = copiedDrawCardPileArray.pop();
						//then update currentColor and currentNumber - turn will remain same
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player1Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//pull out last two elements from drawCardPile
							const drawCard1X = copiedDrawCardPileArray.pop();
							const drawCard2X = copiedDrawCardPileArray.pop();
							const updatedPlayer1Deck = [
								...player1Deck.slice(0, removeIndex),
								...player1Deck.slice(removeIndex + 1),
							];
							updatedPlayer1Deck.push(drawCard1X);
							updatedPlayer1Deck.push(drawCard2X);
						}
					} else {
						//ask for new color
						const newColor = prompt(
							"Enter first letter of new color (R/G/B/Y)"
						).toUpperCase();
						//remove the played card from player2's deck and add it to playedCardsPile (immutably)
						const removeIndex = player2Deck.indexOf(played_card);
						//remove 2 new cards from drawCardPile and add them to player1's deck (immutably)
						//make a copy of drawCardPile array
						const copiedDrawCardPileArray = [...drawCardPile];
						//pull out last four elements from it
						const drawCard1 = copiedDrawCardPileArray.pop();
						const drawCard2 = copiedDrawCardPileArray.pop();
						const drawCard3 = copiedDrawCardPileArray.pop();
						const drawCard4 = copiedDrawCardPileArray.pop();
						//then update currentColor and currentNumber - turn will remain same
						//if two cards remaining check if player pressed UNO button
						//if not pressed add 2 cards as penalty
						if (player2Deck.length === 2 && !isUnoButtonPressed) {
							alert(
								"Oops! You forgot to press UNO. You drew 2 cards as penalty."
							);
							//pull out last two elements from drawCardPile
							const drawCard1X = copiedDrawCardPileArray.pop();
							const drawCard2X = copiedDrawCardPileArray.pop();
							const updatedPlayer2Deck = [
								...player2Deck.slice(0, removeIndex),
								...player2Deck.slice(removeIndex + 1),
							];
							updatedPlayer2Deck.push(drawCard1X);
							updatedPlayer2Deck.push(drawCard2X);
						}
					}
				}
				break;
		}
	};

	const onCardDrawnHandler = () => {
		//extract player who drew the card
		const cardDrawnBy = turn;
		//check who drew the card and return new state accordingly
		if (cardDrawnBy === "Player 1") {
			//remove 1 new card from drawCardPile and add it to player1's deck (immutably)
			//make a copy of drawCardPile array
			const copiedDrawCardPileArray = [...drawCardPile];
			//pull out last element from it
			const drawCard = copiedDrawCardPileArray.pop();
			//extract number and color of drawn card
			const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
			let numberOfDrawnCard = drawCard.charAt(0);
			if (
				colorOfDrawnCard === currentColor &&
				(drawCard === "skipR" ||
					drawCard === "skipG" ||
					drawCard === "skipB" ||
					drawCard === "skipY")
			) {
				alert(`You drew ${drawCard}. It was played for you.`);
			} else if (
				colorOfDrawnCard === currentColor &&
				(drawCard === "D2R" ||
					drawCard === "D2G" ||
					drawCard === "D2B" ||
					drawCard === "D2Y")
			) {
				alert(`You drew ${drawCard}. It was played for you.`);
				//remove 2 new cards from drawCardPile and add them to player2's deck (immutably)
				//make a copy of drawCardPile array
				const copiedDrawCardPileArray = [...drawCardPile];
				//pull out last two elements from it
				const drawCard1 = copiedDrawCardPileArray.pop();
				const drawCard2 = copiedDrawCardPileArray.pop();
			} else if (drawCard === "W") {
				alert(`You drew ${drawCard}. It was played for you.`);
				//ask for new color
				const newColor = prompt(
					"Enter first letter of new color (R/G/B/Y)"
				).toUpperCase();
			} else if (drawCard === "D4W") {
				alert(`You drew ${drawCard}. It was played for you.`);
				//ask for new color
				const newColor = prompt(
					"Enter first letter of new color (R/G/B/Y)"
				).toUpperCase();
				//remove 2 new cards from drawCardPile and add them to player2's deck (immutably)
				//make a copy of drawCardPile array
				const copiedDrawCardPileArray = [...drawCardPile];
				//pull out last four elements from it
				const drawCard1 = copiedDrawCardPileArray.pop();
				const drawCard2 = copiedDrawCardPileArray.pop();
				const drawCard3 = copiedDrawCardPileArray.pop();
				const drawCard4 = copiedDrawCardPileArray.pop();
			}
			//if not action card - check if drawn card is playable
			else if (
				numberOfDrawnCard === currentNumber ||
				colorOfDrawnCard === currentColor
			) {
				alert(`You drew ${drawCard}. It was played for you.`);
			}
		} else {
			//remove 1 new card from drawCardPile and add it to player2's deck (immutably)
			//make a copy of drawCardPile array
			const copiedDrawCardPileArray = [...drawCardPile];
			//pull out last element from it
			const drawCard = copiedDrawCardPileArray.pop();
			//extract number and color of drawn card
			const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
			let numberOfDrawnCard = drawCard.charAt(0);
			if (
				colorOfDrawnCard === currentColor &&
				(drawCard === "skipR" ||
					drawCard === "skipG" ||
					drawCard === "skipB" ||
					drawCard === "skipY")
			) {
				alert(`You drew ${drawCard}. It was played for you.`);
			} else if (
				colorOfDrawnCard === currentColor &&
				(drawCard === "D2R" ||
					drawCard === "D2G" ||
					drawCard === "D2B" ||
					drawCard === "D2Y")
			) {
				alert(`You drew ${drawCard}. It was played for you.`);
				//remove 2 new cards from drawCardPile and add them to player1's deck (immutably)
				//make a copy of drawCardPile array
				const copiedDrawCardPileArray = [...drawCardPile];
				//pull out last two elements from it
				const drawCard1 = copiedDrawCardPileArray.pop();
				const drawCard2 = copiedDrawCardPileArray.pop();
			} else if (drawCard === "W") {
				alert(`You drew ${drawCard}. It was played for you.`);
				//ask for new color
				const newColor = prompt(
					"Enter first letter of new color (R/G/B/Y)"
				).toUpperCase();
			} else if (drawCard === "D4W") {
				alert(`You drew ${drawCard}. It was played for you.`);
				//ask for new color
				const newColor = prompt(
					"Enter first letter of new color (R/G/B/Y)"
				).toUpperCase();
				//remove 2 new cards from drawCardPile and add them to player1's deck (immutably)
				//make a copy of drawCardPile array
				const copiedDrawCardPileArray = [...drawCardPile];
				//pull out last four elements from it
				const drawCard1 = copiedDrawCardPileArray.pop();
				const drawCard2 = copiedDrawCardPileArray.pop();
				const drawCard3 = copiedDrawCardPileArray.pop();
				const drawCard4 = copiedDrawCardPileArray.pop();
			}
			//if not action card - check if drawn card is playable
			else if (
				numberOfDrawnCard === currentNumber ||
				colorOfDrawnCard === currentColor
			) {
				alert(`You drew ${drawCard}. It was played for you.`);
			}
		}
	};

	return (
		<div className={`Game backgroundColorR backgroundColor${currentColor}`}>
			<>
				<div className="topInfo">
					<img src={require("../assets/logo.png").default} />
					<h1>WAR CardGame</h1>
				</div>

				{ PLAYER LEFT MESSAGES }
				{users.length === 1 && currentUser === "Player 2" && (
					<h1 className="topInfoText">Player 1 has left the game.</h1>
				)}
				{users.length === 1 && currentUser === "Player 1" && (
					<h1 className="topInfoText">
						Waiting for Player 2 to join the game.
					</h1>
				)}

				{users.length === 2 && (
					<>
						{gameOver ? (
							<div>
								{winner !== "" && (
									<>
										<h1>GAME OVER</h1>
										<h2>{winner} wins!</h2>
									</>
								)}
							</div>
						) : (
							<div>
								{ PLAYER 1 VIEW }
								{currentUser === "Player 1" && (
									<>
										<div
											className="player2Deck"
											style={{ pointerEvents: "none" }}
										>
											<p className="playerDeckText">Player 2</p>
											{player2Deck.map((item, i) => (
												<img
													key={i}
													className="Card"
													onClick={() => onCardPlayedHandler(item)}
													src={require(`../assets/card-back.png`).default}
												/>
											))}
											{turn === "Player 2" && <Spinner />}
										</div>
										<br />
										<div
											className="middleInfo"
											style={
												turn === "Player 2" ? { pointerEvents: "none" } : null
											}
										>
											<button
												className="game-button"
												disabled={turn !== "Player 1"}
												onClick={onCardDrawnHandler}
											>
												DRAW CARD
											</button>
											{playedCardsPile && playedCardsPile.length > 0 && (
												<img
													className="Card"
													src={
														require(`../assets/cards-front/${
															playedCardsPile[playedCardsPile.length - 1]
														}.png`).default
													}
												/>
											)}
											<button
												className="game-button orange"
												disabled={player1Deck.length !== 2}
												onClick={() => {
													setUnoButtonPressed(!isUnoButtonPressed);
												}}
											>
												UNO
											</button>
										</div>
										<br />
										<div
											className="player1Deck"
											style={
												turn === "Player 1" ? null : { pointerEvents: "none" }
											}
										>
											<p className="playerDeckText">Player 1</p>
											{player1Deck.map((item, i) => (
												<img
													key={i}
													className="Card"
													onClick={() => onCardPlayedHandler(item)}
													src={
														require(`../assets/cards-front/${item}.png`).default
													}
												/>
											))}
										</div>
									</>
								)}

								{ PLAYER 2 VIEW }
								{currentUser === "Player 2" && (
									<>
										<div
											className="player1Deck"
											style={{ pointerEvents: "none" }}
										>
											<p className="playerDeckText">Player 1</p>
											{player1Deck.map((item, i) => (
												<img
													key={i}
													className="Card"
													onClick={() => onCardPlayedHandler(item)}
													src={require(`../assets/card-back.png`).default}
												/>
											))}
											{turn === "Player 1" && <Spinner />}
										</div>
										<br />
										<div
											className="middleInfo"
											style={
												turn === "Player 1" ? { pointerEvents: "none" } : null
											}
										>
											<button
												className="game-button"
												disabled={turn !== "Player 2"}
												onClick={onCardDrawnHandler}
											>
												DRAW CARD
											</button>
											{playedCardsPile && playedCardsPile.length > 0 && (
												<img
													className="Card"
													src={
														require(`../assets/cards-front/${
															playedCardsPile[playedCardsPile.length - 1]
														}.png`).default
													}
												/>
											)}
											<button
												className="game-button orange"
												disabled={player2Deck.length !== 2}
												onClick={() => {
													setUnoButtonPressed(!isUnoButtonPressed);
												}}
											>
												UNO
											</button>
										</div>
										<br />
										<div
											className="player2Deck"
											style={
												turn === "Player 1" ? { pointerEvents: "none" } : null
											}
										>
											<p className="playerDeckText">Player 2</p>
											{player2Deck.map((item, i) => (
												<img
													key={i}
													className="Card"
													onClick={() => onCardPlayedHandler(item)}
													src={
														require(`../assets/cards-front/${item}.png`).default
													}
												/>
											))}
										</div>
									</>
								)}
							</div>
						)}
					</>
				)}
			</>

			<br />
			<a href="/">
				<button className="game-button red">QUIT</button>
			</a>
		</div>
	);
};

export default Game;
*/
