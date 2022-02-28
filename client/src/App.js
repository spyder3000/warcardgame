import "./App.css";
import { Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Game from "./components/Game";

// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
	var flex = document.createElement("div");
	flex.style.display = "flex";
	flex.style.flexDirection = "column";
	flex.style.rowGap = "1px";

	flex.appendChild(document.createElement("div"));
	flex.appendChild(document.createElement("div"));

	document.body.appendChild(flex);
	var isSupported = flex.scrollHeight === 1;
	flex.parentNode.removeChild(flex);
	console.log(isSupported);

	if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

const App = () => {
	return (
		<div className="App">
			{/* <Route path='/' exact component={Homepage} />
      <Route path='/play' exact component={Game} /> */}
			<Route path="" exact component={Game} />
		</div>
	);
};

export default App;
