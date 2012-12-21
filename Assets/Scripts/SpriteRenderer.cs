

using UnityEngine;
using System.Collections;

[AddComponentMenu("Rendering/Sprite Renderer")]

public class SpriteRenderer : MonoBehaviour
{
    public int left;
    public int bottom;
    public int width;
    public int height;

    public SpriteManager spriteManager;

    private Sprite sprite;

    void Start() {
        float ratio, scalex, scaley;

        if( height >= width ) {
            ratio = (float)width / (float)height;
            scalex = ratio * transform.localScale.x;
            scaley = 1.0f * transform.localScale.y;
        }
        else {
            ratio = (float)height / (float)width;
            scalex = 1.0f * transform.localScale.x;
            scaley = ratio * transform.localScale.y;
        }

        //var comp = spriteManager.GetComponent(SpriteManager);
        sprite = spriteManager.AddSprite(gameObject, // The game object to associate the sprite to
										scalex, 		// The width of the sprite
										scaley, 		// The height of the sprite
										left, 		// Left pixel
										bottom, 		// Bottom pixel
									    width, 		// Width in pixels
										height, 		// Height in pixels
										false);		// Billboarded?
    }

}

