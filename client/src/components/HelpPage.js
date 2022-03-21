import React, { useState } from "react";

const HelpPage = (props) => {
	console.log("helpPage");
	console.log(props);
	return (
		<div id="pophelp" className={`helpdiv ${props.helpToggle}`}>
			<h1>Rules</h1>
			<ul>
				<li>Standard War Rules - each round, high card wins</li>
				<li>Exception -- Red 2 will win if all other cards are Black</li>
				<li>Exception -- Black 2 will win if all other cards are Red</li>
				<li>When a 4 is turned up, all players must discard their next card</li>
				<li>
					In case of a tie, players must place 2 down cards & play a 3rd card to
					break the tie
				</li>
				<li>
					If a player does not have enough cards to continue, they are removed
					from the game
				</li>
			</ul>
			<button
				id="closeHelpBtn"
				className="closeHelpBtn"
				onClick={props.closeHelp}
			>
				Close
			</button>
		</div>
	);
};

export default HelpPage;
