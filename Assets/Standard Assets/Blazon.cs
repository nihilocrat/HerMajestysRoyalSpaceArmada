using UnityEngine;
using System.Collections;
using System.IO;
//using TextureUtils;

public class Blazon : MonoBehaviour {
	
	public bool assembleAtStartup = true;
	public Texture2D mask = null;
	private Texture2D blurMask = null;
	public Color[] teamColors;
	private int[] colorIndexes;
	public Texture2D[] teamTextures;
	public string jsonString;
	
	private Texture2D[] originalTextures;
	
	private Texture2D blazonTexture = null;
	/*
	public Color[] teamColors = {
		new Color(0.1f,0.1f,0.1f,1.0f),
		new Color(0.0f,0.0f,0.5f,1.0f),
		new Color(1.0f,1.0f,1.0f,1.0f),
		new Color(1.0f,1.0f,0.0f,1.0f)
	};
	*/
	
	// Use this for initialization
	void Start () {
		/*if(repaintable) {
			// copy textures to originals in memory
			// so that repeated colorations do not screw things up
			originalTextures = new Texture2D[teamTextures.Length];
			
			for(int colorLevel = 0; colorLevel < teamTextures.Length; colorLevel++) {
				originalTextures[colorLevel] = new Texture2D(teamTextures[colorLevel].width, teamTextures[colorLevel].height);
				originalTextures[colorLevel].filterMode = FilterMode.Point;
				originalTextures[colorLevel].SetPixels(teamTextures[colorLevel].GetPixels());
				originalTextures[colorLevel].Apply();
			}
		}
		else {
			originalTextures = teamTextures;
		}*/
		
		// load the blur mask, if available
		blurMask = Resources.Load("blazon/mask_blur") as Texture2D;
		
		originalTextures = teamTextures;
		
		if( jsonString != null && jsonString != "" )
			UnSerialize(Utils.LoadJsonFromFile("FleetSchemes/" + jsonString));
			//UnSerialize(jsonString);
		
		if( assembleAtStartup )
			blazonTexture = MakeTexture();
		//Texture2D tex = Resources.Load("blazon/per_saltire") as Texture2D;
		//Colorize(tex, new Color(1.0f,0.0f,0.0f,1.0f));
		//renderer.material.mainTexture = tex;
	}
	
	public void SetBlazon(Texture2D value) {
		blazonTexture = value;
	}
	
	public Texture2D GetBlazon() {
		return blazonTexture;
	}
	
	public Texture2D MakeTexture() {
		// make copies of each texture and use those instead
		// otherwise we mess up the base textures over multiple MakeTexture() calls
		Texture2D[] baseTextures = new Texture2D[teamTextures.Length];
		teamTextures.CopyTo(baseTextures, 0);
		
		// save the first three colors to use for teamcolors

		// color each texture
		for(int colorLevel = 0; colorLevel < baseTextures.Length; colorLevel++) {
			Texture2D newTexture = new Texture2D(baseTextures[colorLevel].width,
				baseTextures[colorLevel].height);
			Color[] newpixels = TextureUtils.Colorize(baseTextures[colorLevel].GetPixels(),
				teamColors[colorLevel]);
			newTexture.SetPixels(newpixels);
			newTexture.Apply();
			
			baseTextures[colorLevel] = newTexture;
		}
		
		Texture2D finalTexture = new Texture2D(baseTextures[0].width, baseTextures[0].height);
		finalTexture.filterMode = FilterMode.Point;
		finalTexture.SetPixels(baseTextures[0].GetPixels());
		finalTexture.Apply();
		
		// paste each texture onto the prior
		for(int blitLevel = 1; blitLevel < baseTextures.Length; blitLevel++) {
			Color[] bottomPixels = finalTexture.GetPixels();
			Color[] topPixels = baseTextures[blitLevel].GetPixels();
			
			bottomPixels = TextureUtils.Paste(topPixels, bottomPixels);
			
			finalTexture.SetPixels(bottomPixels);
			finalTexture.Apply();
		}
		
		if(blurMask != null) {
			finalTexture.SetPixels(TextureUtils.Mask(finalTexture.GetPixels(), blurMask.GetPixels()));
			finalTexture.Apply();
		}
		
		if(mask != null) {
			finalTexture.SetPixels(TextureUtils.Mask(finalTexture.GetPixels(), mask.GetPixels()));
			finalTexture.Apply();
		}
		
		// copy into a new texture and return
		return finalTexture;
	}
	
	LitJson.JsonData UnSerialize(string jsonString)
	{
		int i;
		LitJson.JsonData data = LitJson.JsonMapper.ToObject(jsonString);
		
		mask = Resources.Load( data["mask"].ToString() ) as Texture2D;
		for(i=0;i<=2;i++)
		{
			teamTextures[i] = Resources.Load( data["textures"][i].ToString() ) as Texture2D;
		}
		
		colorIndexes = new int[3];
		for(i=0;i<=1;i++)
		{
			int colorNum = (int)(data["colors"][i]);
			colorIndexes[i] = colorNum;
			teamColors[i] = Globals.colorChoices[colorNum];
		}
		
		int glowNum = (int)(data["colors"][2]);
		teamColors[2] = Globals.glowChoices[glowNum];
		
		return data;
	}
	
}