# params: pts (integer) points to convert to level
# return: a dict keys:
#                "id": (int) level number, starting at 1
#                "name": (str) level name (i.e. "adventurer")

# Points to achieve next level
next = [
    0,                # level 1
    50,               # level 2
    150,              # level 3
    250,              # level 4
    550,              # level 5
    1000,             # level 6
    2000,             # level 7
    4000,             # level 8
    8000,             # level 9
    16000             # level 10
]

# level names
names = [
    "Newbie",         # level 1
    "Trainee",        # level 2
    "Deck Hand",      # level 3
    "Cartographer",   # level 4
    "Explorer",       # level 5
    "Adventurer",     # level 6
    "The Expert",     # level 7
    "Captain",        # level 8
    "The Amazing",    # level 9
    "Pirate"          # level 10
]

def pointsToLevel(pts):
    id = pts
    temp = 0
    for i in range(len(next)):
        if id >= next[i]:
            temp = i
            
    name=names[temp]
    return dict(id=temp, name=name, pts=pts)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    