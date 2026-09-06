from pathlib import Path
from PIL import Image, ImageDraw

W, H = 1200, 800
OUT = Path("assets/learning/beginner/markets")
OUT.mkdir(parents=True, exist_ok=True)

BG = "#07111F"
PANEL = "#0C1A2B"
GRID = "#1B3046"
BLUE = "#56A6FF"
CYAN = "#55D6C2"
GOLD = "#F1C96B"
RED = "#F07F87"
MUTED = "#71859B"
WHITE = "#DCE8F5"


def canvas():
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    return im, d


def grid(d, left=110, top=110, right=1090, bottom=690, nx=8, ny=5):
    for i in range(nx + 1):
        x = left + (right - left) * i // nx
        d.line((x, top, x, bottom), fill=GRID, width=2)
    for j in range(ny + 1):
        y = top + (bottom - top) * j // ny
        d.line((left, y, right, y), fill=GRID, width=2)


def line(d, pts, color, width=10):
    d.line(pts, fill=color, width=width, joint="curve")
    for x, y in (pts[0], pts[-1]):
        d.ellipse((x-8, y-8, x+8, y+8), fill=color)


def save(name, draw_fn):
    im, d = canvas()
    draw_fn(d)
    path = OUT / name
    im.save(path, "WEBP", lossless=True, method=6)
    with Image.open(path) as check:
        assert check.size == (1200, 800), (name, check.size)
        assert check.format == "WEBP", (name, check.format)
    print(f"{name}: 1200x800 WEBP")


def asset_classes(role):
    def draw(d):
        if role == "hook":
            d.rounded_rectangle((120, 150, 1080, 650), 42, fill=PANEL)
            centers = [(270,400),(490,400),(710,400),(930,400)]
            colors = [BLUE, GOLD, CYAN, RED]
            for (x,y),c in zip(centers,colors):
                d.ellipse((x-82,y-82,x+82,y+82), outline=c, width=14)
            d.line((330,400,430,400), fill=MUTED, width=4)
            d.line((550,400,650,400), fill=MUTED, width=4)
            d.line((770,400,870,400), fill=MUTED, width=4)
        elif role == "concept":
            d.rounded_rectangle((100, 120, 1100, 680), 42, fill=PANEL)
            boxes=[(150,190,390,610,BLUE),(420,190,660,610,GOLD),(690,190,930,610,CYAN),(960,190,1060,610,RED)]
            # Ownership / lending / relative FX / physical exposure, expressed as distinct structures.
            d.polygon([(210,500),(270,300),(330,500)], outline=BLUE)
            d.line((180,530,360,530), fill=BLUE, width=12)
            d.rectangle((455,290,625,500), outline=GOLD, width=12)
            d.line((485,350,595,350), fill=GOLD, width=8)
            d.line((485,410,595,410), fill=GOLD, width=8)
            d.arc((720,270,900,500), 35, 325, fill=CYAN, width=12)
            d.arc((720,320,900,550), 215, 145, fill=CYAN, width=12)
            d.polygon([(990,500),(1040,280),(1090,500)], fill=RED)
        elif role == "misconception":
            grid(d, 100, 120, 1100, 680, 10, 5)
            pts1=[(140,560),(300,470),(450,510),(610,370),(760,420),(920,260),(1060,300)]
            pts2=[(140,590),(300,500),(450,540),(610,400),(760,450),(920,290),(1060,330)]
            line(d, pts1, BLUE, 10)
            line(d, pts2, GOLD, 7)
            d.line((600,160,600,640), fill=RED, width=8)
        else:
            d.rounded_rectangle((120, 160, 1080, 640), 42, fill=PANEL)
            for i,c in enumerate([BLUE,GOLD,CYAN,RED]):
                x=240+i*240
                d.ellipse((x-58,342,x+58,458), outline=c, width=12)
                d.line((x,250,x,330), fill=c, width=10)
                d.line((x,470,x,550), fill=c, width=10)
    return draw


def liquidity(role):
    def draw(d):
        grid(d, 110, 110, 1090, 690, 10, 6)
        center=600
        # Deep vs thin market depth around a common mid price.
        if role in ("hook","concept","summary"):
            left_levels=[(260,220),(230,300),(200,380),(170,460),(140,540)]
            right_levels=[(940,220),(970,300),(1000,380),(1030,460),(1060,540)]
            for i,((lx,y),(rx,_)) in enumerate(zip(left_levels,right_levels)):
                d.rectangle((lx,y,lx+260,y+38), fill=CYAN)
                d.rectangle((rx-260,y,rx,y+38), fill=BLUE)
            d.line((center,150,center,620), fill=WHITE, width=6)
            if role=="concept":
                d.line((420,625,780,625), fill=GOLD, width=18)
                d.polygon([(780,625),(735,598),(735,652)], fill=GOLD)
            if role=="summary":
                d.ellipse((550,340,650,440), outline=GOLD, width=10)
        elif role=="practice":
            for i,w in enumerate([290,250,200,145,95]):
                y=200+i*85
                d.rectangle((600-w,y,600,y+42), fill=CYAN)
                d.rectangle((600,y,600+w,y+42), fill=BLUE)
            d.line((390,600,850,600), fill=GOLD, width=18)
            d.polygon([(850,600),(800,570),(800,630)], fill=GOLD)
        else:
            # Same nominal order, visibly different price impact.
            d.rectangle((130,180,520,620), outline=MUTED, width=6)
            d.rectangle((680,180,1070,620), outline=MUTED, width=6)
            for i in range(5):
                y=230+i*70
                d.rectangle((190,y,460,y+34), fill=CYAN)
                d.rectangle((740,y,920-i*35,y+34), fill=BLUE)
            d.line((230,590,450,590), fill=GOLD, width=16)
            d.line((740,590,1020,590), fill=RED, width=16)
    return draw


def bidask(role):
    def draw(d):
        grid(d, 100, 120, 1100, 680, 10, 5)
        bid=520; ask=680
        d.line((bid,180,bid,620), fill=CYAN, width=16)
        d.line((ask,180,ask,620), fill=RED, width=16)
        d.rectangle((180,260,bid,330), fill=CYAN)
        d.rectangle((ask,430,1020,500), fill=RED)
        d.line((bid,400,ask,400), fill=GOLD, width=12)
        d.ellipse((bid-10,390,bid+10,410), fill=GOLD)
        d.ellipse((ask-10,390,ask+10,410), fill=GOLD)
        if role=="concept":
            d.polygon([(bid,360),(bid-42,335),(bid-42,385)], fill=CYAN)
            d.polygon([(ask,360),(ask+42,335),(ask+42,385)], fill=RED)
        elif role=="practice":
            d.line((300,560,bid,560), fill=BLUE, width=18)
            d.polygon([(bid,560),(475,530),(475,590)], fill=BLUE)
        elif role=="misconception":
            d.line((600,200,600,600), fill=MUTED, width=8)
            d.ellipse((560,350,640,430), outline=GOLD, width=10)
        elif role=="summary":
            d.rounded_rectangle((430,270,770,530), 34, outline=GOLD, width=8)
    return draw


def order_types(role):
    def draw(d):
        grid(d, 110, 110, 1090, 690, 10, 6)
        pts=[(140,540),(280,500),(410,450),(540,500),(670,390),(800,420),(930,300),(1060,330)]
        line(d,pts,BLUE,10)
        market_y=450; limit_y=560; stop_y=335
        d.line((170,market_y,1030,market_y), fill=WHITE, width=4)
        d.line((170,limit_y,1030,limit_y), fill=CYAN, width=8)
        d.line((170,stop_y,1030,stop_y), fill=RED, width=8)
        if role=="concept":
            d.ellipse((520,market_y-18,556,market_y+18), fill=WHITE)
            d.ellipse((680,limit_y-18,716,limit_y+18), fill=CYAN)
            d.ellipse((920,stop_y-18,956,stop_y+18), fill=RED)
        elif role=="practice":
            d.polygon([(900,stop_y),(850,305),(850,365)], fill=RED)
            d.polygon([(700,limit_y),(650,530),(650,590)], fill=CYAN)
        elif role=="misconception":
            d.line((600,180,600,620), fill=GOLD, width=12)
            d.ellipse((555,355,645,445), outline=GOLD, width=10)
        elif role=="summary":
            for x,c in [(350,WHITE),(600,CYAN),(850,RED)]:
                d.ellipse((x-45,355,x+45,445), outline=c, width=10)
    return draw


def slippage(role):
    def draw(d):
        grid(d, 110, 110, 1090, 690, 10, 6)
        levels=[(220,250,900,BLUE),(280,330,820,CYAN),(340,410,730,GOLD),(400,490,650,RED)]
        for x,y,r,c in levels:
            d.rectangle((x,y,r,y+42), fill=c)
        screen_x=520; exec_x=760
        d.line((screen_x,180,screen_x,620), fill=WHITE, width=7)
        d.line((exec_x,180,exec_x,620), fill=RED, width=10)
        d.line((screen_x,600,exec_x,600), fill=GOLD, width=14)
        d.polygon([(exec_x,600),(exec_x-45,572),(exec_x-45,628)], fill=GOLD)
        if role=="concept":
            for y in [271,351,431,511]:
                d.ellipse((exec_x-13,y-13,exec_x+13,y+13), fill=WHITE)
        elif role=="practice":
            d.line((420,180,900,580), fill=BLUE, width=16)
        elif role=="misconception":
            d.ellipse((screen_x-45,355,screen_x+45,445), outline=WHITE, width=10)
            d.ellipse((exec_x-45,355,exec_x+45,445), outline=RED, width=10)
        elif role=="summary":
            d.rounded_rectangle((430,260,850,540), 36, outline=GOLD, width=8)
    return draw


jobs = []
for role in ["hook","concept","misconception","summary"]:
    jobs.append((f"asset-classes-{role}.webp", asset_classes(role)))
for role in ["hook","concept","practice","misconception","summary"]:
    jobs.append((f"liquidity-{role}.webp", liquidity(role)))
    jobs.append((f"bid-ask-{role}.webp", bidask(role)))
    jobs.append((f"order-types-{role}.webp", order_types(role)))
    jobs.append((f"slippage-{role}.webp", slippage(role)))

assert len(jobs) == 24
for name, fn in jobs:
    save(name, fn)

print("Slice-5 FIX-1 export complete: 24/24 native 1200x800 WebPs")
