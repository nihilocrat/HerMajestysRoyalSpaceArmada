public var humanPlayer : Player;
public var numberOfPlayers = 3;

public var debug = true;

public var baseTeamMaterial : Material;
public var baseContrailMaterial : Material;

public var teamMaterials = new Dictionary.<int, Material>();
public var teamContrailMaterials = new Dictionary.<int, Material>();
public var teamPlanetMaterials : Material[];

private static var singleton : TeamSettings;

function Awake() {
	singleton = this;
	
	generateAllTeamMaterials();
}

static function getSingleton() {
	return singleton;
}

function getMaterial(team_id : int) {
	return teamMaterials[team_id];
}

function getContrailMaterial(team_id : int) {
	return teamContrailMaterials[team_id];
}

function generateAllTeamMaterials() {
	for(var kvp in teamMaterials) {
		generateTeamMaterial(kvp.Key);
	}
}

function generateTeamMaterial(team_id : int) {
	var mat = Instantiate(baseTeamMaterial);
	var p = Player.getPlayer(team_id);
	
	mat.name = "generated_colors_p" + team_id.ToString();
	mat.mainTexture = makeTeamcolorTexture(
		p.colors[0],p.colors[1],p.colors[2]
	);
	
	mat.SetTexture("_EmissiveTex", makeGlowTexture(p.colors[2]));
	
	teamMaterials[team_id] = mat;
	
	// now adjust contrail
	// this is really fucking ugly right now and not flexible in the least
	var trailMat = Instantiate(baseContrailMaterial);
	trailMat.name = "generated_contrail_p" + team_id.ToString();
	trailMat.SetColor("_TintColor", p.colors[2]);
	teamContrailMaterials[team_id] = trailMat;
}


function makeTeamcolorTexture(primary : Color, secondary : Color, glow : Color)
	: Texture2D
{
	var parts : Array;
	parts = [
		Resources.Load("misc/colorparts_primary") as Texture2D,
		Resources.Load("misc/colorparts_secondary") as Texture2D,
		Resources.Load("misc/colorparts_neutral") as Texture2D
	];
	
	// colorize each part
	/*var coloredParts : Array;
	coloredParts = [
		TextureUtils.Colorize(parts[0].GetPixels(), primary),
		TextureUtils.Colorize(parts[1].GetPixels(), secondary),
		TextureUtils.Colorize(parts[2].GetPixels(), glow),
		parts[3].GetPixels()
	];*/
	
	var result = new Texture2D(parts[0].width, parts[1].height);
	var result_pixels = result.GetPixels();
	
	var next_pixels : Color[];
	next_pixels = TextureUtils.Colorize(parts[0].GetPixels(), primary);
	result_pixels = TextureUtils.Paste(next_pixels, result_pixels);
	
	next_pixels = TextureUtils.Colorize(parts[1].GetPixels(), secondary);
	result_pixels = TextureUtils.Paste(next_pixels, result_pixels);
	
	next_pixels = parts[2].GetPixels();
	result_pixels = TextureUtils.Paste(next_pixels, result_pixels);
	
	// merge visible layers
	/*for(var next_pixels in coloredParts) {
		result_pixels =TextureUtils.Paste(next_pixels, result_pixels);
	}*/
	
	result.SetPixels(result_pixels);
	result.Apply();

	return result;
}

function makeGlowTexture(glow : Color) {
	var part = Resources.Load("misc/colorparts_glow") as Texture2D;
	
	var blank = Resources.Load("misc/colorparts_empty") as Texture2D;
	var blank_pixels = blank.GetPixels();
	
	next_pixels = TextureUtils.Colorize(part.GetPixels(), glow);
	result_pixels = TextureUtils.Paste(next_pixels, blank_pixels);
	
	var result = new Texture2D(part.width, part.height);
	result.SetPixels(result_pixels);
	result.Apply();
	
	return result;
}