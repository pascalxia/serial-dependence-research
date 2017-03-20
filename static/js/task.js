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
	// "instructions/instruct-1.html",
	"instructions/thanksforpartisipation.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"instructions/instruct-1.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	// "instructions/instruct-1.html",
	// "instructions/instruct-2.html",
	// "instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];


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

var PracticeExperiment = function(practiceExperement, numOfResponces, secondTrial) {

	// variable to deferentiate practice, first, and second trial
	var secondTrial = secondTrial
	var numOfResponces = numOfResponces;
	var practiceExperement = practiceExperement;

	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');





	var tryQId = "QID19";
	var stimulusX = 0.25;
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
	var errorThresh = 20;
	var textX = 100;
	var textY = 100;
	var textTime = 1000;
	var tryNumber = 0;

	var successNumOfPractise = 0


	//set canvas
	var canvas = document.getElementById('myCanvas');
	// canvas.style.width = "731px"
	// canvas.style.height = "382px"

	canvas.width = 731;
	canvas.height = 382;
	var ctx = canvas.getContext('2d');

	//prepare some variables
	var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
	var centerXPage = centerX + $("#myCanvas").offset().left;
	var centerYPage = centerY + $("#myCanvas").offset().top;
	var destX = stimulusX*(canvas.width-displaysize*Math.sqrt(2))+displaysize*Math.sqrt(2)/2;
    var destY = stimulusY*(canvas.height-displaysize*Math.sqrt(2))+displaysize*Math.sqrt(2)/2;
	var stimulus = Math.random()*360-180;


	//draw a grey background first
	drawBackground();
	//hide cursor within canvas
	$("#myCanvas").css('cursor', 'none');

	startTrial();

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

	function drawArrow(destX, destY, angle){
		var anglePi = angle/180*Math.PI;
		var headAnglePi = headAngle/180*Math.PI;
		vectorX = barLength*Math.sin(anglePi);
		vectorY = -barLength*Math.cos(anglePi);
		startX = destX - 0.5*vectorX;
		startY = destY - 0.5*vectorY;
		endX = destX + 0.5*vectorX;
		endY = destY + 0.5*vectorY;

		ctx.beginPath();
		ctx.lineWidth = barWidth;
		ctx.moveTo(startX, startY);
		ctx.lineTo(endX, endY);

		ctx.moveTo(endX-headLen*Math.sin(anglePi-headAnglePi),endY+headLen*Math.cos(anglePi-headAnglePi));
		ctx.lineTo(endX, endY);
		ctx.lineTo(endX-headLen*Math.sin(anglePi+headAnglePi),endY+headLen*Math.cos(anglePi+headAnglePi));

		ctx.stroke();
	}

	function limitOrient(angle){
		angle = angle % 180;
		if(angle>90)
			angle -= 180;
		else if(angle< -90)
			angle += 180;
		return angle;
	}

	function showCross(destX, destY){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		//draw cross
		drawCross(destX, destY);
	}

	function showStimulus(destX, destY, stimulus){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		// draw arrow
		drawArrow(destX, destY, stimulus);
	}

	function pause(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
	}

	//while waiting for bring the cursor back to the center
	function wait(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		drawRedCircle();
	}

	function responding(angle){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		drawGreenCircle();
		drawBar(angle);
	}

	function startTrial(){
		//draw cross
		showCross(destX, destY);
		//after cross time
		setTimeout(function(){
			//draw the canvas for stimulus display
			showStimulus(destX, destY, stimulus);
			//after displayTime
			setTimeout(function(){
				//draw the canvas for pause
				pause();
				//after pauseTime
				setTimeout(function(){
					//show the cursor
					$("#myCanvas").css('cursor', 'auto');
					//drawa the canvas for waiting for bring back the cursor
					wait();
					//add listener to check whether the cursor is brought to center
					document.addEventListener("mousemove", isAtCenter);
				}, pauseTime);
			}, displayTime);
		}, crossTime);
	}

	//event handlers
	//a listener that checks whether the cursor has gone back to center
	function isAtCenter(event){
		cursorX = event.pageX;
		cursorY = event.pageY;
		//alert([cursorX-centerXPage, Math.pow(cursorY-centerYPage, 2), Math.pow(radius, 2)]);
		if(Math.pow(cursorX-centerXPage, 2) + Math.pow(cursorY-centerYPage, 2) < Math.pow(radius, 2)){
			//add listener to rotate the bar with cursor movement
			document.addEventListener("mousemove", rotateBar);
			//add listener to record response and advance to next page
			document.addEventListener("mousedown", respond);
			//remove the center check listener
			document.removeEventListener("mousemove", isAtCenter);
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
		//draw the canvas for responding
		responding(angle);
	}
	//a listener that records the response and advances to next page
	function respond(event){
		//remove event listeners
		document.removeEventListener("mousemove", rotateBar);
		document.removeEventListener("mousedown", respond);
		//hide the bar
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();

		/***********************
		* responce for practise *
		************************/
		if (practiceExperement){
			//update tryNumber
			tryNumber += 1;
			//check whether it is accurate enough
			ctx.font = "bold 25px serif";
			if(Math.abs(orientDiff(angle, stimulus)) > errorThresh){
				ctx.fillStyle = 'tomato';
				ctx.fillText("Not accurate enough. Please try again!", textX, textY);
				setTimeout(function(){
					pause();
					setTimeout(startTrial, pauseTime);
				}, textTime);
			} else{
				successNumOfPractise += 1

				if(successNumOfPractise == 2) {
					ctx.fillStyle = 'LawnGreen';
					ctx.fillText("Going to next trial.", textX, textY);
					setTimeout(function(){
						pause();
						setTimeout(psiTurk.showPage('instructions/instruct-1.html'), pauseTime);
					}, textTime);
				} else{
					//save the number of tries
					ctx.fillStyle = 'LawnGreen';
					ctx.fillText("Accurate enough! Try one more time.", textX, textY);
					setTimeout(function(){
						pause();
						setTimeout(startTrial, pauseTime);
					}, textTime);
				}

			}
		}
		/***********************
		* responce for trial *
		************************/
		else{
			//update the number of user's responces
			tryNumber += 1;

			if (tryNumber < numOfResponces){
				//save the number of tries
				psiTurk.recordUnstructuredData("tryNumber", tryNumber)
				setTimeout(function(){
					pause();
					setTimeout(startTrial, pauseTime);
				}, textTime);
			}else if(secondTrial && tryNumber==3){
				setTimeout(function(){
					pause();
					setTimeout(psiTurk.showPage('instructions/instruct-3.html'), pauseTime);
				}, textTime);
			}else{
				setTimeout(function(){
					pause();
					setTimeout(psiTurk.showPage('instructions/instruct-2.html'), pauseTime);
				}, textTime);
			}
			psiTurk.recordTrialData({'tryNumber':tryNumber,
                                     'angle':angle,
                                     }
                                   );
		}
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

	// // Register the response handler that is defined above to handle any
	// // key down events.
	// $("body").focus().keydown(response_handler);

	// // Start the test
	// next();

};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new PracticeExperiment(true, 0, 0); } // what you want to do when you are done with instructions
    );
});
