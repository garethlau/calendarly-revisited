def one():
    # s = "SE 2203B - 001Lecture8:30AM -10:30AMSpencerEngineeringBuilding 2200APPLMATH2276B - 002Lecture10:30AM -11:30AMSocial ScienceCentre 2050APPLMATH2276B - 005Tutorial11:30AM -12:30PMSpencerEngineeringBuilding 2100"
    # s = "_SE 2203B - 001_ Lecture_8:30AM -_10:30AM_Spencer_Engineering_Building 2200_APPLMATH_2276B - 002_Lecture_10:30AM -_11:30AM_Social Science_Centre 2050_APPLMATH_2276B - 005_Tutorial_11:30AM -_12:30PM_Spencer_Engineering_Building 2100_ECE 2238B -_001_Lecture_4:30PM -_5:30PM_Spencer_Engineering_Building 2200_ECE 2238B -_002_Tutorial_5:30PM -_7:30PM_Spencer_Engineering_Building 2200_SE 2203B - 003_Laboratory_7:30PM -_9:30PM_Amit Chakma_"
    s = "_CLASSICS_2301A - 001_Lecture_10:30AM -_11:30AM_Social Science_Centre 2050_STATS 2141A -_Lecture_1:30PM - 2:30PM_Natural Sciences_Centre 1_ _ _ _ _ _ _ _ _ _ _ _ _"
    split_pos = []

    for i in range(2, len(s)):
        # if (s[i].isupper() and s[i - 1].isupper() and (s[i - 1] != "A" and s[i] != "M")):
            # print("Uppercase pair: {} {}".format(s[i - 1], s[i]))
        if (s[i - 2] == "_" and s[i - 1].isupper() and s[i].isupper()):
            print("Uppercase pair: {} {}".format(s[i - 1], s[i]))
            print("Index to split: {}".format(i - 2))
            split_pos.append(i - 2)

    split_pos = split_pos[::-1]

    print(split_pos)

    items = []
    for pos in split_pos:
        items.append(s[pos:])
        s = s[:pos]

    for item in items:
        print("ITEM ")
        print(item)


def two():
    from datetime import datetime
    t = "1:35PM"
    t  = datetime.strptime(t, "%I:%M%p")
    t = datetime.strftime(t, "%H:%M")
    print(t[:2])
    print(t[3:])
    

def three():
    s = 1
    while True:
        s = (s + 1) % 7
        print(s)

def four():
    s = "2020-04-27T01:11:54.000Z"
    s = s.replace('-', '')
    s = s.replace(':','')
    s = s.replace('.', '')
    s = s[:-4] + 'Z'
    print(s)

def five(x):
    if x > 10: print("nice")

four()