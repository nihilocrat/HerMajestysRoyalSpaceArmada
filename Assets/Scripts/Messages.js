public var maxMessages = 3;
public var messageDuration = 5.0;

//hacky
public var comissionSound : AudioClip;
public var squadDestroyedSound : AudioClip;

public var messages : Array;
public var history : Array;

public var currentPlayer : Player;


/* ================== singleton code  ==================== */
private static var singleton : Messages;

function Awake() {
	singleton = this;
	messages = new Array();
}

static function getSingleton() {
	return singleton;
}
/* ================== end singleton code ================= */


function Start()
{
	currentPlayer = TeamSettings.getSingleton().humanPlayer;
	
}

/// use this function to send messages to the queue
/// basically syntatic sugar
static function Broadcast(playerId : int, m : String) {
	getSingleton().Add(playerId, m);
}


static function Broadcast(playerId : int, messageType : String, m : String) {
	var s = getSingleton();
	s.Add(playerId, m);
	
	// FIXME: AAARGH SUPER HACKY
	if(playerId == -1 || playerId == 1) {//playerId == TeamSettings.getSingleton().humanPlayer) {
		if(messageType == "comission") s.audio.PlayOneShot(s.comissionSound);
		else if(messageType == "squadDestroyed") s.audio.PlayOneShot(s.squadDestroyedSound);
	}
	// FIXME!!!!!!!!!!!
}


function Add(playerId : int, m : String) {
	if(playerId != -1 && playerId != 1) return;

	// TODO: add message metadata so we can make a global history
	// to save to file for fun storytelling goodness
	//history.Push(m);

	// push new message on queue...
	messages.Push(m);
	// and immediately initiate timeout for it
	yield WaitForSeconds(messageDuration);
	messages.Shift();
}

function OnGUI() {
	var i : int;
	var width = Screen.width * 0.5;
	var center_y = Screen.height/2;
	var halfwidth = width / 2;
	
	if(messages.length > 0) {
		GUI.BeginGroup(Rect(Screen.width*0.25, 40, width, messages.length * 20 + 20));
		GUI.Box(Rect(0,0,width,messages.length * 20 + 20), "");
		for(i = 0; i < messages.length; i++) {
			GUI.Label(Rect(10,10 + i * 20,width,20), messages[i]);
		}
		GUI.EndGroup();
	}
}