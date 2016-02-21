<?php

// make experiment files

$bottleneck = 16; // size of bottleneck
// experiment structure for first generation
$cycles_firstGen = array("Test","Test");
// experiment structure for later generations generation
$cycles_laterGen = array("PracticeTrain","Break","PracticeTest","Break","Train","Break","Test","Test");

$cycles_LearnOnly= array("PracticeTrain","Break10","PracticeTrain","PracticeTest","Train","Break60","Train","Break60","Train","Break60","Train","Break60","Test","Test");
$cycles_ExpressOnly= array("PracticeTest","Test","Test");
$cycles_LearnAndExpress= array("PracticeTrain","Break10","PracticeTrain","PracticeTest","Train","Break60","Train","Break60","Train","Break60","Train","Break60","Test","Test");

// total number of stimuli
$numStimuli = 16;

// number of rounds per cycle
$numTrainingRoundsPerCycle = $bottleneck;
$numTestRoundsPerCycle = $numStimuli;


function repeat_array2 ($arr,$desiredLength){
	$newArray = array();
	$i = 0;
	while(count($newArray)<$desiredLength){
		array_push($newArray,$arr[$i]);
		$i += 1;
		if($i == count($arr)){
			$i = 0;
		}
	}
	return $newArray;
}

$log = array(); // for output

 // is it a first generation? Get from POST
 // '1' = yes, other = no
$firstGen = $_POST["firstGen"];
if($firstGen==null){
	$firstGen = "0";
}

$filename = $_POST["filename"];


// experiment structure
$cycles = $cycles_laterGen;
// experiment structure for first generation
if($firstGen=="1"){
	$cycles = $cycles_firstGen;
}

$experType = $_POST["experType"];

if($experType=="LearnOnly"){
	$cycles = $cycles_LearnOnly;
}
if($experType=="ExpressOnly"){
	$cycles = $cycles_ExpressOnly;
}
if($experType=="LearnAndExpress"){
	$cycles = $cycles_LearnAndExpress;
}




$stimList = range(0,$numStimuli-1);

$roundNum = 0;
$training="";
$stim="";
$partBreak = "0";
$message = "";
$RoleSwitch = "1";
$practice = "0";

// Select random bottleneck
$rStims = range(0,$numStimuli-1);
shuffle($rStims);
$bottleneck_stims = array_slice($rStims,0,$bottleneck);

$header = "Round	Stimulus	Training	PartBreak	Message	RoleSwitch	Practice";
$retX =$header."\n";

foreach($cycles as $cy){
	
	
	
	if($cy=="Train"){
	// training round
	
		$training="1";
		$trAr = repeat_array2($bottleneck_stims,$numTrainingRoundsPerCycle);
		shuffle($trAr);
		foreach($trAr as $tr){
			$stim = $tr;
			$thisLine = array($roundNum,$stim,$training,$partBreak,$message,$RoleSwitch,$practice);
			$retX = $retX.implode("\t",$thisLine);
			$retX = $retX."\n";
			$roundNum += 1;
		}
	
	}
	else{	
	
		if($cy=="Test"){
		// test round
			$training="0";
			$trAr = repeat_array2($stimList,$numTestRoundsPerCycle);
			shuffle($trAr);
			foreach($trAr as $tr){
				$stim = $tr;
				$thisLine = array($roundNum,$stim,$training,$partBreak,$message,$RoleSwitch,$practice);
				$retX = $retX.implode("\t",$thisLine);
				$retX = $retX."\n";
				$roundNum += 1;
			}
		
		}
		else{
		
			if($cy=="PracticeTrain"){
				// add practice rounds
				foreach(range(-1,-4) as $pr){
					$training="1";
					$stim = $pr;
					$thisLine = array($roundNum,$stim,$training,$partBreak,$message,$RoleSwitch,"1");
					$retX = $retX.implode("\t",$thisLine);
					$retX = $retX."\n";
					$roundNum += 1;
				}
			
			}
			else{
				if($cy=="PracticeTest"){
					foreach(range(-1,-4) as $pr){
						$training="0";
						$stim = $pr;
						$thisLine = array($roundNum,$stim,$training,$partBreak,$message,$RoleSwitch,"1");
						$retX = $retX.implode("\t",$thisLine);
						$retX = $retX."\n";
						$roundNum += 1;
					}
					// add break before real round
					$thisLine = array($roundNum,"0","1","10","<br />Prepare for the real experiment!",$RoleSwitch,"1");
					$retX = $retX.implode("\t",$thisLine);
					$retX = $retX."\n";
				}
				else{			
					// break - message set in exper.js
					$breakLength = 60;
					$breakMessage = " ";
					if($cy=="Break10"){
						$breakLength = 10;
					}
					if($cy=="BreakF"){
						$breakMessage = "<br />Prepare for the real experiment!";
					}
					$retX = $retX.$roundNum."\t0\t0\t".$breakLength."\t \t0\t0\n";
					}
				}
		}
	
	}

}

$writeToFolder = '../../../private/LEX/experiments/';
fwrite(fopen($writeToFolder . $filename,'w'),$retX);

$log["contents"] = $retX;
echo json_encode($log);



?>