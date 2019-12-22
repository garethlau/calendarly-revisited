try:
    from keys.prod import prodKeys
    keys = prodKeys
except:
    from keys.dev import devKeys
    keys = devKeys
