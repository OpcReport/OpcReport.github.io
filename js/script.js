(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('.nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      title = $this.attr('data-title'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://x.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodedUrl + '" class="article-share-box-link article-share-twitter" target="_blank" title="Share on X"><span class="fa fa-twitter"></span></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-box-link article-share-facebook" target="_blank" title="Share on Facebook"><span class="fa fa-facebook"></span></a>',
            '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' + encodedUrl + '&title=' + encodeURIComponent(title) + '" class="article-share-box-link article-share-linkedin" target="_blank" title="Share on LinkedIn"><span class="fa fa-linkedin"></span></a>',
            '<a href="https://reddit.com/submit?url=' + encodedUrl + '&title=' + encodeURIComponent(title) + '" class="article-share-box-link article-share-reddit" target="_blank" title="Share on Reddit"><span class="fa fa-reddit"></span></a>',
            '<a href="https://t.me/share/url?url=' + encodedUrl + '&text=' + encodeURIComponent(title) + '" class="article-share-box-link article-share-telegram" target="_blank" title="Share on Telegram"><span class="fa fa-telegram"></span></a>',
            '<a href="https://api.whatsapp.com/send?text=' + encodeURIComponent(title) + '%20' + encodedUrl + '" class="article-share-box-link article-share-whatsapp" target="_blank" title="Share on WhatsApp"><span class="fa fa-whatsapp"></span></a>',
            '<a href="https://news.ycombinator.com/submitlink?u=' + encodedUrl + '&t=' + encodeURIComponent(title) + '" class="article-share-box-link article-share-hn" target="_blank" title="Share on Hacker News"><span class="fa fa-hacker-news"></span></a>',
            '<a href="https://mastodon.social/share?text=' + encodeURIComponent(title) + '&url=' + encodedUrl + '" class="article-share-box-link article-share-mastodon" target="_blank" title="Share on Mastodon"><span class="fa fa-mastodon"></span></a>',
            '<a href="mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodedUrl + '" class="article-share-box-link article-share-email" target="_blank" title="Share via Email"><span class="fa fa-envelope"></span></a>',
            '<a href="javascript:void(0)" class="article-share-box-link article-share-copy" onclick="navigator.clipboard.writeText(\'' + url + '\');this.innerText=\'Copied!\';setTimeout(function(){location.reload()},1000)" title="Copy Link"><span class="fa fa-link"></span></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox') || $(this).parent().is('a')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" data-fancybox=\"gallery\" data-caption="' + alt + '"></a>')
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });
})(jQuery);
