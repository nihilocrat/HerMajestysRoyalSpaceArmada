using UnityEngine;
using System.Collections;
//using TextureUtils;

public class BlazonMaker : MonoBehaviour {

	public Texture2D mask = null;
	public Color[] teamColors;
	public Texture2D[] teamTextures;
	
	private Texture2D blazonTexture = null;
	/*
	public Color[] teamColors = {
		new Color(0.1f,0.1f,0.1f,1.0f),
		new Color(0.0f,0.0f,0.5f,1.0f),
		new Color(1.0f,1.0f,1.0f,1.0f),
		new Color(1.0f,1.0f,0.0f,1.0f)
	};
	*/
	
	/*
	public Texture2D[] teamTextures = {
		Resources.Load("blazon/base") as Texture2D,
		Resources.Load("blazon/checky") as Texture2D,
		Resources.Load("blazon/ordinaire_fess") as Texture2D,
		Resources.Load("blazon/charge_eagle") as Texture2D
	};
	*/
	
	// Use this for initialization
	void Awake () {
		blazonTexture = MakeTexture();
		renderer.material.mainTexture = blazonTexture;
		//Texture2D tex = Resources.Load("blazon/per_saltire") as Texture2D;
		//Colorize(tex, new Color(1.0f,0.0f,0.0f,1.0f));
		//renderer.material.mainTexture = tex;
	}
	
	Texture2D GetBlazon() {
		if(blazonTexture == null) blazonTexture = MakeTexture();
		return blazonTexture;
	}
	
	Texture2D MakeTexture() {
		// save the first three colors to use for teamcolors

		
		// color each texture
		for(int colorLevel = 0; colorLevel < teamTextures.Length; colorLevel++) {
			Texture2D newTexture = new Texture2D(teamTextures[colorLevel].width,
				teamTextures[colorLevel].height);
			Color[] newpixels = TextureUtils.Colorize(teamTextures[colorLevel].GetPixels(),
				teamColors[colorLevel]);
			newTexture.SetPixels(newpixels);
			newTexture.Apply();
			
			teamTextures[colorLevel] = newTexture;
		}
		
		Texture2D finalTexture = new Texture2D(teamTextures[0].width, teamTextures[0].height);
		finalTexture.filterMode = FilterMode.Point;
		finalTexture.SetPixels(teamTextures[0].GetPixels());
		finalTexture.Apply();
		
		// paste each texture onto the prior
		for(int blitLevel = 1; blitLevel < teamTextures.Length; blitLevel++) {
			Color[] bottomPixels = finalTexture.GetPixels();
			Color[] topPixels = teamTextures[blitLevel].GetPixels();
			
			bottomPixels = TextureUtils.Paste(topPixels, bottomPixels);
			
			finalTexture.SetPixels(bottomPixels);
			finalTexture.Apply();
		}
		
		if(mask != null) {
			finalTexture.SetPixels(TextureUtils.Mask(finalTexture.GetPixels(), mask.GetPixels()));
			finalTexture.Apply();
		}
		
		// copy into a new texture and return
		return finalTexture;
	}
	
}