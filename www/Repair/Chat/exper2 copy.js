// TODO: saving data:  originally typed word, actually transmitted word, whether repair occured, second attempt at signal

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var sliderExperiment = false;  // if true, runs sound slider experiment.  If false, runs typed label experiment.  This is not fully implemented
// the variables dictionaryExperiment and learnOnlyExperiment are set in index.php
var OIRExperiment = true;   // whether this is part of the repair experiment (these participants may not be allowed to use repair)
// var allowRepairInThisExperiment = true; // set in index.php (whether users have the option of repairing)
var allowRepairInThisRound = true;
var noiseType = "bunched"; // "none", "bunched", "spread"
var noiseParams = [3,5,0.5]; // min, max noise characters, porb of noise occuring
var noiseChar = "#";

var noiseLevelThisRound = 0;

var stimOrder = [];  // keeps track of the order that stimuli were presented (including multiple turns within a round)
var noiseOrder = []; // keeps track of when and how much noise is applied to each stimulus.



// var click_to_continue_text = "Continue";
// var wait_for_partner_text = "Waiting for partner ...";
// var end_of_experiment_text = "This is the end of the experiment!";
// var signal_too_short_text = "Signal is too short! Try again!";
// var experiment_intro_text = "Press to start experiment";


var click_to_continue_text = "Continue";
var wait_for_partner_text = "Waiting for partner ...";
var end_of_experiment_text = "You have finished the test!";
var signal_too_short_text = "Dat was iets te kort. Probeer nog eens!";
var experiment_intro_text = "Click here to begin"; 
var training_text = "Pay attention!";
var break_text = "Take a rest!";

if(learnOnlyExperiment){
	wait_for_partner_text = "";
}

var testing_prompt = "Please type a word that will help the other player pick the correct picture from the set of six randomly picked options, then hit enter.";
var testing_prompt_learnOnly = "Please type the word that you think is associated with the picture, then hit enter";
var dictionary_instruction_text = "<b>Notebook</b> <br />Click to edit";
var notebook_prompt = "Add the word to your notebook?";

var prompt_speaker = "Please type a word that will help the other player pick the correct shape from the set of six randomly generated options.";

var prompt_speaker_repair = "The other player did not understand!!  <br /> <br /> Please type a word that will help the other player pick the correct picture from the set of six randomly picked options, then hit enter.";

var recieveSpeakersWord_text = "The other player has typed the word <br /><br /><br /><br />Click the shape that you think they are referring to";

var correctImage = "images/tick.png"
var incorrectImage = "images/cross.png"

var cont_visible_after_choice = true;

// page to send participant to after the experiment has finished
var debrief_URL = "http://correlation-machine.com/Repair/Debrief_Page.html";

var minimumRecordLength = 2;
var maxStringLength = 50;

var numberOfContextItems = 6;

var roleSpeaker = [name,toUser].sort()[0]==name;
console.log("RoleSpeaker");
console.log(roleSpeaker); 
var currentTarget = 0; // index of ims
var currentSentWord = "";
var currentTrainingStimName = "";
var stimArray = [];  // array of numbers indexing ims
//var ims = ["images/SpikyRed.png","images/SpikyGreen.png","images/SpikyBlue.png","images/SpikyRedThick.png","images/SpikyGreenThick.png","images/SpikyBlueThick.png","images/RoundRed.png","images/RoundGreen.png","images/RoundBlue.png","images/RoundRedThick.png","images/RoundGreenThick.png","images/RoundBlueThick.png"];
var ims = ["images/iconic/B01_mier_A.png","images/iconic/B02_mier_B.png","images/iconic/B03_spin_A.png","images/iconic/B04_spin_B.png","images/iconic/B05_tor_A.png","images/iconic/B06_tor_B.png","images/iconic/B07_krokodil_A.png","images/iconic/B08_krokodil_B.png","images/iconic/B09_slang_A.png","images/iconic/B10_slang_B.png","images/iconic/B11_walvis_A.png","images/iconic/B12_walvis_B.png"];
var stimLabels = ['a','b','c','d','e','f','g','h','i','j','k','l'];

var practice_ims = ["images/Test1.jpg","images/Test2.jpg","images/Test3.jpeg","images/Test4.jpg"];
var practiceLabels = ["broc","pep","ber","ap","","","","","","","","","","","",""];
var lastRoundWasPractice = true;  // set to false at the first real stimulus test

var currentDictionary = [];
var tmpDictText = "";

var interactionString = ""; //a string which saves the interaction in a multi-sequence round

var lastUsedStimLabels = Array();  // this is a copy of stimLabels which is updated with each test round to reflect the last signal used for a given meaning.

var listenersResponse = 0;
var speakersWord = "";
var started = false;
var writtenPartDetails = false;

var rounds;  // training, stimulus, partBreak, message
var TRAINING = 0;
var STIMULUS = 1;
var PARTBREAK = 2;
var MESSAGE = 3;
var ROLESWITCH = 4;
var PRACTICEIND = 5;
var NOISEIND = 6;

var numberOfTestRounds = 0;

var currentlyTraining = false;

var numberCompletedTraining = 0;

var numReadyToStart = 0;

var partBreakTime = 0;
var waitText = "";
var myTimerVar;

var maxTimerTime = 100
var timerTime = maxTimerTime;
var timerTimeInterval = 0;
var firstListenerEndPlayback = true;

var dictionaryOrderIsRandom = true;
var dictOrder = getStartingDictOrder();


var messageSepCharacter1 = "^";
var messageSepCharacter2 = "$";
var messageSepCharacter3 = ":";

//var experiment_filename = "";
//var language_filename  = "";

document.getElementById("ScorePanel").innerHTML = "Score: 0";


var score = 0;

// SW
var sentWhistle = "";


//loadData();  

if(roleSpeaker){

	document.getElementById("SynchButton").innerHTML = " Press to Synchronise<br />"+experiment_filename;
	document.getElementById("SynchButton").onclick = function (){synchExper();};
}
else{
	document.getElementById("SynchButton").innerHTML = "Waiting for Part 1 to synchronise";

}

var currentRound = 0;

// optinally start from a round greater than 0
//var currentRoundTmp = prompt("Start from round ...","0");
//currentRound = parseInt(currentRoundTmp);

// for some reason, if we hide the slideWhistle immediately, it doesn't work
// so, call after a delay
if(sliderExperiment){
setTimeout(function(){document.getElementById("SlideWhistle").style.display = 'none';},1000);
}

document.getElementById("sendButtonDiv").style.display = 'none';
document.getElementById("retryButton").style.display = 'none';
document.getElementById("PlayPartnerSignal").style.display = 'none';
document.getElementById("typedInput").style.display = 'none';
document.getElementById("dictionaryPanel").style.display = 'none';
document.getElementById("AddToNotebook").style.display = 'none';
document.getElementById("RepairButton").style.display = 'none';

document.getElementById("StartButton").innerHTML =  experiment_intro_text;

var animateSendButtonCount = 0;

var loadedExperFromSpeaker = false;  // used for keeping track of whether we'e shared the experiment details

var bufferPadding = Array();

for(var i=0;i<10;++i){
	bufferPadding.push(0);
}

function startExperiment(){
	if(!started){

		started = true;
		waitingForListenerClick = false;
		instructionPhase = false;
		document.getElementById("StartButton").style.display = 'none';
		document.getElementById("SlideWhistle").style.display = 'none';
		if(sliderExperiment){
			stopSlideWhistle(); // Instructions will have started slide whistle
		}
		document.getElementById("cont").style.display = 'none';
		if(!learnOnlyExperiment ){
			// score panel not visibel in learn only condition
			document.getElementById("ScorePanel").style.display = 'inline';
		}
		else{
			document.getElementById("ScorePanel").style.display = 'none';
		}
		document.getElementById("instructions").style.display = 'none';
		document.getElementById("NextInst").style.display = 'none';
		document.getElementById("PrevInst").style.display = 'none';
		
		document.getElementById("dictionaryPanel").style.display = 'none';
		if(dictionaryExperiment){
			document.getElementById("dictionaryPanel").style.display = 'inline';
			document.getElementById("instructions").style.display = 'inline';
			document.getElementById("instructions").innerHTML = dictionary_instruction_text;
		}
		
		if(!writtenPartDetails){
			writeParticipantDetails();
			writtenPartDetails = true;
		}
		

		
		setBackground("");
		clearScreen();
		document.getElementById("InfoPanel").innerHTML = wait_for_partner_text;
		setInnerHTML("InfoPanel",wait_for_partner_text);
		setBackground("images/backgrounds/SW_Listener1.png");
		chat.send("READYTOSTART", name, toUser);	// picked up by readyToStart();
		
		// TODO set infotext to "waiting"
		
		// link button for playing partner's signal
//		document.getElementById("PlayPartnerSignal").addEventListener("touchend",playPartnerSignal());
//		document.getElementById("PlayPartnerSignal").addEventListener("onclick",playPartnerSignal());
		
	}
}


function setInnerHTML(stimWindow,text){
	try{document.getElementById("stimWindow").textContent = text;} catch(err){}
}

function setStim(stimWindow,im){
// im is number that indexes ims

// TODO
// iPhone browser displays 'empty image' box when there's no image, so change inner HTML or display property
	
	if(im=="none"){
		document.getElementById(stimWindow).src = "";	
		document.getElementById(stimWindow).style.display = 'none';
	}
	else{
			document.getElementById(stimWindow).style.display = 'inLine';
		if(im<0){
			// show practice image
			document.getElementById(stimWindow).src = practice_ims[-im-1];
		}
		else{
			document.getElementById(stimWindow).src = ims[im];
			
			try {
			
			//document.getElementById(stimWindow).setAttributeNS('xlink:href',ims[im]);
			backg = $('#leftStimTestImage');
			backg.attr("xlink:href", ims[im]);
			}catch(err){}
		}
		// show stim after a pause for loading
		//window.setTimeout(function(){document.getElementById(stimWindow).style.display = 'inLine';},100);
	}
}

function setBackground (bg) {
	// TODO - set backgrounds off properly
	//document.getElementById("backgroundImage").src = bg;

}

// function shuffle(a, b)
// {
//    return Math.random() > 0.5 ? -1 : 1;
// }

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}


function trainingRound(im,stimName){
	console.log("Training Round");
	
	currentlyTraining = true;	
	
	currentTrainingStimName = stimName;

	
	//setBackground("images/backgrounds/Training.jpg");
	// SW
	setBackground("images/backgrounds/SW_Training.png");
	
	// will need to change to accept number
	currentTarget = im;
	
	document.getElementById("typedInput").style.display = 'none';
	document.getElementById("ScorePanel").style.display = 'none';
	document.getElementById("SlideWhistle").style.display = 'none';
	document.getElementById("cont").style.display = 'none';
	
	document.getElementById("InfoPanel").style.display = 'inline';
	document.getElementById("InfoPanel").innerHTML = training_text;
	setInnerHTML("InfoPanel",wait_for_partner_text);
	
	if(!sliderExperiment){
		document.getElementById("middleStim").style.display = 'inline';
	}
	document.getElementById("leftStim").style.display = 'inline';
	document.getElementById("leftStimImage").style.display = 'inline';
	
	// display stimulus
	setStim("leftStimImage",currentTarget);
	// display label
	
	if(sliderExperiment){
		window.setTimeout(function(){
		// load meaing
		startSlideWhistle();
		recordBuffer = stringToRecordBuffer(currentTrainingStimName);
		startPlayback();
		},1000);
		// after playback has ended, exper_EndPlayback(); is called -> training_PlaybackEnds();
	}
 	else{
 		window.setTimeout(function(){
 			training_showWord();
 		},1000);	
 	}

	
	if(! sliderExperiment){
		// clear image and message
		window.setTimeout(function(){
			setStim("leftStim","none"); ///xxx
			document.getElementById("middleStim").innerHTML = "";
			},6000);	
		
		// next round
		window.setTimeout(function(){nextRound();},9000);
	}
}

function training_showWord(){
	if(currentTarget<0){
	// practice words
		var practiceWord = practiceLabels[-currentTarget-1];
		document.getElementById("middleStim").innerHTML = practiceWord ; 
	}
	else{
		document.getElementById("middleStim").innerHTML = currentTrainingStimName; 
	}
}

function training_PlaybackEnds(){
	console.log("training_PlaybackEnds")
	// called after playback has finished
		setTimeout(function(){
			if(sliderExperiment){
				stopSlideWhistle();
				}
			setStim("leftStim","none");			
		},1000);

		checkMoveNextRound();		
		chat.send("NEXTROUND", name, toUser);

}


function checkMoveNextRound(){
	numberCompletedTraining += 1;
	if(numberCompletedTraining >=2){
		setTimeout("nextRound();",3000); // want this on different thread
	}
}

function endExperiment(){
		//document.getElementById("StartButton").style.display = 'inLine';
		//document.getElementById("StartButton").innerHTML = end_of_experiment_text;
		

		
		// write language used
		// only one participant needs to do this
		if(roleSpeaker){
			writeLanguageFile(ims,lastUsedStimLabels);
		}
		
		if(name=="Part1" && OIRExperiment && allowRepairInThisExperiment){
			writeStimOrderFile();
		}
		
		experimentOver= true; // set in index.php
		
		// send to debrief page with chain, generation and score
		setTimeout("window.location.href = debrief_URL + '?score=' + score.toString() + '&chain='+chain_num.toString() + '&generation='+experiment_filename + '&player='+name;",2000);
}

function nextRound(){
	console.log("NextRound");
	
	if(rounds==undefined){
		// a bit dodgy - if we have no rounds, wait a bit, then try loading again.
		// note that if the call to process.php fails, loadData_exper() gets called again
		// in failLoadData.  Maybe take the call out of here?
		alert("No Rounds loaded: "+experiment_filename);
//		loadData_exper();
//		setInterval("nextRound()",2000);
	}
	else{
		console.log(rounds[currentRound]);  // 
		clearScreen();
		dehighlighAllImages();
		if(sliderExperiment){
			stopSlideWhistle();
		}
		currentlyTraining = false;	
		numberCompletedTraining = 0;
		
		interactionString = "";	
		
		if(currentRound == rounds.length){
			// end of experiment
			endExperiment();
		}
		else{
			// load the dictionary for the first real trial
			if(dictionaryExperiment){
				if(rounds[currentRound][PRACTICEIND]=="1" || (lastRoundWasPractice && rounds[currentRound][PARTBREAK]>0)){
					practiceDictLoad();
				}
				else{
					// first time we load the real dictionary
					if(lastRoundWasPractice){
						score = 0; // reset score
						numberOfTestRounds = 0; // reset number of test rounds
						dictLoad();
						lastRoundWasPractice = false;
					}
				}
				
			}
		
		
			if(rounds[currentRound][PARTBREAK] > 0){
				// do break
				//doBreak(rounds[currentRound][PARTBREAK],rounds[currentRound][MESSAGE]);
				// SW adjustment:
				if(rounds[currentRound][MESSAGE]=="<br />Prepare for the real experiment!"){
					score = 0;
					document.getElementById("ScorePanel").innerHTML = "Score: "+score +"/"+numberOfTestRounds.toString();
				}
				doBreak(rounds[currentRound][PARTBREAK],rounds[currentRound][MESSAGE]);
				
				
			}
			else{
				if(rounds[currentRound][TRAINING]=="1"){
				// TRAINING
				if(dictionaryExperiment){
					// no training in dictionary experiment
					window.setTimeout(function(){nextRound();},50);
					}
				else{
					trainingRound(rounds[currentRound][STIMULUS],stimLabels[rounds[currentRound][STIMULUS]]);
				}
				}
				else{
				// testing
					// switch role
					if(rounds[currentRound][ROLESWITCH]=="1"){
						roleSpeaker = ! roleSpeaker;
					}
					testingRound(rounds[currentRound][STIMULUS]);
				}
			}
			currentRound += 1;
		}
	}
}


function testingRound(target){
	
	numberOfTestRounds += 1;
	
	currentTarget = target;
	
	if(!learnOnlyExperiment ){
		document.getElementById("ScorePanel").style.display = 'inline';
	}
	console.log("TestingRound");
	
	if(learnOnlyExperiment){
		// in a learning only experiment, each participant is always the speaker
		roleSpeaker = true;
	}
	if(OIRExperiment && ! allowRepairInThisExperiment){
		if(rounds[currentRound].length > NOISEIND){
			noiseLevelThisRound = rounds[currentRound][NOISEIND];
		} else{
			noiseLevelThisRound = 0;
		}
	}
	
	if(allowRepairInThisExperiment){
		allowRepairInThisRound = true;
	}
	else{
		allowRepairInThisRound = false;
	}
	
	// part1 keeps track of stimulus order
	if(name=="Part1" && OIRExperiment && allowRepairInThisExperiment){
		stimOrder.push(target.toString());
	}
	
	if(roleSpeaker){
		testingSpeaker1();
	}
	else{
		waitingForMessage = true;
		//setBackground("images/backgrounds/ListenerPresent.png");
		// SW
		setBackground("images/backgrounds/SW_Listener1.png");
		document.getElementById("typedInput").style.display = 'none';
		document.getElementById("SlideWhistle").style.display = 'none'; //make invisible
		document.getElementById("sendButtonDiv").style.display = 'none';
		document.getElementById("retryButton").style.display = 'none';		
		document.getElementById("PlayPartnerSignal").style.display = 'none';
		document.getElementById("cont").style.display = 'none';
		wait();
	}

}

function wait(){
// TODO display waiting text

	document.getElementById("InfoPanel").innerHTML = wait_for_partner_text;
		setInnerHTML("InfoPanel",wait_for_partner_text);
}


function testingSpeaker1(){

	if(sliderExperiment){
		setBackground("images/backgrounds/SW_SpeakerSpeakB.png");
		
		// SW
		document.getElementById("SlideWhistle").style.display = 'inline'; //make visible

		startSlideWhistle();
		setTimeout('document.getElementById("sendButtonDiv").style.display = "inline"',2000);
		document.getElementById("retryButton").style.display = 'inline';
		document.getElementById("PlayPartnerSignal").style.display = 'none';
	}
	if(sliderExperiment){
		document.getElementById("cont").style.display = 'none';
	}
	else{
		if(!learnOnlyExperiment){	
			// context is not visible in learn only experiment
			document.getElementById("cont").style.display = 'inline';
		}
		

		
	}
	document.getElementById("typedInput").style.display = 'inline';
	document.getElementById("sendie").focus();
	
	// set prompts
	if(learnOnlyExperiment){
		document.getElementById("InfoPanel").innerHTML = testing_prompt_learnOnly;
			setInnerHTML("InfoPanel",testing_prompt_learnOnly);
		}
	else{
		document.getElementById("InfoPanel").innerHTML = testing_prompt;
		setInnerHTML("InfoPanel",testing_prompt);
	}
	
	// set array
	
	var imsIndex = [];
	for(var i=0; i < ims.length; ++i){
		imsIndex.push(i);
	}

//	imsIndex = imsIndex.sort(shuffle);
	shuffle(imsIndex);
	stimArray = imsIndex.slice(0,numberOfContextItems);

	if(!containsObject(currentTarget,stimArray)){
		stimArray = stimArray.slice(0,numberOfContextItems-1);
		stimArray.push(currentTarget);
	}
	//stimArray= stimArray.sort(shuffle);
	shuffle(stimArray);

	
	if(currentTarget<0){
		// practice round
		stimArray = [-1,-2,"none",-3,-4,"none"];
	}

	

	if(cont_visible_after_choice){
		// show speaker the context
		showContext();
	}
	// TODO hide unwanted elements
	// TODO make elements visible
	
	waitingForInput = true;
	console.log("CURRENT TARGET");
	console.log(currentTarget);
	setStim("leftStimTestImage",currentTarget);
	showMe("leftStimTest");
	// SW
	
	// start recording
	// this means that there's no practicing!
	if(sliderExperiment){
		startRecord();
		startTimer();
	}
	
}


function listenerRecieveMessage(m){
		// listener receives message from speaker
		
			//setBackground("images/backgrounds/ListenerChoose.png");
			if(sliderExperiment){
				setBackground("images/backgrounds/SW_Listener2.png");
				document.getElementById("playPartnerSignalButton").src = "images/backgrounds/PlayButton.png";	
			}
			waitingForMessage = false;
			
			// the signal may be composed of two elements - what was typed and what was 'sent' (typed + possible noise)
			// in the order sent + messageSepCharacter3 + typed
			var signalPart = m.substring(0,m.indexOf(messageSepCharacter1));
			signalPart = signalPart.split(messageSepCharacter3);
			var sentWord = signalPart[0];
			var typedWord = sentWord;
			if(sentWord.length >1){
				var typedWord = signalPart[1];
			}			
			currentSentWord = sentWord;
			
			currentTarget = parseInt(m.substring(m.indexOf(messageSepCharacter1)+1,m.indexOf(messageSepCharacter2)));
			var sentStims = m.substring(m.indexOf(messageSepCharacter2)+1).split("_");
			console.log(sentWord);
			console.log(sentStims);
			console.log(currentTarget);		
			
			// get stim array from speaker's message
			stimArray = [];
			for(var i=0; i < sentStims.length;++i){
				stimArray.push(parseInt(sentStims[i]));
			}
			
			// shuffle stim array
			shuffle(stimArray);//xxx
			
			if(currentTarget<0){
				// practice round
				stimArray = [-1,-2,"none",-3,-4,"none"];
			}
			
			console.log(stimArray);
	
			// show target word
			showSpeakerWord(sentWord);
			
			console.log("Recieve - 1");
			
			if(sliderExperiment){
				// SW
				// show play button			
				document.getElementById("PlayPartnerSignal").style.display = 'inline';
				console.log("Recieve - 2");
				// set the record buffer in soundSlider.js
				//recordBuffer = stringToRecordBuffer(sentWord);
				// for playback, put padding of silence around recording
				recordBuffer = bufferPadding.concat(stringToRecordBuffer(sentWord),bufferPadding);
			}
			
			// update last used stim
			// map to actual target
			// save word that was typed, rather than what was recieved
			updateLastUsedStimLabels(currentTarget,typedWord);

			// show the context
			showContext();
			
			if(allowRepairInThisRound){
				document.getElementById("RepairButton").style.display = 'inline';
			}
			
			firstListenerEndPlayback = true;
			
			waitingForListenerClick = true;

}

function initiateRepair(){
	// user has clicked on repairButton
	if(allowRepairInThisRound & waitingForListenerClick){
		// only one repair allowed
		allowRepairInThisRound = false;
	
		// keep track of re-presentation of same target
		if(name=="Part1" && OIRExperiment && allowRepairInThisExperiment){
			stimOrder.push(currentTarget.toString());
		}

		// hide button
		document.getElementById("RepairButton").style.display = 'none';

		// send a signal to the speaker
		chat.send("???", name, toUser);

		waitingForMessage = true;
		// put message for listener
		wait();

	}
}

function speakerRespondsToRepair(m){
	//testingSpeaker1(rounds[currentRound-1][STIMULUS]); //TODO: check this is the right round.
	// we can't call testingSpeaker1 directly, because it resets the context.
	
	// show message that repair has been initiated
	document.getElementById("InfoPanel").innerHTML = 	prompt_speaker_repair;	
	setInnerHTML("InfoPanel",prompt_speaker_repair);
	
	if(cont_visible_after_choice){
		// show speaker the context
		showContext();
		document.getElementById("cont").style.display = 'inline';
	}
	
	// show typing box
	document.getElementById("typedInput").style.display = 'inline';
	document.getElementById("sendie").focus();
	
	
	// allow input 
	waitingForInput = true;
	console.log("CURRENT TARGET");
	console.log(currentTarget);
	setStim("leftStimTestImage",currentTarget);
	showMe("leftStimTest");
	
	// keep track of re-presentation of same target
	if(name=="Part1"){
		stimOrder.push(currentTarget.toString());
	}	

	
}

function recieveMessage(m){
	console.log("recieveMessage");
	console.log(m);
	
	document.getElementById("InfoPanel").innerHTML = "";
	setInnerHTML("InfoPanel","");
		if(roleSpeaker){
		
			interactionString += "RESP="+m+";";
			// feedback from listener
			if(isNaN(m)){
				// listener has initiated repair
				speakerRespondsToRepair(m);
				}
			else {
				listenersResponse = parseInt(m);

				// save data
				 saveData();
				 
				dofeedback(listenersResponse);
			}
		}
		else{
			listenerRecieveMessage(m);			
		}
	
}

function recieveExperDetails(mss){
	recieveData(mss,"exper");
}

function showContext(){
			// make array
			for(var i=0;i< stimArray.length;++i){
				setStim("cont"+(i+1),stimArray[i]);
				}
			// wait for a bit so that images load
			if(!learnOnlyExperiment){	
				setTimeout(function(){document.getElementById("cont").style.display = 'inline';},500);
			}
}

function updateLastUsedStimLabels(targetX,wordX){
	lastUsedStimLabels[targetX] = wordX;
}

function readyToStart(){
	console.log("READY TO START");
	numReadyToStart += 1;
	console.log(numReadyToStart);
	
	if(numReadyToStart ==2 || learnOnlyExperiment){
		// TODO set infotext to emtpy
		
		numReadyToStart = 0;
		nextRound();
	}
}

function clearScreen(){
		for(var i=0;i< numberOfContextItems;++i){
			setStim("cont"+(i+1),"none");
			}
		setStim("rightStimTestImage","none");
		setStim("leftStimTestImage","none");
		document.getElementById("middleStimTest").innerHTML = "";
		document.getElementById("InfoPanel").innerHTML = "";
		setInnerHTML("InfoPanel","");
		document.getElementById("feedbackPanel").style.display = 'none';
		if(sliderExperiment){
			stopTimer();
		}
		document.getElementById("AddToNotebook").style.display = 'none';
		document.getElementById("RepairButton").style.display = 'none';
}


function dofeedback(m){
	
	hideMe("RepairButton");

	if(learnOnlyExperiment){
		// no feedback in the learn only condition
		window.setTimeout('chat.send("READYTOSTART", name, toUser);',50);
	}
	else{
		console.log("doFeedback");
	
		document.getElementById("PlayPartnerSignal").style.display = 'none';
		if(sliderExperiment){
			stopTimer();
		}
		
	

			// highlight correct options
// 			if(roleSpeaker){
// 				var imx = stimArray.indexOf(listenersResponse) +1
// 				highlightImage("cont"+imx.toString());
// 			}
// 			else{
// 				var imx = stimArray.indexOf(currentTarget) +1
// 				highlightImage("cont"+imx.toString());
// 			}


			hideMe("leftStimTest");

			if(roleSpeaker){
				
			
	//			setStim("rightStimTestImage",listenersResponse);		
//				setStim("leftStimTestImage",currentTarget);	
				
				setStim("feedbackYouChoseImage",currentTarget);
				setStim("feedbackTheyChoseImage",listenersResponse);
				
				document.getElementById("feedbackYouChoseText").innerHTML = "Your target:"
				document.getElementById("feedbackTheyChoseText").innerHTML = "Your partner chose:"
				
			}
			else{
				//setStim("rightStimTestImage",currentTarget);
//				setStim("leftStimTestImage",listenersResponse);

				setStim("feedbackYouChoseImage",listenersResponse);
				setStim("feedbackTheyChoseImage",currentTarget);
				
				document.getElementById("feedbackYouChoseText").innerHTML = "You chose:"
				document.getElementById("feedbackTheyChoseText").innerHTML = "Your partner's target:"


			}
		
		
	
	
	
		if(listenersResponse == currentTarget){
			// good feedback
			document.getElementById("feedbackPanelImage").src = correctImage;
			score += 1;
		}
		else{
			//bad feedback
			document.getElementById("feedbackPanelImage").src = incorrectImage;
			
		}
		
		document.getElementById("feedbackPanel").style.display = 'inline';
		
		document.getElementById("ScorePanel").innerHTML = "Score: "+score +"/"+numberOfTestRounds.toString();
		
		// the guesser gets feedback immediately locally, while the speaker
		// must wait for the guesser's message.  This can cause problems when the
		// guesser becomes the speaker if they send their signal very quickly
		// therefore, delay guesser by a bit more than the speaker.
	// 	if(roleSpeaker){
	// 		window.setTimeout(function(){nextRound();},3000);
	// 	}
	// 	else{
	// 		window.setTimeout(function(){nextRound();},5000);
	// 	}
		
		// instead of calling nextRound(), we just use the 'readyToStart' funcitonality
		// both participants have to check in before moving on.
		if(!dictionaryExperiment || currentTarget<0){
			window.setTimeout('chat.send("READYTOSTART", name, toUser);',3000);
		}
		else{
		// show notebook div, which contains buttons that will trigger addToNotebook, which does the line above
			showAddToNotebook();
			
		}
	}
	
}

function showAddToNotebook(){
	// make sure addtonotebook is on top

	document.getElementById("InfoPanel").innerHTML = notebook_prompt;
	document.getElementById("AddToNotebook").style.zIndex="2";
	document.getElementById("sendie").style.zIndex="1";
	// show addtonotebook
	document.getElementById("AddToNotebook").style.display = 'inline';
}

function addToNotebook(addTo){
	// launched when add to notebook buttons are pressed
	document.getElementById("AddToNotebook").style.display = 'none';
	// put sendie back on top
	document.getElementById("AddToNotebook").style.zIndex="1";
	document.getElementById("sendie").style.zIndex="2";
	if(addTo){
		currentDictionary[currentTarget] = currentSentWord;
		updateDictionary();
	}
	window.setTimeout('chat.send("READYTOSTART", name, toUser);',50);
	document.getElementById("InfoPanel").innerHTML = wait_for_partner_text;
	
}


function showSpeakerWord(sentWord){
	if(!sliderExperiment){
		document.getElementById("middleStimTest").innerHTML = sentWord;
		document.getElementById("middleStimTest").style.display = 'inline';
		document.getElementById("InfoPanel").innerHTML = recieveSpeakersWord_text;
		setInnerHTML("InfoPanel",recieveSpeakersWord_text);
	}
	
	}

function doBreak(t,m){
	started = true;
	partBreakTimer = t;
	waitText = "";

	document.getElementById("StartButton").style.display = 'inLine';
	document.getElementById("StartButton").innerHTML = waitText + "<br /> "+ partBreakTimer ;
	
	document.getElementById("InfoPanel").style.display = 'inLine';
	document.getElementById("InfoPanel").innerHTML = break_text + m;
	setInnerHTML("InfoPanel",break_text + m);
	
	myTimerVar=setInterval(function(){myTimer()},1000);
	
}

function myTimer(){
	partBreakTimer -= 1;
	if(partBreakTimer < 0){
		clearInterval(myTimerVar);
		document.getElementById("StartButton").innerHTML = click_to_continue_text;
		started = false;

	}
	else{
		document.getElementById("StartButton").innerHTML = waitText + "<br /> "+ partBreakTimer ;	
	}
}

function addNoise(text){

	var doNotApplyNoise = Math.random()>noiseParams[2];
	var minNoise = noiseParams[0];
	var maxNoise = noiseParams[1];
	var l = text.length;
	if(maxNoise>l){ maxNoise = l;}
	if(minNoise>l){ minNoise = l;}
	var numNoiseChars = getRandomInt(minNoise,maxNoise);
	console.log("ADDNOISE");
	// if it's an OIR experiment and if repair is not allowed
	if(OIRExperiment & (!allowRepairInThisExperiment) ){
		// set the noise according to the mached experiment settings
		numNoiseChars = noiseLevelThisRound;
		console.log(noiseLevelThisRound);
		if(numNoiseChars > 0){
			doNotApplyNoise = false;
			if(numNoiseChars >l){numNoiseChars=l;}
		}
	}

	if(doNotApplyNoise){
		// with a certain probability, don't apply noise at all
		return(text);
	}

	switch(noiseType) {
		case "bunched":
			
			startAt = getRandomInt(0,l-numNoiseChars);
			
			outText = "";
			for(var i =0; i<l;++i){
				if(i>=startAt & (i<(startAt+numNoiseChars))){
					outText += noiseChar;
				}
				else{
					outText += text[i];
				}
			}
			
			return(outText);
			break;
		case "spread":
		
			locs = [];
			for(var i=0;i<l;++i){
				locs.push(i);
			}
			shuffle(locs);
			locs = locs.slice(0,numNoiseChars);
			
			outText = "";
			for(var i =0; i<l;++i){
				if(locs.indexOf(i)>=0){
					outText += noiseChar;
				}
				else{
					outText += text[i];
				}
			}
		
			return(text);
			break;
		default:
			return(text);
	} 

}

function sendSpeakerMessage(text){
	console.log("sendSpeakerMessage");
	console.log(stimArray);
	console.log(text);
	
	speakersWord = text; // what was typed
	currentSentWord = addNoise(text);
	
	var amountOfNoise = currentSentWord.split(noiseChar).length-1;
	noiseOrder.push(amountOfNoise);
	
	
	interactionString += "TYPED="+speakersWord+";"+"SENT="+currentSentWord+";";
	// for the string we send, add the clean version of the signal, too:
	currentSentWord = currentSentWord + messageSepCharacter3 + speakersWord;
	console.log(currentSentWord);
	

	
//	document.getElementById("typedInput").style.display = 'none';
	// SW
	document.getElementById("SlideWhistle").style.display = 'none';
	if(sliderExperiment){
		stopSlideWhistle();
	}
	document.getElementById("sendButtonDiv").style.display = 'none';
	document.getElementById("retryButton").style.display = 'none';
	document.getElementById("PlayPartnerSignal").style.display = 'none';
	
	
//	setBackground("images/backgrounds/speakerSpeak.png");
	// SW
	setBackground("images/backgrounds/SW_SpeakerWait.png");
//	document.getElementById("middleStimTest").innerHTML = speakersWord;
	

	// update last used stim
	// map to actual target
	// also done on listener's side
	// update to what was typed
	updateLastUsedStimLabels(currentTarget,speakersWord);
	
	if(learnOnlyExperiment){
		// if it's only a learning experiment,
		// then skip straight to receiving message
		setTimeout("recieveMessage("+currentTarget.toString()+");",1000)
	}
	else{
		document.getElementById("InfoPanel").innerHTML = wait_for_partner_text;	
			setInnerHTML("InfoPanel",wait_for_partner_text);
		// send message
		text2 = currentSentWord + messageSepCharacter1 + currentTarget+ messageSepCharacter2 + stimArray.join("_");  // sep character used to be '#'
		chat.send(text2, name, toUser);	
		if(sliderExperiment){
			stopTimer();
		}
		waitingForMessage = true;
	}
}

function listenerClick(x){
	// incoming directly from index.php definitions
	console.log("Listener click");
	console.log(x);	
	
	x = parseInt(x);
	
	if(instructionPhase){
		exampleChoice = x;
		sceneCounter += 1;
		changeScene();
	}
	else{
		if(waitingForListenerClick){
	
				// send choice to speaker
				chat.send(stimArray[x],name,toUser);
				waitingForListenerClick = false;
				// remove all images
				if(!cont_visible_after_choice){
					removeImages();
				}	
			
			listenersResponse = stimArray[x];
			//setStim("leftStimTestImage",stimArray[x]);
		
			
			dofeedback(listenersResponse);
		
		}
	}
}

function removeImages(){
	// yyy
	for(var i=0;i< numberOfContextItems;++i){
		//if(i != x){
			setStim("cont"+(i+1),"none");
		//}
	}
}

function saveData(){
	// save data after every round  (speaker always saves the data)
	console.log("Save data");

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	var hh = today.getHours().toString();
	var minmin = today.getMinutes().toString();
	var ss = today.getSeconds().toString();
	if(hh.length==1){
		hh = "0"+hh;
	}
	if(minmin.length==1){
		minmin = "0"+minmin;
	}
	if(ss.length==1){
		ss = "0"+ss;
	}
	var timeX =  mm+'_'+dd+'_'+yyyy+'_'+hh+minmin+ss;
	
	// make dictionary string
	var dStr = "";
	for(var i=0; i<currentDictionary.length; ++i){
		dStr += currentDictionary[i]+"_";
	}

	var resString = [
		currentTarget,
		stimArray.join("_"),
		listenersResponse, 
		speakersWord,
		timeX,
		experimentName,
		experiment_filename,
		language_filename,
		name,				// speaker name	
		dStr, // dictionary
		currentExperimentType,
		interactionString,//  string containing interaction in a multi-sequence round
		stimOrder_filename
		].join("\t");
	console.log(experimentName);
	console.log(resString);
	sendResults(experimentName,resString);

	if(roleSpeaker){
		writeLanguageFile(ims,lastUsedStimLabels);
	}
	
	// note this will only happen every other round, because saveData is called only for speaker
	if(name=="Part1" && OIRExperiment && allowRepairInThisExperiment){
		writeStimOrderFile();
	}

}

function loadData(){
	loadData_lang();
	loadData_exper();
}

function loadData_lang(){
	getExperiment(language_filename,"lang");
}

function loadData_exper(){
	// In order for the experiment files to be synched, only Speaker needs to request a random experiment file
	// getRandExperimentFile() requests that a random experiment file be generated and sent back
	// speaker must load experiment file when they recieve a message "LOADEXPER"
	if(roleSpeaker){
		var firstGenEx = "0";
		if(firstGeneration){
			firstGenEx = "1";
		}	 
		
		getRandExperimentFile(firstGenEx,experiment_filename+".exper");		
	}
	
	else{
	// listener loads the file written by the speaker
	// The file might not be written yet, but the speaker will let the listener know
	// if they need to re-load it
		getExperiment(experiment_filename+".exper","exper");
	}
	
	removeSynchButton();
	
}

function loadData_stimOrder(){
	getExperiment(stimOrder_filename,"stimOrder");
}



function recieveData(contents,filetype){

	console.log("DATA");
	console.log(contents);

	if(filetype=='exper'){
		// experiment file
	
		loadExperimentFromString(contents);
		
		removeSynchButton();
		console.log("IS SPEAKER");					
		// If the speaker has recieved the file, then the experiment file is written and the listener
		// can load it.  So send a message to the listener to load the file.
		if(roleSpeaker){

			// if we're in a no-repair condition of the OIR experiment,
			if(OIRExperiment && !allowRepairInThisExperiment){
				// now that the rounds have been loaded, they can be replaced with the previous stimuli
				console.log("SPEAKER LOADING STIM ORDER");
				loadData_stimOrder();
			}
			else{
				chat.send("LOADEXPER"+experiment_filename, name, toUser);
			}
		}
	}
	
	else{
	
		if(filetype=='lang'){
		// lanuage file
	
		loadLanguage(contents);
		//dictLoad();
		practiceDictLoad();
		}
		else{
			if(filetype=='stimOrder'){	
				// stimOrder file
				loadStimOrder(contents);
				// send new rounds to listener
				sendStimOrderToListener();
			}
		}
	}
	
}


function loadExperimentFromString(contents){

		contents = contents.replace(/%0A/g,"\n");
		console.log(contents);
		var lines = contents.split("\n");
		console.log(lines.length);
		var rownames = lines[0].split("\t");
		
		var trainingInd = rownames.indexOf("Training");
		var stimulusInd = rownames.indexOf("Stimulus");
		var partBreakInd = rownames.indexOf("PartBreak");
		var messageInd = rownames.indexOf("Message");
		var roleSwitch = rownames.indexOf("RoleSwitch");
		var pracInd = rownames.indexOf("Practice");
		var noisInd = rownames.indexOf("Noise");
		
		rounds = [];
		for(var i=1; i < lines.length -1;++i){  // start from row 1
			var ix = lines[i].split("\t");
			if(ix.length>1){
				
				// add amount of noise
				if(noisInd>=0){
					// include noise
					var noiseThisRound = ix[noisInd];
					if (noiseThisRound == 'undefined'){
						noiseThisRound = 0;
					}
					else{
						noiseThisRound = parseInt(noiseThisRound);
						if(noiseThisRound<0){
							noiseThisRound = 0;
						}
					}
					rounds.push([ix[trainingInd],parseInt(ix[stimulusInd]),parseInt(ix[partBreakInd]), ix[messageInd],ix[roleSwitch], ix[pracInd],noiseThisRound]);
				}
				else{
					rounds.push([ix[trainingInd],parseInt(ix[stimulusInd]),parseInt(ix[partBreakInd]), ix[messageInd],ix[roleSwitch], ix[pracInd]]);
				}
			}
		}
		console.log("LOADED FROM STIM ORDER");
		for(var i=0;i<rounds.length;++i){
		console.log(rounds[i]);		
		}
		
		removeSynchButton();
		
}

function encodeExperimentString(){
//var TRAINING = 0;
//var STIMULUS = 1;
//var PARTBREAK = 2;
//var MESSAGE = 3;
//var ROLESWITCH = 4;
//var PRACTICEIND = 5;
	ret = "Training\tStimulus\tPartBreak\tMessage\tRoleSwitch\tPractice%0A";
	if(rounds[0].length > NOISEIND){
		ret = "Training\tStimulus\tPartBreak\tMessage\tRoleSwitch\tPractice\tNoise%0A";
	}
	for(var i=0; i<rounds.length;++i){
		ret += rounds[i].join("\t")+"%0A";
	}
	return(ret);
}

function sendStimOrderToListener(){
	// speaker sends revised experiment to listener
	var stimOrderString = encodeExperimentString();
	chat.send("STIMORDER"+stimOrderString, name, toUser);	
}

function loadLanguage(contents){
		var ims_tmp = []
		stimLabels = [];
		var lines = contents.split("\n");
		for(var i = 0; i < lines.length; ++ i){
			console.log([lines[i],lines[i].split("\t")[0]]);
			var labx = lines[i].split("\t")[0];
			if(labx.length>0){
				stimLabels.push(labx);
				// read stimulus images from language file
				ims_tmp.push(lines[i].split("\t")[1]);		
			}
		}
		if(ims_tmp.length == stimLabels.length){
			ims = ims_tmp
		}

		// copy to last Used Stim Labels
		lastUsedStimLabels = Array();
		for(var i=0;i<stimLabels.length;++i){
			lastUsedStimLabels.push(stimLabels[i]);
		}
}

function loadStimOrder(contents){
// given a list of stimuli, produce a rounds specification which replicaes the same stimuli (in possibly a different order)

//var TRAINING = 0;
//var STIMULUS = 1;
//var PARTBREAK = 2;
//var MESSAGE = 3;
//var ROLESWITCH = 4;
//var PRACTICEIND = 5;
	// get list of stims
	
	// each line is a pair of stimNumber\tAmountOfNoise, but keep together while we shuffle
	var prevStims = contents.split("\n");
	console.log("PREVSTIMS");
	console.log(prevStims);
	console.log(contents);
	console.log("--");
	console.log(rounds.length);

	var prevStimNums = [];
	for(var i = 0; i <prevStims.length; ++i){
		if(prevStims[i].length>0){
			prevStimNums.push(prevStims[i]);
		}
	}
	
	// shuffle order of stimuli
	// BUT - the number of targets shown to each participant as speaker should be balanced.
	// so, extract every other value, shuffle those, then put them back together.
	var stimList1 = [];
	var stimList2 = [];
	for(var i=0;i<prevStimNums.length;++i){
		if( (i % 2 )==0){
			stimList1.push(prevStimNums[i]);
		} 
		else{
			stimList2.push(prevStimNums[i]);			
		}
	}
	console.log("SPIT");
	console.log(stimList1);
	console.log(stimList2);
	
	shuffle(stimList1);
	shuffle(stimList2);
	
	maxLength = Math.max(stimList1.length,stimList2.length);
	console.log(maxLength);
	var prevStimNums2 = [];
	var prevNoise = []
	for(var i=0; i<maxLength; ++i){
		if(i < stimList1.length){
			var lx = stimList1[i].split("\t");
			prevStimNums2.push(lx[0]);
			prevNoise.push(lx[1]);
		}
		if(i < stimList2.length){
			var lx = stimList2[i].split("\t");
			prevStimNums2.push(lx[0]);
			prevNoise.push(lx[1]);
		}
	}
	console.log("INTERLEAVE");
	console.log(prevStimNums);
	console.log(prevStimNums2);
	console.log(prevNoise);
	
	
	// make a copy of the rounds variable, swapping the stimuli for prevStimNums2
	var newRounds = [];
	var count = 0;
	var totalRowCount = 0;
	var i =0;
	while((count < prevStimNums2.length) && (i<rounds.length)){
//	for(var i=0; i< prevStimNums2.length; ++ i){
		
		if(rounds[i][TRAINING]=="0" && rounds[i][PRACTICEIND]=="0" && rounds[i][PARTBREAK]=="0"){
			var rx = rounds[i];
			console.log(count);
			rx[STIMULUS] = prevStimNums2[count];
			// add noise column
			rx.push(prevNoise[count]);  
			newRounds.push(rx);
			count += 1;
		}
		else{
		// if it's a training round, practice or break,
			if(count < prevStimNums2.length){
			// and we haven't run out of stimuli, just copy this round number
				var rx = rounds[i];
				// add noise column
				rx.push(0);
				newRounds.push(rx);
			}
		}
		i += 1;
	}
	
	// there might be fewer rounds in 'rounds' than there are prevStimNums2
	if(count < prevStimNums2.length){
		for(var i=count; i < prevStimNums2.length; ++i){
		//	rounds.push([ix[trainingInd],parseInt(ix[stimulusInd]),parseInt(ix[partBreakInd]), ix[messageInd],ix[roleSwitch], ix[pracInd]]);
			practicex = "0";
			stimx = prevStimNums2[i];
			partbreakx = 0;
			msx = "";
			roleswitchx = "1";
			pracx = "0";
			noisex = prevNoise[i];
			newRounds.push([practicex,stimx,partbreakx,msx,roleswitchx,pracx,noisex]);
		}
	}
	
	// replace rounds with newRounds;
	rounds = newRounds;
	console.log("OUT");
	for(var i=0;i<rounds.length;++i){
		console.log(rounds[i]);
	}
}

function writeLanguageFile(imageFiles,signals){
	
		console.log("Sending language file");
		var ret = "";
		for(var i=0; i< imageFiles.length; ++i){
			ret += signals[i] + "\t" + imageFiles[i] + "\n";
		}
		
		sendResults(experiment_filename+".lang",ret);
	

}

function writeStimOrderFile(){
	ret = "";
	for(var i=0;i<stimOrder.length;++i){
		ret += stimOrder[i]+"\t"+noiseOrder[i]+"\n";
	}
	sendResults(experiment_filename+".order",ret);
}


//  FUNCTIONS FOR SLIDE WHISTLE

function playPartnerSignal(){
	// play back the partner's signal
	console.log("PlayPartnerSignal2");
	console.log(waitingForListenerClick);
	document.getElementById("playPartnerSignalButton").src = "images/backgrounds/PlayButton_occupied.png";

	// check if suitable to do so
	if(waitingForListenerClick){			
		console.log("playBack starting");
		console.log(playingBack);
		console.log(recordBuffer.length);
		// from soundSlider.js
		//playSavedRecording(sentWhistle);
		if(!playingBack){		// check that we're not already playing something
 			startSlideWhistle();
			startPlayback();
			}
	}
}

function retrySignal(){
	// give the participant a second attempt at doing the signal.
	// hide retry button, so only 1 attempt
	if(!instructionPhase){
		document.getElementById("retryButton").style.display = 'none';
		recordBuffer = Array();
	}
}


function exper_EndPlayback(){
	console.log("exper_EndPlayback ");
	console.log(currentlyTraining);
	if(currentlyTraining){
		training_PlaybackEnds();
	}
	else{
		// change play button image
		// needs a delay because buffer is still running out
		setTimeout(function(){
			document.getElementById("playPartnerSignalButton").src = "images/backgrounds/PlayButton.png";
			stopSlideWhistle();
			},500);
			
		if(firstListenerEndPlayback){
			firstListenerEndPlayback = false;
			if(sliderExperiment){
				startTimer();
			}				
		}

	}
}

function sendSliderSignal(){
	if(waitingForInput & !instructionPhase){
		stopRecord();
		
		// is recording long enough?
		if(recordBuffer.length > minimumRecordLength){
			// call to communicaiton program
			var messageString = recordBufferToString();
			sendSpeakerMessage(messageString);
		}
		else{
			document.getElementById("InfoPanel").innerHTML = signal_too_short_text;
						setInnerHTML("InfoPanel",signal_too_short_text);
			// reset record buffer
			recordBuffer = Array();
			startRecord();
		}
		
	}
}

function sendTextSignal(e){
	if(e.keyCode == 13){
		var str = document.getElementById("sendie").value;
		if(validateDict(str)){
			
			// disable text entry
			document.getElementById("StartButton").focus();
			document.getElementById("typedInput").style.display = 'none';
			document.getElementById("sendie").value = "";
			
			sendSpeakerMessage(str);
		}
		else{
			// TODO warning
			alert("Text must have at least one character!\nLowercase letters only, no Spaces, no English!");
		}
	}
}

function animateSendButton(){
	
	if(animateSendButtonCount==0){
		document.getElementById("sendButton").src = "images/backgrounds/SendButtonDark.png";
	}
	else{
		document.getElementById("sendButton").src = "images/backgrounds/SendButton.png";
		animateSendButtonCount == 0;
	}
	
	animateSendButtonCount += 1;
}

function writeParticipantDetails(){
		// write sex, age of participants to file
		// TODO
		
		var sex = "NA";//document.getElementById("data_sex").value;
// 			Sex<br />
// 			<select id='data_sex' size="2" style="font-size:20px; width:100%">
// 				<option selected>Female</option>
// 				<option>Male</option>
// 			</select>
		var age = document.getElementById("data_age").value;
		
		sendPartData(experiment_filename + "\t" + name +  "\t" + sex + "\t" + age);
		
}

function failLoadData(filename,filetype){
	// on failing to load data
	if(roleSpeaker)	{
	   	alert("Cannot load Ex file "+filename);
	}
	else{
		console.log("failed to load data as listener, waiting");
		// listener may just be waiting for speaker to generate the file
		// wait for a bit, then try again.
		// if we fail again, we'll just come back here.
		// setTimeout("loadData_exper()",3000);
	}
}

function synchExper(){
	loadData();  
	document.getElementById("SynchButton").style.top = "0%";
	document.getElementById("SynchButton").style.left = "0%";
	removeSynchButton();
}

function removeSynchButton(){
	document.getElementById("SynchButton").style.top = "0%";
	document.getElementById("SynchButton").style.left = "0%";
	document.getElementById("SynchButton").style.width = "0%";
	document.getElementById("SynchButton").style.height = "0%";
	document.getElementById("SynchButton").style.display = 'none';
	document.getElementById("SynchButton").style.zIndex = '-1';
}

function startTimer(){
	if(started){
		document.getElementById("timerCanvasDiv").style.display = "inline";
		timerTime = maxTimerTime;
		timerTimeInterval = setInterval("minusTimer()",30);
		}
}

function stopTimer(){
	clearInterval(timerTimeInterval);
	document.getElementById("timerCanvasDiv").style.display = "none";
}

function drawTimer(endangle){
	
//	endangle = endangle * (2 * Math.PI);
	endangle = (3.5 - (2*endangle)) ;
	
	var canvas = document.getElementById("timerCanvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var radius = cx - 6;

	context.fillStyle = '#ff0000';   
	context.lineWidth=4;
	context.beginPath();
	context.arc(cx,cy,radius, 0, Math.PI*2, true); 
	context.closePath();
	context.fill();

	
	context.fillStyle = '#00973e';
	context.moveTo(cx,cy);
	context.arc(cx,cy,radius,1.5*Math.PI,endangle* Math.PI,false);
	context.lineTo(cx,cy);
//	context.stroke(); // or context.fill()
	context.strokeStyle = 'black';
	context.stroke();
	context.fill();
	}
	
	function flashTimer(x){
	var canvas = document.getElementById("timerCanvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var radius = cx - 6;
    
   	x = Math.abs(x % 100);

	context.fillStyle = 'hsl(0,100%,' + x+'%)';

	context.lineWidth=4;
	context.beginPath();
	context.arc(cx,cy,radius, 0, Math.PI*2, true); 
	context.closePath();
	context.fill();
	}
	
	function minusTimer(){
//		console.log(timerTime/maxTimerTime );
		if(timerTime<0){
			timerTime -= 1;
			flashTimer(timerTime);
		}
		else{
			timerTime -= 0.1;
			drawTimer(timerTime/maxTimerTime );
			}
	}
	
// Dictionary functions

function dictLoad(){

	if(dictionaryOrderIsRandom){
		dictOrder = getRandomDictOrder();
	}

	currentDictionary = [];

	// set images for dict
	for(var i=0; i< ims.length; ++i){
		var x = i+1;
		var dictRef = dictOrder[i]
		document.getElementById("d"+x.toString()+"Image").src = ims[dictRef];
	}
	// update dictionary list
	for(var i=0; i< stimLabels.length; ++i){
		currentDictionary.push(stimLabels[i]);
	}
	// update dictionary display
	updateDictionary();
}

function practiceDictLoad(){
		currentDictionary = practiceLabels;
		updateDictionary();
		for(var i=0; i< practice_ims.length; ++i){
			var x = i+1;
			document.getElementById("d"+x.toString()+"Image").src =practice_ims[i];
		}
}

function updateDictionary(){
	//console.log(document.getElementById("dictionaryPanel").innerHTML);
	for(var i=0; i< currentDictionary.length; ++i){
		var x = i+1;
		var dictRef = dictOrder[i]
		document.getElementById("d"+x.toString()+"text").value = currentDictionary[dictRef];
	}
}

function dictionaryTextClick(x){
	//document.getElementById("d"+x.toString()+"text").disabled = false;
	document.getElementById("d"+x.toString()+"text").focus();
	tmpDictText = document.getElementById("d"+x.toString()+"text").value;
}

function dictionaryTextKey(e){
	if(e.keyCode == 13){
		dictionaryTextKey2(e);
	}	
}

function dictionaryTextKey2(e){
	var n = e.target.id;
	var tx = document.getElementById(n).value;	
	var meaning_num = parseInt(n.substring(1))-1;
	if(dictionaryOrderIsRandom){
		// meaning_num matches visual dictionary position
		// not meaning list index
		meaning_num = dictOrder[meaning_num];
	}
	
	//document.getElementById(n).disabled = true;
	document.getElementById("sendie").focus();
	if(!validateDict(tx)){
			// TODO warning
			alert("Text must have at least one character!\nLowercase letters only, no Spaces, no English!");
			document.getElementById(n).value = tmpDictText;
			//document.getElementById(n).disabled= false;
			//setTimeout(function(){document.getElementById(n).focus();},500);
	}
	else{
		currentDictionary[meaning_num] = tx;
	}
	
}

function validateDict(str){
  return /^[a-z]*$/.test(str) && str.length > 0 && str.length <= maxStringLength;
}


function highlightImage(c){
	document.getElementById(c).style.border="thick solid #FF0000";
}

function dehighlightImage(c){
	document.getElementById(c).style.border = "none";
}

function dehighlighAllImages(){
	for(var i=0;i< numberOfContextItems;++i){
			dehighlightImage("cont"+(i+1));
	}
}

// RANDOMISE DICTIONARY

// function randomiseDictionaryOrder(){
// 	var order = new Array();
// 	for(var i=0;i<stimLabels.length;++i){
// 		order.push(i);
// 	}
// 	shuffle(order)
// 	var dictDiv = makeDictDiv(order);
// 	console.log(dictDiv);
// 	document.getElementById("dictionaryPanel").innerHTML = dictDiv;
// }

function getStartingDictOrder(){
	var dx = new Array();
	for(i=0; i <16; ++ i){  // hard coded!
		dx.push(i);
	}
	return dx;
}

function getRandomDictOrder(){
// 	var dx = new Array();
// 	for(i=0; i <stimLabels.length; ++ i){
// 		dx.push(i);
// 	}
// 	shuffle(dx);
// 	return dx;	
 	var orderX = new Array();	
	// set shape order
	shapeOrder = new Array();
	for(i=0;i<4; ++i){
		shapeOrder.push(i)
	}
	shuffle(shapeOrder);
	// set pattern order
	patternOrder = new Array();
	for(i=0;i<4; ++i){
		patternOrder.push(i)
	}
	shuffle(patternOrder);	
	
	for(var s=0;s<shapeOrder.length;++s){
		for(var p=0;p<patternOrder.length;++p){
			orderX.push(patternOrder[p] + (shapeOrder[s]*4))
		}
	}
	console.log("ORDER "+orderX);
	return orderX;
}

// function makeDictDiv(order){
// 	divString = '<div id="leftDictCol">';
// 	for(var i=0;i<(order.length/2); ++i){
// 		divString = divString +"\n" + makeEntryDiv(order[i]);
// 	}
// 	divString = divString + '</div><div id="rightDictCol">';
// 	for(var i=order.length/2;i<order.length; ++i){
// 		divString = divString +"\n" + makeEntryDiv(order[i]);
// 	}
// 	divString = divString + '</div>';
// 	return divString;
// }
// 
// function makeEntryDiv(n){
// 	return '<div id="d' + n +
// 	'"><img id="d'+ n +
// 	'Image" src=""><input type="text" id="d'+ n +
// 	'text" onclick="dictionaryTextClick('+ n +
// 	')" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)"></div>';
// }