$(document).ready(
    function(){
    }    
);

function saveEvent()
{
	eventNameIn = document.getElementById("eventNameInput").value;
	eventDateIn = document.getElementById("eventDateInput").value;
	
	if (!eventNameIn || eventNameIn == "")
	{
		alert("Please enter event name.");
		return;
	}

	if (!eventDateIn || eventDateIn == "")
	{
		alert("Please enter event date ( dd-MM-yyyy hh:mm:ss ).");
		return;		
	}

	if (eventNameIn != "" && eventDateIn != "")
	{
		saveEventAsCookie(eventNameIn, eventDateIn);	
		window.opener.parent.parent.location.href = "/Custom_Events.html?defaultEvent="+eventNameIn;
	}
	window.close();
}

