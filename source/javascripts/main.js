$('document').ready(function() {
  $('#instafeed').waypoint(function(direction) {
    if (feed.hasNext()) {
      console.log('next!');
      feed.next();
    }
  }, {
    offset: 'bottom-in-view',
    enabled: false
  });

  var feed = new Instafeed({
    get: 'user',
    userId: '16206566',
    clientId: 'c0c7115af26f418c87e7be22c303da2f',
    accessToken: '16206566.c0c7115.770a51feb4a242bea4e16026c578b450',
    resolution: 'standard_resolution',
    before: function() {
      $('#instafeed').waypoint('disable');
    },
    after: function() {
      $('#instafeed').waypoint('enable');
    }
  });
  feed.run();
});
