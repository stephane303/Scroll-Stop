var pageDeleted = false;
var pageMatch = false;
var siteURLs;
var sitePxs; //default value
var currSitePx = 300;
var websiteIndex = 0; //the index of the website in the URL array
var closeBehav = "close";
var redirectURL = "http://www.google.com"; //default value
var lastAlert = 0; //last scroll value we alerted at
var alertDiff = 1000; //duration until we alert again

var paused = false;


function createModal() {

	const modal = document.createElement("div");
	modal.setAttribute("id", "myModal");
	modal.classList.add("modal");
	// Add inline styles for the modal element
	modal.style.position = 'fixed';
	modal.style.zIndex = '1000000';
	modal.style.left = '0';
	modal.style.top = '0';
	modal.style.width = '100%';
	modal.style.height = '100%';
	modal.style.backgroundColor = 'rgba(0, 0, 0, 1)';

	const modalContent = document.createElement("div");
	modalContent.classList.add("modal-content");
	// Add inline styles for the modal-content element
	modalContent.style.display = 'flex';
	modalContent.style.flexDirection = 'column';
	modalContent.style.justifyContent = 'center';
	modalContent.style.alignItems = 'center';
	modalContent.style.position = 'fixed';
	modalContent.style.left = '50%';
	modalContent.style.top = '50%';
	modalContent.style.transform = 'translate(-50%, -50%)';
	modalContent.style.backgroundColor = '#fff';
	modalContent.style.padding = '20px';
	modalContent.style.border = '1px solid #888';
	modalContent.style.width = '300px';
	modalContent.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';


	const closeBtn = document.createElement("span");
	closeBtn.classList.add("close");
	closeBtn.innerHTML = "&times;";
	modalContent.appendChild(closeBtn);

	const title = document.createElement("h1");
	title.textContent = "Math Challenge";
	modalContent.appendChild(title);

	const problem = document.createElement("div");
	problem.setAttribute("id", "problem");
	modalContent.appendChild(problem);

	const answer = document.createElement("input");
	answer.setAttribute("type", "number");
	answer.setAttribute("id", "answer");
	modalContent.appendChild(answer);

	const submit = document.createElement("button");
	submit.setAttribute("id", "submit");
	submit.textContent = "Submit";
	modalContent.appendChild(submit);

	modal.appendChild(modalContent);
	document.body.appendChild(modal);

	return { modal, closeBtn, problem, answer, submit };
}

function openChallenge() {
	const { modal, closeBtn, problem, answer, submit } = createModal();

	function generateProblem() {
		const a = Math.floor(Math.random() * 10) + 1;
		const b = Math.floor(Math.random() * 10) + 1;
		problem.textContent = `${a} + ${b} =`;
		return a + b;
	}

	let correctAnswer = generateProblem();

	submit.addEventListener("click", () => {
		if (parseInt(answer.value, 10) === correctAnswer) {
			modal.style.display = "none";
		} else {
			answer.value = "";
			correctAnswer = generateProblem();
		}
	});

/* 	closeBtn.addEventListener("click", () => {
		modal.style.display = "none";
	}); */

/* 	window.addEventListener("click", (event) => {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	}); */

	setTimeout(() => {
		modal.style.display = "block";
	}, 500);
}

function siteBlocked() {
	if (typeof siteURLs == 'undefined')
		return false
	var siteArray = siteURLs.split(",");
	for (var i = 0; i < siteArray.length; i++) {
		if (window.location.href.indexOf(siteArray[i]) != "" && window.location.href.indexOf(siteArray[i]) > -1) {
			websiteIndex = i;
			return true;
		}
	}
	return false;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.method == "setURLs") {
		siteURLs = request.data;
		if (siteBlocked()) {
			pageMatch = true;
		}
		else {
			pageMatch = false;
		}
	}
	else if (request.method == "setPxs") {
		sitePxs = request.data;
		if (typeof sitePxs !== 'undefined')
			sitePxs = sitePxs.split(",");
	}
	else if (request.method == "setClose") {
		closeBehav = request.data;
	}
	else if (request.method == "setRedirect") {
		redirectURL = request.data;
	}
	else if (request.method == "togglePaused") {
		paused = !paused;
	}
});

window.onscroll = function (ev) {
	if (sitePxs != null) {
		if (window.scrollY > sitePxs[websiteIndex] && pageMatch) {
			pageDeleted = true;

			if (closeBehav == "close") {
				chrome.runtime.sendMessage({ method: "closeTab" }, function (response) {
					// console.log(response);
				});
			}
			else if (closeBehav == "remove") {
				document.body.remove();
			}
			else if (closeBehav == "redirect") {
				window.location.replace(redirectURL);
			}
			else if (closeBehav == "alert") {
				if (lastAlert == 0 || window.scrollY > lastAlert + alertDiff) {
					openChallenge();
					lastAlert = window.scrollY;
				}
			}
			else {
				chrome.runtime.sendMessage({ method: "closeTab" }, function (response) {
					// console.log(response);
				});
			}
		}
	}
};


