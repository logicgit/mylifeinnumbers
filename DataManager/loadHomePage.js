var eventDate;
   
$(document).ready(
    function(){
		loadTable();	
		window.setInterval(update, 50);
    }    
);

function loadTable()
{   
    // Content div
    var contentDiv = document.createElement('div');
    var classString = "content";
	contentDiv.setAttribute("class", classString);
	contentDiv.style.display = "none"; 
	$(contentDiv).fadeIn();
        
	// Table div
	var tableDiv = document.createElement('div');
	var tableDivString = "tableDiv";
	tableDiv.setAttribute("id", tableDivString);
	contentDiv.appendChild(tableDiv);
                
	// Add to container
	document.getElementById("container").appendChild(contentDiv);    

    // Actual table
	row=new Array();
	cell=new Array();
    cell_num=1;
    tab=document.createElement('table');
    tab.setAttribute('id','mainTable');
	tbo=document.createElement('tbody');

	// Find the events/measures that are going in this table
	var rowId = 0;
	for(var i=0; i < homePageEvents.length; i++)
	{
		var event = homePageEvents[i][0];
        var eventName = event.elementFields[0];
		var measure = homePageEvents[i][1];
        var measureName = measure.elementFields[0];
		var displayString = measureName;
		var eventDateString = event.elementFields[1];
		var eventDate = getEventDate(eventDateString);		
		var dateNow = new Date();
		
		if (dateNow < eventDate)
			displayString += " until ";
		else
			displayString += " since ";
			
		displayString += eventName;
		
		// Create the name row/cell
		row[rowId]=document.createElement('tr');
		cell[0]=document.createElement('td');
		cell[0].setAttribute("class", "name");
		dataItem = document.createTextNode(displayString);
		cell[0].appendChild(dataItem);
		row[rowId].appendChild(cell[0]);
		tbo.appendChild(row[rowId]);	
		rowId++;
		
		// Create the number row/cell
		row[rowId]=document.createElement('tr');
		cell[0]=document.createElement('td');
		cell[0].setAttribute("class", "number");
		cell[0].setAttribute("id", i);	
		row[rowId].appendChild(cell[0]);
		tbo.appendChild(row[rowId]);				
		rowId++;
		
		// Create empty row
		row[rowId]=document.createElement('tr');
		cell[0]=document.createElement('td');
		cell[0].setAttribute("class", "hidden");		
		dataItem = document.createTextNode("BlankRow");
		cell[0].appendChild(dataItem);
		row[rowId].appendChild(cell[0]);
		tbo.appendChild(row[rowId]);		
		rowId++;		
	}
	
	tab.appendChild(tbo);     
	tableDiv.appendChild(tab);
}

// Do the calculations
function update(){
	// Find the events/measures that are going in this table
	for(var i=0; i < homePageEvents.length; i++)
	{
		var event = homePageEvents[i][0];
        var eventName = event.elementFields[0].split(' ').join('');		
		var eventDateString = event.elementFields[1];
		var measure = homePageEvents[i][1];
		var measureRate = measure.elementFields[3];
		var eventDate = getEventDate(eventDateString);
		var calc = calculate(eventDate, measureRate);

		$("#"+i).text(calc);
	}
}

// Calculate and format output
function calculate(eventDate, rate){
    var dateNow = new Date();
    var elapsedInSeconds = (dateNow.getTime() - eventDate.getTime()) / 1000;
    var rateAdjusted = Math.abs(elapsedInSeconds * rate);
    return (addCommas(rateAdjusted.toFixed(0)));   
}
