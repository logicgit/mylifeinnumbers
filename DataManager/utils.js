// Get the event date
function getEventDate(eventDateAsString)
{
	var year = eventDateAsString.substr(6,4);
	var month = eventDateAsString.substr(3,2)-1;
	var day = eventDateAsString.substr(0,2);
	var hour = eventDateAsString.substr(11,2);
	var minute = eventDateAsString.substr(14,2);
	var second = eventDateAsString.substr(17,2);

	return new Date(year, month, day, hour, minute, second);
}

function getURLParam(urlParam, useParent) 
{
    var results;
    urlParam = urlParam.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

	if (useParent)
		results = new RegExp("[\\?&]" + urlParam + "=([^&#]*)").exec(decodeURI(parent.parent.location.href));
	else
		results = new RegExp("[\\?&]" + urlParam + "=([^&#]*)").exec(decodeURI(window.location.href));	
		
    return (results == null) ? "" : unescape(results[1].replace(/\+/g," "));
}

// Convert time_t offset to years, months, days etc ...
function elapsedSecondsToString(startYear, startMonth, startDay, startTime, elapsedTime, countUp)
{
	var formattedTime;
	var isItLeapYear = isLeapYear(startYear);
	var years = 0, months = 0, days = 0, minutes = 0, hours = 0, seconds = 0;
	var daysInNonLeapYear = 365;
	var daysInLeapYear = 364;
	var secondsInNonLeapYear = 31536000;
	var secondsInLeapYear = 31622400;
	var secondsInWeek = 604800;
	var secondsInDay = 86400;
	var secondsInHour = 3600;
	var secondsInMinute = 60;
	var monthDaysInNonLeapYear = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var monthSecondsInNonLeapYear = new Array(2678400, 2419200, 2678400, 2592000, 2678400, 2592000, 2678400, 2678400, 2592000, 2678400, 2592000, 2678400);
	var monthDaysInLeapYear = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var monthSecondsInLeapYear = new Array(2678400, 2505600, 2678400, 2592000, 2678400, 2592000, 2678400, 2678400, 2592000, 2678400, 2592000, 2678400);

	
	// Do years then months then days etc
	while (elapsedTime)
	{
		if (startTime == elapsedTime)
			break;
		
		if (elapsedTime >= (isItLeapYear ? secondsInLeapYear : secondsInNonLeapYear))
		{
			years++;
			elapsedTime -= isItLeapYear ? secondsInLeapYear : secondsInNonLeapYear;
			
			if (countUp)
				startYear += 1;
			else
				startYear -= 1;
			
			isItLeapYear = isLeapYear(startYear);
			continue;
		}
		
		if (elapsedTime >= (isItLeapYear ? monthSecondsInLeapYear[startMonth] : monthSecondsInNonLeapYear[startMonth]))
		{
			months++;
			elapsedTime -= isItLeapYear ? monthSecondsInLeapYear[startMonth] : monthSecondsInNonLeapYear[startMonth];
			
			if (countUp)
			{
				if (startMonth == 11)
				{
					startMonth = 0;
					startYear += 1;
					isItLeapYear = isLeapYear(startYear);
				}
				else
					startMonth += 1;
			}
			else
			{
				if (startMonth == 0)
				{
					startMonth = 11;
					startYear -= 1;
					isItLeapYear = isLeapYear(startYear);
				}
				else
					startMonth -= 1;
			}
			
			continue;
		}
		
		if (elapsedTime >= secondsInDay)
		{
			days = (elapsedTime / secondsInDay);
			elapsedTime = elapsedTime % secondsInDay;
			continue;
		}
		
		if (elapsedTime >= secondsInHour)
		{
			hours = (elapsedTime / secondsInHour);
			elapsedTime = elapsedTime % secondsInHour;
			continue;
		}
		
		if (elapsedTime >= secondsInMinute)
		{
			minutes = (elapsedTime / secondsInMinute);
			seconds = elapsedTime % secondsInMinute;
			break;
		}
		
		if (elapsedTime < secondsInMinute)
		{
			seconds = elapsedTime;
			break;
		}
	}
	
	formattedTime = Math.floor(years);
	formattedTime += "yrs ";
	formattedTime += Math.floor(months);
	formattedTime += "mths ";
	formattedTime += Math.floor(days);
	formattedTime += "days ";
	formattedTime += Math.floor(hours);
	formattedTime += "hrs ";
	formattedTime += Math.floor(minutes);
	formattedTime += "mins ";
	formattedTime += Math.floor(seconds);
	formattedTime += "secs ";
	
	return formattedTime;
}

function isLeapYear(year)
{
	return (year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0);
}

function addCommas(s){
    s += '';
    x = s.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;  

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
}

function clearCookies()
{
	document.cookie="MyLifeInNumbersEvents" + "=" + "";
}

function deleteCookie(eventName)
{
	var savedEventsCookie = getCookie();
	var cookieValue = "";

	if (savedEventsCookie == "")
		return;
	
	var eventsCookieArray = savedEventsCookie.split("^^");

	for (var i=0; i < eventsCookieArray.length; i++)
	{
		var eventsFieldsArray = eventsCookieArray[i].split("~~");

		if (eventsFieldsArray[0] == eventName)
			continue;
			
		cookieValue += eventsFieldsArray[0];
		cookieValue += "~~";
		cookieValue += eventsFieldsArray[1];
		
		if (i < (eventsCookieArray.length-2))
			cookieValue += "^^";			
	}
		
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 365);
	var expireString = ";expires="+exdate.toUTCString();

	if (cookieValue)
		document.cookie="MyLifeInNumbersEvents" + "=" + cookieValue+expireString;
	else
		document.cookie="MyLifeInNumbersEvents" + "=" + "";
}

function saveEventAsCookie(eventName, eventDate)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 365);
	var expireString = ";expires="+exdate.toUTCString();

	var savedEventsCookie = getCookie();
	var cookieValue = "";

	if (savedEventsCookie == "")
	{
		cookieValue = eventName + "~~" + eventDate;
		document.cookie="MyLifeInNumbersEvents" + "=" + cookieValue;
		return;
	}
	
	var eventsCookieArray = savedEventsCookie.split("^^");
	var eventExists = false;
	
	for (var i=0; i < eventsCookieArray.length; i++)
	{
		var eventsFieldsArray = eventsCookieArray[i].split("~~");

		if (eventsFieldsArray[0] == eventName)
		{
			eventsFieldsArray[1] = eventDate;
			eventExists = true;
		}
		
		cookieValue += eventsFieldsArray[0];
		cookieValue += "~~";
		cookieValue += eventsFieldsArray[1];
		
		if (i < (eventsCookieArray.length-1))
			cookieValue += "^^";			
	}
	
	if (eventExists == false)
	{
		if (eventsCookieArray.length > 0)
			cookieValue += "^^";
			
		cookieValue += eventName;
		cookieValue += "~~";
		cookieValue += eventDate;
	}
	
	document.cookie="MyLifeInNumbersEvents" + "=" + cookieValue+expireString;
}

function getCookie()
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x=="MyLifeInNumbersEvents")
		{
			return unescape(y);
		}
	}
	
	return "";
}

function getAllEventsFromCookie()
{
	var savedEventsCookie = getCookie();
	var savedEventsArray = new Array();
	
	if (savedEventsCookie == "")
	{
		return savedEventsArray;
	}
	
	var eventsCookieArray = savedEventsCookie.split("^^");
	var eventArray = new Array();
	
	for (var i=0; i < eventsCookieArray.length; i++)
	{
		var eventsFieldsArray = eventsCookieArray[i].split("~~");		
		var event = {elementFields: new Array(eventsFieldsArray[0],eventsFieldsArray[1])};
		savedEventsArray[savedEventsArray.length] = event;
	}
	
	savedEventsArray.sort(arraySort);
	return savedEventsArray;
}

function arraySort(a, b)
{
	var eventDateStringA = a.elementFields[1];
	var eventDateStringB = b.elementFields[1];	
	var eventDateA = getEventDate(eventDateStringA);
	var eventDateB = getEventDate(eventDateStringB);	
	return eventDateB < eventDateA;
}
		
function areWeInLiveMode(useParent)
{
	var liveMode = true;
	var page;
	
	// Which page are we on
	if (useParent)
		page = parent.window.location.href;
	else
		page = window.location.href;		
		
	if (page.indexOf("Custom") != -1)
	{
		liveMode = false;
		events = getAllEventsFromCookie();	
	}		
	
	return liveMode;
}