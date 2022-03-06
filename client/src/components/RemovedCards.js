import React from "react";

const RemovedCards = (props) => {
	console.log("RemovedCards.js ***");
	console.log(props);

	return (
		<>
			<div className="data-remove">
				{props.data.map((crd, index) => {
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
						); /* ...expense allows for destructuring in ExpenseListItem */
				})}
			</div>
		</>
	);
};

export default RemovedCards;
