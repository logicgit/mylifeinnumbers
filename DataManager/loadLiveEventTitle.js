var title;
var liveMode;

$(document).ready(
    function(){
		liveMode = areWeInLiveMode(true);
		title = getURLParam("title");	
		loadTitle();	
    }    
);

function loadTitle()
{   
	// Add title to container
    var contentDiv = document.createElement('div');
	contentDiv.setAttribute("class", "titleText");
	contentDiv.style.display = "none"; 
	$(contentDiv).fadeIn();
	
	if (title == "")
	{
		if (liveMode)
			title = "Since " + liveEvents[0].elementFields[0];
		else
		{
			var customEvents = getAllEventsFromCookie();
			if (customEvents.length)
			{
				var dateNow = new Date();
				var eventName = customEvents[0].elementFields[0];
				var eventDate = customEvents[0].elementFields[1];
				if (dateNow < eventDate)
					title = "Until " + eventName;
				else
					title = "Since " + eventName;
			}
			else
				title = "No events created";
		}
	}
		
	dataItem = document.createTextNode(title);
	contentDiv.appendChild(dataItem);            
	document.getElementById("container").appendChild(contentDiv);    
}