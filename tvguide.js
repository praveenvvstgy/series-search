webix.ready(function () {
	webix.ui({
		container: "container",
		id: "mainContainer",
		type: "space",
		adjust: true,
		rows: [
				{template: "Series Guide", type: "header"},
				{
					view: "toolbar",
					id: "mainToolbar",
					cols: [
						{view: "text", id: "searchInput", placeholder: "Search Series"},
						{view: "button", value:"Search", width: 150, click: "search_series"}
					]
				},
				{cols: [
					{
						view: "list",
						id: "resultContainer",
						container: "searchResults",
						type: {
							autoheight: true,
							height: 1000,
							template: '<div class="span_4_of_4"><div class="col span_2_of_4 image" style="background-image: url(#banner#);"><h2><span class="imgtitle">#title#</span></h2></div><div class="col span_2_of_4"><h1>#title# <span class="seriesyear">(#year#)</span></h1><p>#overview#</p><h3>Air Time: #air_time#</h3><h3>Country: #country#</h3></div></div>'
						}
					}
				]}
			]
	});
});

function make_request (apiurl) {
	$.ajax({
		type: "GET",
		url: apiurl,
		jsonp: "callback",
		dataType: "jsonp",
		crossDomain: true,
		success: function(response) {
			update_search_results(response);
		}
	});

}

function search_series() {
	var query = $$("searchInput").getValue().split(' ').join('+');
	if (query == "") {
		webix.message({type:"error", text:"Enter a Series Name"});
		return false;
	};
	webix.extend($$("resultContainer"), webix.OverlayBox);
	$$("resultContainer").showOverlay();

	var apiurl = "http://api.trakt.tv/search/shows.json/90355c5aef55d13a75b1b740368024f5?query=" + query;
	make_request(apiurl)
}

function update_search_results(results) {
	console.log(results);
	var resultContainer = $$("resultContainer");
	resultContainer.hideOverlay();

	resultContainer.clearAll();

	$.each(results, function(i, show){
		resultContainer.add({
			title: show.title,
			banner: show.images.poster,
			year: show.year,
			overview: show.overview,
			air_time: show.air_time,
			country: show.country,
		});
		resultContainer.refresh();
	});
}