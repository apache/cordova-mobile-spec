XmppHook.setDebug(true);

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
    ok(navigator.xmppClient.sendMessageToJID != null, "navigator.xmppClient.sendMessageToJid should not null");
    ok(navigator.xmppClient.sendHtmlMessageToJID != null, "navigator.xmppClient.sendHtmlMessageToJid should not be null");
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
    ok(navigator.xmppClient.enableFileTransfer != null, "navigator.xmppClient.enableFileTransfer should exist");
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
    ok(msg.isread != null, "XMPP Message should have an isRead property");
    ok(msg.timestamp != null, "XMPP Message should have a timestamp");
  });
  module("XMPP RosterItem");
  var res = new RosterItem('test', 'foo', 'bar');
  test("should exist", function(){
    expect(3);
    ok(test.name != null, "Resource name is not null");
    ok(test.user != null, "Person is not null");
    ok(test.status != null, "status is not null");
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
    	  ok(body == "test", "Alice echoed the text sent by bob");
    	  navigator.xmppClient.removeListener('MessageReceived');
    	  start();
      }
      navigator.xmppClient.addListener('MessageReceived', null, msg_handler);
      navigator.xmppClient.sendMessageToJID('alice@xmpp.phonegap.com', 'test');
  });
  test("Should send and receive XHTML messages", function() {
	  //We expect the previous tests, and these tests.
	  expect(2);
	  stop();
      var html_handler = function(event)
      {
    	  var from = event.args[0];
    	  var body = event.args[1].body;
    	  ok(from == 'alice', "Alice sent a message");
    	  ok(body != null, "We have a large payload!");
    	  navigator.xmppClient.removeListener('HtmlMessageReceived');
    	  start();
      }
      navigator.xmppClient.addListener('HtmlMessageReceived', null, html_handler);
      navigator.xmppClient.sendHtmlMessageToJID('alice@xmpp.phonegap.com','test',"<body xmlns='http://www.w3.org/1999/xhtml'>Foo<br /></body>");
  });
  test("should be able to discover services", function()
  {
	  expect(1);
	  stop();
	  var servicesHandler = function(event)
	  {
		  ok(navigator.xmppClient.services.length > 0, "There are services that have been discovered");
		  start();
	  }
	  navigator.xmppClient.addListener('DiscoveryWin', null, servicesHandler);
	  navigator.xmppClient.discoverServices('xmpp.phonegap.com');
  });
  test("should be able to get the roster", function(){
	expect(1);
	stop();
    var rosterHandler = function(event)
    {
      ok(navigator.xmppClient.roster.length > 0, "The roster should not be empty");
      start();
    }
    navigator.xmppClient.addListener('UpdateRoster', null, rosterHandler);
    navigator.xmppClient.getRoster();
  });
  test("Should be able to send and receive a form", function() {
	  expect(1);
	  stop();
	  var formHandler = function(event) 
	  {
		  var xml = event.args[0];
		  ok(xml.length > 0, "XML has been passed back");
		  start();
	  }
	  navigator.xmppClient.addListener('XmppHasForm', null, formHandler);
	  //This IS pretty awful!!!!
	  var formXml = "<x xmlns='jabber:x:data' type='form'>";
      formXml += "<title>Bot Configuration</title>";
      formXml += "<instructions>Fill out this form to configure your new bot!</instructions>";
      formXml += "<field type='hidden' var='FORM_TYPE'>";
      formXml += "<value>jabber:bot</value>";
      formXml += "</field>";
      formXml += "<field type='fixed'><value>Section 1: Bot Info</value></field>";
      formXml += "<field type='text-single' label='The name of your bot' var='botname'/>";
      formXml += "<field type='text-multi' label='Helpful description of your bot' var='description'/>";
      formXml += "<field type='boolean' label='Public bot?' var='public'><required/></field>";
      formXml += "<field type='text-private' label='Password for special access' var='password'/>";
      formXml += "<field type='fixed'><value>Section 2: Features</value></field>";
      formXml += "<field type='list-multi' label='What features will the bot support?' var='features'>";
      formXml += "<option label='Contests'><value>contests</value></option>";
      formXml += "<option label='News'><value>news</value></option>";
      formXml += "<option label='Polls'><value>polls</value></option>";
      formXml += "<option label='Reminders'><value>reminders</value></option>";
      formXml += "<option label='Search'><value>search</value></option>";
      formXml += "<value>news</value>";
      formXml += "<value>search</value>";
      formXml += "</field>";
      formXml += "<field type='fixed'><value>Section 3: Subscriber List</value></field>";
      formXml += "<field type='list-single' label='Maximum number of subscribers' var='maxsubs'>";
      formXml += "<value>20</value>";
      formXml += "<option label='10'><value>10</value></option>";
      formXml += "<option label='20'><value>20</value></option>";
      formXml += "<option label='30'><value>30</value></option>";
      formXml += "<option label='50'><value>50</value></option>";
      formXml += "<option label='100'><value>100</value></option>";
      formXml += "<option label='None'><value>none</value></option>";
      formXml += "</field>"
      formXml += "<field type='fixed'><value>Section 4: Invitations</value></field>";
      formXml += "<field type='jid-multi' label='People to invite' var='invitelist'>";
      formXml += "<desc>Tell all your friends about your new bot!</desc>";
      formXml += "</field>";
      formXml += "</x>"
	  navigator.xmppClient.sendForm('alice@xmpp.phonegap.com/PhoneGap', formXml);
  });
  /*
  test("Should be able to receive a file", function() {
	  expect(1);
	  stop();
	  function fileDownHandler(event)
	  {
		  var filename = event.args[1];
		  ok(filename.length > 0, "The filename was passed back");
		  start();
	  }
	  navigator.xmppClient.enableFileTransfer('/sdcard/', false);
	  navigator.xmppClient.addListener('XmppFileReceived', null, fileDownHandler);
	  navigator.xmppClient.sendMessageToJID('eve@xmpp.phonegap.com', 'panda');
  });
  test("should be able to send a file", function() {
	  expect(1);
	  stop();
	  var fileHandler = function(event)
	  {
		  ok(true, "The SendComplete handler was called");
		  start();
	  }
	  navigator.xmppClient.addListener('SendComplete', null, fileHandler);
	  navigator.xmppClient.sendFile('/sdcard/panda.jpg', 'eve@xmpp.phonegap.com/phonegap', 'have a panda');
  });
  test("should be able to Publish Events to Devices and Subscribe to events from devices", function() {
	  expect(2);
	  stop();
	  var subHandler = function(event)
	  {
		  ok(true, "Received Subscription Event!");
		  start();
	  }
	  var subSetHandler = function(event)
	  {
		  var id = event.args[1];
		  ok(id <= navigator.xmppClient.subs.length, "Listener is in the Subscriptions.");
		  // This is a hack!
		  navigator.xmppClient.publish('pubsub.xmpp.phonegap.com', 'Book', 'pubsub:test:book', "<book xmlns='pubsub:test:book'><title>1984</title></book>", 'TestNode', false);
	  }
	  navigator.xmppClient.addListener('XmppSubWin', null, subSetHandler);
	  navigator.xmppClient.subscribe('pubsub.xmpp.phonegap.com', 'TestNode', subHandler);
  });
  */
}
