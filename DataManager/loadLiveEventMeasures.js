var liveEvent;
var liveEventDateAsString;
var liveEventDateTime;
var liveEventDate;
var liveMeasures;
var livemode;

$(document).ready(
    function(){	
		liveMode = areWeInLiveMode(true);		
		var side = getURLParam("side");
		var liveEventName = getURLParam("eventName");
		var liveEventDateAsString = getURLParam("eventDate");				
		if (liveEventDateAsString && liveEventDateAsString != "")
			liveEventDate = getEventDate(getURLParam("eventDate"));
		
		if (side == "right")
			liveMeasures = liveMeasuresRight;
		else
			liveMeasures = liveMeasuresLeft;			

		loadTables();	
		
		if (liveEventName != "")
			liveEventDateTime = liveEventDate.getTime();
		else
			liveEventDateTime = 0;
		window.setInterval(updateLiveEvent, 50);
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
        
	// Create a new table for each measure category
	for(var i=0; i < liveMeasures.length; i++)
	{
		var liveMeasure = liveMeasures[i];
		var tableDiv = document.createElement('div');
		var tableDivString = "liveMeasure" + i;
		tableDiv.setAttribute("id", tableDivString);
		contentDiv.appendChild(tableDiv);
                
		// Actual table
		row=new Array();
		cell=new Array();
		cell_num=2;
		tab=document.createElement('table');
		tab.setAttribute("class", "liveEventsMeasuresTable");
		tbo=document.createElement('tbody');
		
		// Create the header
		header=document.createElement('th');
		dataItem = document.createTextNode(liveMeasure[0].elementFields[2]);
		header.appendChild(dataItem);
		tab.appendChild(header);
		
		// Add to table div
		tableDiv.appendChild(tab);
		
		// Find the measures that are going in this table
		for(var j=0; j < liveMeasure.length; j++)
		{
			var measureName = liveMeasure[j].elementFields[0];
			var measureId = liveMeasure[j].elementFields[1];			
			
			// Check the earliest measure date
			var measureDateAsString = liveMeasure[j].elementFields[5];
			
			if (measureDateAsString != "")
			{
				var measureDate = getEventDate(measureDateAsString);
			
				if (liveEventDate < measureDate)
					continue;
			}
			
			// Create the name row/cell
			row[j]=document.createElement('tr');
			cell[0]=document.createElement('td');
			cell[0].setAttribute("class", "liveName");
			dataItem = document.createTextNode(measureName);
			cell[0].appendChild(dataItem);
			row[j].appendChild(cell[0]);
			
			// Create the number cell
			cell[1]=document.createElement('td');
			cell[1].setAttribute("class", "liveNumber");
			cell[1].setAttribute("id", measureId);	
			row[j].appendChild(cell[1]);

			// Add the row to the table
			tbo.appendChild(row[j]);	
		}
	
		// Add the table body and table
		tab.appendChild(tbo);     
		tableDiv.appendChild(tab);
	}

	// Add to container
	document.getElementById("container").appendChild(contentDiv);    
}

// Do the calculations
function updateLiveEvent()
{
	if (liveEventDateTime == 0)
		return;
		
	var dateNow = new Date();
    var elapsedInSeconds = (dateNow.getTime() - liveEventDateTime) / 1000;
	
	for (var i=0; i < liveMeasures.length; i++)
	{
		var liveMeasure = liveMeasures[i];
		
		for(var j=0; j < liveMeasure.length; j++)
		{
			var measureId = "#" + liveMeasure[j].elementFields[1];	
			var measureRate;
			if (liveMeasure[j].elementFields[1] == "Minutes")
				measureRate = 1/60;
			else if (liveMeasure[j].elementFields[1] == "Hours")
				measureRate = 1/60/60;
			else if (liveMeasure[j].elementFields[1] == "Days")
				measureRate = 1/60/60/24;
			else
				measureRate = liveMeasure[j].elementFields[3];
			var calc = calculateLiveEvent(elapsedInSeconds, measureRate);
			$(measureId).text(calc);
		}
	}
}

// Calculate and format output
function calculateLiveEvent(elapsedInSeconds, rate)
{
    var rateAdjusted = Math.floor(Math.abs(elapsedInSeconds * rate));
    return (addCommas(rateAdjusted.toFixed(0)));   
}

