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
    userId: '2460940',
    clientId: 'c0c7115af26f418c87e7be22c303da2f',
    accessToken: '2460940.1677ed0.a815f199b3484cd2aac31312854fe978',
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
