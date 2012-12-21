import System.Collections.Generic;

public var queue = new List.<BuildOrder>();
	
private var player : Player;
	
function Start () {
	player = GetComponent(Player);
}

function Advance() {
	var next : BuildOrder;
	var toRemove = 0;
	
	// look at the next thing in queue
	for(next in queue)
	{
		// if we have enough money for it, submit the build order!
		if(next.cost > player.cash) break;
		
		// need to know where the hell to send the message, though!
		next.sender.SendMessage(next.buildMessage, next.buildArgs);
	
		//FIXME : for now, I am not manually deducting the cost
		//  because the commands that get called end up deducting the cost
		//  but it's probably smartest to move that functionality here
		//player.cash -= next.cost;
		Debug.Log("build order completed! cost $" + next.cost + "  --  ");
		
		toRemove += 1;
	}
	
	if(toRemove > 0)
	{
		queue.RemoveRange(0,toRemove);
	}
}


function OnSubmit(order : BuildOrder)
{
	queue.Add(order);
	
	// immediately evaluate if we can build this or not
	Advance();
}

function Submit(cost : int, description : String, icon : Texture2D, sender : GameObject, buildMessage : String)
{
	// this is kind of dumb, but keeps other scripts from having to know about BuildOrder
	var order = new BuildOrder();
	order.cost = cost;
	order.description = description;
	order.icon = icon;
	order.sender = sender;
	order.buildMessage = buildMessage;
	
	queue.Add(order);
	
	// immediately evaluate if we can build this or not
	Advance();
}


function GetTotalValue() : int
{
	var total = 0;
	for(var b : BuildOrder in queue)
	{
		total += b.cost;
	}
	return total;
}
