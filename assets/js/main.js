  var globalEvent = {
    touch : false,
    swipeLeft: false,
    swipeRight: false,
    clickBallVolume: false,

    reset : function(){
      this.touch = false;
      this.swipeLeft = false;
      this.swipeRight = false;
    }
  }

  var mouseObject = {
    posX: null,
    posY: null,

    setCurrentPos : function(x, y){
      this.posX = x;
      this.posY = y;
    },

    isSwipeLeft : function(x){ return x < (this.posX - 70) ? true : false},
    isSwipeRight : function(x){ return x > (this.posX + 70 ) ? true : false},
  }

document.addEventListener('click', function(e){
  // let target = e.target;
  // let inputItem = document.getElementsByClassName('input-item');
  // for(var ele of inputItem){
  //  if (!$(ele).is(target) && $(ele).has(target).length === 0 && $(ele).find('input').val().length == 0) {
  //    $(ele).find('.label-01').removeClass('up');
  //  }
  // }
});

document.addEventListener('mouseup', function(){
  globalEvent.clickBallVolume = false;
})

window.addEventListener('DOMContentLoaded', function(){
  // define Variable
  var listTrack = document.getElementById('listTrack'),
      speakerButton = document.getElementById('speaker-button'),
      bulletListTrack = document.getElementById('list-track-bullet'),
      bulletHome = document.getElementById('home-bullet'),
      listBtn = document.getElementById('list-btn'),
      gridBtn = document.getElementById('grid-btn'),
      settingBtn = document.getElementById('settingBtn'),
      modalSetting = document.getElementById('modalSetting'),
      settingItem = document.getElementsByClassName('setting__item')
      header = document.getElementById('header'),
      playViewControl = document.getElementById('play-view__control'),
      inputSearch = document.getElementsByClassName('input-search-01'),
      searchResult = document.getElementById('search-result-wrapper'),
      closeBtnModal = document.getElementsByClassName('close-btn'),
      ballVolume = document.getElementById('ballVolume'),
      pause_or_play_btn = document.getElementById('pause_or_play_btn'),
      speaker_volume = document.getElementById('speaker-volume'),
      speaker_progress = document.getElementById('speakerProgress')
      ;

  // console.log(speaker_volume.getBoundingClientRect().y);
  let speaker_volume_posY = speaker_volume.getBoundingClientRect().y,
      volume_posY = 50;

  const self = this;

  //////////////////// define method
  var isClick = e=> e.type === "click"?true : false;
  var toggleModify = type=>{
    console.log(type);
    type === "grid" ? listTrack.classList.add('toggle-modify') : listTrack.classList.remove('toggle-modify');
  }

  var toggleClass = (element, className)=>{
    console.log(element.classList.contains(className));
    element.classList.contains(className) ? element.classList.remove(className) : element.classList.add(className);
  }

  var toggleMenu = ()=>{
    toggleClass(header, "hide");
  }

  var toggleControl = ()=> {
    toggleClass(playViewControl, "hide");
  }








////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////// SC CODE ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// var url = 'https://api.soundcloud.com/tracks?client_id=ec8f5272bde9a225c71692a876603706';
// $.getJSON(url, function (tracks) {
//  console.log(tracks);
// });

var listTrack = [];
var favoriteList = [];
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
         html +=  '<li class="item">\
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
  //  event.preventDefault();
  //  console.log('ok');
    // console.log();
  // });
});

$(document).on('click', '#listMusic .TrackItem', async function(event) {
  event.preventDefault();
  let index = parseInt($(this).attr('data-trackIndex'));
  playTrackWithIndex(index);
});

$('input[name="alarm-submit"]').on('click', function(event) {
  event.preventDefault();
  let t = $('input[name="alarm-input"]').val();
  let time = t*60*1000;
  console.log(time);
  setTimeout(function(){
    pauseFunc();
  }, time)
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////// END SC CODE ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







  // handle listTrack event show & hide on mobile
  const dashBoard = document.getElementsByClassName('Dashboard-01')[0];
  dashBoard.addEventListener("touchstart", function(e){
    let touches = e.changedTouches;
    mouseObject.setCurrentPos( touches[0].pageX, touches[0].pageY );
  });

  dashBoard.addEventListener("touchmove", function(e){
  })

  dashBoard.addEventListener("touchend", function(e){
    let touches = e.changedTouches;
    if ( mouseObject.isSwipeLeft( touches[0].pageX, touches[0].pageY) ){
      globalEvent.swipeLeft = true;
      console.log("swipeLeft");
    }

    if ( mouseObject.isSwipeRight(touches[0].pageX, touches[0].pageY) ) {
      globalEvent.swipeRight = true;
      console.log("swipeRight");
    }

    // handle show list track
    if (globalEvent.swipeRight) {
      listTrack.classList.add('show');
      bulletListTrack.classList.add('active');
      bulletHome.classList.remove('active');
    } else if (globalEvent.swipeLeft) {
      listTrack.classList.remove('show');
      bulletListTrack.classList.remove('active');
      bulletHome.classList.add('active');
    }

    // reset globalEvent
    globalEvent.reset();
  });

  // handle swiper on desktop
  dashBoard.addEventListener('mousedown', function(e){
    mouseObject.setCurrentPos( e.pageX, e.pageY );
    console.log(e.pageX, e.pageY);
  })

  dashBoard.addEventListener('mouseup', function(e){
    // mouseObject.setCurrentPos( e.pageX, e.pageY );
    if (mouseObject.isSwipeRight(e.pageX, e.pageY)) {
      globalEvent.swipeRight = true;
    }

    if(mouseObject.isSwipeLeft(e.pageX, e.pageY)) {
      globalEvent.swipeLeft = true;
    };

    // handle show list track
    if (globalEvent.swipeRight) {
      listTrack.classList.add('show');
      bulletListTrack.classList.add('active');
      bulletHome.classList.remove('active');
    } else if (globalEvent.swipeLeft) {
      listTrack.classList.remove('show');
      bulletListTrack.classList.remove('active');
      bulletHome.classList.add('active');
    }

    // reset globalEvent
    globalEvent.reset();
  })

  // handle toggle speaker-button
  speakerButton.addEventListener('click', function(){
    this.classList.contains('active') ? this.classList.remove('active') : this.classList.add('active');
  })

  // handle toggle modify list track
  listBtn.addEventListener('click', function(){
    toggleModify('list');
  })

  gridBtn.addEventListener('click', function(){
    toggleModify('grid');
  })

  // handle toggle setting
  settingBtn.addEventListener('click', function(){
    toggleClass(modalSetting, "show");
  })

  // handle setting
  let settingItemArr = Array.from(settingItem);
  settingItemArr.map((e, i)=>{
    if (i === 0 || i === 1) {
      let data = e.getAttribute("data-target");
      e.addEventListener('click', function(){
        toggleClass(e, "active");
        eval(data)();
      })
    }
  })

  // handle input search
  let inputSearchArr = Array.from(inputSearch);
  inputSearchArr[0].addEventListener('focus', function(){
    searchResult.classList.add('show');
  });

  inputSearchArr[0].addEventListener('focusout', function(){
    searchResult.classList.remove('show');
  });

  closeBtnModalArr = Array.from(closeBtnModal);
  closeBtnModalArr.map(e=>{
    e.addEventListener('click', function(){
      if (e.closest('.modal-01')) {
        e.closest('.modal-01').classList.remove('show');
      }
    })
  })

  // scroll volume
  ballVolume.addEventListener('mousedown', function(e){
    globalEvent.clickBallVolume = true;
  })

  ballVolume.addEventListener('mousemove', function(e){
    if(globalEvent.clickBallVolume) {
      mouseObject.setCurrentPos(e.pageX, e.pageY);
      // console.log(e.pageY + "moving");
      volume_posY = e.pageY - speaker_volume_posY;
      if (e.pageY - speaker_volume_posY < - 1) {
        volume_posY = 0;
      } else if (e.pageY - speaker_volume_posY > 111) {
        volume_posY = 100;
      } else {
        volume_posY = e.pageY - speaker_volume_posY;
      }

      ballVolume.style.top = volume_posY + '%';
      speakerProgress.style.top = volume_posY + '%';

    }
  })

  //click pause play button
  pause_or_play_btn.addEventListener('click', function(){

  })
})
