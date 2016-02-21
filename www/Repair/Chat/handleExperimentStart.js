var lex_experiment = true;

var experiment_filename = "";
var language_filename  = "";
var stimOrder_filename = "";

  function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])]
        = decodeURIComponent(tokens[2]);
    }

    return params;
  }


    // ask user for name with popup prompt
   // var name = prompt("Enter your name:", "Part1");
//        var toUser = prompt("Enter your partner's name:", "Part2");

var experParams = getQueryParams(document.location.search);

var name = experParams["player"];
var toUser = "Part2";
if(name=="Part2"){
  toUser = "Part1";
}


  var currentExperimentType = experParams["condition"];
// should the dictionary be available?
  var dictionaryExperiment = false;

//     	if(experParams["condition"] == "Expressivity"){
//     		dictionaryExperiment = true;
//     	}
  var learnOnlyExperiment = false;
//     	if(experParams["condition"] == "Learnability"){
//     		learnOnlyExperiment = true;
//     	}


var allowRepairInThisExperiment = false;
if(experParams["condition"] == "Repair"){
  allowRepairInThisExperiment = true;
}

var generation = experParams["gen"];
var firstGeneration = generation == "New Generation";
stimOrder_filename = experParams["stimO"];

// THis is used in exper.js
language_filename =  generation;
if(firstGeneration){
  generation = "0";
  // set default langauge file (this shouldn't be used)
  language_filename = 'test_language.txt';
}
else{
// generation +1
  //generation = parseInt(generation.substring(2,generation.indexOf("_")))+1;
  if(lex_experiment){
    generation = "1";
  }
  else{
  generation = parseInt(generation.substring(generation.indexOf("G")+1,generation.indexOf("-")))+1;
  //console.log("GENERATION "+generation.toString());
  generation = generation.toString();
  }

}

var chain_num = experParams["chain"];

// set chat file to match chain number.  chat_file variable in chat.js
chat_file = "Chat0"+chain_num;
if(chain_num.length>1){
  chat_file = "Chat"+chain_num;
}

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!


var sortNames = [name,toUser].sort();

var today = new Date();
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

var conditionString = "NoRepair";
if(experParams["condition"] == "Repair"){
  conditionString = "WithRepair";
}

var genString = experParams["genName"];

//var ex = "CH"+chain_num + "_G" + generation + "-" + mm+'_'+dd+'_'+hh+minmin+ss;
var altName = experParams["altName"];
//var ex  = altName+"_"+ "CH"+chain_num +  "-" + mm+'_'+dd+'_'+hh+minmin+ss;
var ex = conditionString + "_CH"+chain_num + "_G"+genString + "-"+ mm+'_'+dd+'_'+hh+minmin+ss;
//experPhase+"_"+ mm+'_'+dd+'_'+hh+minmin+ss + "_CH"+chain_num + "_parent-" + startFile;
console.log(ex);
 //   if(lex_experiment){
 //   	var startFile = experParams["gen"];
 //   	var altName = experParams["altName"]
//       ex = altName + "_"+ startFile + "_CH"+chain_num + "-" + mm+'_'+dd+'_'+hh+minmin+ss;
 //   }


  //  var experimentName = prompt("Enter the current experiment name", ex);
//		var experimentName = ex;

// this variable is used in exper.js
experiment_filename = ex;
var experimentName = ex;

console.log("CHAIN");
console.log(experParams["chain"]);

    // default name is 'Guest'
  if (!name || name === ' ') {
     name = "Part1";
  }

  // strip tags
  name = name.replace(/(<([^>]+)>)/ig,"");




  function myValidate(text){
    return(/^[a-zA-Z]*$/.test(text) );
  }

  // kick off chat
    var chat =  new Chat();
    // if first participant
    if(name==sortNames[0]){
      // wipe chat file
      // because speed of loading of chat file is dependent on length, we want to wipe it at the start of the experimet
  // this is a bit risky because we're assuming no-one else is reading the chat file in the next 1 seconds
  // if planning multiple experiments at once, get rid of this
  // probaby better to have seperate chat file for each experiment
      chat.wipeChatFile();
    }
  $(function() {

     chat.getState();

     // watch textarea for key presses
         $("#sendie").keydown(function(event) {

             var key = event.which;

             //all keys including return.
             if (key >= 33) {

                 var maxLength = $(this).attr("maxlength");
                 var length = this.value.length;

                 // don't allow new content if length is maxed out
                 if (length >= maxLength) {
                     event.preventDefault();
                 }
              }
                                                                                                    });
     // watch textarea for release of key press
     $('#sendie').keyup(function(e) {

        if (e.keyCode == 13) {

                var text = $(this).val();
                text = text.replace("\n",'');
        var maxLength = $(this).attr("maxlength");
                var length = text.length;

                 // TODO check minimum length

                // send
                if (length <= maxLength + 1 & length > 0 & /^[a-zA-Z]*$/.test(text)) {
                  if(waitingForInput){
                    sendSpeakerMessage(text.toLowerCase());
                $(this).val("");
              }

                } else {
                  document.getElementById("InfoPanel").innerHTML = "Letras solamente!";
          //$(this).val(text.substring(0, maxLength));
          // TODO: warning message

        }


        }

         });

  });
