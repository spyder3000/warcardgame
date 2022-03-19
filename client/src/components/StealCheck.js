import React, { useState } from "react";

const StealCheck = (props) => {
	console.log("StealCheck");
	console.log(props);
	return (
		<div id="popinfo" className={`stealdiv ${props.stealToggle}`}>
			<h1>Steal Pile?</h1>
			{props.data.map((dat) => {
				return (
					<button
						key={dat}
						id="stealBtn"
						className="stealBtn"
						onClick={() => {
							props.onSteal(dat);
						}}
					>
						Player {dat + 1}
					</button>
				);
			})}

			<button
				id="stealBtn"
				key="cancel"
				className="stealBtn"
				onClick={() => {
					props.onSteal("cancel");
				}}
			>
				Cancel
			</button>
		</div>
	);
};

export default StealCheck;
