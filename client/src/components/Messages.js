import React from "react";

const Messages = (props) => {
	console.log("Messages.js ***");
	console.log(props);

	const gameOver = props.data.msgWinner;
	if (gameOver)
		return (
			<>
				<div className="msg-div">
					<span className="msg-winner">{props.data.msgWinner}</span>
				</div>
			</>
		);

	return (
		<>
			<div className="msg-div">
				{props.data.msgWinner && (
					<span className="msg-winner">{props.data.msgWinner}</span>
				)}
				<span className="msg-removed">{props.data.msgRemoved}</span>
				<span className="msg-misc">{props.data.msgMisc}</span>
				<span className="msg-round-win">{props.data.msgRoundWin}</span>

				{props.data.wonCards.map((crd, index) => {
					{
						/* console.log("index = " + index); */
					}
					if (index == 0)
						return (
							<span key={index} className={`card-value ${crd.suit} `}>
								{crd.cardValue}
							</span>
						);
					else
						return (
							<span key={index} className={`card-value ${crd.suit} `}>
								<span className="remove-comma">, </span> &nbsp;{crd.cardValue}
							</span>
						);
				})}
			</div>
		</>
	);
};

export default Messages;
