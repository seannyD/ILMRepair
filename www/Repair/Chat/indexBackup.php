<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
    <title>Chat</title>
    
    <link rel="stylesheet" href="style3.css" type="text/css" />
    
    <script type="text/javascript">
	    var experimentOver = false;
    	// save back button disaster
		window.onbeforeunload = function() { 
			if(!experimentOver){
				//alert("Oops! Click 'OK' then 'Stay on Page'");
				return "Oops! Click 'OK' then 'Stay on Page'";
			}
		};
	</script>
    
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script type="text/javascript" src="chat2.js"></script>

    <script type="text/javascript">
    
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
		
		
		var ex = "CH"+chain_num + "_G" + generation + "-" + mm+'_'+dd+'_'+hh+minmin+ss;
        if(lex_experiment){
        	var startFile = experParams["gen"];
        	var altName = experParams["altName"]
	        ex = altName + "_"+ startFile + "_CH"+chain_num + "-" + mm+'_'+dd+'_'+hh+minmin+ss;
        }
        
        
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
    </script>

</head>

<body onload="setInterval('chat.update()', 2000)">





<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   sodipodi:docname="testPage.svg"
   inkscape:version="0.91 r13725"
   version="1.1"
   id="svg2"
   viewBox="0 0 2048 1536"
   height="1536"
   width="2048">
  <defs
     id="defs4" />
  <sodipodi:namedview
     inkscape:window-maximized="1"
     inkscape:window-y="0"
     inkscape:window-x="0"
     inkscape:window-height="1155"
     inkscape:window-width="1920"
     units="px"
     showgrid="false"
     inkscape:current-layer="RepairButton"
     inkscape:document-units="px"
     inkscape:cy="740.41231"
     inkscape:cx="675.07508"
     inkscape:zoom="0.49497475"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     borderopacity="1.0"
     bordercolor="#666666"
     pagecolor="#ffffff"
     id="base" />
  <metadata
     id="metadata7">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="RepairButtonLayer"
     inkscape:groupmode="layer"
     id="RepairButton"
     transform="translate(0,483.63793)"
     style="display:inline">
    <rect
       style="opacity:1;fill:#ef2b2d;fill-opacity:0.87311826;fill-rule:nonzero;stroke:#000000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       id="rect4614"
       width="279.81226"
       height="138.3909"
       x="874.73682"
       y="577.16565"
       ry="4.9349799"
       inkscape:label="#rect4216"
       onclick="initiateRepair()" />
    <g
       transform="matrix(5.171392,0,0,5.171392,-4293.3428,-4451.3426)"
       style="font-style:normal;font-variant:normal;font-weight:600;font-stretch:normal;font-size:22px;line-height:110.00000238%;font-family:'Lucida Grande';-inkscape-font-specification:'Lucida Grande Semi-Bold';text-align:center;writing-mode:lr-tb;text-anchor:middle;opacity:1;fill:#000000;fill-opacity:0.87311826;fill-rule:nonzero;stroke:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       id="flowRoot4296">
      <path
         d="m 1026.1113,993.00825 0,-2.65332 3.1905,0 0,2.65332 -3.1905,0 z m 3.1905,-4.50098 -3.1905,0 0,-0.30078 q 0,-1.72949 1.5899,-3.49121 l 0.7627,-0.83789 q 1.5468,-1.70801 1.5468,-3.05078 0,-1.99805 -2.5136,-1.99805 -1.6221,0 -3.7168,0.95606 l 0,-2.42774 q 2.1377,-0.64453 4.1787,-0.64453 2.5459,0 4.0176,0.97754 1.4824,0.97754 1.4824,2.66406 0,1.54688 -1.7725,3.22266 l -0.7197,0.6875 q -1.0098,0.95605 -1.3428,1.62207 -0.3222,0.65527 -0.3222,1.70801 l 0,0.91308 z"
         style=""
         id="path4617" />
    </g>
  </g>
  <g
     inkscape:groupmode="layer"
     id="layer6"
     inkscape:label="LeftStimTestLayer"
     style="display:inline">
    <rect
       style="opacity:1;fill:#ffffff;fill-opacity:0.87311826;fill-rule:nonzero;stroke:#009ec8;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       id="leftStimTest"
       width="492.95444"
       height="365.67523"
       x="234.35539"
       y="1018.8019"
       ry="4.9349799"
       inkscape:label="#rect4324" />
    <image
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       y="1037.5127"
       x="285.39111"
       id="leftStimTestImage"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       preserveAspectRatio="none"
       height="322.19275"
       width="322.19275"
       inkscape:label="#image4475" />
    <flowRoot
       xml:space="preserve"
       id="flowRoot4556"
       style="font-style:normal;font-variant:normal;font-weight:600;font-stretch:normal;font-size:22px;line-height:110.00000238%;font-family:'Lucida Grande';-inkscape-font-specification:'Lucida Grande Semi-Bold';text-align:start;writing-mode:lr-tb;text-anchor:start;opacity:1;fill:none;fill-opacity:0.87311826;fill-rule:nonzero;stroke:#009ec8;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"><flowRegion
         id="flowRegion4558"><rect
           id="rect4560"
           width="276.25366"
           height="45.938931"
           x="598.53845"
           y="550.6192" /></flowRegion><flowPara
         id="flowPara4562"></flowPara></flowRoot>  </g>
  <g
     inkscape:groupmode="layer"
     id="cont"
     inkscape:label="contextLayer">
    <rect
       style="opacity:1;fill:#c1e3f1;fill-opacity:0.87311826;fill-rule:nonzero;stroke:#000000;stroke-width:2.68371916;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       id="rect4612"
       width="787.45984"
       height="485.65375"
       x="477.41196"
       y="45.634792"
       ry="5.4370351" />
    <image
       style="display:inline"
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       y="45.542877"
       x="477.3201"
       id="cont1"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       preserveAspectRatio="none"
       height="243.40085"
       width="243.40085"
       inkscape:label="#image4475"
       onclick="listenerClick(0)" />
    <image
       onclick="listenerClick(1)"
       inkscape:label="#image4475"
       width="243.40085"
       height="243.40085"
       preserveAspectRatio="none"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       id="cont2"
       x="720.72095"
       y="45.542877"
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       style="display:inline" />
    <image
       style="display:inline"
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       y="45.542877"
       x="964.12183"
       id="cont3"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       preserveAspectRatio="none"
       height="243.40085"
       width="243.40085"
       inkscape:label="#image4475"
       onclick="listenerClick(2)" />
    <image
       onclick="listenerClick(3)"
       inkscape:label="#image4475"
       width="243.40085"
       height="243.40085"
       preserveAspectRatio="none"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       id="cont4"
       x="477.3201"
       y="288.94373"
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       style="display:inline" />
    <image
       style="display:inline"
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       y="288.94373"
       x="720.72095"
       id="cont5"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       preserveAspectRatio="none"
       height="243.40085"
       width="243.40085"
       inkscape:label="#image4475"
       onclick="listenerClick(4)" />
    <image
       onclick="listenerClick(5)"
       inkscape:label="#image4475"
       width="243.40085"
       height="243.40085"
       preserveAspectRatio="none"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       id="cont6"
       x="964.12183"
       y="288.94373"
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       style="display:inline" />
  </g>
  <g
     inkscape:groupmode="layer"
     id="layer2"
     inkscape:label="ScorePanelLayer">
    <text
       xml:space="preserve"
       style="font-style:normal;font-variant:normal;font-weight:600;font-stretch:normal;font-size:56.3536644px;line-height:110.00000238%;font-family:'Lucida Grande';-inkscape-font-specification:'Lucida Grande Semi-Bold';text-align:start;writing-mode:lr-tb;text-anchor:start;opacity:1;fill:#000000;fill-opacity:0.87311826;fill-rule:nonzero;stroke:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       x="1671.1511"
       y="1482.333"
       id="ScorePanel"
       sodipodi:linespacing="110%"><tspan
         sodipodi:role="line"
         x="1671.1511"
         y="1482.333"
         id="tspan4578"><tspan
           x="1671.1511"
           y="1482.333"
           id="tspan4580">Score:  0/8</tspan></tspan></text>
  </g>
  <g
     inkscape:groupmode="layer"
     id="feedbackPanel"
     inkscape:label="FeedbackPanel"
     style="display:inline">
    <rect
       style="opacity:1;fill:none;fill-opacity:0.87311826;fill-rule:nonzero;stroke:#009ec8;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       id="rect4550"
       width="779.83777"
       height="398.00009"
       x="587.90875"
       y="487.46167"
       ry="4.9349799" />
    <image
       inkscape:label="#image4475"
       width="243.40085"
       height="243.40085"
       preserveAspectRatio="none"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       id="feedbackYouChoseImage"
       x="585.45239"
       y="574.86285"
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png" />
    <image
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       y="544.55829"
       x="1087.4523"
       id="feedbackTheyChoseImage"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       preserveAspectRatio="none"
       height="243.40085"
       width="243.40085"
       inkscape:label="#image4475" />
    <image
       sodipodi:absref="/Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       y="498.09125"
       x="931.88879"
       id="feedbackPanelImage"
       xlink:href="file:///Users/pplsuser/Documents/MPI/ILMs/ILMRepair/RepairExper/Stimuli/s12.png"
       preserveAspectRatio="none"
       height="108.04041"
       width="108.04041"
       inkscape:label="#image4475" />
  </g>
  <g
     inkscape:groupmode="layer"
     id="layer3"
     inkscape:label="InfoPanleLayer">
    <rect
       style="opacity:1;fill:#ffffff;fill-opacity:0.87311826;fill-rule:nonzero;stroke:#009ec8;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       id="InfoPanelCONTAINER"
       width="452.54834"
       height="658.61945"
       x="1581.8989"
       y="-418.42004"
       ry="4.9349799"
       inkscape:label="#rect4304"
       transform="translate(0,483.63793)" />
    <text
       xml:space="preserve"
       style="font-style:normal;font-variant:normal;font-weight:600;font-stretch:normal;font-size:22px;line-height:110.00000238%;font-family:'Lucida Grande';-inkscape-font-specification:'Lucida Grande Semi-Bold';text-align:start;writing-mode:lr-tb;text-anchor:start;opacity:1;fill:#000000;fill-opacity:0.87311826;fill-rule:nonzero;stroke:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       x="1622.3047"
       y="93.164497"
       id="InfoPanel"
       sodipodi:linespacing="110%"
       inkscape:label="#text4544"><tspan
         sodipodi:role="line"
         x="1622.3047"
         y="93.164497"
         id="tspan4546"><tspan
           x="1622.3047"
           y="93.164497"
           id="tspan4548">abc</tspan></tspan></text>
  </g>
  <g
     inkscape:groupmode="layer"
     id="g4595"
     inkscape:label="SpeakersWordLayer">
    <rect
       style="opacity:1;fill:none;fill-opacity:0.87311826;fill-rule:nonzero;stroke:#000000;stroke-width:3.21829844;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       id="rect4583"
       width="571.02808"
       height="219.49496"
       x="1499.4255"
       y="239.32327"
       ry="4.9188828" />
    <text
       inkscape:label="#text4544"
       sodipodi:linespacing="110%"
       id="middleStimTest"
       y="355.17422"
       x="1518.0419"
       style="font-style:normal;font-variant:normal;font-weight:600;font-stretch:normal;font-size:47.38678741px;line-height:110.00000238%;font-family:'Lucida Grande';-inkscape-font-specification:'Lucida Grande Semi-Bold';text-align:start;writing-mode:lr-tb;text-anchor:start;opacity:1;fill:#000000;fill-opacity:0.87311826;fill-rule:nonzero;stroke:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:1.03180003;stroke-opacity:1"
       xml:space="preserve"><tspan
         id="tspan4587"
         y="355.17422"
         x="1518.0419"
         sodipodi:role="line">Speakers Word Here</tspan></text>
  </g>
</svg>








	<div id="background"><img id="backgroundImage"></div>
    
    <div id="leftStim"><img id="leftStimImage"></div>

    
    <div id="rightStim"></div>
    <div id="middleStim"> </div>    


    <div id="rightStimTest"><img id="rightStimTestImage"></div>    
    
    
    <div id="typedInputSurround"></div>
    <p id="typedInput"><input type="text" id="sendie" maxlength = '100' width = '100%' onkeypress="sendTextSignal(event)"></p>

	
	



	<div id="StartButton" onClick="startExperiment()"></div>
	
	<div id="SlideWhistle"></div>
	
	<div id="sendButtonDiv">
		<img id="sendButton" src="" onclick="sendSliderSignal()"> 
	</div>
	
	<div id="retryButton">
		<img id="retryButtonImage" src="" onClick="retrySignal()">
	</div>
	
	<div id="PlayPartnerSignal">
		<img id="playPartnerSignalButton" src="" onclick="playPartnerSignal();"> 
	</div>
	
	<div id="dictionaryPanel">
		<div id="leftDictCol">
			<div id="d1">
				<img id="d1Image" src="">
				<input type="text" id="d1text" onclick="dictionaryTextClick(1)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d2">
				<img id="d2Image" src="">
				<input type="text" id="d2text" onclick="dictionaryTextClick(2)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d3">
				<img id="d3Image" src="">
				<input type="text" id="d3text" onclick="dictionaryTextClick(3)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d4">
				<img id="d4Image" src="">
				<input type="text" id="d4text" onclick="dictionaryTextClick(4)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d5">
				<img id="d5Image" src="">
				<input type="text" id="d5text" onclick="dictionaryTextClick(5)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d6">
				<img id="d6Image" src="">
				<input type="text" id="d6text" onclick="dictionaryTextClick(6)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d7">
				<img id="d7Image" src="">
				<input type="text" id="d7text" onclick="dictionaryTextClick(7)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d8">
				<img id="d8Image" src="">
				<input type="text" id="d8text" onclick="dictionaryTextClick(8)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
		</div>
		<div id="rightDictCol">
			<div id="d9">
				<img id="d9Image" src="">
				<input type="text" id="d9text" onclick="dictionaryTextClick(9)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d10">
				<img id="d10Image" src="">
				<input type="text" id="d10text" onclick="dictionaryTextClick(10)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d11">
				<img id="d11Image" src="">
				<input type="text" id="d11text" onclick="dictionaryTextClick(11)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d12">
				<img id="d12Image" src="">
				<input type="text" id="d12text" onclick="dictionaryTextClick(12)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d13">
				<img id="d13Image" src="">
				<input type="text" id="d13text" onclick="dictionaryTextClick(13)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d14">
				<img id="d14Image" src="">
				<input type="text" id="d14text" onclick="dictionaryTextClick(14)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d15">
				<img id="d15Image" src="">
				<input type="text" id="d15text" onclick="dictionaryTextClick(15)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d16">
				<img id="d16Image" src="">
				<input type="text" id="d16text" onclick="dictionaryTextClick(16)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>		
		</div>
	</div>
	
	<div id="instructions" style="text-align: center;"></div>
	
	<div id="instructionsTitle" style="text-align: center; font-size: 30;"><b>Instructions</b></div>
	
	<div id="AddToNotebook"> 
		<div id="AddToNotebookTitle">Add to Notebook?</div>
		<button id="AddToNotebookYes" type="button" onclick="addToNotebook(true)">Yes</button>
 		<button id="AddToNotebookNo" type="button" onclick="addToNotebook(false)">No</button>
	</div>

	<div id="NextInst" onclick="nextScene()">
		<p style="display: absolute; text-align: center;  vertical-align: middle;  line-height: normal; font-size: 26; ">Volgende</p>
	</div>
	<div id="PrevInst" onclick="previousScene()">
		<p style="display: absolute;  text-align: center; vertical-align: middle;  line-height: normal; font-size: 26; ">Vorige</p>
	</div>
	
	<div id="DataForm" style="position: absolute; top: 100px; left: 50px; height: 500px; width: 500px; font-size: 30px;">
	
			<br />Leeftijd <br />
			<select id='data_age' size="5" style="position: relative; font-size:20px; width:100%;">
				<option>Minder dan 6</option>
				<option>6-9</option>
				<option>10-13</option>
				<option>14-18</option>
				<option selected>19-40</option>
				<option>40+</option>
			</select>
	
	</div>
	

	
	<div id="SynchButton">Synchronise exper</div>
	
	<div id="timerCanvasDiv">
	<canvas id="timerCanvas" width="125" height="125"></canvas> 
	</div>

	<div id="AcceptAndProceedDiv">
		<input type="button" id="AgreeButton" onclick="agreeClick()" value="Start the experiment!">
	<div>
</body>

<script type="text/javascript" src="exper2.js"></script>    
<script type="text/javascript" src="instructions.js"></script>

</html>



