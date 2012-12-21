   
function Generate() {
	/*
    //colors = list(heraldry_terms["tinctures"])
    colors = get_color_scheme()
    
    //base color
    blazon = [random.choice(colors)]
    colors.remove(blazon[0])
    
    //division
    if random.random() < 0.7:
        tincture = random.choice(colors)
        divisions_and_treatments = heraldry_terms["divisions"] + heraldry_terms["treatments"]
        blazon.append( "%s %s" % \
         ( random.choice(divisions_and_treatments),  tincture) )
        colors.remove(tincture)
     
    //ordinaire
    if random.random() < 0.6:
        tincture = random.choice(colors)
        blazon.append( "%s %s" % \
         ( random.choice(heraldry_terms["ordinaires"]),  tincture) )
        colors.remove(tincture)
    
    //charge
    // NOTE : for now, all arms have charges
    // because it looks cooler that way
    if random.random() < 0.9:
        tincture = random.choice(colors)
        charge = random.choice(heraldry_terms["charges"])
        """
        if random.random() < 0.2:
            article = "three"
            arrangement = random.choice(heraldry_terms["arrangements"])
            blazon.append( "%s %ss %s %s" % \
                (article, charge, tincture, arrangement))
        else:
        """
        if True:
            if charge[0] in ('a','e','i','o',):
                article = "an"
            else:
                article = "a"
                
            blazon.append( "%s %s %s" % \
            ( article, charge, tincture) )
        colors.remove(tincture)
    
    // HACK : reject if we only managed to generate a base
    if len(blazon) <= 1:
        return generate_blazon()
    
    return ", ".join(blazon)
	*/
}
