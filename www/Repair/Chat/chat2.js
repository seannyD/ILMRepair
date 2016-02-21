/* 
Created by: Kenrick Beckett

Name: Chat Engine
*/

var instanse = false;
var state;  // the current number of lines read through the chat file
var mes;
var file;
var chat_file = 'Chat11.txt';

var poll_wait = 2000; // how long to wait between polls of file

var waitingForInput = false;
var waitingForMessage = false;
var waitingForListenerClick = false;

function Chat () {
    this.update = updateChat;
    this.send = sendChat;
	this.getState = getStateOfChat;
	this.wipeChatFile = wipeChatFile;
	this.startupChat = startupChat;
	//this.getResultsFiles = getResultsFiles;
}


function startupChat(){
	updateChat();
}

//gets the state of the chat
function getStateOfChat(){
	if(!instanse){
		 instanse = true;
		 $.ajax({
			   type: "POST",
			   url: "process3.php",
			   data: {  
			   			'function': 'getState',
						'file': file,
						'chat_file': chat_file
						},
			   dataType: "json",
			
			   success: function(data){
				   state = data.state;
				   instanse = false;
			   },
			});
	}	 
}

//Updates the chat
function updateChat(){
	 if(!instanse){
		 instanse = true;
	     $.ajax({
			   type: "POST",
			   url: "process3.php",
			   data: {  
			   			'function': 'update',
						'state': state,
						'file': file,
						'chat_file': chat_file
						},
			   dataType: "json",
			   success: function(data){
				   if(data.text){
						for (var i = 0; i < data.text.length; i++) {
                            
                            processNewMessage(data.text[i]);
                        }								  
				   }
				   //document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
				   instanse = false;
				   state = data.state;
			   },
			   // the idea here was to only call updatechat after a message has been recieved.
			   // however, the instanse variable basically does the same job, and here we risk
			   // recursing 
			//   complete: function(jqXHR, status){
			//   		// after recieving a response, wait a bit then ask again
			//   		setTimeout("updateChat()",poll_wait);
			//   },
			});
	 }
	 // since we're calling updateChat often anyway, we don't need to call it again if the function is still busy
	 // in fact, this can cause recursion problems where there are too many calls to updateChat.
	 else {
	 	console.log("NOT INSTANSE");
		 //setTimeout(updateChat, poll_wait);
	 }
}

function processNewMessage(d){

var mFrom = d.substring(0,d.indexOf("@"));
var mTo = d.substring(d.indexOf("@")+1,d.indexOf("%"));
console.log("MESS");
console.log([d,mFrom,mTo,name]);
var mss = d.substring(d.indexOf("%")+1);
if(mss == "READYTOSTART"){
	readyToStart();
}
else{
	if(mTo == name){
		if(mss.substring(0,9)=="LOADEXPER"){
			console.log("Listener Load Message");
			// just in case we have different filenames
			experiment_filename = mss.substring(9);
		// this is a singnal for the listener to load an experiment file
			loadData();
		}
		else if (mss == "NEXTROUND"){
				checkMoveNextRound();
			}
		else {
			if(mss.substring(0,9) == "STIMORDER"){
				loadExperimentFromString(mss.substring(9));
				// for listener, we need to check that the language is loaded.
				setTimeout('loadData_lang();',10);
			}
			else{
				if(waitingForMessage){
					//$('#chat-area').append($("<p>"+ d +" OOOOO</p>"));
					//recieveMessage(mss);
					// we don't want to keep running stuff in this loop
					// because it's holding up instanse being set in updateChat()
					// so, put it on a timeout
					setTimeout('recieveMessage("'+mss+'")',100);
				}
			}
		}
	} // end if mTo == name
} // end if "READY TO START"


} // end function

//send the message
function sendChat(message, nickname,toUser)
{       
    updateChat();
     $.ajax({
		   type: "POST",
		   url: "process3.php",
		   data: {  
		   			'function': 'send',
					'message': message,
					'nickname': nickname,
					'toUser': toUser,
					'file': file,
					'chat_file': chat_file
				 },
		   dataType: "json",
		   success: function(data){
			   updateChat();
		   },
		});
}


// write results
function sendResults(filename,results)
{       
//    updateChat();
     $.ajax({
		   type: "POST",
		   url: "process3.php",
		   data: {  
		   			'function': 'send-results',
					'filename': filename,
					'results': results,
					'file': file
				 },
		   dataType: "json",
		   success: function(data){
			 //  updateChat();
			 console.log("Written");
		   },
		});
}

function sendPartData(text)
{       
//    updateChat();
     $.ajax({
		   type: "POST",
		   url: "process3.php",
		   data: {  
		   			'function': 'send-partData',
					'text':text
				 },
		   dataType: "json",
		   success: function(data){
			 console.log("Written");
		   },
		});
}

function getExperiment(filename,filetype){

	     $.ajax({
			   type: "POST",
			   url: "process3.php",
			   data: {  
			   			'function': 'get-experiment',
						'filename': filename,
						'filetype' : filetype
						},
			   dataType: "json",
			   success: function(data){
				   if(data.contents){
						recieveData(data.contents,data.filetype);
				   }
				   else{
					failLoadData(filename,filetype); // in exper2.js
				   }
			  },
		 });

}

function getRandExperimentFile(firstGen,fileName){
		var experType = "LearnAndExpress";
		
		if(learnOnlyExperiment){
			experType = "LearnOnly";
		}
		if(dictionaryExperiment){
			experType = "ExpressOnly";
		}

	     $.ajax({
			   type: "POST",
			   url: "makeExperFiles.php",
			   data: {  
			   			'firstGen': firstGen,
			   			'filename': fileName,
			   			'experType':experType,
						},
			   dataType: "json",
			   success: function(data){
				   if(data.contents){
						recieveData(data.contents,"exper");
				   }
				   else{
				   	alert("Cannot load file"+data+ " " +filename);
				   }
			  },
		 });

}

// function getResultsFiles(){
// 
// 	     $.ajax({
// 			   type: "POST",
// 			   url: "process3.php",
// 			   data: {  
// 			   			'function': 'get-results-file-list'
// 						},
// 			   dataType: "json",
// 			   success: function(data){
// 				   if(data.contents){
// 				   	// in IntroScreen.html
// 						processResultsFiles(data.contents);
// 				   }
// 				   else{
// 				   	alert("Cannot load file"+data);
// 				   }
// 			  },
// 		 });
// 
// }

function wipeChatFile(){
	// because speed of loading of chat file is dependent on length, we want to wipe it at the start of the experimet
	// this is a bit risky because we're assuming no-one else is using the chat file in the next 1 seconds
	 if(!instanse){
		 instanse = true;
	     $.ajax({
			   type: "POST",
			   url: "process3.php",
			   data: {  
			   			'function': 'wipe-chat-file',
						'chat_file': chat_file
						},
			   dataType: "json",
		 });
		state = 0;
		instanse = false;
		}

}