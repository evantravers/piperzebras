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
    get: 'tagged',
    tagName: 'piperzebras',
    resolution: 'standard_resolution',
    userId: '16206566',
    clientId: 'c0c7115af26f418c87e7be22c303da2f',
    accessToken: '16206566.467ede5.f514a92579754e0298fa023cf7848573',
    before: function() {
      $('#instafeed').waypoint('disable');
    },
    after: function() {
      $('#instafeed').waypoint('enable');
    }
  });
  feed.run();
});
