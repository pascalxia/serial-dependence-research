/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"before_formal.html",
	"break.html",
	"end.html",
	"before_practice.html",
	"stage.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"before_practice.html"
];

//rotation direction of a run
var direction;

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

/********************
* PRACTICE*
********************/
//set parameters

var experiment = function(practice, nTrial, finish, direction) {
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');
	//set parameters
	var regularCounterA = [3, 4];
	var stepSize = 10;
	var minJump = 50;
	var maxJump = 60;
	var stimulusX = 0.5;
	var stimulusY = 0.5;
	var radius = 10;
	var crossWidth = 2;
	var barLength = 100;
	var barWidth = 8;
	var displaysize = 150;
	var headLen = 20;
	var headAngle = 30;
	var crossTime = 300;
	var displayTime = 500;
	var pauseTime = 500;
	var postTrialPauseTime = 500;
	var errorThresh = 15;
	var textX = 100;
	var textY = 100;
	var textTime = 1500;

	if (practice) {
		var nTry = 0;
	}
	// images
	var gaborUrls = [
		"http://i.imgur.com/cMbgmJl.jpg",
		"http://i.imgur.com/CP2sOBf.jpg",
		"http://i.imgur.com/qrRttYr.jpg",
		"http://i.imgur.com/GBqU92E.jpg",
		"http://i.imgur.com/EqduElq.jpg",
		"http://i.imgur.com/xIGp6hR.jpg",
		"http://i.imgur.com/gHwGe0t.jpg",
		"http://i.imgur.com/6VLnewI.jpg",
		"http://i.imgur.com/qIDSN3j.jpg",
		"http://i.imgur.com/7JDyP81.jpg",
		"http://i.imgur.com/1akBHGh.jpg",
		"http://i.imgur.com/YwzmmjT.jpg",
		"http://i.imgur.com/E4BSdy1.jpg",
		"http://i.imgur.com/mZNHh2q.jpg",
		"http://i.imgur.com/tLZYKzX.jpg",
		"http://i.imgur.com/9awmagD.jpg",
		"http://i.imgur.com/Nn5GmjK.jpg",
		"http://i.imgur.com/L51lxG6.jpg"];

	//try to load all the gabor images
	nGabor = gaborUrls.length;
	gaborA = new Array(nGabor);
	loadA = new Array(nGabor);
	for (var i = 0; i < nGabor; i ++) {
    	loadA[i] = false;
    	gaborA[i] = new Image();
    	gaborA[i].src=gaborUrls[i];
    	gaborA[i].onload = (function(i){return function(){loadA[i] = true}})(i);
    	//gaborA[i].onload = function(){loadA[i] = true};
	}

	//set canvas
	var canvas = document.getElementById('myCanvas');
	canvas.width = 731;
	canvas.height = 382;
	var ctx = canvas.getContext('2d');

	//prepare some variables
	var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
	var centerXPage = centerX + $("#myCanvas").offset().left;
	var centerYPage = centerY + $("#myCanvas").offset().top;
	var destX = stimulusX*canvas.width;
	var destY = stimulusY*canvas.height;
	var stimulus;
	var gabor;
	var regularCounter;

	//initialize the stimulus to a random angle
	stimulus = Math.random()*360-180;
	//initialize the counter
	regularCounter = regularCounterA[Math.floor(Math.random()*regularCounterA.length)];


	//set button in case user missed the patch
	if (practice){
		document.getElementById('yes_button').style.visibility = 'hidden';
	} else {
		document.getElementById('yes_button').style.visibility = 'visible';

	}

	function clickHandler(){
		document.getElementById('yes_button').removeEventListener("click", clickHandler);
		doOneTrial(trialStepA);

	  //drawGabor(destX, destY, stimulus, gabor)
	  //setTimeout(screenForWait, 1000);
	}

	//define the trial procedure
	trialStepA = [
		{
			action: function(){
				//hide cursor within canvas
				$("#myCanvas").css('cursor', 'none');
				screenForCross(destX, destY);},
			time: crossTime
		},
		{
			action: function(){showStimulus(destX, destY, stimulus);},
			time: displayTime
		},
		{
			action: function(){screenForPause();},
			time: pauseTime
		},
		{
			action: function(){
				//show the cursor
				$("#myCanvas").css('cursor', 'auto');
				//drawa the canvas for waiting for bring back the cursor
				screenForWait();
				//add listener to check whether the cursor is brought to center
				document.addEventListener("mousemove", proceedAfterMoveToCenter);
				//add listener to button click
				document.getElementById('yes_button').addEventListener("click", clickHandler)
			}
		}
	];

	var trialInd = 0;
	//start the first trial when all images are loaded
	checkLoading = setInterval(function(){
		if (loadA.every(function(element){return element;})) {
			clearInterval(checkLoading);
			doOneTrial(trialStepA);
		}
	}, 100);
	//doOneTrial(trialStepA);

	//functions for running the experiment--------------------
	function doOneTrial(trialStepA){
		step = 0;
		doSteps(trialStepA, step);
	}

	function doSteps(trialStepA, step){
		trialStepA[step].action();
		if (step<trialStepA.length-1) {
			setTimeout(
				function(){doSteps(trialStepA, step+1);},
				trialStepA[step].time);
		}
	}

	//event handlers
	//a listener that checks whether the cursor has gone back to center
	function proceedAfterMoveToCenter(event){
		cursorX = event.pageX;
		cursorY = event.pageY;
		//alert([cursorX-centerXPage, Math.pow(cursorY-centerYPage, 2), Math.pow(radius, 2)]);
		if(Math.pow(cursorX-centerXPage, 2) + Math.pow(cursorY-centerYPage, 2) < Math.pow(radius, 2)){
			//remove the center check listener
			document.removeEventListener("mousemove", proceedAfterMoveToCenter);
			//add listener to rotate the bar with cursor movement
			document.addEventListener("mousemove", rotateBar);
			//add listener to record response and advance to next page
			if (practice) {
				document.addEventListener("mousedown", practiceRespond);
			} else{
				document.addEventListener("mousedown", respond);
			}
		}
	}
	//a listener that rotates the bar with mouse movement
	function rotateBar(event){
		//calculate the angle according to cursor position
		cursorX = event.pageX;
		cursorY = event.pageY;
		angle = Math.atan2(cursorY-centerYPage, cursorX-centerXPage)/Math.PI*180;
		angle = angle + 90;
		angle = limitOrient(angle);
		//draw the canvas for screenForRespond
		screenForRespond(angle);
	}

	function practiceRespond(event){
		//remove event listeners
		document.removeEventListener("mousemove", rotateBar);
		document.removeEventListener("mousedown", practiceRespond);
		//hide the bar
		screenForPause();
		//prepare text feedback
		ctx.font = "bold 25px serif";
		//check response
		if(Math.abs(orientDiff(angle, stimulus)) > errorThresh){
			ctx.fillStyle = 'tomato';
			ctx.fillText("Not accurate enough. Please try again!", textX, textY);
			//repeat this trial
			setTimeout(function(){
				setTimeout(doOneTrial(trialStepA), postTrialPauseTime);
			}, textTime);
		} else{
			ctx.fillStyle = 'LawnGreen';
			ctx.fillText("Accurate enough! Going to next trial.", textX, textY);
			setTimeout(function(){
				//update the trial number to next trial
				trialInd += 1;
				if (trialInd<nTrial) {
					//set a new value to stimulus
					stimulus = Math.random()*360-180;
					setTimeout(doOneTrial(trialStepA), postTrialPauseTime);
				} else {
					finish();
				}
			}, textTime);
		}
	}

	//a listener that records the response and advances to next page
	function respond(event){
		//remove event listeners
		document.removeEventListener("mousemove", rotateBar);
		document.removeEventListener("mousedown", respond);
		//hide the bar
		screenForPause();

		//save data
		psiTurk.recordTrialData({
			'order': trialInd,
            'angle': angle});

		//update the trial number to next trial
		trialInd += 1;

		if (trialInd<nTrial) {
			//set a new value to stimulus
			// stimulus = Math.random()*360-180;
			updateStimulus();
			setTimeout(doOneTrial(trialStepA), postTrialPauseTime);
		} else {
			finish();
		}
	}

	function updateStimulus(){
		stimulus += direction*stepSize;
		if(regularCounter==0){
			stimulus += calculate_jump();
			//reset the counter
			regularCounter = regularCounterA[Math.floor(Math.random()*regularCounterA.length)];
		} else {
			regularCounter -= 1;
		}
	}

	function calculate_jump(){
		var jumpDirection = [-1, 1][Math.floor(Math.random() * 2)];
		console.log(jumpDirection)
		var jump = Math.random()*(maxJump-minJump)+minJump
		jump = jump * jumpDirection;
		return jump
	}

	//drawing functions----------------------
	function drawBackground(){
		ctx.fillStyle = "#808080";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	function drawCross(destX, destY){
		startX = destX - 0.5*radius;
		startY = destY - 0.5*radius;
		endX = destX + 0.5*radius;
		endY = destY + 0.5*radius;

		ctx.beginPath();
		ctx.lineWidth = crossWidth;
		ctx.moveTo(startX, destY);
		ctx.lineTo(endX, destY);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = crossWidth;
		ctx.moveTo(destX, startY);
		ctx.lineTo(destX, endY);
		ctx.closePath();
		ctx.stroke();
	}


	function drawRedCircle(){
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'red';
		ctx.fill();
	}

	function drawGreenCircle(){
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'green';
		ctx.fill();
	}

	function drawBar(angle){
		var anglePi = angle/180*Math.PI;
		vectorX = barLength*Math.sin(anglePi);
		vectorY = -barLength*Math.cos(anglePi);
		startX = centerX - 0.5*vectorX;
		startY = centerY - 0.5*vectorY;
		endX = centerX + 0.5*vectorX;
		endY = centerY + 0.5*vectorY;

		ctx.beginPath();
		ctx.lineWidth = barWidth;
		ctx.moveTo(startX, startY);
		ctx.lineTo(endX, endY);
		ctx.stroke();
	}

	function drawGabor(destX, destY, orientation, gabor){
		ctx.save();
		// Move registration point to the center of the canvas
		ctx.translate(destX, destY);
		// Rotate
		ctx.rotate(orientation/180*Math.PI);

        var destWidth = displaysize;
        var destHeight = displaysize;
       	ctx.drawImage(gabor, -0.5*displaysize, -0.5*displaysize, destWidth, destHeight);
		ctx.restore();
	}

	function limitOrient(angle){
		angle = angle % 180;
		if(angle>90)
			angle -= 180;
		else if(angle< -90)
			angle += 180;
		return angle;
	}

	//functions to prepare the screen for different periods-------------
	function screenForCross(destX, destY){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		//draw cross
		drawCross(destX, destY);
	}

	function showStimulus(destX, destY, stimulus){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		//randomly choose one gabor pattern
		gabor = gaborA[Math.floor(Math.random()*gaborA.length)];
		// draw gabor
		drawGabor(destX, destY, stimulus, gabor);
	}

	function screenForPause(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
	}

	//while waiting for bring the cursor back to the center
	function screenForWait(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		drawRedCircle();
	}

	function screenForRespond(angle){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		drawGreenCircle();
		drawBar(angle);
	}

	function orientDiff(a, b){
		diff = a-b;
		diff = diff % 180;
		if(diff>90)
			diff -= 180;
		else if(diff< -90)
			diff += 180;
		return(diff)
	}

};

function finishPractice(){
	psiTurk.showPage('before_formal.html');
	$('#next').click(function(){
		//direction is either 1 or -1
		direction = Math.floor(Math.random()*2)*2-1;
		currentview = new experiment(false, 10, finishRun1, direction);
	});
}

function finishRun1(){
	psiTurk.showPage('break.html');
	$('#next').click(function(){
		//use the opposite direction
		direction *= -1;
		currentview = new experiment(false, 10, finishRun2, direction);
	});
}

function finishRun2(){
	psiTurk.showPage('end.html');
	$("#next").click(function () {
		psiTurk.saveData({
			success: function(){
				psiTurk.computeBonus('compute_bonus', function() {
				    psiTurk.completeHIT(); // when finished saving compute bonus, the quit
				});
			},
			error: prompt_resubmit});
	});
	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};
}

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() {
    		currentview = new experiment(true, 3, finishPractice);
    	} // what you want to do when you are done with instructions
    );
});
