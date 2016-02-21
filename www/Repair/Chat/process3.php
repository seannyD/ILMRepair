<?php

	function endsWith($haystack, $needle)
	{
		return $needle === "" || substr($haystack, -strlen($needle)) === $needle;
	}

    $function = $_POST['function'];
    
    $log = array();
    
    switch($function) {
    
    	 case('getState'):
         	$chatFile = '../../../private/Repair/chat_scratch/'.$_POST['chat_file'];
        	 if(file_exists($chatFile)){
               $lines = file($chatFile);
        	 }
             $log['state'] = count($lines); 
        	 break;	
    	
    	 case('update'):
        	$state = $_POST['state'];
			$chatFile = '../../../private/Repair/chat_scratch/'.$_POST['chat_file'];
        	if(file_exists($chatFile)){
        	   $lines = file($chatFile);
        	 }
        	 $count =  count($lines);
        	 if($state == $count){
        		 $log['state'] = $state;
        		 $log['text'] = false;
        		 
        		 }
        		 else{
        			 $text= array();
        			 $log['state'] = $state + count($lines) - $state; // this seems redundant?
        			 foreach ($lines as $line_num => $line)
                       {
        				   if($line_num >= $state){
                         $text[] =  $line = str_replace("\n", "", $line);
        				   }
         
                        }
        			 $log['text'] = $text; 
        		 }
        	  
             break;
    	 
    	 case('send'):
		  $nickname = htmlentities(strip_tags($_POST['nickname']));
		  $toUser = htmlentities(strip_tags($_POST['toUser']));
 		  $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
		  $message = htmlentities(strip_tags($_POST['message']));
		  $chatFile = '../../../private/Repair/chat_scratch/'.$_POST['chat_file'];
		 if(($message) != "\n"){
        	
			 if(preg_match($reg_exUrl, $message, $url)) {
       			$message = preg_replace($reg_exUrl, '<a href="'.$url[0].'" target="_blank">'.$url[0].'</a>', $message);
				} 
			 
        	
        	 fwrite(fopen($chatFile, 'a'), $nickname . "@". $toUser. "%" . $message = str_replace("\n", " ", $message) . "\n"); 
		 }
        	 break;
        	 
    	 case('send-results'):
    	 $fileName = htmlentities(strip_tags($_POST['filename']));
    	 $results = htmlentities(strip_tags($_POST['results']));
		 if(strpos($fileName, '/') === FALSE){
		 	
		 	if(endsWith($fileName,'.lang') || endsWith($fileName,'.order')){
				// language file, overwrite completely
				// order file, overwrite completely
					$writeToFolder = '../../../private/Repair/experiments/';
					
				 if(fwrite(fopen($writeToFolder . $fileName,'w'),$results."\n")){
				 //if(fwrite(fopen('../../../ILM_HTML_Results/' . $fileName,'a'),$results."\n")){
					 $log['state'] = "WRITTEN";	
					}
				 else{
					$log['state'] = "Not written";
					 }
		 	}
		 	else{
				// round results file
				 $writeToFolder = '../../../private/Repair/results/';
				 if(fwrite(fopen($writeToFolder . $fileName,'a'),$results."\n")){
				 //if(fwrite(fopen('../../../ILM_HTML_Results/' . $fileName,'a'),$results."\n")){
					 $log['state'] = "WRITTEN";	
					}
				 else{
					$log['state'] = "Not written";
					 }
		   		}
		   	 }
    	 break;
    	 
    	 case('get-experiment'):
    	     $fileName = htmlentities(strip_tags($_POST['filename']));
    	     $filetype = htmlentities(strip_tags($_POST['filetype']));    	     
	      	if(strpos($fileName, '/') === FALSE){
				if(file_exists('../../../private/Repair/experiments/'.$fileName)){
				
				  // $lines = file('experiments/'.$fileName);
				   $log['contents'] = file_get_contents('../../../private/Repair/experiments/'.$fileName);
				   $log['filetype'] = $filetype;
				 }
        	 }
    	 break;
    	 
    	 
    	 case('wipe-chat-file'):
	    	$chatFile = '../../../private/Repair/chat_scratch/'.$_POST['chat_file'];
    	 	fwrite(fopen($chatFile, 'w'),'');
    	 	chmod($chatFile,0777);
    	 break;
    	 
    	 case("get-results-file-list"):
  	 		$log['files'] = implode(",",scandir('../../../private/Repair/experiments/'));
    	 break;
    	 
    	 case("send-partData"):
	    	 $text = $_POST['text']."\n";
  	 		 fwrite(fopen("../../../private/Repair/partDetails/partDetails.txt",'a'),$text."\n");
  	 		 chmod($chatFile,0777);
    	 break;
    	
    }
    
    echo json_encode($log);

?>