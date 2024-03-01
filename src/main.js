
// JQuery functions
$(document).ready(function() {

	console.log("Reading...");
	console.log("Load Complete!");

	// Elements
	var html			= $("body,html");
	var firstBg			= $("#bg-first");
	var secondBg		= $("#bg-second");
	var playBtn			= $("#play");
	var startBtn		= $("#start");
	var calcBtn 		= $("#calculate");
	var bottomBtn 		= $("#bottom-button");
	var navBar 			= $(".navigation-bar-opaque");
	var logo			= $("#logo");
	var info 			= $("#info-wrapper");
	var navRow 			= $("ul");
    var wrapper         = $(".wrapper");
    var wrapperOpaque   = $(".wrapper-opaque");
	var navStartBtn		= $("#nav-start");
	var navPlayBtn		= $("#nav-play");
	var navInfoBtn		= $("#nav-info");
	var canvas 			= $("#canvas-context");
	var calcBtn 		= $("#calculate");
	var randomCalcBtn 	= $("#random-calc");
	var choiceGameMode 	= $("#game-mode");
	var choiceFreeMode 	= $("#free-mode");
	var choiceContainer = $("#game-choice");
	var gameContainer 	= $("#game-status-container");
	var freeContainer 	= $("#game-free-mode");
	var interaction 	= $("#canvas-interaction-container");

	var scrollPos = $(window).scrollTop();

	// Real time nav bar listener
	if (scrollPos > 100) {
		navBar.addClass("navigation-bar");
		logo.css("margin-left", "0");
		navRow.css("margin-right", "0");
	} else if (scrollPos < 100) {
		navBar.removeClass("navigation-bar");
		logo.css("margin-left", "15px");
		navRow.css("margin-right", "15px");
	}

	// Active scroll listener
	$(window).scroll(function(event) {
		var scrollPos = $(window).scrollTop();

		if (scrollPos > 100) {
			bottomBtn.css("bottom", "15px");
			navBar.addClass("navigation-bar");
			logo.css("margin-left", "5px");
			navRow.css("margin-right", "5px");
		} else if (scrollPos < 100) {
			bottomBtn.css("bottom", "-500px");
			navBar.removeClass("navigation-bar");
			logo.css("margin-left", "15px");
			navRow.css("margin-right", "15px");
		}
	});

	// Bottom button click
	bottomBtn.click(function() {
		html.animate({
			scrollTop: wrapperOpaque.offset().top
		}, 1000);
	});

	// Play now button click
	playBtn.click(function() {
		html.animate({
			scrollTop: wrapper.offset().top - 80
		}, 1000);
	});

	// Start button click
	startBtn.click(function() {
		render();

		startBtn.css("display", "none");
		interaction.css("display", "block");

		html.animate({
			scrollTop: canvas.offset().top - 80
		}, 1000);
	});

	// Navigation button click actions
	navStartBtn.click(function() {
        html.animate({
            scrollTop: wrapperOpaque.offset().top
		}, 1000);
	});

	navPlayBtn.click(function() {
		html.animate({
			scrollTop: wrapper.offset().top - 80
		}, 1000);
	});

	navInfoBtn.click(function() {
		html.animate({
			scrollTop: info.offset().top - 80
		}, 1000);
	});

	// Game button actions
	choiceGameMode.click(function() {
        renderSection("game");

        startGame();
	});

	choiceFreeMode.click(function() {
		renderSection("free");
	});

	calcBtn.click(function() {
		render();

		calculate(false);
	});

	randomCalcBtn.click(function() {
		render();

		calculate(true);
    });

	// Background image fade animation 
	// (Not the best code) But it works...
	var animDuration 	= 5000;
	var secondVisible 	= false;

	setInterval(function() {
		secondBg.css("z-index", "-50");

		if (secondVisible) {
			secondVisible = false;
			secondBg.fadeTo("slow", 0);
		}
		else {
			secondVisible = true;
			secondBg.fadeTo("slow", 1);
		}
	}, animDuration);

	// --------------- Primary or main functionality --------------- \\
	var k = 0;
	var m = 0;

	var x1 = 0;
	var x2 = 0;

	var y1 = 0;
	var y2 = 0;

	const max = 11;
	const scorePerRound = 10;

	var colorStatus = "#ff0000";

    const gridSize      = 500;
    const multiplier    = 50;

    var coordinateOne = [0, 0];
    var coordinateTwo = [0, 0];

    var selectedCoordinates = [
        coordinateOne,
        coordinateTwo,
    ];

    var coordinates = [];
    var coords = [];

    var selectIndex = 0;

    var buttonRadius = 25;

    var gameStart = false;

    var correctAnswers  = 0;
    var answerIndex     = 0;
    var clickCount 		= 0;

	var canvas 	= document.getElementById("canvas-context");
	var kInput 	= document.getElementById("kInput"); 
	var mInput 	= document.getElementById("mInput");

	var canvasElement = $("#canvas-context");
	var correctStatus = $("#correctStatus");

	var context = canvas.getContext("2d");

	document.getElementById('canvas-context').onclick = function(e) {
  		getMousePosition(this, e);
	};

	function getMousePosition(canvas, event) {
	    var canvasArea = canvas.getBoundingClientRect();

	    var x = event.clientX - canvasArea.left;
	    var y = event.clientY - canvasArea.top;

	    clickCount += 1;

	    if (clickCount == 3) {
	    	clickCount = 0;

	    	render();
	    	calculateLine();

	    	correctStatus.html("");

	    	return;
	    }

	    handleClick(x, y);
	}

	function pointToGrid(x, y) {
		var half = Math.floor(max / 2);

		var newX = Math.floor((x / multiplier) + 0.5);
		var newY = Math.floor((y / multiplier) + 0.5);

		var newX = newX - half;
		var newY = half - newY;

		return { x: newX, y: newY };
	}

	function gridToPoint(x, y) {
		var half = Math.floor(max / 2);

		var newX = (x + half) * multiplier;
		var newY = (half - y) * multiplier;

		return { x: newX, y: newY };
	}

	function handleClick(x, y) {
		if (gameStart) {
			var newPoint = pointToGrid(x, y);

			var reversedPoint = gridToPoint(newPoint.x, newPoint.y);

			coords.push([reversedPoint.x, reversedPoint.y]);

			renderObjects();
		}
	}

	function renderObjects() {
		if (coords.length == 1)
			render();

		for (var i = 0; i < coords.length; i++) {
			renderGraphButton(coords[i][0], coords[i][1], "green");
		}

		if (coords.length >= 2) {
			drawLine(coords[0], coords[1], "green");
			checkResult();
		}

	}

	function drawLine(coord1, coord2, color) {
		context.strokeStyle = color;
		context.lineWidth 	= 3;

		context.beginPath();
		context.moveTo(coord1[0], coord1[1]);
		context.lineTo(coord2[0], coord2[1]);
        context.stroke();
	}

	function checkResult() {
		var kValueOK 	= false;
		var mValueOK 	= false;
		var correct 	= false;

		var userKValue = ((coords[0][1] - coords[1][1]) / (coords[1][0] - coords[0][0]));

		if (userKValue == k)
			kValueOK = true;

		var highestYCoord;

		if (coords[0][1] < coords[1][1])
			highestYCoord = coords[0];
		else
			highestYCoord = coords[1];
		
		var pointInGrid = pointToGrid(highestYCoord[0], highestYCoord[1]);
		var userMValue = pointInGrid.y - k * pointInGrid.x;
		
		if (userMValue == m)
			mValueOK = true;

		if (kValueOK && mValueOK)
			correct = true;

		if (!correct) {
			colorStatus = "red";

			correctStatus.css("color", colorStatus);
			correctStatus.html("   Incorrect!");
		} else {
			colorStatus = "green";

			correctStatus.css("color", colorStatus);
			correctStatus.html("   Correct!");
		}

		kInput.value = k;
		mInput.value = m;

		coords[0][1] *= 2;
		coords[0][0] *= 2;

		coords[1][1] *= 2;
		coords[1][0] *= 2;

		drawLine(coords[0], coords[1], "green");

		calculate(false);

		var score = registerScore(correct);

		if (score) {
			coords = [];
		}
	}

	function registerScore(correct) {
		answerIndex++;

		if (correct)
			correctAnswers++;

		document.getElementById("correctAnswers").innerHTML = correctAnswers;

		if (answerIndex == scorePerRound) {
			onFinishedGame();
			gameStart = false;
			return false;
		}

		return true;
	}

	function onFinishedGame() {
		//Here it can be some visual confirmation of your finished score for example
		document.getElementById("game-choice-status").innerHTML = "Your final score was " + correctAnswers + " out of " + answerIndex;
	}

	function randomNumber(min, max) {
		var number = Math.floor(Math.random() * (max - min)) - (max / 2);

		return parseInt(number);
	}

	function calculate(random) {
		if (random) {
			k = randomNumber(-5, 5);
            m = randomNumber(-5, 5);

            if (k == 0)
                k = 1;

			kInput.value = k;
			mInput.value = m;
		} else {
			k = parseInt(kInput.value);
			m = parseInt(mInput.value);
		}

		k = k * -1;
		m = m * -1;

		x1 = (((-5 - m) / k) + 5) * multiplier;
        x2 = (((5 - m) / k) + 5) * multiplier;

        context.strokeStyle = colorStatus;
		context.lineWidth 	= 3;

		context.beginPath();
		context.moveTo(x1, 0);
		context.lineTo(x2, gridSize);
        context.stroke();
	}

	function calculateLine() {
		k = randomNumber(-5, 5);
        m = randomNumber(-5, 5);

        if (k == 0)
            k = 1;
        else if (k > 5)
        	k = 5;

        if (m > 5)
        	m = 5;

        document.getElementById("kValue").innerHTML = k;
        document.getElementById("mValue").innerHTML = m;
	}

	function renderSection(type) {
		choiceContainer.css("display", "none");

		if (type == "game") {
			gameContainer.css("display", "block");
		}

		if (type == "free") {
			freeContainer.css("display", "block");
		}
	}

    function renderGraphButton(x, y, color) {
        if (gameStart) {
            context.beginPath();

            context.arc(x, y, 5, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
        }
	}

    function startGame() {
        gameStart = true;

        calculateLine();
    }

	function render() {
		context.clearRect(0, 0, gridSize, gridSize);

		context.canvas.height 	= gridSize;
		context.canvas.width 	= gridSize;

		context.fillStyle = "#eee";
		
		context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = "#777";
        context.font        = "15px Arial";

		context.lineWidth = 1; 

		for (var i = 0; i <= gridSize; i = i + (gridSize / 10)) {
			context.beginPath();
			context.moveTo(i, 0);
			context.lineTo(i, gridSize);
			context.stroke();
		}

		for (var i = 0; i <= gridSize; i = i + (gridSize / 10)) {
			context.beginPath();
			context.moveTo(0, i);
			context.lineTo(gridSize, i);
			context.stroke();
		}

		context.strokeStyle = "#000";
		context.lineWidth 	= 2; 
		context.fillStyle 	= "#000";

		for (var i = 0; i <= gridSize; i = i + (gridSize / 2)) {
			context.beginPath();
			context.moveTo(0, i);
			context.lineTo(gridSize, i);
			context.stroke();
		}

		for (var i = 0; i <= gridSize; i = i + (gridSize / 2)) {
			context.beginPath();
			context.moveTo(i, 0);
			context.lineTo(i, gridSize);
			context.stroke();
		}

		// Indication text
		for (var i = 0; i < max; i++) {
			var currentValue;

			if (i < (max / 2))
				currentValue = parseInt(-(max / 2 - i));
			else if (i > (max / 2))
				currentValue = parseInt(((i - max) + 1) + (max / 2) + 1);

			context.beginPath();

			if (currentValue == 0)
				continue;

			if (i > (max / 2))
				context.fillText(currentValue - 1, i * (gridSize / 10) - 20, (gridSize / 2) + 20);
			else if (i < (max / 2))
				context.fillText(currentValue, i * (gridSize / 10) + 5, (gridSize / 2) + 20);
		}

		// Indication text
		for (var i = 0; i < max; i++) {
			var currentValue;

			if (i > (max / 2))
				currentValue = parseInt((max / 2 - i) - 1);
			else if (i < (max / 2))
				currentValue = parseInt((max - i) - (max / 2) + 1);

			context.beginPath();

			if (i > (max / 2)) 
				context.fillText(currentValue, (gridSize / 2) - 20, i * (gridSize / 10) - 5);
			else if (i < (max / 2))
				context.fillText(currentValue, (gridSize / 2) - 20, i * (gridSize / 10) - 30);
		}
	}
});