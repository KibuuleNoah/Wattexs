from collections import defaultdict

d = defaultdict(lambda: defaultdict(lambda: 0), {"n": 6})

d["h"] += 6

print(d)
