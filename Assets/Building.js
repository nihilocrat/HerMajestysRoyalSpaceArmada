
public var name = "A Building";
public var goodsProduced : String;
public var goodsConsumed : String[];

public var myCargo : Cargo;

public var period = 1.0;
public var Yield = 1.0;
public var consumption = 1.0;
public var efficiency = 1.0;

private var cooldown = 0.0;

function Tick(dt : float) {
	cooldown -= dt;
	
	if(cooldown < 0.0) {
		cooldown += period;
	}

	var total_yield = dt * Yield * efficiency;
	var total_consumption = (dt * consumption) / efficiency;

	var enough = true;
	for(var good in goodsConsumed) {
		if(!myCargo.Has(good, total_consumption)) enough = false;
	}

	if(enough) {
		myCargo.Add(goodsProduced, total_yield);
		for(var good in goodsConsumed) {
			myCargo.Remove(good, total_consumption);
		}
	}

	return total_yield;
}
