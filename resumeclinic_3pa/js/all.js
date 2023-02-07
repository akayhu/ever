$(function(){

  var Resumeclinic = Resumeclinic || {};

  Resumeclinic = ( function($) {

    $inputName = {
      resume: $("input[name=resume]"),
      resumeSelect: $("select[name=resumeSelect]"),
      test: $("input[name=test]"),
      categor_select: $("select[name=categor_select]"),
      agree: $("input[name=agree]"),
      submit: $("input[type=submit]")
    };

    $idName = {
      error_message_resume_1: $("#error_message_resume_1"),
      error_message_resume_2: $("#error_message_resume_2"),
      error_message_resume_3: $("#error_message_resume_3"),
      error_message_test: $("#error_message_test"),
      error_message_categor: $("#error_message_categor"),
      error_message_agree: $("#error_message_agree")
    };

    $className = {
      distribution: $(".distribution"),
      re_select: $(".re_select"),
      been_full_bg: $(".been_full_bg"),
      body: $("body")
    };

    // 由104分配
    distribution = function(){
      console.log("由104分配");
      $className.body.css( "overflow-y", "auto" );
      $className.been_full_bg.hide();
    },
    // submit
    form_submit = function(){
      console.log("送出ajax");
    };

    return {

      init: function(){

        // 履歷表checkbox
        $inputName.resume.click( function() {
          if( $(this).prop( "checked" ) !== false ) {
            $idName.error_message_resume_1.hide();
            $idName.error_message_resume_2.hide();
            $idName.error_message_resume_3.hide();
          }
        });

        // 履歷表下拉選單
        $inputName.resumeSelect.change( function() {
          if( $(this).val() != 0 ){
            $inputName.resume.prop( "checked", true );
            $idName.error_message_resume_1.hide();
            $idName.error_message_resume_2.hide();
            $idName.error_message_resume_3.hide();
          } else {
            $inputName.resume.prop( "checked", false );
          }
        });

        // 職業適性測驗checkbox
        $inputName.test.click( function() {
          if( $(this).prop( "checked" ) !== false ) {
            $idName.error_message_test.hide();
          }
        });

        // 產業類別下拉選單
        $inputName.categor_select.change( function() {
          if( $(this).val() === 'full' ){
            $className.body.css( "overflow-y", "hidden" );
            $className.been_full_bg.show();
          } else if( $(this).val() !== 0 ){
            $idName.error_message_categor.hide();
          }
        });

        // 同意授權checkbox
        $inputName.agree.click( function() {
          if( $(this).prop( "checked" ) !== false ) {
            $idName.error_message_agree.hide();
          }
        });

        // 由104分配
        $className.distribution.click( function() {
          distribution();
        });

        // 我要重新選擇
        $className.re_select.click( function() {
          $className.body.css( "overflow-y", "auto" );
          $className.been_full_bg.hide();
        });

        // 報名送出防呆
        $inputName.submit.click( function() {
          if( $inputName.resume.prop( "checked" ) === false || $inputName.resumeSelect.val() == 0 ) {
            $idName.error_message_resume_3.show();
          } else if( $inputName.test.prop( "checked" ) === false ) {
            $idName.error_message_test.show();
          } else if( $inputName.categor_select.val() == 0 || $inputName.categor_select.val() === 'full' ) {
            $idName.error_message_categor.show();
          } else if( $inputName.agree.prop( "checked" ) === false ) {
            $idName.error_message_agree.show();
          } else {
            form_submit();
          }
        });

      }

    }

  })(jQuery);

  Resumeclinic.init();

});
