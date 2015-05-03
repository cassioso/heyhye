var mid;
var imgid;
var firstLoad = true;
var request = { getParameter: _getParameter };

function _getParameter(querystring) {
	var querystr = new Array();
	loc = window.location.search.substr(1).split('&');
	
	if ((loc!='')&&(loc!=null)) {
		for (var icnt=0; icnt< loc.length; icnt++){
			var q = loc[icnt].split('=');
			querystr[q[0]] = q[1];
		}
		return querystr[querystring];
	}else{
		return(null);
	}
}

$.extend({
	URLEncode:function(c){var o='';
	var x=0;
	c=c.toString();
	var r=/(^[a-zA-Z0-9_.]*)/;
	while(x<c.length){
		var m=r.exec(c.substr(x));
		if(m!=null && m.length>1 && m[1]!=''){
			o+=m[1];
			x+=m[1].length;
		}else{
			if(c[x]==' ')
				o+='+';
			else{
				var d=c.charCodeAt(x);
				var h=d.toString(16);
				o+='%'+(h.length<2?'0':'')+h.toUpperCase();
			}
			x++;
		}
	}return o;
}, URLDecode:function(s){
	var o=s;
	var binVal,t;
	var r=/(%[^%]{2})/;
	while((m=r.exec(o))!=null && m.length>1 && m[1]!=''){
		b=parseInt(m[1].substr(1),16);
		t=String.fromCharCode(b);
		o=o.replace(m[1],t);
	}
	return o;
} });

$(document).keyup(function(e){
	if(e.which == 77) {
		randomizeMusic();
		return true;
	} if(e.which == 73) {
		randomizeImage();
		return true;
	} if(e.which == 66) {
		randomize();
		return true;
	}
});

function randomize(){
	randomizeMusic();
	randomizeImage();
	firstLoad = false;
}

function randomizeImage(){
	imgStr = request.getParameter("imgStr");
	if(firstLoad == true && imgStr != null){
		imgid = "http://j.mp/" + imgStr;
		setImage();
	} else {
		$.ajax({
			url: "http://commons.wikimedia.org/w/api.php?action=query&generator=random&grnnamespace=6&prop=imageinfo&iiprop=url&format=json&callback=?",
			dataType: 'json',
			async: false,
			success: function(res){
				var o = (res["query"])["pages"];
				for (var p in o) {
					o = o[p];
					break;
				}
				imgid = (((o["imageinfo"])["0"])["url"]);
				setImage();
			}
		});
	}
}

function setImage(){
	$('html').css('background-image', 'url(' + imgid + ')');
}

function randomizeMusic(){
	var urlR = "http://api.jamendo.com/br/?m=get2&m_params=track_id+track_stream+track_name+artist_name+artist_url+track_url/track/json/track_album+album_artist&n=1&order=ratingweek_desc&nshuffle=1000&streamencoding=ogg2";
	mid = request.getParameter("mid");
	console.log(firstLoad + mid);
	if(firstLoad == true && mid != null){
		urlR += "&track_id=" + mid;
	}
	$.ajax({
		url: urlR,
		dataType: 'json',
		async: false,
		success: function(res){
			var o = res[0];
			mid = o.track_id;
			var audio = '<audio id="audio" controls="controls" autoplay="autoplay" style="display:inline;">'
						+ '<source src="' + o.track_stream + '" type="audio/ogg;codecs=vorbis" / >'
						+ '</audio>' + '<br /><a target="new" href="' + o.track_url + '">' + o.track_name
						+ '</a>' + ' by ' + ' <a target="new" href="' + o.artist_url + '">' + o.artist_name + '</a> <br />' ;
			$("#music").html(audio);
			$("#audio").bind("ended", function(){
				randomizeMusic();
				randomizeImage();
			});
		}
	});
}

function shortUrl(urlRequest){
	return $.ajax({
		url: urlRequest,
		dataType: 'text',
		async: false,
		success: function(res){
			return res;
		}
	}).responseText;
 }
