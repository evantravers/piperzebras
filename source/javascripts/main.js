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
    userId: '4534823990',
    clientId: 'c0c7115af26f418c87e7be22c303da2f',
    accessToken: '4534823990.c0c7115.496a55e206904253be86387439328f7e',
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
