jQuery(document).ready(function($) {
	var upload_link = document.getElementById('upload_link'),
      closeBtnModal = document.getElementsByClassName('close-btn'),
      modal_upload = document.getElementById('modalUpload');

  $('.trigger').click(function(event) {
    $(this).toggleClass('active');
    $('.menu-01').toggleClass('show');
  });

    /// upload music
  $('#file-upload__file').on('change', function(event) {
    event.preventDefault();
    // console.log($(this).val());
    $(this).prev('.name').text($(this).val());
  });

  $(upload_link).on('click', function(event) {
    event.preventDefault();
    $(modal_upload).addClass('show');
  });

  $('#submit-upload-music').on('click', function(event) {
    event.preventDefault();
    let lyric = $('.file-upload__lyric').val();
    if (lyric.length === 0) {
      lyric = "Chưa có lyric cho bài hát này";
    } else {
      lyric = lyric.replace(/[.]/g, "</br>");
    }

    // if ($('#file-upload__name').length > 0 && $('#file-upload__file').) {}
    $('.file-upload__lyric').val(lyric);
    console.log($('#file-upload__file').val());
    if(validateInputFile()) {
      $(this).closest('.upload-form-01').submit();
    }  
  });

  let changeValidateInput = () => {
    if(!$('#file-upload__name').val()) {
      $('#file-upload__name').closest('.input-item').children('.err').addClass('show');
      return false;
    } else {
      $('#file-upload__name').closest('.input-item').children('.err').removeClass('show');
    }

    if(!$('#file-upload__file').val()) {
      $('#file-upload__file').closest('.input-item').children('.err').addClass('show');
      return false;
    } else {
      $('#file-upload__file').closest('.input-item').children('.err').removeClass('show');
    }

    return true;
  }

  $('#file-upload__name').on('change', function(event) {
    changeValidateInput();
  });

  $('#file-upload__file').on('change', function(event) {
    changeValidateInput();
  });

  let validateInputFile = ()=>{
    return changeValidateInput();
  }

  // handle input search
  closeBtnModalArr = Array.from(closeBtnModal);
  closeBtnModalArr.map(e=>{
    e.addEventListener('click', function(){
      if (e.closest('.modal-01')) {
        e.closest('.modal-01').classList.remove('show');
      }
    })
  })
});