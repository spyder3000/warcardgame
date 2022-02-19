import React from "react";

const PlayerCard = (props) => {
	console.log("PlayerCard.js ***");
	console.log(props);

	return (
		<div className={`playerCard playerCard${props.id}`}>
			<h2 className="playName">{props.name}</h2>
			<div className="cardPiles">
				<div className="cardPileDown">
					<img
						className="cardImg0a"
						src={require(`../assets/cards-img/cardback.png`).default}
					></img>
					<div className="numDown">{props.data.deck.length}</div>
				</div>
				<div className="cardPileUp">
					{props.data.winpile.length > 0 ? (
						<img
							className="cardImg0b"
							src={
								require(`../assets/cards-img/${props.data.winpile[
									props.data.winpile.length - 1
								].toLowerCase()}.png`).default
							}
						></img>
					) : (
						<img
							className="cardImgBlank"
							src={require(`../assets/cards-img/blank.png`).default}
						></img>
					)}
					<div className="numUp">{props.data.winpile.length}</div>
				</div>
			</div>

			<div className="currentPlay">
				<div className={`cardPlay1 ${props.data.hideRound}`}>
					{props.data.currplay && props.data.currplay.length > 0 && (
						<img
							className="cardImg1"
							src={
								require(`../assets/cards-img/${props.data.currplay[
									props.data.currplay.length - 1
								].toLowerCase()}.png`).default
							}
						></img>
					)}
				</div>
				<div className={`cardPlay2 ${props.data.showTie}`}>
					{props.data.currplay && props.data.currplay.length >= 1 && (
						<>
							<div className="oldImages_div">
								<img
									className="cardImg2"
									src={
										require(`../assets/cards-img/${props.data.currplay[
											props.data.currplay.length - 1
										].toLowerCase()}.png`).default
									}
								></img>
								<img
									className="cardImg2a"
									src={
										require(`../assets/cards-img/${props.data.currplay[
											props.data.currplay.length - 1
										].toLowerCase()}.png`).default
									}
								></img>
								<img
									className="cardImg2a"
									src={
										require(`../assets/cards-img/${props.data.currplay[
											props.data.currplay.length - 1
										].toLowerCase()}.png`).default
									}
								></img>
							</div>
							<div className="newImage_div">
								<img
									className="cardImg2b"
									src={
										require(`../assets/cards-img/${props.data.currplay[
											props.data.currplay.length - 1
										].toLowerCase()}.png`).default
									}
								></img>
							</div>
						</>
					)}
				</div>
			</div>

			<br />
			<div className={`rnd_result ${props.data.rndResult}`}>
				{props.data.rndResult.toUpperCase()}
			</div>
			<div className="steal_div">
				<a href="/">
					<button className="steal-button">STEAL</button>
				</a>
			</div>
		</div>
	);
};

export default PlayerCard;