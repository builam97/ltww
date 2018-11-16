// var url = 'https://api.soundcloud.com/tracks?client_id=ec8f5272bde9a225c71692a876603706';
// $.getJSON(url, function (tracks) {
// 	console.log(tracks);
// });

var listTrack = [];
var mainTrack= {
	indexTrack: null,
	status : "pause",
	setIndex: function(index){this.indexTrack = index},
	toggle: ()=>{this.status = this.status==="play"?"pause":"play"},
	isPlay: ()=>status==="play",
	play: function(){
		this.status = "play";
	},
	pause: function(){
		this.status = "pause";
	}
};

// update playview 
let updatePlayView = (index)=>{
	$('.play-view__image img').attr('src', listTrack[index].user.avatar_url);	
	$('.play-view__information .textbox__title').text( listTrack[index].title );
	$('.play-view__information .textbox__subtitle').text(listTrack[index].user.username);
}

// play a track
let playFunc = ()=>{
	if (window.sound) {
		window.sound.play();
		mainTrack.play();
		$('#pause_or_play_btn').attr('src', 'assets/images/pause.png');
	}
}

// pause a track
let pauseFunc = ()=>{
	if (window.sound) {
		window.sound.pause();
		mainTrack.pause();
		$('#pause_or_play_btn').attr('src', 'assets/images/play.png');
	}
}

// use index to play track , change track
let playTrackWithIndex = async (index)=>{
	pauseFunc();
	updatePlayView(index);
	mainTrack.setIndex.call(mainTrack, index);
	// console.log();
	window.sound = await SC.stream('tracks/'+ parseInt(listTrack[index].id));
	playFunc();
}

$(document).ready(function () {
	$('#but').click(function (e) {
		e.preventDefault();
		console.log('hello');
		var searchValue = $("#search").val();
		console.log("search value",searchValue);
		SC.initialize({
			client_id: 'ec8f5272bde9a225c71692a876603706'
		});

		// find all sounds of buskers licensed under 'creative commons share alike'
		SC.get('/tracks', {
			q: searchValue,
			// license: 'cc-by-sa'
		}).then(function (tracks) {
			listTrack = tracks;
			var html ='';
			tracks.forEach((element, index) => {
				 // html += '<li class="item"><span href="#" class="suggestText" onclick="clickTrackSuggest">'+element.title+'</span></li>';
				 html += 	'<li class="item">\
					 			<div class="TrackItem " data-trackIndex="'+index+'">\
					 				<div class="media-wrapper">\
					 					<img src="' + element.user.avatar_url + '" alt="'+element.user.username+'" />\
				 					</div>\
				 					<p class="title">'+element.title+'</p>\
				 					<p class="author">'+element.user.username+'</p>\
			 					</div>\
	 						</li>'
			});
		 var searchresult = $('#listMusic').html(html);
		});
	});

	$('#pause_or_play_btn').on('click', function(event) {
		event.preventDefault();
	 	mainTrack.toggle();
	 	if (mainTrack.isPlay()) {
	 		pauseFunc();
	 	} else {
	 		playFunc();
	 	}
	});

	$('#next_btn').on('click', function(event) {
		event.preventDefault();
		playTrackWithIndex( mainTrack.indexTrack + 1 );
	});

	$('#prev_btn').on('click', function(event) {
		event.preventDefault();
		playTrackWithIndex( mainTrack.indexTrack - 1 );
	});

	// $('#listMusic .TrackItem').on('click', function(event) {
	// 	event.preventDefault();
	// 	console.log('ok');
		// console.log();
	// });
});

$(document).on('click', '#listMusic .TrackItem', async function(event) {
	event.preventDefault();
	let index = parseInt($(this).attr('data-trackIndex'));
	playTrackWithIndex(index);
});