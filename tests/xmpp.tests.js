Tests.prototype.XmppTests = function() {
  module("Xmpp (navigator.xmppClient)");
  test("should exist", function() {
    expect(5);
    ok(navigator.xmppClient != null, "navigator.xmppClient should not be null");
    ok(navigator.xmppClient.roster != null, "navigator.xmppClient.roster should exist");
    ok(navigator.xmppClient.messageMap != null, "navigator.xmppClient.messageMap should exist");
    ok(navigator.xmppClient.unreadCount == 0, "navigator.xmppClient.unreadCount should equal zero");
    ok(navigator.xmppClient.subs != null, "navigator.xmppClient.subs should exist");
  });
  test("should have a connect method", function()
  {
    expect(1);
    ok(navigator.xmppClient.connect != null, "navigator.xmppClient.connect should not be null");
  });                                  
  test("should have a way to send a message", function()
  {
    expect(2);
    ok(navigator.xmppClient.sendMessageToJid != null, "navigator.xmppClient.sendMessageToJid should not null");
    ok(navigator.xmppClient.sendHtmlMessageToJid != null, "navigator.xmppClient.sendHtmlMessageToJid should not be null");
  });
  test("should have a way to publish and subscribe", function()
  {
    expect(3);
    ok(navigator.xmppClient.publish != null, "navigator.xmppClient.publish exists");
    ok(navigator.xmppClient.subscribe != null, "navigator.xmppClient subscribe exists");
    ok(navigator.xmppClient.subs != null, "The subscription list exists");
  });
  test("should have a way to discover services", function()
  {
    expect(1);
    ok(navigator.xmppClient.discoverServices != null, "navigator.xmppClient.discoverServices exists");
  });
  test("should have a way to send and receive files", function()
  {
    expect(2);
    ok(navigator.xmppClient.addFileTransferListener != null, "navigator.xmppClient.addFileTransferListener should exist");
    ok(navigator.xmppClient.sendFile != null, "navigator.xmppClient.sendFile should exist");
  });
  module("Xmpp Message Model");
  var msg = new XMPPMessage('foo', 'test', 'support@nitobi.com', 'brian@nitobi.com', false);
  test("should be able to define an XMPP message with the following", function() {
    expect(6);
    ok(msg.id != null, "XMPP Message ID is not null");
    ok(msg.body != null, "XMPP Message is not null");
    ok(msg.senderJid != null, "XMPP Sender jID is not null");
    ok(msg.receiverJid != null, "XMPP Receiver jID is not null");
    ok(msg.isRead != null, "XMPP Message should have an isRead property");
    ok(msg.timestamp != null, "XMPP Message should have a timestamp");
  });
  module("XMPP Resource Model");
  var res = new XmppResource('test', 'foo', 'bar');
  test("should exist", function(){
    expect(3);
    ok(test.name != null, "Resource name is not null");
    ok(test.user != null, "Person is not null");
    ok(test.user != null, "status is not null");
  });
  module("XMPP Chat");
  test("should connect", function(){
	expect(1);
	stop();
    var handler = function(event)
    {
      ok(navigator.xmppClient.hostname.length > 0, "XMPP hostname should be present and be non-zero");
      start();
    };
    navigator.xmppClient.addListener('ConnectSuccess',null ,handler );
    navigator.xmppClient.connect('xmpp.phonegap.com', 'bob', 'phonegap', 'resource', 5222);
  });
  
  test("Should send and receive messages", function() {
	  expect(2);
	  stop();
      var msg_handler = function(event)
      {
    	  var from = event.args[0];
    	  var body = event.args[1].body;
    	  ok(from == 'alice', "Alice sent a message");
    	  console.log(body);
    	  ok(body == "test", "Alice echoed the text sent by bob");
    	  start();
      }
      navigator.xmppClient.addListener('MessageReceived', null, msg_handler);
      navigator.xmppClient.sendMessageToJID('alice@xmpp.phonegap.com', 'test');
  });
  test("should be able to get the roster", function(){
	expect(1);
	stop();
    var rosterHandler = function(event)
    {
      ok(roster.length > 0, "The roster should not be empty");
      start();
    }
    navigator.xmppClient.addListener('UpdateRoster', null, rosterHandler);
    navigator.xmppClient.getRoster();
  });
}
