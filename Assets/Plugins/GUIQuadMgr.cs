using UnityEngine;
using System.Collections;

//-----------------------------------------------------------------
// Describes a sprite
//-----------------------------------------------------------------
public class GUISprite
{
    protected float m_width;                    // Width and Height of the sprite in worldspace units
    protected float m_height;
    protected float m_depth;					// Layer order of the sprite as a depth
    protected Vector2 m_lowerLeftUV;            // UV coordinate for the upper-left corner of the sprite
    protected Vector2 m_UVDimensions;         	// Distance from the upper-left UV to place the other UVs
    protected GameObject m_client;        		// Reference to the client GameObject
    protected GUIQuadMgr m_manager;      		// Reference to the sprite manager in which this sprite resides
    protected bool m_hidden;            		// Indicates whether this sprite is currently hidden
    protected Color m_color;					// The color to be used by all four vertices

    public Transform clientTransform;			// Transform of the client GameObject
    public Vector3 offset;						// Offset of sprite from center of client GameObject

    public int index;							// Index of this sprite in its SpriteManager's list
    
    public Vector3 v1;							// The sprite's vertices in local space
    public Vector3 v2;
    public Vector3 v3;
    public Vector3 v4;
    
    public int mv1;								// Indices of the associated vertices in the actual mesh 
    public int mv2;
    public int mv3;
    public int mv4;

    public int uv1;								// Indices of the associated UVs in the mesh
    public int uv2;
    public int uv3;
    public int uv4;

    public int cv1;								// Indices of the associated color values in the mesh
    public int cv2;
    public int cv3;
    public int cv4;

	public int tv1;								// Indices of the associated triangles in the mesh
	public int tv2;
	public int tv3;
	public int tv4;
	public int tv5;
	public int tv6;
	
    public GUISprite()
    {
        m_width = 0;
        m_height = 0;
        m_depth = 0;
        m_client = null;
        m_manager = null;
        m_hidden = false;
        m_color = Color.white;
        
        clientTransform = null;
        offset = new Vector3(0,0,0);
        
        index = 0;

	    v1 = new Vector3(0,0,0);
	    v2 = new Vector3(0,0,0);
	    v3 = new Vector3(0,0,0);
	    v4 = new Vector3(0,0,0);
	    mv1 = 0;
	    mv2 = 0;
	    mv3 = 0;
	    mv4 = 0;
	    uv1 = 0;
	    uv2 = 0;
	    uv3 = 0;
	    uv4 = 0;
	    cv1 = 0;
	    cv2 = 0;
	    cv3 = 0;
	    cv4 = 0;
		tv1 = 0;
		tv2 = 0;
		tv3 = 0;
		tv4 = 0;
		tv5 = 0;
		tv6 = 0;
    }

    public GUIQuadMgr manager
    {
        get { return m_manager; }
        set { m_manager = value; }
    }

    public GameObject client
    {
        get { return m_client; }
        set 
        { 
            m_client = value;
            if (m_client != null)
                clientTransform = m_client.transform;
            else
                clientTransform = null;
        }
    }
    
    public float depth
    {
    	get { return m_depth; }
    	set {
    		m_depth = value;
    		m_manager.SortActiveList(this);
    	}
    }

	//Set lowerleft uv value.  Input is in pixel coords.
    public Vector2 lowerLeftUV
    {
        get { return m_lowerLeftUV; }
        set 
        {
        	m_lowerLeftUV = m_manager.PixelCoordToUVCoord(value);
            m_manager.UpdateUV(this);
        }
    }

	//Set UV width/height.  Input is in UV coords.
    public Vector2 uvDimensions
    {
        get { return m_UVDimensions; }
        set 
        { 
            m_UVDimensions = value;
            m_manager.UpdateUV(this);
        }
    }

    public float width
    {
        get { return m_width; }
    }

    public float height
    {
        get { return m_height; }
    }

    public bool hidden
    {
        get { return m_hidden; }
        set
        {
            // No need to do anything if we're
            // already in this state:
            if (value == m_hidden)
                return;

            m_hidden = value;

            if (value)
            {
                m_manager.HideSprite(this);
            }
            else
            {
                m_manager.ShowSprite(this);
            }
        }
    }
    
    public Color color
    {
    	get { return m_color;}
    	set
    	{
    		//Set vertex colors
    		m_color = value;
       		m_manager.UpdateColors(this);
    	}
    }

    // Sets the physical dimensions of the sprite in the XY plane:
    public void SetSizeXY(float width, float height)
    {
        m_width = width;
        m_height = height;
        v1 = offset + new Vector3(-m_width / 2, m_height / 2, 0);   // Upper-left
        v2 = offset + new Vector3(-m_width / 2, -m_height / 2, 0);  // Lower-left
        v3 = offset + new Vector3(m_width / 2, -m_height / 2, 0);   // Lower-right
        v4 = offset + new Vector3(m_width / 2, m_height / 2, 0);    // Upper-right

        this.Transform();
    }

    // Sets the physical dimensions of the sprite in the XZ plane:
    public void SetSizeXZ(float width, float height)
    {
        m_width = width;
        m_height = height;
        v1 = offset + new Vector3(-m_width / 2, 0, m_height / 2);   // Upper-left
        v2 = offset + new Vector3(-m_width / 2, 0, -m_height / 2);  // Lower-left
        v3 = offset + new Vector3(m_width / 2, 0, -m_height / 2);   // Lower-right
        v4 = offset + new Vector3(m_width / 2, 0, m_height / 2);    // Upper-right

        this.Transform();
    }

    // Sets the physical dimensions of the sprite in the YZ plane:
    public void SetSizeYZ(float width, float height)
    {
        m_width = width;
        m_height = height;
        v1 = offset + new Vector3(0, m_height / 2, -m_width / 2);   // Upper-left
        v2 = offset + new Vector3(0, -m_height / 2, -m_width / 2);  // Lower-left
        v3 = offset + new Vector3(0, -m_height / 2, m_width / 2);   // Lower-right
        v4 = offset + new Vector3(0, m_height / 2, m_width / 2);    // Upper-right

        this.Transform();
    }

	//Resize the sprite
	public void Resize(float width, float height)
	{
		//Update vertices
		switch (manager.plane)
		{
			case (GUIQuadMgr.SPRITE_PLANE.XY):
				SetSizeXY(width, height);
				break;
			case (GUIQuadMgr.SPRITE_PLANE.XZ):
				SetSizeXZ(width, height);
				break;
			case (GUIQuadMgr.SPRITE_PLANE.YZ):
				SetSizeYZ(width, height);
				break;
		}
		
		//Update UV
		this.uvDimensions = m_manager.PixelSpaceToUVSpace((int)width, (int)height);
	}
	
    // Applies the transform of the client GameObject and stores
    // the results in the associated vertices of the overall mesh:
    public void Transform()
    {
    	//Only update the manager mesh if we're not hidden
    	if (m_hidden == false)
    	{
        	m_manager.UpdatePositions(this);
    	}
    }

    // Applies the transform of the client GameObject and stores
    // the results in the associated vertices of the overall mesh:
    public void TransformBillboarded(Transform t)
    {
       /* Vector3 pos = clientTransform.position;

        meshVerts[mv1] = pos + t.InverseTransformDirection(v1);
        meshVerts[mv2] = pos + t.InverseTransformDirection(v2);
        meshVerts[mv3] = pos + t.InverseTransformDirection(v3);
        meshVerts[mv4] = pos + t.InverseTransformDirection(v4);

        m_manager.UpdatePositions(this);*/
    }
}


//-----------------------------------------------------------------
// Holds a single mesh object which is composed of an arbitrary
// number of quads that all use the same material, allowing
// multiple, independently moving objects to be drawn on-screen
// while using only a single draw call.
//-----------------------------------------------------------------
public class GUIQuadMgr : MonoBehaviour 
{
    // In which plane should we create the sprites?
    public enum SPRITE_PLANE
    {
        XY,
        XZ,
        YZ
    };

    // Which way to wind polygons?
    public enum WINDING_ORDER
    {
        CCW,	// Counter-clockwise
        CW		// Clockwise
    };

	public GUIManager.Layers LayerNumber = GUIManager.Layers.GUILayer1;
    public Material material;					// The material to use for the sprites
    public int allocBlockSize = 1;					// How many sprites to allocate space for at a time
    public SPRITE_PLANE plane;					// The plane in which to create the sprites
    public WINDING_ORDER winding=WINDING_ORDER.CW; // Which way to wind polygons
    public bool autoUpdateBounds = false;		// Automatically recalculate the bounds of the mesh when vertices change?
	public bool PixelPerfectCollision = false;		// Show inputs be checked pixel perfect?

    protected bool vertsChanged = false;		// Have changes been made to the vertices of the mesh since the last frame?
    protected bool uvsChanged = false;			// Have changes been made to the UVs of the mesh since the last frame?
    protected bool colorsChanged = false;		// Have the colors changed?
    protected bool trisChanged = false;			// Have the triangle order changed?
    protected bool meshChanged = false;	// Has the number of vertices changed?
    protected bool updateBounds = false;		// Update the mesh bounds?
    protected GUISprite[] sprites;				// Array of all sprites (the offset of the vertices corresponding to each sprite should be found simply by taking the sprite's index * 4 (4 verts per sprite).
    protected ArrayList availableBlocks = new ArrayList(); // Array of references to sprites which are currently not in use
    protected ArrayList activeBlocks = new ArrayList(); // Array of references to all the currently active (non-empty) sprites
    protected float boundUpdateInterval;		// Interval, in seconds, to update the mesh bounds

    protected MeshFilter meshFilter;
    protected MeshRenderer meshRenderer;
    protected Mesh mesh;						// Reference to our mesh (contained in the MeshFilter)

    protected Vector3[] vertices;				// The vertices of our mesh
    protected int[] triIndices;					// Indices into the vertex array
    protected Vector2[] UVs;					// UV coordinates
    protected Color[] colors;					// Color values
    //protected Vector3[] normals;				// Normals
	
   //--------------------------------------------------------------
    // Utility functions:
    //--------------------------------------------------------------

    // Converts pixel-space values to UV-space scalar values
    // according to the currently assigned material.
    // NOTE: This is for converting widths and heights-not
    // coordinates (which have reversed Y-coordinates).
    // For coordinates, use PixelCoordToUVCoord()!
    public Vector2 PixelSpaceToUVSpace(Vector2 xy)
    {
        Texture t = material.GetTexture("_MainTex");

        return new Vector2(xy.x / ((float)t.width), xy.y / ((float)t.height));
    }

    // Converts pixel-space values to UV-space scalar values
    // according to the currently assigned material.
    // NOTE: This is for converting widths and heights-not
    // coordinates (which have reversed Y-coordinates).
    // For coordinates, use PixelCoordToUVCoord()!
    public Vector2 PixelSpaceToUVSpace(int x, int y)
    {
        return PixelSpaceToUVSpace(new Vector2((float)x, (float)y));
    }

    // Converts pixel coordinates to UV coordinates according to
    // the currently assigned material.
    // NOTE: This is for converting coordinates and will reverse
    // the Y component accordingly.  For converting widths and
    // heights, use PixelSpaceToUVSpace()!
    public Vector2 PixelCoordToUVCoord(Vector2 xy)
    {
        Vector2 p = PixelSpaceToUVSpace(xy);
        p.y = 1.0f - p.y;
        return p;
    }

    // Converts pixel coordinates to UV coordinates according to
    // the currently assigned material.
    // NOTE: This is for converting coordinates and will reverse
    // the Y component accordingly.  For converting widths and
    // heights, use PixelSpaceToUVSpace()!
    public Vector2 PixelCoordToUVCoord(int x, int y)
    {
        return PixelCoordToUVCoord(new Vector2((float)x, (float)y));
    }

    //--------------------------------------------------------------
    // End utility functions
    //--------------------------------------------------------------

    public void InitQuadMgr()
    {
		Debug.Log("Init Quad Manager: " + gameObject.name);
        gameObject.AddComponent("MeshFilter");
        gameObject.AddComponent("MeshRenderer");

        meshFilter = (MeshFilter)GetComponent(typeof(MeshFilter));
        meshRenderer = (MeshRenderer)GetComponent(typeof(MeshRenderer));

        meshRenderer.renderer.material = material;
        mesh = meshFilter.mesh;

        // Create our first batch of sprites:
        EnlargeArrays(allocBlockSize);

        // Move the object to the origin so the objects drawn will not
        // be offset from the objects they are intended to represent.
        transform.position = Vector3.zero;
        transform.rotation = Quaternion.identity;
        
		//Set layer
		gameObject.layer = (int) LayerNumber;
		
		//Tell all quad children to register with the manager
		foreach (GUIQuadObj tmpQuad in gameObject.GetComponentsInChildren(typeof(GUIQuadObj)))
		{
			tmpQuad.InitQuad(this);
		}
    }

    // Allocates initial arrays
    protected void InitArrays()
    {
        sprites = new GUISprite[1];
        vertices = new Vector3[4];
        UVs = new Vector2[4];
        colors = new Color[4];
        triIndices = new int[6];
    }

    // Enlarges the sprite array by the specified count and also resizes
    // the UV and vertex arrays by the necessary corresponding amount.
    // Returns the index of the first newly allocated element
    // (ex: if the sprite array was already 10 elements long and is 
    // enlarged by 10 elements resulting in a total length of 20, 
    // EnlargeArrays() will return 10, indicating that element 10 is the 
    // first of the newly allocated elements.)
    protected int EnlargeArrays(int count)
    {
        int firstNewElement;

        if (sprites == null)
        {
            InitArrays();
            firstNewElement = 0;
            count = count - 1;  // Allocate one less since InitArrays already allocated one sprite for us
        }
        else
        {
            firstNewElement = sprites.Length;
        }

        // Resize sprite array:
        GUISprite[] tempSprites = sprites;
        sprites = new GUISprite[sprites.Length + count];
        tempSprites.CopyTo(sprites, 0);

        // Vertices:
        Vector3[] tempVerts = vertices;
        vertices = new Vector3[vertices.Length + count*4];
        tempVerts.CopyTo(vertices, 0);
        
        // UVs:
        Vector2[] tempUVs = UVs;
        UVs = new Vector2[UVs.Length + count*4];
        tempUVs.CopyTo(UVs, 0);

        // Colors:
        Color[] tempColors = colors;
        colors = new Color[colors.Length + count * 4];
        tempColors.CopyTo(colors, 0);

        // Triangle indices:
        int[] tempTris = triIndices;
        triIndices = new int[triIndices.Length + count*6];
        tempTris.CopyTo(triIndices, 0);

        // Setup the newly-added sprites and Add them to the list of available 
        // sprite blocks. Also initialize the triangle indices while we're at it:
        for (int i = firstNewElement; i < sprites.Length; ++i)
        {
            // Create and setup sprite:
            sprites[i] = new GUISprite();
            sprites[i].index = i;
            sprites[i].manager = this;

            // Setup indices of the sprite's vertices in the vertex buffer:
            sprites[i].mv1 = i * 4 + 0;
            sprites[i].mv2 = i * 4 + 1;
            sprites[i].mv3 = i * 4 + 2;
            sprites[i].mv4 = i * 4 + 3;

            // Setup the indices of the sprite's UV entries in the UV buffer:
            sprites[i].uv1 = i * 4 + 0;
            sprites[i].uv2 = i * 4 + 1;
            sprites[i].uv3 = i * 4 + 2;
            sprites[i].uv4 = i * 4 + 3;

            // Setup the indices to the color values:
            sprites[i].cv1 = i * 4 + 0;
            sprites[i].cv2 = i * 4 + 1;
            sprites[i].cv3 = i * 4 + 2;
            sprites[i].cv4 = i * 4 + 3;

            // Setup the default color:
            sprites[i].color = Color.white;

            // Add as an available sprite:
            availableBlocks.Add(sprites[i]);

            /* Setup the triangle indices:
            sprites[i].tv1 = i * 6 + 0;
            sprites[i].tv2 = i * 6 + 1;
            sprites[i].tv3 = i * 6 + 2;
            sprites[i].tv4 = i * 6 + 3;
            sprites[i].tv5 = i * 6 + 4;
            sprites[i].tv6 = i * 6 + 5;
            if(winding == WINDING_ORDER.CCW)
            {   // Counter-clockwise winding
                triIndices[i * 6 + 0] = i * 4 + 0;  //  0_ 2            0 ___ 3
                triIndices[i * 6 + 1] = i * 4 + 1;  //  | /      Verts:  |   /|
                triIndices[i * 6 + 2] = i * 4 + 3;  // 1|/              1|/__|2

                triIndices[i * 6 + 3] = i * 4 + 3;  //     3
                triIndices[i * 6 + 4] = i * 4 + 1;  //   /|
                triIndices[i * 6 + 5] = i * 4 + 2;  // 4/_|5
            }
            else
            {   // Clockwise winding
                triIndices[i * 6 + 0] = i * 4 + 0;  //  0_ 1            0 ___ 3
                triIndices[i * 6 + 1] = i * 4 + 3;  //  | /      Verts:  |   /|
                triIndices[i * 6 + 2] = i * 4 + 1;  // 2|/              1|/__|2

                triIndices[i * 6 + 3] = i * 4 + 3;  //     3
                triIndices[i * 6 + 4] = i * 4 + 2;  //   /|
                triIndices[i * 6 + 5] = i * 4 + 1;  // 5/_|4
            }*/
        }

		//Flip flags to copy new data to mesh
        meshChanged = true;

        return firstNewElement;
    }

	// Recompute the traiangles for a range of sprites
	protected void RebuildTris (int StartIdx, int EndIdx)
	{
		//Check start and end ranges
		if (StartIdx < 0)
		{
			StartIdx = 0;
		}
		if (EndIdx > (activeBlocks.Count - 1))
		{
			EndIdx = activeBlocks.Count - 1;
		}
		
		//Rebuild tris
		int BlockIdx = 0;
		int TrisIdx = 0;
		GUISprite tmpSprite;
		for (BlockIdx=StartIdx;BlockIdx<=EndIdx;BlockIdx++)
		{
			//Get the sprite data
			tmpSprite = (GUISprite) activeBlocks[BlockIdx];
			//Calculate pointer to tris array
			TrisIdx = BlockIdx * 6;
			//Update triangle pointers in sprite
			tmpSprite.tv1 = TrisIdx + 0;
			tmpSprite.tv2 = TrisIdx + 1;
			tmpSprite.tv3 = TrisIdx + 2;
			tmpSprite.tv4 = TrisIdx + 3;
			tmpSprite.tv5 = TrisIdx + 4;
			tmpSprite.tv6 = TrisIdx + 5;
			//Copy vertices to triangle list
            if(winding == WINDING_ORDER.CCW)
            {  
            	// Counter-clockwise winding
				triIndices[TrisIdx + 0] = tmpSprite.mv1;
				triIndices[TrisIdx + 1] = tmpSprite.mv2;
				triIndices[TrisIdx + 2] = tmpSprite.mv4;
				triIndices[TrisIdx + 3] = tmpSprite.mv4;
				triIndices[TrisIdx + 4] = tmpSprite.mv2;
				triIndices[TrisIdx + 5] = tmpSprite.mv3;
            }
            else
			{
            	// Clockwise winding
				triIndices[TrisIdx + 0] = tmpSprite.mv1;
				triIndices[TrisIdx + 1] = tmpSprite.mv4;
				triIndices[TrisIdx + 2] = tmpSprite.mv2;
				triIndices[TrisIdx + 3] = tmpSprite.mv4;
				triIndices[TrisIdx + 4] = tmpSprite.mv3;
				triIndices[TrisIdx + 5] = tmpSprite.mv2;
			}
		}
	}
	
	// Add a reference to the sprite into the active blocks array list
	// This list is sorted and the tris array rebuilt
	protected void AddToActiveList (GUISprite sprite)
	{
		//Calculate pointer to tris array
		int TrisIdx = activeBlocks.Count * 6;
		//Update triangle pointers in sprite
		sprite.tv1 = TrisIdx + 0;
		sprite.tv2 = TrisIdx + 1;
		sprite.tv3 = TrisIdx + 2;
		sprite.tv4 = TrisIdx + 3;
		sprite.tv5 = TrisIdx + 4;
		sprite.tv6 = TrisIdx + 5;
		//Copy vertices to triangle list
		if(winding == WINDING_ORDER.CCW)
		{  
			// Counter-clockwise winding
			triIndices[TrisIdx + 0] = sprite.mv1;
			triIndices[TrisIdx + 1] = sprite.mv2;
			triIndices[TrisIdx + 2] = sprite.mv4;
			triIndices[TrisIdx + 3] = sprite.mv4;
			triIndices[TrisIdx + 4] = sprite.mv2;
			triIndices[TrisIdx + 5] = sprite.mv3;
		}
		else
		{
			// Clockwise winding
			triIndices[TrisIdx + 0] = sprite.mv1;
			triIndices[TrisIdx + 1] = sprite.mv4;
			triIndices[TrisIdx + 2] = sprite.mv2;
			triIndices[TrisIdx + 3] = sprite.mv4;
			triIndices[TrisIdx + 4] = sprite.mv3;
			triIndices[TrisIdx + 5] = sprite.mv2;
		}

		//Insert sprite at the end of the list
		activeBlocks.Add(sprite);
		
		//Sort array list
		SortActiveList(sprite);
		
		trisChanged = true;
	}
	
	// Remove a reference to the sprite from the active blocks array list
	// This tris array is rebuilt
	protected void RemoveFromActiveList (GUISprite sprite)
	{
		//Get start point in arraylist
		int StartIdx = activeBlocks.IndexOf(sprite);
		//Remove sprite
		activeBlocks.Remove(sprite);
		
		//Rebuild tris array
		RebuildTris(StartIdx, (activeBlocks.Count - 1));
		
		//Clear the rest of the triangle array
		int TrisIdx = 0;
		for (TrisIdx = (activeBlocks.Count * 6);TrisIdx<triIndices.Length;TrisIdx++)
		{
			triIndices[TrisIdx] = 0;
		}
		
		trisChanged = true;
	}
	
	// Resorts the active sprite list and rebuids the triangles array
	public void SortActiveList (GUISprite sprite)
	{
		//Get current sprite location
		int CurLoc = activeBlocks.IndexOf(sprite);
		
		//Sort active list
		int Index = 0;
		int TmpIndex = 0;
		int NumItems = activeBlocks.Count;
		GUISprite tmpSprite;
		for(Index=1;Index<NumItems;Index++)
		{
			tmpSprite = (GUISprite) activeBlocks[Index];
			TmpIndex = Index;
			
			while( (TmpIndex > 0) && (((GUISprite)activeBlocks[TmpIndex-1]).depth < tmpSprite.depth) )
			{
				activeBlocks[TmpIndex] = activeBlocks[TmpIndex-1];
				TmpIndex = TmpIndex - 1;
			}
			
			activeBlocks[TmpIndex] = tmpSprite;
		}
		
		//Get new sprite location
		int NewLoc = activeBlocks.IndexOf(sprite);
		
		//Do nothing if sort order didn't change
		if (NewLoc == CurLoc)
		{
			return;
		}
		
		int StartIdx = 0;
		int EndIdx = 0;
		//Set start and end index
		if (NewLoc > CurLoc)
		{
			StartIdx = CurLoc;
			EndIdx = NewLoc;
		}
		else
		{
			StartIdx = NewLoc;
			EndIdx = CurLoc;
		}
		
		//Rebuild tris from current to new location
		RebuildTris(StartIdx, EndIdx);

		trisChanged = true;
	}
	
    // Adds a sprite to the manager at the location and rotation of the client 
    // GameObject and with its transform.  Returns a reference to the new sprite
    // Width and height are in world space units
    // leftPixelX and bottomPixelY- the bottom-left position of the desired portion of the texture, in pixels
    // pixelWidth and pixelHeight - the dimensions of the desired portion of the texture, in pixels
    public GUISprite AddSprite(GameObject client, int width, int height, float depth, Vector2 LLUV)
    {
        int spriteIndex;
    	Vector2 lowerLeftUV = PixelCoordToUVCoord((int)LLUV.x, (int)LLUV.y);
    	Vector2 UVDimensions = PixelSpaceToUVSpace(width, height);

        // Get an available sprite:
        if (availableBlocks.Count < 1)
        {
			// If we're out of available sprites, allocate some more.
            EnlargeArrays(allocBlockSize);
        }

        // Use a sprite from the list of available blocks:
        spriteIndex = ((GUISprite)availableBlocks[0]).index;
        availableBlocks.RemoveAt(0);    // Now that we're using this one, remove it from the available list

        // Assign the new sprite:
        GUISprite newSprite = sprites[spriteIndex];
        newSprite.client = client;
        newSprite.depth = depth;
        newSprite.lowerLeftUV = LLUV;
        newSprite.uvDimensions = UVDimensions;

        switch(plane)
        {
            case SPRITE_PLANE.XY:
                newSprite.SetSizeXY(width, height);
                break;
            case SPRITE_PLANE.XZ:
                newSprite.SetSizeXZ(width, height);
                break;
            case SPRITE_PLANE.YZ:
                newSprite.SetSizeYZ(width, height);
                break;
            default:
                newSprite.SetSizeXY(width, height);
                break;
        }

        // Save this to an active list now that it is in-use:
		//activeBlocks.Add(newSprite);
		AddToActiveList(newSprite);
		
        // Setup the UVs:
        UVs[newSprite.uv1] = lowerLeftUV + Vector2.up * UVDimensions.y;			// Upper-left
        UVs[newSprite.uv2] = lowerLeftUV;										// Lower-left
        UVs[newSprite.uv3] = lowerLeftUV + Vector2.right * UVDimensions.x;		// Lower-right
        UVs[newSprite.uv4] = lowerLeftUV + UVDimensions;						// Upper-right

        // Set our flags:
        vertsChanged = true;
        uvsChanged = true;

        return newSprite;
    }

    public void RemoveSprite(GUISprite sprite)
    {
        sprite.SetSizeXY(0,0);
        sprite.v1 = Vector3.zero;
        sprite.v2 = Vector3.zero;
        sprite.v3 = Vector3.zero;
        sprite.v4 = Vector3.zero;

        vertices[sprite.mv1] = sprite.v1;
        vertices[sprite.mv2] = sprite.v2;
        vertices[sprite.mv3] = sprite.v3;
        vertices[sprite.mv4] = sprite.v4;

        sprite.client = null;

        availableBlocks.Add(sprite);

        // Remove the sprite from the active list
        //activeBlocks.Remove(sprite);
        RemoveFromActiveList(sprite);

        vertsChanged = true;
    }
    
    public void HideSprite(GUISprite sprite)
    {
        vertices[sprite.mv1] = Vector3.zero;
        vertices[sprite.mv2] = Vector3.zero;
        vertices[sprite.mv3] = Vector3.zero;
        vertices[sprite.mv4] = Vector3.zero;

        sprite.hidden = true;

        vertsChanged = true;
    }

    public void ShowSprite(GUISprite sprite)
    {
        // Only show the sprite if it has a client:
        if(sprite.client == null)
        {
            return;
        }

        sprite.hidden = false;

        // Update the vertices:
        sprite.Transform();

        vertsChanged = true;
    }

    public GUISprite GetSprite(int i)
    {
        if (i < sprites.Length)
            return sprites[i];
        else
            return null;
    }

    // Updates the vertices of a sprite based on the transform
    // of its client GameObject
    public void Transform(GUISprite sprite)
    {
        sprite.Transform();

        vertsChanged = true;
    }

    // Updates the vertices of a sprite such that it is oriented
    // more or less toward the camera
    public void TransformBillboarded(GUISprite sprite)
    {
        Vector3 pos = sprite.clientTransform.position;
        Transform t = Camera.main.transform;

        vertices[sprite.mv1] = pos + t.TransformDirection(sprite.v1);
        vertices[sprite.mv2] = pos + t.TransformDirection(sprite.v2);
        vertices[sprite.mv3] = pos + t.TransformDirection(sprite.v3);
        vertices[sprite.mv4] = pos + t.TransformDirection(sprite.v4);

        vertsChanged = true;
    }

    // Informs the SpriteManager that some vertices have changed position
    // and the mesh needs to be reconstructed accordingly
    public void UpdatePositions(GUISprite sprite)
    {
        vertices[sprite.mv1] = sprite.clientTransform.TransformPoint(sprite.v1);
        vertices[sprite.mv2] = sprite.clientTransform.TransformPoint(sprite.v2);
        vertices[sprite.mv3] = sprite.clientTransform.TransformPoint(sprite.v3);
        vertices[sprite.mv4] = sprite.clientTransform.TransformPoint(sprite.v4);

        vertsChanged = true;
    }

    // Updates the UVs of the specified sprite and copies the new values
    // into the mesh object.
    public void UpdateUV(GUISprite sprite)
    {
        UVs[sprite.uv1] = sprite.lowerLeftUV + Vector2.up * sprite.uvDimensions.y;		// Upper-left
        UVs[sprite.uv2] = sprite.lowerLeftUV;											// Lower-left
        UVs[sprite.uv3] = sprite.lowerLeftUV + Vector2.right * sprite.uvDimensions.x;	// Lower-right
        UVs[sprite.uv4] = sprite.lowerLeftUV + sprite.uvDimensions;						// Upper-right

        uvsChanged = true;
    }

    // Updates the color values of the specified sprite and copies the
    // new values into the mesh object.
    public void UpdateColors(GUISprite sprite)
    {
        colors[sprite.cv1] = sprite.color;
        colors[sprite.cv2] = sprite.color;
        colors[sprite.cv3] = sprite.color;
        colors[sprite.cv4] = sprite.color;

        colorsChanged = true;
    }

    // Instructs the manager to recalculate the bounds of the mesh
    public void UpdateBounds()
    {
        updateBounds = true;
    }

    // Schedules a recalculation of the mesh bounds to occur at a
    // regular interval (given in seconds):
    public void ScheduleBoundsUpdate(float seconds)
    {
        boundUpdateInterval = seconds;
        InvokeRepeating("UpdateBounds", seconds, seconds);
    }

    // Cancels any previously scheduled bounds recalculations:
    public void CancelBoundsUpdate()
    {
        CancelInvoke("UpdateBounds");
    }
    
    // LateUpdate is called once per frame
    virtual public void LateUpdate () 
    {
        // Were changes made to the mesh since last time?
        if (meshChanged)
        {
        	//Reset all flags
            vertsChanged = false;
            uvsChanged = false;
            colorsChanged = false;
            trisChanged = false;
            meshChanged = false;
            updateBounds = false;

            mesh.Clear();
            mesh.vertices = vertices;
            mesh.uv = UVs;
            mesh.colors = colors;
            mesh.triangles = triIndices;
        }
        else
        {
        	//Copy new vertices to mesh if changed
            if (vertsChanged)
            {
                vertsChanged = false;

                if (autoUpdateBounds)
                {
                    updateBounds = true;
                }

                mesh.vertices = vertices;
            }

        	//Copy new uvs to mesh if changed
            if (uvsChanged)
            {
                uvsChanged = false;
                mesh.uv = UVs;
            }

        	//Copy new colors to mesh if changed
            if (colorsChanged)
            {
                colorsChanged = false;
                mesh.colors = colors;
            }
            
        	//Copy new triangles to mesh if changed
            if (trisChanged)
            {
                trisChanged = false;
                mesh.triangles = triIndices;
            }
            
        	//Update the bounding area of the mesh if changed
            if (updateBounds)
            {
                updateBounds = false;
                mesh.RecalculateBounds();
            }
        }
    }

	bool CheckHit (GUIQuadObj pQuadObj, RaycastHit pHit)
	{
		Texture2D MaterialTexture = (Texture2D) material.GetTexture ("_MainTex");
		
		//Calculate the XY coord where the ray hit the texture
		Vector2 TextureXY = pQuadObj.UV + ((Vector2) (pHit.point - pHit.collider.gameObject.transform.position));
		TextureXY.x = TextureXY.x + (pQuadObj.Width / 2);
		TextureXY.y = MaterialTexture.height - (TextureXY.y - (pQuadObj.Height / 2));
		
		//Get alpha value
		Color PixColor = MaterialTexture.GetPixel((int)TextureXY.x, (int)TextureXY.y);
		
		//Send collision message if alpha is greater than .25
		if (PixColor.a > 0.25f)
		{
			return true;
		}
		
		return false;
	}
	
	//Handle all touch inputs
	void Update () 
	{
		GUIQuadObj tmpQuadObj;
		Camera GUICamera = (Camera) GameObject.Find("GUICameraL1").GetComponent(typeof(Camera));
		RaycastHit hit;

		//Handle touch input
		if (iPhoneInput.touchCount > 0)
		{
			//Cast rays for all objects on this layer
			int LayerBitMask = (1 << gameObject.layer);
				
			foreach (iPhoneTouch tmpTouch in iPhoneInput.touches)
			{
				//Create ray from first GUI camera
				Ray ray = GUICamera.ScreenPointToRay (tmpTouch.position);
			
				switch (tmpTouch.phase)
				{
					case iPhoneTouchPhase.Began:
						if (PixelPerfectCollision == true)
						{
							//Get all objects hit by ray
							RaycastHit[] hitGroup = Physics.RaycastAll(ray, 1000, LayerBitMask);
							//Sort objects by distance from camera
							int Index = 0;
							int TmpIndex = 0;
							RaycastHit tmpItem;
							for(Index=1;Index<hitGroup.Length;Index++)
							{
								tmpItem = hitGroup[Index];
								TmpIndex = Index;
								
								while( (TmpIndex > 0) && ((hitGroup[TmpIndex-1]).distance > tmpItem.distance) )
								{
									hitGroup[TmpIndex] = hitGroup[TmpIndex-1];
									TmpIndex = TmpIndex - 1;
								}
								
								hitGroup[TmpIndex] = tmpItem;
							}
							//Pixel perfect check from front to back
							foreach (RaycastHit tmpHit in hitGroup)
							{
								tmpQuadObj = (GUIQuadObj) tmpHit.collider.gameObject.GetComponent(typeof(GUIQuadObj));
								if (tmpQuadObj != null)
								{
									if (CheckHit(tmpQuadObj, tmpHit) == true)
									{
										tmpHit.collider.gameObject.SendMessage("onGUIDown", tmpTouch, SendMessageOptions.DontRequireReceiver);
										break;
									}
								}
							}
						}
						else
						{
							if(Physics.Raycast(ray, out hit, 1000, LayerBitMask))
							{
								//Send down message only for objects handled by this manager
								tmpQuadObj = (GUIQuadObj) hit.collider.gameObject.GetComponent(typeof(GUIQuadObj));
								if (tmpQuadObj != null)
								{
									if (tmpQuadObj.QuadManager == this)
									{
										hit.collider.gameObject.SendMessage("onGUIDown", tmpTouch, SendMessageOptions.DontRequireReceiver);
									}
								}
							}
						}
						break;
						
					case iPhoneTouchPhase.Moved:
						if (PixelPerfectCollision == true)
						{
							//Get all objects hit by ray
							RaycastHit[] hitGroup = Physics.RaycastAll(ray, 1000, LayerBitMask);
							//Sort objects by distance from camera
							int Index = 0;
							int TmpIndex = 0;
							RaycastHit tmpItem;
							for(Index=1;Index<hitGroup.Length;Index++)
							{
								tmpItem = hitGroup[Index];
								TmpIndex = Index;
								
								while( (TmpIndex > 0) && ((hitGroup[TmpIndex-1]).distance > tmpItem.distance) )
								{
									hitGroup[TmpIndex] = hitGroup[TmpIndex-1];
									TmpIndex = TmpIndex - 1;
								}
								
								hitGroup[TmpIndex] = tmpItem;
							}
							//Pixel perfect check from front to back
							foreach (RaycastHit tmpHit in hitGroup)
							{
								tmpQuadObj = (GUIQuadObj) tmpHit.collider.gameObject.GetComponent(typeof(GUIQuadObj));
								if (tmpQuadObj != null)
								{
									if (CheckHit(tmpQuadObj, tmpHit) == true)
									{
										tmpHit.collider.gameObject.SendMessage("onGUIMoved", tmpTouch, SendMessageOptions.DontRequireReceiver);
										break;
									}
								}
							}
						}
						else
						{
							if(Physics.Raycast(ray, out hit, 1000, LayerBitMask))
							{
								//Send down message only for objects handled by this manager
								tmpQuadObj = (GUIQuadObj) hit.collider.gameObject.GetComponent(typeof(GUIQuadObj));
								if (tmpQuadObj != null)
								{
									if (tmpQuadObj.QuadManager == this)
									{
										hit.collider.gameObject.SendMessage("onGUIMoved", tmpTouch, SendMessageOptions.DontRequireReceiver);
									}
								}
							}
						}
						break;
						
					case iPhoneTouchPhase.Ended:
						if (PixelPerfectCollision == true)
						{
							//Get all objects hit by ray
							RaycastHit[] hitGroup = Physics.RaycastAll(ray, 1000, LayerBitMask);
							//Sort objects by distance from camera
							int Index = 0;
							int TmpIndex = 0;
							RaycastHit tmpItem;
							for(Index=1;Index<hitGroup.Length;Index++)
							{
								tmpItem = hitGroup[Index];
								TmpIndex = Index;
								
								while( (TmpIndex > 0) && ((hitGroup[TmpIndex-1]).distance > tmpItem.distance) )
								{
									hitGroup[TmpIndex] = hitGroup[TmpIndex-1];
									TmpIndex = TmpIndex - 1;
								}
								
								hitGroup[TmpIndex] = tmpItem;
							}
							//Pixel perfect check from front to back
							foreach (RaycastHit tmpHit in hitGroup)
							{
								tmpQuadObj = (GUIQuadObj) tmpHit.collider.gameObject.GetComponent(typeof(GUIQuadObj));
								if (tmpQuadObj != null)
								{
									if (CheckHit(tmpQuadObj, tmpHit) == true)
									{
										tmpHit.collider.gameObject.SendMessage("onGUIUp", tmpTouch, SendMessageOptions.DontRequireReceiver);
										break;
									}
								}
							}
						}
						else
						{
							if(Physics.Raycast(ray, out hit, 1000, LayerBitMask))
							{
								//Send down message only for objects handled by this manager
								tmpQuadObj = (GUIQuadObj) hit.collider.gameObject.GetComponent(typeof(GUIQuadObj));
								if (tmpQuadObj != null)
								{
									if (tmpQuadObj.QuadManager == this)
									{
										hit.collider.gameObject.SendMessage("onGUIUp", tmpTouch, SendMessageOptions.DontRequireReceiver);
									}
								}
							}
						}
						break;
				}
			}
		}
	}
}
 