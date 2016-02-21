// display the instructions and get personal information 

// ENGLISH
// COLLECTDATA = Array("","\
// Welcome to the experiment! Please enter your details\
// ")
// 
// PRACTICE = Array("images/backgrounds/IntroToSlider.png","\
// You will communicate with your partner using the Sound Slider below. \
// Practice using the slider by sliding your finger over the red area.\
// ");
// 
// PARTNER = Array("images/backgrounds/IntroToSlider_Partner.png","\
// This is your partner!\
// ");
// 
// SPEAK = Array("images/backgrounds/IntroToSlider_Partner.png","\
// In this game, you must describe objects for your parter using the slider. \
// Try making a sound that will help the guess this object!\
// ");
// 
// SEND = Array("images/backgrounds/IntroToSlider_Partner.png",'\
// After making a sound, send it to your partner with the \
// <img src="images/backgrounds/SendButton.png" style="width: 60px; height: 30px"> \
// button.\
// ');
// 
// RETRY = Array("images/backgrounds/IntroToSlider_Partner.png",'\
// If you make a mistake, you can try again once by pressing the  \
// <img src="images/backgrounds/RetryButton.png" style="width: 30px; height: 30px"> \
// button.\
// ');
// 
// LISTEN = Array("images/backgrounds/IntroToSlider_Listen.png",'\
// When it\'s your turn to guess, your partner will send you a sound.  Press the  \
// <img src="images/backgrounds/PlayButton.png" style="width: 30px; height: 30px"> \
// button to hear it.\
// ');
// 
// GUESS = Array("images/backgrounds/SW_Listener2.png","\
// You'll see different options in your thought bubble. Press the option you think your partner is thinking of.\
// ");
// 
// FEEDBACK = Array("images/backgrounds/SW_FeedbackGood.png","\
// You'll find out if you got the right answer.  It might be difficult at first, but keep trying!  \
// You're now ready to start the experiment.  If you have any questions, ask the experimentors!\
// ");

// the arrays below are in the format (background image, instruction text);
// backslashes are used to display the code over multiple lines for readability (line breaks are not shown in the webpage).

COLLECTDATA = Array("","\
<b>Instructies</b><br />\
Welkom bij het communicatiespel! Vul eerst deze details in\
");

TRAINING1 = Array("images/backgrounds/SW_Training.png","\
<b>Instructies</b><br />\
In dit spel communiceer je in een buitenaardse fluittaal. \
We beginnen met een lesje buitenaards. Druk op 'Volgende' om het fluitsignaal voor 'blad' te horen.\
");

TRAINING2 = Array("images/backgrounds/SW_Training.png","\
<b>Instructies</b><br />\
Nadat je de woorden hebt geleerd ga je er mee communiceren..\
");

PRACTICE = Array("images/backgrounds/IntroToSlider.png","\
<b>Instructies</b><br />\
Je gaat zometeen communiceren via de TonePad hieronder. \
Probeer 'm eens uit door met je vinger heen en weer te schuiven in het groene vlak.\
");

PARTNER = Array("images/backgrounds/IntroToSlider_Partner.png","\
<b>Instructies</b><br />\
Dit is je partner. Speel met de rug naar elkaar toe zodat jullie elkaars scherm niet zien!\
");

SPEAK = Array("images/backgrounds/IntroToSlider_Partner.png","\
<b>Instructies</b><br />\
In dit spel moet je voorwerpen beschrijven met de TonePad. \
Probeer signalen te maken die je partner helpen om het voorwerp te raden.\
");

SEND = Array("images/backgrounds/IntroToSlider_Partner.png",'\
<b>Instructies</b><br />\
Na het maken van je signaal kun je het naar je partner sturen met de \
<img src="images/backgrounds/SendButton.png" style="width: 60px; height: 30px"> \
-knop.\
');

RETRY = Array("images/backgrounds/IntroToSlider_Partner.png",'\
<b>Instructies</b><br />\
Als je een foutje maakt kun je het signaal &eacute;&eacute;n keer opnieuw opnemen. Druk daarvoor op de \
<img src="images/backgrounds/RetryButton.png" style="width: 30px; height: 30px"> \
-knop.\
');

LISTEN = Array("images/backgrounds/IntroToSlider_Listen.png",'\
<b>Instructies</b><br />\
Als je partner aan de beurt is stuurt die jou een signaal. Druk op de \
<img src="images/backgrounds/PlayButton.png" style="width: 30px; height: 30px"> \
-knop om het te horen.\
');

GUESS = Array("images/backgrounds/SW_Listener2.png","\
<b>Instructies</b><br />\
Je ziet dan zes voorwerpen. Kies de optie waarvan jij denkt dat je partner die bedoelt met zijn signaal.\
");

FEEDBACK = Array("images/backgrounds/SW_FeedbackGood.png","\
<b>Instructies</b><br />\
Je krijgt te zien of je het goed had of niet. Aan het begin kan het moeilijk zijn, maar als je goed samenwerkt gaat het steeds beter!\
"); 

//Je bent nu klaar om te beginnen. Als je nog vragen hebt, stel ze dan nu aan de onderzoekers.\

AGREE = Array("","\
Je hebt nu de introductie doorlopen en je bent klaar om het spel te beginnen.  <br />\
Je spelgedrag verzamelen we als data voor ons onderzoek. \
Als je nog vragen hebt kun je die aan de onderzoekers stellen. <br />\
Door op 'Begrepen, let's go!' te drukken geef je aan dat je vrijwillig en goed ingelicht deelneemt aan dit onderzoek.\
"); 

//READY = Array("images/backgrounds/SW_FeedbackGood.png","\
//You're now ready to start the experiment.  If you have any questions, ask the experimentors!\
//");


var listOfScenes = Array(COLLECTDATA,TRAINING1,TRAINING2,PRACTICE,PARTNER,SPEAK,SEND,RETRY,LISTEN,GUESS,FEEDBACK,AGREE);

var exampleArray = Array("images/example/leaf.png",
							"images/example/flower2.png",
							"images/example/leaf2.png",
							"images/example/leaf3.png",
							"images/example/tree.png",
							"images/example/tree5.png");

var exampleChoice = 0;

var sceneCounter = 0;

var instructionPhase;

function nextScene(){
	console.log("NEXT");
	if(sceneCounter +1 < listOfScenes.length){
		sceneCounter += 1;
		changeScene();
	}
	handleNextPrevButtons();
}

function previousScene(){
	if(sceneCounter -1 >=0){
		sceneCounter -= 1;
		changeScene();
	}
	handleNextPrevButtons();
}

function handleNextPrevButtons(){
	if(sceneCounter===0){
		hideMe("PrevInst");
	}
	else{
		showMe("PrevInst");
	}
	if(sceneCounter==listOfScenes.length-1){
		hideMe("NextInst");
	}
	else{
		showMe("NextInst");	
	}
}

function changeScene(){
	var sceneX = listOfScenes[sceneCounter];
	displayInstructions(sceneX[0],sceneX[1]);
	hideAllInstructions();
	handleNextPrevButtons();
	console.log(sceneCounter);
	switch(sceneCounter)
		{
		case 0:  // collect data
		  showMe("DataForm");
		  break;
		case 1:
			if(firstGeneration){  // if it's a first generation, skip the instructions about training
				sceneCounter =3;
				changeScene();
			}
			else{
				displayExampleTraining();
		   		  shiftInstructions();
			}
		break;		
		case 2:
			if(firstGeneration){
				sceneCounter =3;
				changeScene();
	   		  shiftInstructions();
			}
			else{
				waitingForListenerClick = true;
				displayExampleTraining();
				//loadExampleSound();
				//playPartnerSignal();
			}
		break;

		case 3:  // practice
		  showMe("SlideWhistle");
//		  document.getElementById("SlideWhistle").innerHTML = "TOUCH HERE!"
		  break;
		case 4:  // partner
		  showMe("SlideWhistle");
		  break;
		case 5:  // speak
		  showMe("SlideWhistle");
		  break;
		case 6:  // send
		  showMe("SlideWhistle");		
		  showMe("sendButtonDiv");		  
		  break;
		case 7: // retry
		  showMe("SlideWhistle");
		  showMe("sendButtonDiv");
		  showMe("retryButton");		  
		  break;
		case 8:   // listen
		  loadExampleSound();
  		  waitingForListenerClick = true;
		  showMe("PlayPartnerSignal");
   		  shiftInstructions();
		  break;
		case 9:  // guess
		  console.log("GUESS");
		  showMe("cont");
		  showMe("cont1");
		  showMe("cont2");
		  showMe("cont3");
		  showMe("cont4");
		  showMe("cont5");
		  showMe("cont6");
		  displayExampleMeanings();
   		  shiftInstructions();
		  break;
		case 10:  //feedback and ready
		  displayExampleFeedback();
		  showMe("rightStimTestImage");
		  showMe("leftStimTestImage");
		//  showMe("StartButton");
		  // shift previous button
		  document.getElementById("PrevInst").style.top = "70%";
		  document.getElementById("PrevInst").style.left = "2%";
   		  shiftInstructions();
		  break;
		case 11:
			showMe("AcceptAndProceedDiv");
		}
	
	
}

function shiftInstructions(){
	document.getElementById("instructions").style.top = "350px";
	document.getElementById("instructions").style.left = "250px";
}


function displayInstructions(background,text){
	document.getElementById("instructions").innerHTML = text;
	document.getElementById("backgroundImage").src = background;
}

function showMe(x){
	try{document.getElementById(x).style.display = 'inLine';}catch(err){}
	try{
		svg = document.getElementById("svg2");
		svg.getElementById(x).setAttributeNS(null, 'opacity', 1);
	}catch(err){}
}

function hideMe(x){
	try{document.getElementById(x).style.display = 'none';}catch(err){}
	try{
		svg = document.getElementById("svg2");
		svg.getElementById(x).setAttributeNS(null, 'opacity', 0);
	}catch(err){}
}

function setInnerHTML(stimWindow,text){
	try{document.getElementById(stimWindow).innerHTML = text;} catch(err){}
	try{document.getElementById(stimWindow).textContent = text;} catch(err){}
}


function hideAllInstructions(){
    document.getElementById("SlideWhistle").innerHTML = ""
	hideMe("sendButtonDiv");
	hideMe("retryButton");
	hideMe("PlayPartnerSignal");
	hideMe("SlideWhistle");
	hideMe("DataForm");
	hideMe("StartButton");
	hideMe("ScorePanel");
	hideMe("cont");
	hideMe("leftStimTestImage");
	hideMe("rightStimTestImage");
	hideMe("AcceptAndProceedDiv");
	
	document.getElementById("instructions").style.top = "10px";
	document.getElementById("instructions").style.left = "10px";
	
	document.getElementById("PrevInst").style.top = "95px";
	document.getElementById("PrevInst").style.left = "750px";

	waitingForListenerClick = false;
	
	// clears cont and info
		for(var i=0;i< 6;++i){
			setStim("cont"+(i+1),"");	
			hideMe("cont"+(i+1));
		//	setStim("cont"+(i+1),-1);
			}
			//document.getElementById("rightStimTestImage").src = "";	
			hideMe("rightStimTestImage");
			//document.getElementById("leftStimTestImage").src = "";	
			hideMe("leftStimTestImage");

	
}

function displayExampleMeanings(){
	console.log("EXAMPLES");
	for(var i=0;i< exampleArray.length;++i){
		console.log(exampleArray[i]);
		document.getElementById("cont"+(i+1)).src = exampleArray[i];
	}
}	

function displayExampleFeedback(){
		document.getElementById("rightStimTestImage").src = exampleArray[exampleChoice];
		document.getElementById("leftStimTestImage").src = exampleArray[exampleChoice];
}

function displayExampleTraining(){
		document.getElementById("leftStimTestImage").src = exampleArray[0];
		showMe("leftStimTest");
		showMe("leftStimTestImage");
}

function loadExampleSound(){
	
	var exampleSoundString = "701.6796875,701.6796875,701.6796875,709.4140625,715.859375,742.9296875,777.734375,807.3828125,871.8359375,946.6015625,1030.390625,1110.3125,1169.609375,1214.7265625,1261.1328125,1310.1171875,1347.5,1399.0625,1424.84375,1424.84375,1424.84375,1413.2421875,1387.4609375,1335.8984375,1289.4921875,1232.7734375,1165.7421875,1115.46875,1092.265625,1057.4609375,1040.703125,1004.609375,978.828125,953.046875,923.3984375,891.171875,871.8359375,844.765625,834.453125,809.9609375,802.2265625,798.359375,794.4921875,791.9140625,791.9140625,791.9140625";
	recordBuffer = stringToRecordBuffer(exampleSoundString);
	
}


function askExperimentor(){
	document.getElementById("askExperimentorButton").value = "Stel ze dan nu aan de onderzoekers";
}

function agreeClick(){
	hideMe("AcceptAndProceedDiv");
	startExperiment();	
}

//instructionPhase = true;
//startSlideWhistle();
//setTimeout('hideMe("SlideWhistle"); changeScene();',1000);

hideAllInstructions();
hideMe("NextInst");
hideMe("PrevInst");
showMe("AcceptAndProceedDiv");
