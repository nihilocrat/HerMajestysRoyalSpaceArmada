/*
import string
import pprint
import time
import random
import math

import json

import blazon as BlazonGen


titlenames = [
	"Baro",
	"Comes",
	"Marchio", #"Iarlus"
	"Dux",
	"Rex",
	"Imperator",
]


names = {
	"norse" :
	{
		"male" : ["Thorbjorn","Bjorn","Eirikr","Sveinn","Sigmundr","Ragnar","Knutr","Leifr","Ingimar","Hroar","Hjalmar","Hrafn","Hakon","Gudrun","Gunnar","Hogni","Erlingr","Asmundr"],
		"female" : ["Brunnhild","Hildegard","Helga", "Freya"],
		"surname_prefix" : ["Silli","Aas","Born","Dahl","Hage","Gron","Holm","Soder","Svahn","Torn"],
		"surname_suffix" : ["sson","sdottir","man","gaard","quist","strom","holdt","gren","skog","berg","brand"],
		"fief" : {
			"prefix" : ["aal","hvidse","sval","trond","got"],
			"suffix" : ["borg","heim","baard","mark","land"],
		}
	},
    
	"anglosaxon" :
	{
		"male" : [
			"Adalbertus", "AEthelredus", "AEthelgarus", "AEthelstanus",
			"Alfredus",
            "Balduinus",
			"Carolus",
			"Cnuto",
			"Conradus",
			"Cennathus",
			"Edmundus",
			"Georgius",
			"Eduardus",
			"Edredus",
			"Edwius",
			"Edgarus",
			"Egbertus",
            "Fredericus",
			"Hengistus",
			"Henricus",
			"Haroldus",
			"Ovenus",
			"Guielmus",
            "Guinstonus",
            "Goduinus",
			"Iohannes",
			"Ricardus",
			"Redvald",
			"Rothgarus",
			"Sigbertus",
			"Vulfherus",
            "Stephanus",
			"Philippus",
			"Iacobus",
            "Olivarius",
		],
		"female" : [
			"AEthelhilda",
            # more christian / latin sounding
			"Anna",
			"Carolina",
            "Caroletta",
            "Catharina",
			"Elisabetha",
			"Guielmina",
            "Georgina",
            "Henrietta",
            "Isabella",
			"Iohanna",
			"Matilda",
			"Maria",
            "Margareta",
            "Morgana",
            "Olivia",
            "Rosetta",
            "Sophia",
		],
        "cognomen" : {
            "unready" : "Unparatus",  # particularly large number of military failures
            "simple" : "Simplex",  # ?
            "victor" : "Victor",  # highly successful militarily
            "conqueror" : "Conquestor", #takes a high-value title (duke, king) by force
            "tyrant" : "Tyrannus", # oppressive, unpopular with commoners
            "pious" : "Pius", # particularly good relations with the church
            "confessor" : "Confessor", # pious, nonmilitary, died in peace
            # cognomina in code:
            # <birth-region-name>-us : given to nobles to marry into a culture not their own
            # "Gunnar Gotlandus" translates as "Gunnar the Gotlander"
        },
		"surname_prefix" : [
			"eald", "tud", "vess", "suss", "bruns", "gren", "sax", "vind", "iorc", "norm", "britt", "stuar", "lanc",
		],
		"surname_suffix" : [
			"ogathus", "ovithus", "isexus", "igerus", "andus", "endius", "arius", "orus", "utus", "astrus",
		],
		"fief" : {
			"prefix" : [
				"angl",
				"londin",
				"edin",
				"oxon",
				"ebor",
				"ledes",
				#"carliol",
				"luguvall",
				"mancun",
				"vulfrun",
				"hant",
				"ham",
				"plimm",
				
				"umbr",
				"liv",
				"dors",
				"cornval",
				"cent",
				"dur",
				"surr",
				"scot",
			],
			"suffix" : [
				"ia",
				"ium",
				"acum",
				#"iburgum",
				"etium",
				#"ellum",
				"entum",
				"ona",
				"eta",
				"iex",
			],
            "flavor_precede" : [
                "Patria","Mons","Campus","Colonia","Silva",
            ],
            "flavor_follow" : [
                "Novum","Altum",
                "Major","Minor","Superior","Inferior",
                "Occidentalis","Australis","Orientalis","Septentrionalis",
            ],
		},
	},
    
    #HMRSA cultures
    "deutsch" :
	{
		"male" : ["Reinhardt","Gerhardt","Gunther","Hagen","Hans"],
		"female" : ["Brunnhild","Hildegard","Gretel",],
		"surname_prefix" : ["Ratz","Schwartz","Grenzfurt"],
		"surname_suffix" : ["mann","berg","inger"],
		"fief" : {
			"prefix" : ["wolf","wald","stauf","aal","aach","augs","strass","kaisers",
                "falken","raben","luene","ham","hildes","magde","regen","ratze",
                "muehl","mecklen","branden","eisen","lim"],
			"suffix" : ["furt","mark","land","burg","berg","bach","stein","stadt",
                "heim","kirchen","feld","hausen","brunn","tal",],
		}
	},
    # not liking this too much... so far it sounds too much like crappy sci-fi / fantasy tropes
    # BRONCANUS
    "transhuman" :
    {
        "male" : ["Tiberius", "Loki", "Iesu", "Oda"],
        "female" : ["Illiria"],
        "surname_prefix" : ["Nobun", "Karr", "Ixiell", "Vuld"],
        "surname_suffix" : ["aga", "ino", "ius"],
		"fief" : {
			"prefix" : ["ix","illur","Xrad","Xreth","Xrog","Sill","Geneith", "Kelled", "Korris", "Err"],
			"suffix" : ["ud","an","ant", "akos"],
            "flavorwords" : ["Prime", "Major", "Minor"],
		}
    }
}

	
#thus: Ethelredus "" , Rex Anglorum



class House(object):
    nobles = []
    surname = None
    alive = True
	
    def __init__(self, house_id, culture, surname=None, blazon=None):
        self.house_id = house_id
        
        if surname is None:
            surname = random.choice(names[culture]["surname_prefix"]) + random.choice(names[culture]["surname_suffix"])
            surname = surname.capitalize() 
        if blazon is None:
            self.blazon = BlazonGen.generate_blazon()
        
        self.culture = culture
        self.surname = surname
    
    def __repr__(self):
        return 'House %s' % self.surname
    
    def kill(self, anno):
        self.alive = False

    def getUnusedNames(self, sex):
        used = [n.firstname for n in self.nobles if n.sex == sex]
        unused = [name for name in names[self.culture][sex] if name not in used]
        return unused
    
        
class Council(object):
    """
    A legislative body made up of nobles from several houses.
    
    Generally these weaken individual houses but improve relationships between them
    and make it easier to cooperate.
    """

class Society(object):
    """
    These are basically Houses that are not necessarily hereditary and are
    founded for a specfic purpose, examples being:
    Guilds, trade Republics, military Orders, Templars, Holy See + Papal states, etc.
    """
        
class Fief(object):
    name = None
    tiles = []
    
    def __init__(self, fief_id, name, pos):
        self.fief_id = fief_id
        self.name = name
        self.pos = pos
    
    def __repr__(self):
        return '%s (%d,%d)' % (self.name, self.pos[0], self.pos[1])
    

class Realm(object):
    """
    groupings of fiefs or realms to create larger "nation"-like entities
    fiefs -> counties -> duchies -> kingdoms -> empires
    """
    def __init__(self, type, name, superrealm=None, subs=[]):
        self.superrealm = superrealm
        self.subrealms = subs
        self.fullname = "%s of %s" % (type, name)

    
class Title(object):
    name = None
    type = None
    holdings = []
    
    def __init__(self, name, holding):
        self.name = "%s %s" % (name, holding.name)
        self.holdings = [holding,]
        
    def __repr__(self):
        return '%s' % self.name

class TitleType(object):
    name = 'King'

    
gene_deviation = {
    # deviations of various genedata variables from generation to generation
    # global for all nobles; might have it be culture- or house-specific
    # to reflect cultural/house upbringing differences
}
    
class Noble(object):
    alive = True
    
    firstname = None
    lastname = None
    middlename = None
    cognomen = ""
    maidenname = None
    lineage_rank = 1
    born = 0
    died = None
    lifespan = 60

    spouse = None
    parents = []
    children = []
	
    # these are things that tend to get passed onto offspring
    facedata = {}
    genedata = {
        "avg_lifespan" : 50, # average lifespan, supposing death by old age
        "immunity" : 0.95, # immunity to illnesses
        "fertility" : 0.6, # likelihood of producing a child
        "charm" : 0.7, # likelihood of attracting a mate
    }
    
    # status data -- this will fluctuate with play
    titles = []
    sick = False
    statdata = {
        "command" : 1,
        "management" : 1,
    }

    def __init__(self, sex, house, culture, firstname, lineage_rank=None):
        self.firstname = firstname
        self.surname = house.surname
        self.fullname = self.firstname + " " + self.surname
        self.sex = sex
        self.house = house
        self.culture = culture
        
        if lineage_rank:
            self.setLineage(lineage_rank)
        
        self.lifespan = self.genedata["avg_lifespan"] + random.randint(-10,10)
        self.titles = []
        self.children = []
			
    def __repr__(self):
        if self.lineage_rank > 1:
            lineage = " " + toRoman(self.lineage_rank)
        else:
            lineage = ""

        if self.maidenname is not None:
            maiden = "%s " % self.maidenname
        else:
            maiden = ""
        
        fullname = '%s %s%s%s' % (self.firstname, maiden, self.surname, lineage)
        return fullname

    def kill(self, anno):
        self.alive = False
        self.died = anno
        
        # define succession logic here
        # if my spouse is alive, they get all the titles
        # if not...
        # for now, give the highest-value titles to the eldest offspring
        try:
            #for t in self.titles:
            #   self.children[0].bestow(t)
            self.children[0].titles += self.titles
        except IndexError:
            pass
            
        del self.titles
        
    def getAge(self, year):
        if self.alive:
            return (year - self.born)
        else:
            return (self.died - self.born)
        
    def setLineage(self, lineage_rank):
        self.lineage_rank = lineage_rank
        self.fullname += " " + toRoman(self.lineage_rank)
	
    def bestow(self, title):
        self.titles.append(title)
        return True
    
    def marry(self, year, spouse):
        # no gay marriage for now ;_;
        if spouse.sex == self.sex:
            return None
        
        spouse.spouse = self
        self.spouse = spouse
        
        # silliness
        if spouse.sex == "female":
            spouse.maidenname = spouse.surname
            spouse.surname = self.surname

    
    def beget(self, year, spouse):
        """ returns Noble """
        if spouse.sex == self.sex:
            return None

        # genetically, 50% chance of male or female
        sex = random.choice(["male", "female"])

        # is this my first son? if so, we shall name him after the father
        sons = [child for child in self.children if child.sex == "male"]
        if sex == "male" and len(sons) <= 0:
            if self.lineage_rank == 0: self.lineage_rank = 1
            offspring = Noble(sex, self.house, self.culture, self.firstname, self.lineage_rank+1)
        else:
            # BUG : it might choose a name that's already within our house, but is not
            # caught by the case above
            fname = random.choice(self.house.getUnusedNames(sex))
            offspring = Noble(sex, self.house, self.culture, fname)
		
        # fill in various inherited data
        offspring.born = year
        offspring.parents = (self, spouse)
        
        # gene lotto!
        
        
        self.children.append(offspring)
        spouse.children.append(offspring)
        return offspring


class Army(object):
    def __init__(self, leader, name, location,  men):
        if leader is None:
            # spawn a non-noble leader
            pass
        self.leader = leader
        self.soldiers = men
        self.name = name
        self.location = location
        

def choice_weighted(weights):
    scores = {}
    for choice, weight in weights.items():
        scores[random.randint(0,weight)] = choice
    winning_score = max(scores.keys())
    return scores[winning_score]
    


def generate_fief():
    opos = (0,0)
    tiles = growtile(opos, 4)
    for t in tiles:
        newt = growtile(t,4)

def growtile(origin, num_tiles, probability=1.0):
    ox, oy = origin
    # grow a tile in each direction
    offspring = [(ox+1,oy),(ox-1,oy),(ox,oy+1),(ox,oy-1)]
    # randomly pop off a grown tile
    for t in range(0, 4-num_tiles):
        if random.random() <= probability:
            offspring.pop(random.randint(0,len(offspring)-1))
    return offspring
        

def generate_seed_house(anno, culture, house, num_members):
    members = []
    for i in range(0, num_members):
        king = Noble("male", house, culture, random.choice(names[culture]["male"]))
        queen = Noble("female", house, culture, random.choice(names[culture]["female"]))
        king.spouse = queen
        queen.spouse = king
        king.born = anno - 25 - random.randint(0,5)
        queen.born = anno - 25 - random.randint(0,5)
        members.append(king)
        members.append(queen)

    # see if we need to add a number to the name		
    house_names = [noble.fullname for noble in members]
    for fullname in house_names:
        cnt = house_names.count(fullname)
        if cnt > 1:
            # we rely on the fact that we get the FIRST index
            for num in range(0, cnt):
                idx = house_names.index(fullname)
                members[idx].setLineage(num+1)
                house_names[idx] = members[idx].fullname # hack
                #members[idx] += " " + toRoman(num+1)
    return members

	
	
def generate_fiefs(culture, num_fiefs, max_x, max_y):
    fiefs = []
    fiefnames = []
    for y in range(0, max_y):
        for x in range(0, max_x):
    #    for i in range(0, num_fiefs):
            fullname = random.choice(names[culture]["fief"]["prefix"]) + random.choice(names[culture]["fief"]["suffix"])
            fullname = fullname.capitalize()
            
            if random.random() < 0.10:
                funword = random.choice(names[culture]["fief"]["flavor_follow"])
                fullname += " " + funword
            elif random.random() < 0.20:
                funword = random.choice(names[culture]["fief"]["flavor_precede"])
                fullname = funword + " " + fullname
            
            if fiefnames.count(fullname) <= 0:
                fiefnames.append(fullname)
                
                fief_id = (x+1)*(y+1)
                newfeef = Fief(fief_id, fullname, (x, y))
                
                fiefs.append(newfeef)
            else:
                x -= 1 # retry... dirty
    
    del fiefnames
    return fiefs


def main():
    annum_primum = 500
    years_generated = 500
    armies_per_house = 1
    num_houses = 8
    map_x = 7
    map_y = 6
    num_fiefs = map_x * map_y
    seed_families = 3
    
    # seed the world with nobles and fiefs
    houses = []
    fiefs = []
    armies = []
    events = { annum_primum-1 : [], }
    
    world_seed = time.time()
    random.seed(world_seed)
    world = {"seed" : world_seed, "houses" : {}, "nobles" : {}, "events" : events, "fiefs" : {}}
    
    sourcejson = open("sourcedata.json")
    j = "".join(sourcejson.readlines())
    sourcejson.close()
    
    sourcedata = json.loads(j)
    
    for culture in ["anglosaxon",]:
        culture_houses = []
        for i in range(0, num_houses):
            surname = random.choice(names[culture]["surname_prefix"]) + random.choice(names[culture]["surname_suffix"])
            surname = surname.capitalize()
            if surname in [h.surname for h in culture_houses]:
                i -= 1 # retry
            else:
                h = House(i, culture, surname)
                # culture, house's name, number of seed families
                h.nobles = generate_seed_house(annum_primum, culture, h, seed_families)
                culture_houses.append(h)
                world["houses"][i] = h

        fiefs = generate_fiefs(culture, num_fiefs, map_x, map_y)
        # divide fiefs amongst houses
        fiefs_per_house = int(math.floor(num_fiefs / num_houses))
        extra_fiefs = num_fiefs % num_houses
        print "numbers of houses:",  num_houses, "fiefs per house: ", fiefs_per_house, " with leftovers:", extra_fiefs
        # find contiguous blocks of fiefs
        # for now we will just slice up the fief list
        fiefslist = list(fiefs)
        print "total number of fiefs:", len(fiefslist)
        for h in culture_houses:
            for i in range(0, fiefs_per_house):
                try:
                    my_fief = fiefslist.pop()
                    print "fief %s goes to %s fiefs left: %d" % (my_fief, h, len(fiefslist))
                except IndexError:
                    print "no more fiefs to give out!"
                
                t = Title("Baro", my_fief)
                noble = h.nobles[i]
                noble.bestow(t)
                events[annum_primum-1].append("%s was awarded the title '%s'" % (`noble`, `t`))

            for i in range(1, armies_per_house+1):
                # HACK
                noble = h.nobles[i-1]
                try:
                    location = noble.titles[0].holdings[0]
                    armyname = "Legio %s %s" % (toRoman(i), location)
                    a = Army(noble, armyname, location, 100)
                    armies.append(a)
                    events[annum_primum-1].append( "%s has raised %s, an army of %d soldiers at %s" % (noble, armyname, 100, location) )
                except IndexError:
                    print "couldn't give army to " + `noble`

    # extract handy list of all houses in existence
    houses = world["houses"].values()
    
    for h in world["houses"].values():
        print "%s - blazon: %s" % (`h`, h.blazon)
        pprint.pprint(h.nobles)
    
    #universe = {"houses":houses,"fiefs":fiefs,}
    
    dead_houses = []
            
    # grow the house a certain number of years
    for anno in range(annum_primum, annum_primum+years_generated):
        events[anno] = []
        for house in houses:
            # housewide yearly occurrences
            if len(house.nobles) <= 0 and house.alive:
                house.kill(anno)
                events[anno].append( "Alas! House %s is extinct." % (house.surname,) )
                dead_houses.append(house)
                continue
        
            # yearly occurrences
            male_nobles = [n for n in house.nobles if n.sex == "male"]
            if len(male_nobles) > 0:
                parent = random.choice(male_nobles)
                # beget!
                if random.random() < parent.genedata["fertility"] and parent.spouse != None and not n.sick:
                    child = parent.beget(anno, parent.spouse)
                    events[anno].append( "%s and %s begat %s" % \
                        (`parent`, `parent.spouse`, `child`) )
                    house.nobles.append(child)
                    #world["nobles"][repr(child)] = child
                    
                    # tiny chance of death during childbirth
                    # varies with healtiness of house, cleanliness of culture
                    if random.random() < 0.01:
                        n = parent.spouse
                        n.kill(anno)
                        events[anno].append( "Alas! %s died at the age of %d during childbirth" % (n, n.getAge(anno)) )
                        dead.append(n)                        
                    
                # marriage!
                elif random.random() < parent.genedata["charm"] and parent.getAge(anno) >= 18:
                    other_houses = list(houses)
                    other_houses.remove(house)
                    o_house = random.choice(other_houses)
                    eligible = [n for n in o_house.nobles if n.alive and n.sex != parent.sex and n.spouse is None and n.getAge(anno) >= 18]
                    try:
                        newspouse = random.choice(eligible)
                        parent.marry(anno, newspouse)
                        # women join the man's house
                        if parent.sex == "male" and newspouse.sex == "female":
                            o_house.nobles.remove(newspouse)
                            house.nobles.append(newspouse)
                        events[anno].append( "%s married %s" % \
                            (`parent`, `parent.spouse`) )
                    except IndexError:
                        pass
                    
            # die!
            dead = []
            for n in house.nobles:
                if not n.sick:
                    if random.random() > n.genedata["immunity"]:
                        n.sick = True
                        #events[anno].append("%s has fallen ill at the age of %d" % (n,n.getAge(anno)))
                else:
                    if random.random() < n.genedata["immunity"]:
                        n.sick = False
                        #events[anno].append("%s recovered from sickness" % (n,))
                    else:
                        n.lifespan -= 1
                        if n.getAge(anno) > n.lifespan:
                            n.kill(anno)
                            events[anno].append( "Alas! %s died at the age of %d of illness" % (n, n.getAge(anno)) )
                            dead.append(n)
                
                if n.alive and n.getAge(anno) > n.lifespan:
                    n.kill(anno)
                    events[anno].append( "%s died at the age of %d of old age" % (n, n.getAge(anno)) )
                    dead.append(n)
            
            map(house.nobles.remove, dead)
        
        #map(houses.remove, dead_houses)
    
    """
    print "generation complete. Do you want to print to the screen? [Y/n] :",
    confirm = raw_input()
    if confirm != "n":
        # print out history
        anni = events.keys()
        anni.sort()
        for a in anni:
            print "In Anno %d  ................................." % a
            for e in events[a]:
                print "  " + e
    """

    # pack events into data
    world["events"] = events
    
    # to assist serialization
    # FIXME : replace with automatic inspection of data structures within __dict__
    for id, h in world["houses"].items():
        for n in h.nobles:
            # dirty and destructive!
            n.parents = [repr(p) for p in n.parents]
            n.children = [repr(c) for c in n.children]
            n.titles = [repr(t) for t in n.titles]
            n.house = repr(n.house)
            if n.spouse: n.spouse = repr(n.spouse)
            if not world["nobles"].has_key(repr(n)):
                world["nobles"][repr(n)] = n.__dict__
            else:
                newname = repr(n) + " foo"
                print "ERROR : the noble %s already exists. Storing them as %s" % (n, newname)
                world["nobles"][newname] = n.__dict__
        
        h.nobles = [repr(n) for n in h.nobles]
        world["houses"][id] = h.__dict__
        
    for f in fiefs:
        world["fiefs"][f.name] = f.__dict__
    
    
    print "="*50
    print "Status of the Houses, Anno %d:" % anno
    for h in houses:
        print `h`
        pprint.pprint(h.nobles)

    print "Extinct Houses:", `dead_houses`
    
    print "do you want to write this history to file? [y/N] :",
    confirm = raw_input()
    fh = None
    if confirm == "y":
        print "name the file (sans extension):",
        filename = raw_input()
        fh = open(filename + ".history.txt", "w")
        fh.write(json.dumps(world, sort_keys=True, indent=4))
        fh.close()
        
    
def HMRSA_main():
    houses = []
    fiefs = []
    
    for culture in ["transhuman",]:
        for i in range(0, 5):
            h = House(culture)
            # culture, house's name, number of seed families
            h.nobles = generate_house(culture, h.surname, 1)
            houses.append(h)
        
        fiefs = generate_fiefs(culture, 40)
	
    for h in houses:
        pprint.pprint(h.nobles)
    
    print "Fiefs: " + "="*20
    pprint.pprint(fiefs)
*/