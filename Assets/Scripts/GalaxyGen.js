public var starPrefab : GameObject;

public var method = "clusters";

public var seed = 0;
// good seeds:
// 1411587674 - 60 stars, separation 4, galaxy 60x60, minclusters 10, maxclusters 10

public var total_stars = 100;
public var minimum_star_separation = 5;
public var perturbation = 1.0;

public var galaxyX = 100;
public var galaxyY = 100;

public var minClusters = 10;
public var maxClusters = 20;
public var clusterSpread = 4;

public var starYOffset = -1.5;

public var placenamesFile = "places_latin";

/*
# This script generates a 3D galaxy from a number of parameters and stores
# it in an array. You can modify this script to store the data in a database
# or whatever your purpose is. THIS script uses the data only to generate a
# PNG with a 2D view from top of the galaxy. 
#
# The algorithm used to generate the galaxy is borrowed from Ben Motz
# <motzb@hotmail.com>. The original C source code for DOS (including a 3D
# viewer) can be downloaded here:
#
# http://bits.bristol.ac.uk/motz/tep/galaxy.html
#
# Generation parameters:

// Number of stars in the core (Example: 2000)
var NUMHUB   = 5000;

// Number of stars in the disk (Example: 4000)
var NUMDISK  = 10000;

// Radius of the disk (Example: 90.0)
var DISKRAD  = 20000.0;

// Radius of the hub (Example: 45.0)
var HUBRAD   = 10000.0;

// Number of arms (Example: 3)
var NUMARMS  = 3;

// Tightness of winding (Example: 0.5)
var ARMROTS  = 0.5;

# Arm width in degrees (Not affected by number of arms or rotations)
# Exammple: 65.0
ARMWIDTH = 65.0

# Maximum depth of arms (Example: 2.0)
MAXDISKZ = 450.0

# Maximum depth of core (Example: 16.0)
MAXHUBZ  = 3500.0

# Maximum outlier distance from arms (Example: 25.0)
FUZZ     = 25.0


# X and Y size of the created PNG
PNGSIZE    = 800

# Background color of the created PNG
PNGBGCOLOR = ( 0, 0, 0 )

# Foreground color of the created PNG
PNGCOLOR   = ( 255, 255, 255 )

# PNG frame size
PNGFRAME   = 50

VOWELS = [
    'a','e','i','o','u','y'
]

#CONSONANTS = set(string.ascii_lowercase) set(VOWELS)
#CONSONANTS += [
#    'ng','sh','th','ch',
#]
*/


var alphabet = new Array(
        "Alpha",
        "Beta",
        "Gamma",
        "Delta",
        "Epsilon",
        "Zeta",
        "Eta",
        "Theta",
        "Iota",
        "Kappa",
        "Lambda",
        "Mu",
        "Nu"
);


var clusternames = new Array(
        "Antilae",
        "Draconis",
        "Ophiuchi",
        "Mersenne",
        "Pavonis",
        "Pegasi",
        "Serpentis",
        "Vulpeculae",
        "Ceti",
        "Gruis",
        "Cygnus",
        "Tauri",
        "Virginis",
        "Illuminati",
        "Herculis",
        "Krueger",
        "Gorno",
        "Sextantis",
        "Luyten",
        "Scuti",
        "Persei",
        "Arae",
        "Reticuli",
        "Cancri",
        "Eridani",
        "Leonis",
        "Geminorum",
        "Lyncis",
        "Cerenkov",
        "Scorpii",
        "Vitalis",
        "Bootis"
);

var lonernames = new Array(
        //"Sol",
        "Altair",
        "Arcturus",
        "Aldebaran",
        "Hyperion",
        "Pollux",
        "Metis",
        "Regulus",
        "Vela",
        "Rigel",
        "Fomalhaut",
        "Vega",
        "Sirius",
        "Betelgeuse",
        "Mizar",
        "Deneb",
        "Procyon",
		"Zephyr",
		"Erakkos",
		"Koerusaan",
		"Bandura",
		"Stygia",
		"Kymmera",
		"Akilon",
		"Shen"
);


// ---------------------------------------------------------------------------

function overlap(pos : Vector2, stars : Array, minimum)
{
	//return False
    for(var s in stars)
	{
        var dist = Vector2.Distance(pos, new Vector2(s[0], s[1]));
        if(dist <= minimum) return true;
	}
    return false;
}



/*
# num_clusters
# cluster_size_max
# cluster_size_min
# cluster_stars_min
# cluster_stars_max
# generate clusters
# pepper with unclustered stars
*/

function generate_sector(seed : int)
{
    
    var clusters_num = [maxClusters, minClusters];
    //cluster_size = (8, 24)
    var cluster_stars = [3, 8];

    var bounds = [[-galaxyX,galaxyX], [galaxyY,-galaxyY]];

    var x_bounds = [bounds[0][0], bounds[1][0]];
    var y_bounds = [bounds[1][1], bounds[0][1]];
    
    if(seed != 0) Random.seed = seed;

    //random.shuffle(clusternames);
    //random.shuffle(lonernames);

    var clusters = new Array();
    var stars = new Array();
    var stars_made = 0;

    randfunc = Random.Range;

	var total_clusters = Mathf.Floor(randfunc(clusters_num[0], clusters_num[1]));

    for(var j = 0; j < total_clusters; j++)
	{
        // generate cluster name

        // generate cluster origin
		var origin = new Vector2();
		
		var x = 0;
		var y = 0;
		
        var overlapping = true;
        var iterations = 0;
        while(overlapping)
		{
            origin = new Vector2(randfunc(x_bounds[0], x_bounds[1]),
										randfunc(y_bounds[0], y_bounds[1]));
            // determine cluster size and number of stars
            //radius = randfunc(*cluster_size)
            var num_stars = Mathf.Floor(randfunc(cluster_stars[0], cluster_stars[1]));
            var radius = num_stars * clusterSpread;

            overlapping = overlap(origin, clusters, radius);
            
            iterations += 1;
            if(iterations > 100)
            {
            	Debug.Log("Exceeded maximum iteration count for star placement");
            	break;
            }
		}
        var clustername = clusternames.Pop();

        clusters.Add(origin);
        
        Debug.Log(clustername + " cluster created at" + origin + "with size"+ radius +" and "+ num_stars + " stars...");

        for(i = 0; i < num_stars; i++)
		{
            // generate position for each star
            x = 0;
            y = 0;
            overlapping = true;
            while( x < x_bounds[0] || x > x_bounds[1] ||
                  y < y_bounds[0] || y > y_bounds[1] ||
                  overlapping)
				{
                x = randfunc(origin.x - radius, origin.x + radius);
                y = randfunc(origin.y - radius, origin.y + radius);
                overlapping = overlap(new Vector2(x,y), stars, minimum_star_separation);
			}

            // generate name
            name = alphabet[i] +" "+ clustername;
			var a = createStarAttribs();
            stars.Add([x,y, name, a[0], a[1], a[2]]);
            stars_made += 1;
		}
	}
	
	// generate non-clustered stars
	while (stars_made < total_stars)
	{
		x = 0;
		y = 0;
		overlapping = true;
		while( x < x_bounds[0] || x > x_bounds[1] ||
			  y < y_bounds[0] || y > y_bounds[1] ||
			  overlapping)
			{
			x = randfunc(x_bounds[0], x_bounds[1]);
			y = randfunc(y_bounds[0], y_bounds[1]);
			overlapping = overlap(new Vector2(x,y), stars, minimum_star_separation);
		}

		try
		{
			name = lonernames.Pop();
		}
		catch (e)
		{
			name = "TooMany!";
		}

		a = createStarAttribs();
		stars.Add([x,y, name, a[0], a[1], a[2]]);
		stars_made += 1;
		//print name, "created at", `(x,y)`
	}

    return stars;
}

function createStarAttribs() {
	var myield = Random.Range(0.75,1.25);
	var fyield = Random.Range(0.75,1.25);
	var gyield = Random.Range(0.75,1.25);
	
	return [myield, fyield, gyield];
}


function generate_grid(seed : int, starnames : Array) {
    var bounds = [[-galaxyX,galaxyX], [galaxyY,-galaxyY]];

    var x_bounds = [bounds[0][0], bounds[1][0]];
    var y_bounds = [bounds[1][1], bounds[0][1]];
    
    if(seed != 0) Random.seed = seed;
	
    var stars = new Array();
	var stars_made = 0;
	
	var rawsize = Mathf.Sqrt(total_stars);
	// if we need to, fudge it so it's wider than it is long
	// give the remainder to width
	var galaxyHeight = Mathf.Floor(rawsize);
	var galaxyWidth = Mathf.Floor(rawsize);
	if(rawsize % galaxyHeight != 0) galaxyWidth += 1;
	
	var spacingx = (galaxyX * 2) / galaxyWidth;
	var spacingy = (galaxyY * 2) / galaxyHeight;
	var originx = -(galaxyX);
	var originy = -(galaxyY);
	
	var density = 0.9;
	
	for(var y = 0; y < galaxyHeight; y++) {
		for(var x = 0; x < galaxyWidth; x++) {
			// skip some stars
			var dice = Random.value;
			if(dice > density) continue;
		
			var finalx = originx + (x * spacingx) + Random.Range(-perturbation, perturbation);
			var finaly = originy + (y * spacingy) + Random.Range(-perturbation, perturbation);
		
            // generate name
			try
			{
				var index = Random.Range(0, starnames.Count);
				name = starnames[index];
				starnames.RemoveAt(index);
			}
			catch (e)
			{
				name = "TooMany!";
			}

			var a = createStarAttribs();
            stars.Add([finalx, finaly, name, a[0], a[1], a[2]]);
            stars_made += 1;
		}
	}
	
	return stars;
}


/*
var probabilities = {
        'star_size': [
            (1,1,'giant'),
            (2,23,'subgiant'),
            (24,76,'main_sequence'),
            (77,86,'white_dwarf'),
            (87,99,'brown_dwarf'),
            (100,100,'special'),
        ],
        'star_spectral': [
            (1,1,'giant'),
            (2,2,'A'),
            (3,5,'F'),
            (6,13,'G'),
            (14,27,'K'),
            (28,76,'M'),
            (77,86,'white_dwarf'),
            (87,99,'brown_dwarf'),
            (100,100,'special'),
        ],
        'star_binary' : [
            (1,69,False),
            (70,100,True),
        ],
        'nebula_coverage' : [
            (1,20,True),
            (21,100,False),
        ],
}

function generateStars()
{
    stars = []

    # omega is the separation (in degrees) between each arm
    # Prevent div by zero error:
    if NUMARMS:
        omega = 360.0 / NUMARMS
    else:
        omega = 0.0
    i = 0
    while i < NUMDISK:
        # Choose a random distance from center
        dist = HUBRAD + random.random() * DISKRAD

        # This is the 'clever' bit, that puts a star at a given distance
        # into an arm: First, it wraps the star round by the number of
        # rotations specified.  By multiplying the distance by the number of
        # rotations the rotation is proportional to the distance from the
        # center, to give curvature
        theta = ( ( 360.0 * ARMROTS * ( dist / DISKRAD ) )
        
            # Then move the point further around by a random factor up to
            # ARMWIDTH
                + random.random() * ARMWIDTH
                
            # Then multiply the angle by a factor of omega, putting the
            # point into one of the arms
                #+ (omega * random.random() * NUMARMS )
                + omega * random.randrange( 0, NUMARMS )
                
            # Then add a further random factor, 'fuzzin' the edge of the arms
                + random.random() * FUZZ * 2.0 - FUZZ
                #+ random.randrange( -FUZZ, FUZZ )
            )
            
        # Convert to cartesian
        x = math.cos( theta * math.pi / 180.0 ) * dist
        y = math.sin( theta * math.pi / 180.0 ) * dist
        z = random.random() * MAXDISKZ * 2.0 - MAXDISKZ

        # Add star to the stars array            
        stars.append( ( x, y ,z ) )

        # Process next star
        i = i + 1
    
    # Now generate the Hub. This places a point on or under the curve
    # maxHubZ - s d^2 where s is a scale factor calculated so that z = 0 is
    # at maxHubR (s = maxHubZ / maxHubR^2) AND so that minimum hub Z is at
    # maximum disk Z. (Avoids edge of hub being below edge of disk)
    
    scale = MAXHUBZ / ( HUBRAD * HUBRAD )
    i = 0
    while i < NUMHUB:
        # Choose a random distance from center
        dist = random.random() * HUBRAD
      
        # Any rotation (points are not on arms)
        theta = random.random() * 360
        
        # Convert to cartesian
        x = math.cos( theta * math.pi / 180.0) * dist
        y = math.sin( theta * math.pi / 180.0) * dist
        z = ( random.random() * 2 - 1 ) * ( MAXHUBZ - scale * dist * dist )
        
        # Add star to the stars array
        stars.append( ( x, y, z ) )
    
        # Process next star
        i = i + 1

    return stars
}
*/

// gabriel graph code
/*
npoints = 100
radius = 0.05
exclusion = 0.2     # prevent points from being too close
scale = 5
 
def dist2(p,q):
    return (p[0]-q[0])**2 + (p[1]-q[1])**2
 
points = []
while len(points) < 100:
    p = (random()*scale,random()*scale)
    if points:
        nn = min(dist2(p,q)**0.5 for q in points)
        if nn < exclusion:
            continue
    points.append(p)
 
def neighbors(p,q):
    c = ((p[0]+q[0])/2,(p[1]+q[1])/2)
    dd = dist2(p,c)
    for r in points:
        if r != p and r != q and dist2(r,c) < dd:
            return False
    return True
 
for p in points:
    for q in points:
        if p < q and neighbors(p,q):
            edge(p,q)
 
*/

function dist2(a, b)
{
    return Mathf.Pow((a[0]-b[0]), 2) + Mathf.Pow((a[1]-b[1]), 2);
}

function AreNeighbors(p, q, points)
{
    var c = [(p[0]+q[0])/2, (p[1]+q[1])/2];
    var dd = dist2(p,c);
    for(var r in points)
    {
        if(r != p && r != q && dist2(r,c) < dd)
            return false;
    }
    return true;
}

function generateEdges(points)
{
	var edges = new Array();

	for(var p in points)
	{
		for(var q in points)
		{
			if(p != q && AreNeighbors(p, q, points))
			{
				edges.Add( [p, q] );
			}
		}
	}
	
	return edges;
}


function GetRandomUnique(myList)
{
	var index = Random.Range(0,myList.Count);
	var element = myList[index];
	myList.RemoveAt(index);
	
	return element;
}

function Go()
{
    // Generate the galaxy          
    //generateStars()
	var fullofstars : Array;
	var planets = new Array();
	
	// FIXME SERIOUSLY! need to fix the pathnames!
	var allnames = new Array(CSVReader.read("Data/"+placenamesFile+".txt"));
	//var loadednames_more = new Array(CSVReader.read("Data/places_latin.txt"));
	//var allnames = loadednames.Concat(loadednames_more);
	
	if( method == "clusters" ) {
		fullofstars = generate_sector(seed);
	}
	else {
		fullofstars = generate_grid(seed, allnames);
	}

    Debug.Log("seed was:" + Random.seed);
	
	for(var s in fullofstars)
	{
		var starpos = new Vector3(s[0],starYOffset,s[1]);
		clone = Instantiate(starPrefab, starpos, Quaternion.identity);
		//clone.name = s[2];
		clone.name = GetRandomUnique(allnames);
		
		var p = clone.GetComponent(CampaignPlanet);
		if(p != null)
		{
		}
		clone.transform.parent = transform;
		planets.Add(clone);
	}
	
	return planets;
}
