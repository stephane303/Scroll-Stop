chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == "getLocalStorage")
    {
		sendResponse({data: localStorage[request.key]});
    }
	else if(request.method == "blockIcon")
	{
		chrome.browserAction.setIcon
		({
				path: "../images/icon19.png",
				tabId: sender.tab.id
		});
	}
	else if(request.method == "normIcon")
	{
		chrome.browserAction.setIcon
		({
				path: "../images/icon19-grey.png",
				tabId: sender.tab.id
		});
	}
	else if(request.method == "closeTab")
	{
		chrome.tabs.remove(sender.tab.id);
	}
	else
	{
      		sendResponse({}); // snub them.
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	passData();
	if(changeInfo.url != null) //if the url of a tab was changed
	{
		if(siteBlocked(changeInfo.url))
		{
			chrome.browserAction.setIcon
			({
				path: "../images/icon19.png",
				tabId: tabId
			});
		}
	}
	else //page was reloaded
	{
		if(siteBlocked(tab.url))
		{
			chrome.browserAction.setIcon
			({
				path: "../images/icon19.png",
				tabId: tabId
			});
		}
	}
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, function(tab)
  {
	if(tab.url != null)
	{
		passData();

		if(siteBlocked(tab.url))
		{
			//set icon to blocked icon
			chrome.browserAction.setIcon
			({
				path: "../images/icon19.png",
				tabId: activeInfo.tabId
			});
		}
		else
		{
			chrome.browserAction.setIcon
			({
				path: "../images/icon19-grey.png",
				tabId: activeInfo.tabId
			});
		}
	}
  });
});

function passData() //pass parameters to the inline scripts
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
	  chrome.tabs.sendMessage(tabs[0].id, {method: "setURLs", data: localStorage["siteURLs"]}, function(response)
	  {
		console.log(response);
	  });
	});

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
	  chrome.tabs.sendMessage(tabs[0].id, {method: "setPxs", data: localStorage["sitePxs"]}, function(response)
	  {
		console.log(response);
	  });
	});

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
	  chrome.tabs.sendMessage(tabs[0].id, {method: "setClose", data: localStorage["closeBehav"]}, function(response)
	  {
		console.log(response);
	  });
	});

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
	  chrome.tabs.sendMessage(tabs[0].id, {method: "setRedirect", data: localStorage["redirectURL"]}, function(response)
	  {
		console.log(response);
	  });
	});
}

function siteBlocked(url)
{
	var siteURLs = localStorage["siteURLs"];
	if(typeof siteURLs == 'undefined')
		return false
	var siteArray = siteURLs.split(",");
	for(var i = 0; i < siteArray.length; i++)
	{
		if(url.indexOf(siteArray[i]) > -1 && siteArray[i] != "" )
		{
			websiteIndex = i;
			return true;
		}
	}
	return false;
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "openChallenge") {
	  chrome.windows.create({
		url: "challenge.html",
		type: "popup",
		width: 320,
		height: 200,
	  });
	}
  });
