var defaultEvent;
var customEvents;
$(document).ready(
    function(){
		loadTables();	
		defaultEvent = getURLParam("defaultEvent", true);		
		if (defaultEvent != "")
			defaultEventSelected();
		customEvents = getAllEventsFromCookie();
    }    
);

function loadTables()
{   
    // Content div
    var contentDiv = document.createElement('div');
    var classString = "content";
	contentDiv.setAttribute("class", classString);
	contentDiv.style.display = "none"; 
	$(contentDiv).fadeIn();
        
	// Table div
	var tableDiv = document.createElement('div');
	var tableDivString = "liveEventNames";
	tableDiv.setAttribute("id", tableDivString);
	contentDiv.appendChild(tableDiv);
                
	// Add to container
	document.getElementById("container").appendChild(contentDiv);    

    // Actual table
	row=new Array();
	cell=new Array();
    cell_num=1;
    tab=document.createElement('table');
    tab.setAttribute('id','liveEventsNameTable');
	tbo=document.createElement('tbody');
	
	var dateNow = new Date();
	
	// Since row
	var rowCount = 0;
	row[rowCount]=document.createElement('tr');
	cell[0]=document.createElement('td');
	dataItem = document.createTextNode("Since (click on an event)");
	cell[0].setAttribute("class", "header");	
	cell[0].appendChild(dataItem);
	row[rowCount].appendChild(cell[0]);
	tbo.appendChild(row[rowCount++]);	
	var untilRowAdded;

	// Find the events that are going in this table
	for(var i=0; i < liveEvents.length; i++)
	{
		var event = liveEvents[i];
        var eventName = event.elementFields[0];
        var eventDateString = event.elementFields[1];
		var eventDate = getEventDate(eventDateString);			

		if (!untilRowAdded && dateNow < eventDate)
		{
			row[rowCount]=document.createElement('tr');
			cell[0]=document.createElement('td');
			dataItem = document.createTextNode("Until (click on an event)");
			cell[0].setAttribute("class", "header");	
			cell[0].appendChild(dataItem);
			row[rowCount].appendChild(cell[0]);	
			tbo.appendChild(row[rowCount++]);	
			untilRowAdded = true;
		}
		
		// Create the name row/cell
		row[rowCount]=document.createElement('tr');
		cell[0]=document.createElement('td');
		linkLeft = document.createElement('a');
		linkLeft.setAttribute("class", "liveEventName");
		linkLeft.innerText = eventName;
		linkLeft.setAttribute('href', '#');	
		linkLeft.onclick = eventSelected;
		cell[0].appendChild(linkLeft);
		row[rowCount].appendChild(cell[0]);		
		tbo.appendChild(row[rowCount++]);	
	}
	
	tab.appendChild(tbo);     
	tableDiv.appendChild(tab);
	
	/*for(i=1; i<tab.getElementsByTagName("tr").length; i++)
	{
        row = tab.getElementsByTagName("tr")[i];
        row.onmouseover=changeColor;
		row.onmouseout=changeColorBack;
		row.onclick=eventSelected;
	}*/
}
/*
		// Create the name row/cell
		row[rowCount]=document.createElement('tr');
		cell[0]=document.createElement('td');
		linkLeft = document.createElement('a');
		linkLeft.setAttribute("class", "liveEventName");
		linkLeft.innerText = eventName;
		linkLeft.setAttribute('href', '../DataManager/LoadLiveEventMeasures.html?side=left&eventName='+eventName);	
		linkLeft.setAttribute('target', 'liveLeft' );				
		linkLeft.setAttribute("class", "liveEventName");
		cell[0].appendChild(linkLeft);
		linkRight = document.createElement('a');
		linkRight.setAttribute("class", "liveEventName");
		linkRight.setAttribute('href', '../DataManager/LoadLiveEventMeasures.html?side=right&eventName='+eventName);	
		linkRight.setAttribute('target', 'liveRight' );				
		linkRight.setAttribute("class", "liveEventName");		
		cell[0].appendChild(linkRight);
		row[rowCount].appendChild(cell[0]);		
		tbo.appendChild(row[rowCount++]);	
*/

function defaultEventSelected()
{
	// Find the event
	var event;
	
	for(var i=0; i < liveEvents.length; i++)
	{
		var event = liveEvents[i];
		if (event.elementFields[0] == defaultEvent)
			break;
	}	

	displayEvent(event);
}

function eventSelected()
{
	// Find the event
	var event;
	
	for(var i=0; i < liveEvents.length; i++)
	{
		var event = liveEvents[i];
		if (event.elementFields[0] == this.innerText)
			break;
	}	

	displayEvent(event);	
	return false;
}

function displayEvent(event)
{
	var dateNow = new Date();
	var titleString = "Since ";
    var eventDateString = event.elementFields[1];
	var eventDate = getEventDate(eventDateString);		
	
	if (dateNow < eventDate)
		titleString = "Until ";
		
	var widgetTitle = parent.parent.document.getElementById("widget1-frame");	
	var title = widgetTitle.contentDocument.getElementById("liveFrameTitle");	
	title.src="../DataManager/LoadLiveEventTitle.html?title="+titleString+event.elementFields[0];
	var widgetLeft = parent.parent.document.getElementById("widget2-frame");	
	var left = widgetLeft.contentDocument.getElementById("liveFrameLeft");	
	left.src="../DataManager/LoadLiveEventMeasures.html?side=left&eventName="+event.elementFields[0];
	var widgetRight = parent.parent.document.getElementById("widget4-frame");		
	var right = widgetRight.contentDocument.getElementById("liveFrameRight");	;		
	right.src="../DataManager/LoadLiveEventMeasures.html?side=right&eventName="+event.elementFields[0];
}

function changeColor()
{
	row = tab.getElementsByTagNamegetElementsByTagName("tr")[this.rowIndex];
	row.style.backgroundColor = '#dcfac9'
}

function changeColorBack()
{
	row = tab.getElementsByTagName("tr")[this.rowIndex];
	row.style.backgroundColor = 'black';
}


