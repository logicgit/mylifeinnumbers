var defaultEvent;
var defaultEventDate;
var events = liveEvents;
var liveMode = true;

$(document).ready(
    function(){
		//clearCookies();
		initEvents();
    }    
);

function initEvents()
{
	liveMode = areWeInLiveMode();
	if (!liveMode)
	{
		events = getAllEventsFromCookie();
		
		if (events.length == 0)
		{
			// Create start of the day event
			var dateNow = new Date();
			var month = dateNow.getMonth();
			month++;
			var monthString = (month > 9 ? month : "0" + month);
			var dateString = dateNow.getDate() + "-" +
							 monthString + "-" +
							 dateNow.getFullYear() + " 00:00:00";
			var event = {elementFields: new Array("the start of the day", dateString)};
			events[0] = event;
		}		
	}
	loadTables();
	
	defaultEvent = getURLParam("defaultEvent", true);		
	defaultEventDate = getURLParam("date", true);			
	
	if (defaultEvent != "")
		defaultEventSelected();
	else
	{
	if (liveMode)
		displayEvent(events[23]);
	else
		displayEvent(events[0]);
	}
}

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
    var cell_num=1;
	if (!liveMode)
		cell_num=2;
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
	for(var i=0; i < events.length; i++)
	{
		var event = events[i];
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
		
		// Create the delete X
		if (!liveMode && eventName != "the start of the day")
		{
			cell[1]=document.createElement('td');
			deleteLink = document.createElement('a');
			deleteLink.setAttribute("class", "liveEventName");
			deleteLink.innerText = "X";
			deleteLink.setAttribute('href', '#');	
			deleteLink.onclick = deleteEvent;			
			cell[1].setAttribute("class", "deleteX");	
			cell[1].appendChild(deleteLink);
			row[rowCount].appendChild(cell[1]);	
		}
		
		tbo.appendChild(row[rowCount++]);	
	}
	
	tab.appendChild(tbo);     
	tableDiv.appendChild(tab);
}

function defaultEventSelected()
{
	// Do we have a default date
	if (defaultEventDate && defaultEventDate != "")
	{
		var event = {elementFields: new Array(defaultEvent,defaultEventDate)};
	}
	else
	{
		// Find the event
		var event;
		
		for(var i=0; i < events.length; i++)
		{
			var event = events[i];
			if (event.elementFields[0] == defaultEvent)
				break;
		}	
	}
	
	displayEvent(event);
}

function eventSelected()
{
	// Find the event
	var event;
	
	for(var i=0; i < events.length; i++)
	{
		var event = events[i];
		if (event.elementFields[0] == this.innerText)
			break;
	}	

	displayEvent(event);	
	return false;
}

function deleteEvent()
{
	// Find the event
	var tableRow = this.parentNode.parentNode;
	eventName = tableRow.childNodes[0].innerText;
	
	// Delete the event
	deleteCookie(eventName);
	
	// Reload event list
	window.location.href = window.location.href;
	
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
		
	var widgetTitle;
	var widgetLeft;
	var widgetRight;
	
	if (liveMode)
	{
		widgetTitle = parent.parent.document.getElementById("widget1-frame");	
		widgetLeft = parent.parent.document.getElementById("widget2-frame");	
		widgetRight = parent.parent.document.getElementById("widget4-frame");	 
	}
	else
	{
		widgetTitle = parent.parent.document.getElementById("widget1-frame");	
		widgetLeft = parent.parent.document.getElementById("widget3-frame");	
		widgetRight = parent.parent.document.getElementById("widget5-frame");	 
	}
	var title = widgetTitle.contentDocument.getElementById("liveFrameTitle");	
	title.src="../DataManager/LoadLiveEventTitle.html?title="+titleString+event.elementFields[0];
	var left = widgetLeft.contentDocument.getElementById("liveFrameLeft");	
	left.src="../DataManager/LoadLiveEventMeasures.html?side=left&eventName="+event.elementFields[0]+"&eventDate="+event.elementFields[1];
	var right = widgetRight.contentDocument.getElementById("liveFrameRight");	;		
	right.src="../DataManager/LoadLiveEventMeasures.html?side=right&eventName="+event.elementFields[0]+"&eventDate="+event.elementFields[1];
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


