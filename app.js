/* =====================================================================
   BrightByte — Python + Java gamified crash-course platform.
   Progress is strictly earned; a Java-subset engine runs real code.
===================================================================== */
'use strict';
/* ---------- utils ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const fmt=n=>Number(n||0).toLocaleString('en-US');
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3);
const pad2=n=>String(n).padStart(2,'0');
const dayKey=(d=new Date())=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
const daysAgo=n=>{const d=new Date();d.setDate(d.getDate()-n);return d};
const hsh=s=>{let x=5381;for(const c of String(s))x=(((x<<5)+x)+c.charCodeAt(0))>>>0;return 'h'+x.toString(36)};
let pageTimers=[];
const later=(fn,ms)=>{const id=setTimeout(fn,ms);pageTimers.push(id);return id};
const every=(fn,ms)=>{const id=setInterval(fn,ms);pageTimers.push(id);return id};
const clearTimers=()=>{pageTimers.forEach(id=>{clearTimeout(id);clearInterval(id)});pageTimers=[]};

/* ---------- SVG icon system ---------- */
const ICONS={
 home:'<path d="m3 10.5 9-7.5 9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
 book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 video:'<path d="m23 7-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
 award:'<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
 chart:'<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M3 20h18"/>',
 trophy:'<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4a3 3 0 0 0 3 4"/><path d="M17 6h3a3 3 0 0 1-3 4"/>',
 user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
 terminal:'<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
 flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
 bolt:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
 code:'<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',
 lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 play:'<path d="m6 4 14 8-14 8V4z" fill="currentColor" stroke="none"/>',
 chev:'<path d="m6 9 6 6 6-6"/>',
 arrow:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
 menu:'<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 crown:'<path d="M3 18h18"/><path d="m4 18 1-9 4.5 3.5L12 6l2.5 6.5L19 9l1 9"/>',
 layers:'<path d="m12 2 10 5.5-10 5.5L2 7.5 12 2z"/><path d="m2 12.5 10 5.5 10-5.5"/><path d="m2 17.5 10 5.5 10-5.5"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
 calendar:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2z"/>',
 phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>'};
const ic=(n,s=18,cls='')=>`<svg ${cls?`class="${cls}" `:''}width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||ICONS.star}</svg>`;

/* ---------- persistent storage layer ---------- */
const DBKEY='brightbyte_v2';
let DB=null;
const save=()=>localStorage.setItem(DBKEY,JSON.stringify(DB));
function makeUser(o){return Object.assign({id:uid(),name:'',email:'',pass:'',role:'student',avatar:0,xp:0,streak:0,
  lastActive:'',joined:dayKey(),done:{},quizzes:[],extra:{},dailyXP:{},lessonsDay:{},unlocked:[],lastCourse:null,
  onboarded:false,interests:[],pref:'Complete Beginner',prefs:{reduceMotion:false}},o)}
function seedDB(){
  const ethan=makeUser({id:'u_ethan',name:'Ethan',email:'ethan@brightbyte.dev',pass:hsh('code1234'),
    joined:dayKey(daysAgo(26)),onboarded:true,interests:['Python Basics'],pref:'Beginner',lastCourse:'py'});
  const admin=makeUser({id:'u_admin',name:'Prof Byte',email:'admin@brightbyte.dev',pass:hsh('admin123'),role:'admin',avatar:4,onboarded:true});
  return {users:[ethan,admin],session:null,customCourses:[],extraMods:{},customAch:[]};
}
function loadDB(){try{DB=JSON.parse(localStorage.getItem(DBKEY))}catch(e){DB=null}if(!DB||!DB.users)DB=seedDB();save()}
const user=()=>DB.users.find(u=>u.id===DB.session)||null;

/* ---------- catalog: Python + Java ---------- */
function genericLearn(title){return[`what ${String(title).toLowerCase()} means and when to use it`,'a worked example you can run yourself','a challenge that locks the idea in']}
function genLessons(topic,n,lang,seedIdx){
  const base=['What is '+topic+'?','Core ideas of '+topic,'Practice: '+topic,topic+' Challenge'];
  const names=(n<=4?base.slice(0,Math.max(n,2)):['What is '+topic+'?','Core ideas of '+topic,'Practice: '+topic,'Level up: '+topic,topic+' Challenge'].slice(0,n));
  return names.map((t,i)=>({title:t,type:i===names.length-1?'challenge':'lesson',xp:100,
    learn:genericLearn(t),
    starter:lang==='java'
      ?'public class Main {\n    public static void main(String[] args) {\n        // '+t+'\n        \n    }\n}'
      :'# '+t+'\n',
    task:`Practice <code class="inl">${esc(topic)}</code> in the editor: write and run code that proves the idea works for you.`,
    test:{logs:true,hint:'Print at least one line that shows your practice worked.'}}));
}
/* python course builders */
function pyCourse(){
  const L=(title,extra={})=>Object.assign({title,type:'lesson',xp:100},extra);
  const C=(title,extra={})=>Object.assign({title,type:'challenge',xp:100},extra);
  const P=(title,task)=>({title,type:'project',xp:100,task,starter:'# '+title+'\n',test:{logs:true,hint:'Run your project — at least one print should appear.'}});
  return [
   {title:'Python Foundations',lessons:[
    L('What is Python?',{learn:['what Python is used for','how Python runs your code','printing with print()','writing comments'],
      ex:`# Python powers games, AI, websites and more
print("Hello, world!")
print("I am writing real Python!")

# lines starting with # are comments — notes for humans`,
      task:'Use print() to print your own greeting to the world.',
      starter:'# Print a greeting below\n',
      test:{logs:true,hint:'Print at least one message with print("...")'}}),
    L('Variables',{learn:['what variables are','how to create variables','naming things clearly','UPPER_CASE for constants'],
      diagram:true,
      ex:`player_name = "Ethan"
score = 100

print(player_name)
print(score)`,
      extra:'Python needs no let or var — the first assignment creates the box. Values that should never change are written in ALL_CAPS, like MAX_LIVES = 3.',
      task:'Create a variable called <code class="inl">age</code> and store a number inside it.',
      starter:'# Create your variable below\n\n',
      test:{vars:{age:v=>typeof v==='number'},hint:'Create a variable named age holding a number, like age = 14'}}),
    L('Data Types',{learn:['strings: text in quotes','integers: whole numbers','booleans: True or False','checking with type()'],
      ex:`my_name = "Maya"     # str  — text
level = 7            # int  — whole number
is_ready = True      # bool — True or False

print(type(my_name))
print(type(level))
print(type(is_ready))`,
      task:'Create three variables: <code class="inl">text</code> (a string), <code class="inl">num</code> (a whole number) and <code class="inl">flag</code> (a boolean).',
      starter:'# one string, one int, one boolean\n',
      test:{vars:{text:v=>typeof v==='string',num:v=>typeof v==='number'&&Number.isInteger(v),flag:v=>typeof v==='boolean'},
        hint:'Use quotes for a string, a plain whole number, and True or False (capital first letter).'}}),
    C('Mini Challenge',{ex:`hero = "Pixel Knight"
power = 90

print(hero + " has power " + str(power))`,
      task:'Create <code class="inl">player_name</code> (a string) and <code class="inl">score</code> (a whole number), then print both.',
      starter:'',test:{vars:{player_name:v=>typeof v==='string',score:v=>typeof v==='number'},logs:true,
        hint:'You need a player_name variable, a score variable, and a print that shows them.'}})]},
   {title:'Numbers & Math',lessons:[
    L('Arithmetic Operators',{learn:['the core math operators','order of operations','remainders with % and powers with **'],
      ex:`total = 5 + 3 * 2   # math first: 11
change = 10 % 3     # remainder: 1
square = 2 ** 8     # powers: 256

print(total)
print(change)
print(square)`,
      task:'Make <code class="inl">result</code> equal <code class="inl">15 * 3 + 7</code>, then print it.',
      starter:'',test:{vars:{result:v=>v===52},logs:true,hint:'result should equal 52 — remember * runs before +.'}}),
    L('Shorthand Updates',{learn:['updating a variable in place','+=, -=, *= and /=','building a counter'],
      ex:`coins = 10
coins += 5    # now 15
coins -= 3    # now 12
coins *= 2    # now 24

print(coins)`,
      task:'Start <code class="inl">score</code> at 0, add 50 with <code class="inl">+=</code>, then double it with <code class="inl">*=</code>. Print it at the end (should show 100).',
      starter:'score = 0\n\n',test:{vars:{score:v=>v===100},logs:true,hint:'score should end as 100: 0 + 50 = 50, then 50 * 2 = 100.'}}),
    C('Challenge',{ex:`days = 3
hours = days * 24

print(hours)`,
      task:'Create <code class="inl">week_seconds</code> and store the number of seconds in one week using math: 7 * 24 * 60 * 60. Print it.',
      starter:'',test:{vars:{week_seconds:v=>v===604800},logs:true,hint:'week_seconds should equal 604800 — chain the multiplications.'}})]},
   {title:'Strings',lessons:[
    L('Combining Strings',{learn:['joining strings with +','measuring with len()','adding spaces where they belong'],
      ex:`first = "Ada"
last = "Lovelace"
full = first + " " + last

print(full)
print(len(full))`,
      task:'Create <code class="inl">full_name</code> from a first and last name joined with a space, then print it.',
      starter:'',test:{vars:{full_name:v=>typeof v==='string'&&v.includes(' ')},logs:true,
        hint:'Join two strings with + and remember the space in between: first + " " + last'}}),
    L('String Methods',{learn:['.upper() and .lower()','methods do the work for you','chaining results'],
      ex:`word = "PyThOn"

print(word.upper())
print(word.lower())
print(len("hello"))`,
      task:'Write <code class="inl">shout(word)</code> that returns the word in ALL CAPS followed by an exclamation mark.',
      starter:`def shout(word):
    # return the loud version
    pass

print(shout("hello"))`,
      test:{fn:'shout',cases:[{args:['hello'],is:'HELLO!'},{args:['code'],is:'CODE!'}],hint:'Return word.upper() + "!"'}}),
    L('Indexing',{learn:['characters have positions','counting starts at 0','grabbing a single letter'],
      ex:`word = "Python"

print(word[0])    # P
print(word[3])    # h
print(len(word))  # 6`,
      task:'Write <code class="inl">first_letter(word)</code> that returns the first character.',
      starter:`def first_letter(word):
    pass

print(first_letter("Python"))`,
      test:{fn:'first_letter',cases:[{args:['Python'],is:'P'},{args:['code'],is:'c'}],hint:'Index 0 is the first character: word[0]'}}),
    C('Challenge',{ex:`secret = "level"

print(secret[0] + secret[1])`,
      task:'Write <code class="inl">initials(first, last)</code> that returns the first letter of each name joined together — initials("Ada", "Lovelace") returns "AL".',
      starter:`def initials(first, last):
    pass

print(initials("Ada", "Lovelace"))`,
      test:{fn:'initials',cases:[{args:['Ada','Lovelace'],is:'AL'},{args:['Sam','Smith'],is:'SS'}],hint:'Take first[0] and last[0] and glue them with +.'}})]},
   {title:'Making Decisions',lessons:[
    L('If Statements',{ex:`weather = "sunny"

if weather == "sunny":
    print("Grab your sunglasses!")`,
      task:'Write <code class="inl">can_vote(age)</code> that returns True when age is 18 or more.',
      starter:`def can_vote(age):
    # return True or False
    pass

print(can_vote(17))
print(can_vote(18))`,
      test:{fn:'can_vote',cases:[{args:[17],is:false},{args:[18],is:true},{args:[30],is:true}],hint:'can_vote(17) is False, can_vote(18) and can_vote(30) are True.'}}),
    L('Else Statements',{ex:`coins = 40

if coins >= 100:
    print("Buy the golden skin!")
else:
    print("Keep collecting...")`,
      task:'Write <code class="inl">sign(n)</code> that returns "positive" when n is 0 or more, otherwise "negative".',
      starter:`def sign(n):
    pass

print(sign(5))
print(sign(-3))`,
      test:{fn:'sign',cases:[{args:[5],is:'positive'},{args:[-3],is:'negative'},{args:[0],is:'positive'}],hint:'Watch out: 0 counts as positive here!'}}),
    L('Elif Chains',{ex:`score = 85

if score >= 80:
    print("high")
elif score >= 60:
    print("pass")
else:
    print("fail")`,
      task:'Write <code class="inl">grade(score)</code> that returns "high" when score is 80 or more, "pass" when 60 or more, otherwise "fail".',
      starter:`def grade(score):
    pass

print(grade(90), grade(70), grade(42))`,
      test:{fn:'grade',cases:[{args:[90],is:'high'},{args:[70],is:'pass'},{args:[42],is:'fail'}],hint:'Check the highest band first: if 80+, elif 60+, else fail.'}}),
    C('Challenge',{ex:`if age >= 13 and age <= 19:
    print("teen")`,
      task:'Write <code class="inl">is_teen(age)</code> — True only when age is between 13 and 19 (inclusive).',
      starter:`def is_teen(age):
    pass

print(is_teen(12), is_teen(15), is_teen(19))`,
      test:{fn:'is_teen',cases:[{args:[12],is:false},{args:[15],is:true},{args:[19],is:true}],hint:'Combine two comparisons with and: age >= 13 and age <= 19'}})]},
   {title:'Loops',lessons:[
    L('For Loops & range',{ex:`for lap in range(1, 6):
    print("Lap " + str(lap))`,
      task:'Write <code class="inl">sum_to(n)</code> that uses a loop to add every number from 1 up to n.',
      starter:`def sum_to(n):
    pass

print(sum_to(3))
print(sum_to(5))`,
      test:{fn:'sum_to',cases:[{args:[3],is:6},{args:[5],is:15},{args:[1],is:1}],hint:'sum_to(3) is 6 because 1 + 2 + 3 = 6. Try range(1, n + 1).'}}),
    L('While Loops',{ex:`fuel = 3

while fuel > 0:
    print("Zoom! Fuel: " + str(fuel))
    fuel -= 1`,
      task:'Write <code class="inl">double_to_100(n)</code> that keeps doubling n with a while loop until it is 100 or more, then returns it.',
      starter:`def double_to_100(n):
    pass

print(double_to_100(3))
print(double_to_100(100))`,
      test:{fn:'double_to_100',cases:[{args:[3],is:192},{args:[64],is:128},{args:[100],is:100}],hint:'double_to_100(3): 3, 6, 12, 24, 48, 96, 192 — stop as soon as it reaches 100 or more.'}}),
    L('Break & Continue',{ex:`for i in range(1, 11):
    if i == 4:
        break        # stop the loop
    if i % 2 == 0:
        continue     # skip evens
    print(i)`,
      task:'Write <code class="inl">first_over_10(nums)</code> that loops through the list and returns the first number greater than 10.',
      starter:`def first_over_10(nums):
    pass

print(first_over_10([2, 14, 8, 22]))
print(first_over_10([1, 2, 11]))`,
      test:{fn:'first_over_10',cases:[{args:[[2,14,8,22]],is:14},{args:[[1,2,11]],is:11}],hint:'Loop over each number and return it as soon as one is over 10.'}}),
    C('Challenge',{ex:`if n % 3 == 0:
    print("Fizz")`,
      task:'Write <code class="inl">fizz(n)</code>: return "Fizz" when n is divisible by 3, otherwise return n itself.',
      starter:`def fizz(n):
    pass

print(fizz(9), fizz(10))`,
      test:{fn:'fizz',cases:[{args:[9],is:'Fizz'},{args:[10],is:10},{args:[3],is:'Fizz'},{args:[7],is:7}],hint:'The % operator gives a remainder — n % 3 == 0 means divisible.'}})]},
   {title:'Lists',lessons:[
    L('Creating Lists',{ex:`colors = ["red", "green", "blue"]

print(colors[0])     # red
print(len(colors))   # 3`,
      task:'Write <code class="inl">first_item(items)</code> that returns the first element of a list.',
      starter:`def first_item(items):
    pass

print(first_item(["a", "b", "c"]))`,
      test:{fn:'first_item',cases:[{args:[['a','b']],is:'a'},{args:[[7,8]],is:7}],hint:'List indexes start at 0 — items[0]'}}),
    L('List Methods',{ex:`bag = ["coin", "key"]
bag.append("potion")        # add to the end
print(len(bag))             # 3
print("key" in bag)         # True`,
      task:'Write <code class="inl">has_item(items, x)</code> that returns True when the list contains x.',
      starter:`def has_item(items, x):
    pass

print(has_item([1, 2, 3], 2))`,
      test:{fn:'has_item',cases:[{args:[[1,2,3],2],is:true},{args:[[1,2],9],is:false}],hint:'The in operator does the checking: return x in items'}}),
    L('Looping Lists',{ex:`scores = [10, 30, 20]
total = 0

for s in scores:
    total += s

print(total)  # 60`,
      task:'Write <code class="inl">total(nums)</code> that returns the sum of every number in the list.',
      starter:`def total(nums):
    pass

print(total([10, 30, 20]))`,
      test:{fn:'total',cases:[{args:[[10,30,20]],is:60},{args:[[5,5]],is:10}],hint:'Start a total at 0 and add each number inside the loop.'}}),
    {title:'Checkpoint Quiz',type:'quiz',xp:100,quiz:[
      {q:'Which keyword defines a function in Python?',opts:['function','def','define'],a:1},
      {q:'What does type(3.5) return?',opts:['"int"','"float"','"str"'],a:1},
      {q:'Which loop fits best when you know exactly how many times to repeat?',opts:['for with range()','while True','if'],a:0}]}]},
   {title:'Dictionaries',lessons:[
    L('What are Dictionaries?',{ex:`player = {
    "name": "Ethan",
    "age": 14
}

print(player["name"])
print(player["age"])`,
      task:'Create a dictionary called <code class="inl">player</code> with a <code class="inl">"name"</code> (string) and an <code class="inl">"age"</code> (number).',
      starter:'player = {\n    # your entries here\n}\n\nprint(player)',
      test:{vars:{player:v=>v&&typeof v==='object'&&!Array.isArray(v)&&typeof v.name==='string'&&typeof v.age==='number'},
        hint:'Use curly braces with "key": value pairs — like {"name": "Ethan", "age": 14}'}}),
    L('Updating Entries',{ex:`player = {"score": 0}
player["score"] += 50
player["level"] = 2

print(player["score"])
print(player["level"])`,
      task:'Start <code class="inl">player</code> as {"score": 0}, add 50 to its score, and give it a "level" of 2.',
      starter:'',test:{vars:{player:v=>v&&v.score===50&&v.level===2},hint:'player["score"] += 50 then player["level"] = 2'}}),
    L('Looping Dictionaries',{ex:`ages = {"Ada": 36, "Alan": 41}

for who in ages:
    print(who, ages[who])`,
      task:'Write <code class="inl">describe(d)</code> that returns the text "NAME is AGE" — describe({"name": "Ethan", "age": 14}) returns "Ethan is 14".',
      starter:`def describe(d):
    pass

print(describe({"name": "Ethan", "age": 14}))`,
      test:{fn:'describe',cases:[{args:[{name:'Ethan',age:14}],is:'Ethan is 14'},{args:[{name:'Maya',age:13}],is:'Maya is 13'}],
        hint:'Build the string with + and convert the age with str(): d["name"] + " is " + str(d["age"])'}}),
    C('Challenge',{ex:`player = {"coins": 10, "keys": 2}

print(len(player))  # 2 entries`,
      task:'Write <code class="inl">count_entries(d)</code> that returns how many entries a dictionary has.',
      starter:`def count_entries(d):
    pass

print(count_entries({"a": 1, "b": 2}))`,
      test:{fn:'count_entries',cases:[{args:[{a:1,b:2}],is:2},{args:[{}],is:0}],hint:'len(d) counts the entries of a dictionary.'}})]},
   {title:'Functions',lessons:[
    L('Defining Functions',{ex:`def greet(name):
    return "Hi, " + name + "!"

print(greet("Ethan"))`,
      task:'Write <code class="inl">say_hi(name)</code> that returns "Hi, NAME!" — say_hi("Ana") returns "Hi, Ana!".',
      starter:`def say_hi(name):
    pass

print(say_hi("Ana"))`,
      test:{fn:'say_hi',cases:[{args:['Ana'],is:'Hi, Ana!'},{args:['Bo'],is:'Hi, Bo!'}],hint:'Build the string with +: "Hi, " + name + "!"'}}),
    L('Parameters & Return',{ex:`def area(width, height):
    return width * height

print(area(4, 5))  # 20`,
      task:'Write <code class="inl">area(width, height)</code> that returns width times height.',
      starter:`def area(width, height):
    pass

print(area(4, 5))`,
      test:{fn:'area',cases:[{args:[4,5],is:20},{args:[2,9],is:18}],hint:'Just return width * height.'}}),
    L('Calling Functions from Functions',{ex:`def double(n):
    return n * 2

def quad(n):
    return double(double(n))

print(quad(3))  # 12`,
      task:'Write <code class="inl">quad(n)</code> that returns n multiplied by 4 — by calling the given <code class="inl">double(n)</code> helper twice.',
      starter:`def double(n):
    return n * 2

def quad(n):
    pass

print(quad(3))`,
      test:{fn:'quad',cases:[{args:[3],is:12},{args:[5],is:20}],hint:'Inside quad, return double(double(n)).'}}),
    C('Challenge',{ex:`def is_even(n):
    return n % 2 == 0`,
      task:'Write <code class="inl">is_even(n)</code> that returns True when n is even.',
      starter:`def is_even(n):
    pass

print(is_even(4), is_even(7))`,
      test:{fn:'is_even',cases:[{args:[4],is:true},{args:[7],is:false},{args:[0],is:true}],hint:'n % 2 == 0 means even — return that comparison directly.'}})]},
   {title:'Mini Projects',lessons:[
    P('Project: Number Counter','PROJECT — Build a counter: create a variable count at 0, write a function add_one() that increases it by 1, and call it three times, printing the result after each call.'),
    P('Project: To-Do List','PROJECT — Build a tiny to-do engine: a list, a function add_todo(text) that appends to it, and a function show_all() that prints every task with its number. Add two tasks and show them.'),
    P('Project: Color Picker','PROJECT — Store 4 color names in a list and write pick_color(i) that returns "Color: " + the color at index i. Print two picks to test it.'),
    P('Project: Quiz Game','PROJECT — Store a question and the right answer, write check(guess) that prints "Correct!" or "Try again", and test it with both a right and a wrong guess.')]},
   {title:'Final Boss',lessons:[
    L('Project Planning',{ex:`# Every great build starts as a plan
# 1. What will it do?
# 2. What data do I need?
# 3. What functions?
print("Plan first, code second.")`,
      task:'In comments, plan a small project of your own: what it does, its data, and its functions. Then print "Plan ready!".',
      test:{logs:true,hint:'Write your plan as comments and finish with a print("Plan ready!").'}}),
    P('Project: Build It — Core','PROJECT — Write the core feature of the project you planned: at least one variable, one function, and one print proving it works.'),
    P('Project: Build It — Polish','PROJECT — Extend your build: add a second function and make the two work together.'),
    P('Ship It & Share','FINAL PROJECT — Print a short demo output of everything your project does, then print "Shipped!" to celebrate.')]}
  ];
}
/* java course builders */
const JW=(...body)=>'public class Main {\n    public static void main(String[] args) {\n'+body.map(l=>'        '+l).join('\n')+'\n    }\n}';
const JM=(mth,...main)=>'public class Main {\n\n'+mth.split('\n').map(l=>'    '+l).join('\n')+'\n\n    public static void main(String[] args) {\n'+main.map(l=>'        '+l).join('\n')+'\n    }\n}';
function javaCourse(){
  const L=(title,extra={})=>Object.assign({title,type:'lesson',xp:100},extra);
  const C=(title,extra={})=>Object.assign({title,type:'challenge',xp:100},extra);
  const PJ=(title,task,body)=>({title,type:'project',xp:100,task,starter:JW(...(body||['// '+title])),test:{logs:true,hint:'Run your project — at least one println should appear.'}});
  return [
   {title:'Java Foundations',lessons:[
    L('What is Java?',{learn:['what Java is used for','how Java runs: compile once, run anywhere','printing with System.out.println','comments with //'],
      ex:JW('// Java powers Android apps, Minecraft and more','System.out.println("Hello, world!");','System.out.println("I am writing real Java!");'),
      task:'Use System.out.println to print your own greeting to the world.',
      starter:JW('// Print a greeting below',''),
      test:{logs:true,hint:'Print at least one message with System.out.println("...")'}}),
    L('Variables',{learn:['what variables are','declaring a type: int, double, boolean, String','naming in camelCase','final for constants'],
      diagram:true,
      ex:JW('int score = 100;','String playerName = "Ethan";','','System.out.println(playerName);','System.out.println(score);'),
      extra:'In Java every variable gets a type up front — and it is locked in forever. Values that should never change are marked <code class="inl">final</code>, like final int MAX_LIVES = 3;',
      task:'Create an <code class="inl">int</code> variable called <code class="inl">age</code> and store a number inside it.',
      starter:JW('// Create your variable below',''),
      test:{vars:{age:v=>typeof v==='number'&&Number.isInteger(v)},hint:'Create it like: int age = 14;'}}),
    L('Data Types',{learn:['int: whole numbers','double: decimals','boolean: true or false','String: text in quotes'],
      ex:JW('int level = 7;            // whole number','double progress = 42.5;   // decimal','boolean isReady = true;   // true or false','String name = "Maya";     // text','','System.out.println(name + " is level " + level);'),
      task:'Create three variables: <code class="inl">text</code> (String), <code class="inl">num</code> (int) and <code class="inl">flag</code> (boolean).',
      starter:JW('// a String, an int, and a boolean',''),
      test:{vars:{text:v=>typeof v==='string',num:v=>typeof v==='number'&&Number.isInteger(v),flag:v=>typeof v==='boolean'},
        hint:'Example: String text = "hi"; int num = 5; boolean flag = true;'}}),
    C('Mini Challenge',{ex:JW('String hero = "Pixel Knight";','int power = 90;','','System.out.println(hero + " has power " + power);'),
      task:'Create <code class="inl">playerName</code> (a String) and <code class="inl">score</code> (an int), then print both.',
      starter:JW(''),
      test:{vars:{playerName:v=>typeof v==='string',score:v=>typeof v==='number'},logs:true,
        hint:'You need a playerName variable, a score variable, and a println that shows them.'}})]},
   {title:'Numbers & Math',lessons:[
    L('Arithmetic Operators',{learn:['the core math operators','order of operations','remainders with %','decimals with double'],
      ex:JW('int total = 5 + 3 * 2;   // math first: 11','int leftover = 10 % 3;   // remainder: 1','double exact = 7.0 / 2;  // 3.5','','System.out.println(total);','System.out.println(leftover);','System.out.println(exact);'),
      task:'Make an <code class="inl">int</code> called <code class="inl">result</code> equal <code class="inl">15 * 3 + 7</code>, then print it.',
      starter:JW(''),
      test:{vars:{result:v=>v===52},logs:true,hint:'result should equal 52 — remember * runs before +.'}}),
    L('Shorthand Updates',{learn:['updating a variable in place','+=, -= and *=','building a counter'],
      ex:JW('int coins = 10;','coins += 5;   // now 15','coins -= 3;   // now 12','coins *= 2;   // now 24','','System.out.println(coins);'),
      task:'Start <code class="inl">score</code> at 0, add 50 with <code class="inl">+=</code>, then double it with <code class="inl">*=</code>. Print it at the end (should show 100).',
      starter:JW('int score = 0;',''),
      test:{vars:{score:v=>v===100},logs:true,hint:'score should end as 100: 0 + 50 = 50, then 50 * 2 = 100.'}}),
    L('The Math Class',{learn:['Math.pow for powers','Math.sqrt for square roots','Math.max and Math.min','Math.round'],
      ex:JW('double root = Math.sqrt(144);','double power = Math.pow(2, 10);','int bigger = Math.max(9, 4);','','System.out.println(root);','System.out.println(power);','System.out.println(bigger);'),
      task:'Store Math.sqrt(144) in a double called <code class="inl">root</code> and Math.pow(2, 10) in a double called <code class="inl">power</code>, then print both.',
      starter:JW(''),
      test:{vars:{root:v=>v===12,power:v=>v===1024},logs:true,hint:'double root = Math.sqrt(144); and double power = Math.pow(2, 10);'}}),
    C('Challenge',{ex:JW('int days = 3;','int hours = days * 24;','','System.out.println(hours);'),
      task:'Create <code class="inl">week_seconds</code> and store the number of seconds in one week using math: 7 * 24 * 60 * 60. Print it.',
      starter:JW(''),
      test:{vars:{week_seconds:v=>v===604800},logs:true,hint:'week_seconds should equal 604800 — chain the multiplications.'}})]},
   {title:'Strings',lessons:[
    L('Combining Strings',{learn:['joining strings with +','measuring with .length()','adding spaces where they belong'],
      ex:JW('String first = "Ada";','String last = "Lovelace";','String full = first + " " + last;','','System.out.println(full);','System.out.println(full.length());'),
      task:'Create a String called <code class="inl">full_name</code> from a first and last name joined with a space, then print it.',
      starter:JW(''),
      test:{vars:{full_name:v=>typeof v==='string'&&v.includes(' ')},logs:true,
        hint:'Join with + and remember the space: first + " " + last'}}),
    L('String Methods',{learn:['.toUpperCase() and .toLowerCase()','comparing with .equals()','methods do the work for you'],
      ex:JW('String word = "JaVa";','','System.out.println(word.toUpperCase());','System.out.println(word.toLowerCase());','System.out.println("hi".equals("hi"));'),
      task:'Write <code class="inl">static String shout(String word)</code> that returns the word in ALL CAPS followed by an exclamation mark.',
      starter:JM('static String shout(String word) {\n        // return the LOUD version with a "!" on the end\n        return "";\n    }','System.out.println(shout("hello"));'),
      test:{fn:'shout',cases:[{args:['hello'],is:'HELLO!'},{args:['code'],is:'CODE!'}],hint:'Return word.toUpperCase() + "!"'}}),
    L('Indexing',{learn:['characters have positions','charAt(0) grabs the first letter','.length() counts characters'],
      ex:JW('String word = "Java";','','System.out.println(word.charAt(0));   // J','System.out.println(word.charAt(3));   // a','System.out.println(word.length());    // 4'),
      task:'Write <code class="inl">static String firstLetter(String word)</code> that returns the first character.',
      starter:JM('static String firstLetter(String word) {\n        return "";\n    }','System.out.println(firstLetter("Java"));'),
      test:{fn:'firstLetter',cases:[{args:['Java'],is:'J'},{args:['code'],is:'c'}],hint:'Position 0 is the first character: word.charAt(0)'}}),
    C('Challenge',{ex:JW('String secret = "level";','','System.out.println(secret.charAt(0) + "" + secret.charAt(1));'),
      task:'Write <code class="inl">static String initials(String first, String last)</code> — initials("Ada", "Lovelace") returns "AL".',
      starter:JM('static String initials(String first, String last) {\n        return "";\n    }','System.out.println(initials("Ada", "Lovelace"));'),
      test:{fn:'initials',cases:[{args:['Ada','Lovelace'],is:'AL'},{args:['Sam','Smith'],is:'SS'}],hint:'Glue the first letters: "" + first.charAt(0) + last.charAt(0)'}})]},
   {title:'Making Decisions',lessons:[
    L('If Statements',{ex:JW('int coins = 120;','','if (coins >= 100) {','    System.out.println("Buy the golden skin!");','}'),
      task:'Write <code class="inl">static boolean canVote(int age)</code> that returns true when age is 18 or more.',
      starter:JM('static boolean canVote(int age) {\n        // return true or false\n        return false;\n    }','System.out.println(canVote(17));','System.out.println(canVote(18));'),
      test:{fn:'canVote',cases:[{args:[17],is:false},{args:[18],is:true},{args:[30],is:true}],hint:'canVote(17) is false, canVote(18) and canVote(30) are true.'}}),
    L('Else Statements',{ex:JW('int fuel = 3;','','if (fuel > 0) {','    System.out.println("Zoom!");','} else {','    System.out.println("Out of fuel...");','}'),
      task:'Write <code class="inl">static String sign(int n)</code> that returns "positive" when n is 0 or more, otherwise "negative".',
      starter:JM('static String sign(int n) {\n        return "";\n    }','System.out.println(sign(5));','System.out.println(sign(-3));'),
      test:{fn:'sign',cases:[{args:[5],is:'positive'},{args:[-3],is:'negative'},{args:[0],is:'positive'}],hint:'Watch out: 0 counts as positive here!'}}),
    L('Else If Chains',{ex:JW('int score = 85;','','if (score >= 80) {','    System.out.println("high");','} else if (score >= 60) {','    System.out.println("pass");','} else {','    System.out.println("fail");','}'),
      task:'Write <code class="inl">static String grade(int score)</code> that returns "high" when score is 80 or more, "pass" when 60 or more, otherwise "fail".',
      starter:JM('static String grade(int score) {\n        return "";\n    }','System.out.println(grade(90));','System.out.println(grade(70));','System.out.println(grade(42));'),
      test:{fn:'grade',cases:[{args:[90],is:'high'},{args:[70],is:'pass'},{args:[42],is:'fail'}],hint:'Check the highest band first: if 80+, else if 60+, else fail.'}}),
    C('Challenge',{ex:JW('if (age >= 13 && age <= 19) {','    System.out.println("teen");','}'),
      task:'Write <code class="inl">static boolean isTeen(int age)</code> — true only when age is between 13 and 19 (inclusive).',
      starter:JM('static boolean isTeen(int age) {\n        return false;\n    }','System.out.println(isTeen(12));','System.out.println(isTeen(15));','System.out.println(isTeen(19));'),
      test:{fn:'isTeen',cases:[{args:[12],is:false},{args:[15],is:true},{args:[19],is:true}],hint:'Combine two comparisons with && : age >= 13 && age <= 19'}})]},
   {title:'Loops',lessons:[
    L('For Loops',{ex:JW('for (int i = 1; i <= 5; i++) {','    System.out.println("Lap " + i);','}'),
      task:'Write <code class="inl">static int sumTo(int n)</code> that uses a loop to add every number from 1 up to n.',
      starter:JM('static int sumTo(int n) {\n        // add every number from 1 up to n, then return it\n        return 0;\n    }','System.out.println(sumTo(3));','System.out.println(sumTo(5));'),
      test:{fn:'sumTo',cases:[{args:[3],is:6},{args:[5],is:15},{args:[1],is:1}],hint:'sumTo(3) is 6 because 1 + 2 + 3 = 6. Try for (int i = 1; i <= n; i++)'}}),
    L('While Loops',{ex:JW('int fuel = 3;','','while (fuel > 0) {','    System.out.println("Zoom! Fuel: " + fuel);','    fuel--;','}'),
      task:'Write <code class="inl">static int doubleTo100(int n)</code> that keeps doubling n with a while loop until it is 100 or more, then returns it.',
      starter:JM('static int doubleTo100(int n) {\n        return 0;\n    }','System.out.println(doubleTo100(3));','System.out.println(doubleTo100(100));'),
      test:{fn:'doubleTo100',cases:[{args:[3],is:192},{args:[64],is:128},{args:[100],is:100}],hint:'doubleTo100(3): 3, 6, 12, 24, 48, 96, 192 — stop as soon as it reaches 100 or more.'}}),
    L('Break & Continue',{ex:JW('for (int i = 1; i <= 10; i++) {','    if (i == 4) {','        break;        // stop the loop','    }','    if (i % 2 == 0) {','        continue;     // skip evens','    }','    System.out.println(i);','}'),
      task:'Write <code class="inl">static int firstOver10(int[] nums)</code> that loops through the array and returns the first number greater than 10.',
      starter:JM('static int firstOver10(int[] nums) {\n        return -1;\n    }','int[] a = {2, 14, 8, 22};','int[] b = {1, 2, 11};','System.out.println(firstOver10(a));','System.out.println(firstOver10(b));'),
      test:{fn:'firstOver10',cases:[{args:[[2,14,8,22]],is:14},{args:[[1,2,11]],is:11}],hint:'Loop over each number and return it as soon as one is over 10.'}}),
    C('Challenge',{ex:JW('if (n % 3 == 0) {','    System.out.println("Fizz");','}'),
      task:'Write <code class="inl">static Object fizz(int n)</code>: return "Fizz" when n is divisible by 3, otherwise return n itself.',
      starter:JM('static Object fizz(int n) {\n        return null;\n    }','System.out.println(fizz(9));','System.out.println(fizz(10));'),
      test:{fn:'fizz',cases:[{args:[9],is:'Fizz'},{args:[10],is:10},{args:[3],is:'Fizz'},{args:[7],is:7}],hint:'The % operator gives a remainder — n % 3 == 0 means divisible.'}})]},
   {title:'Arrays',lessons:[
    L('Creating Arrays',{ex:JW('int[] ages = {12, 15, 14};','','System.out.println(ages[0]);     // 12','System.out.println(ages.length); // 3'),
      task:'Write <code class="inl">static Object firstItem(Object[] items)</code> that returns the first element of the array.',
      starter:JM('static Object firstItem(Object[] items) {\n        return null;\n    }','Object[] letters = {"a", "b", "c"};','System.out.println(firstItem(letters));'),
      test:{fn:'firstItem',cases:[{args:[['a','b']],is:'a'},{args:[[7,8]],is:7}],hint:'Array indexes start at 0 — items[0]'}}),
    L('Checking & Updating',{ex:JW('int[] scores = {70, 85, 90};','','scores[1] = 88;   // replace a value','System.out.println(scores[1]);','System.out.println(scores.length);'),
      task:'Write <code class="inl">static boolean hasItem(int[] items, int x)</code> that returns true when the array contains x.',
      starter:JM('static boolean hasItem(int[] items, int x) {\n        return false;\n    }','int[] bag = {1, 2, 3};','System.out.println(hasItem(bag, 2));'),
      test:{fn:'hasItem',cases:[{args:[[1,2,3],2],is:true},{args:[[1,2],9],is:false}],hint:'Loop with for (int i = 0; i < items.length; i++) and compare items[i] == x'}}),
    L('Looping Arrays',{ex:JW('int[] scores = {10, 30, 20};','int total = 0;','','for (int i = 0; i < scores.length; i++) {','    total += scores[i];','}','','System.out.println(total);  // 60'),
      task:'Write <code class="inl">static int total(int[] nums)</code> that returns the sum of every number in the array.',
      starter:JM('static int total(int[] nums) {\n        return 0;\n    }','int[] data = {10, 30, 20};','System.out.println(total(data));'),
      test:{fn:'total',cases:[{args:[[10,30,20]],is:60},{args:[[5,5]],is:10}],hint:'Start a total at 0 and add each number inside the loop.'}}),
    {title:'Checkpoint Quiz',type:'quiz',xp:100,quiz:[
      {q:'Which statement prints text to the screen in Java?',opts:['echo "hi";','System.out.println("hi");','print("hi")'],a:1},
      {q:'In real Java, what is 7 / 2 when both values are int?',opts:['3.5','3','4'],a:1},
      {q:'Which keyword marks a value that can never change?',opts:['static','final','const'],a:1}]}]},
   {title:'Methods',lessons:[
    L('Defining Methods',{ex:JM('static String greet(String name) {\n        return "Hi, " + name + "!";\n    }','System.out.println(greet("Ethan"));'),
      task:'Write <code class="inl">static String sayHi(String name)</code> that returns "Hi, NAME!" — sayHi("Ana") returns "Hi, Ana!".',
      starter:JM('static String sayHi(String name) {\n        return "";\n    }','System.out.println(sayHi("Ana"));'),
      test:{fn:'sayHi',cases:[{args:['Ana'],is:'Hi, Ana!'},{args:['Bo'],is:'Hi, Bo!'}],hint:'Build the string with +: "Hi, " + name + "!"'}}),
    L('Parameters & Return',{ex:JM('static int area(int width, int height) {\n        return width * height;\n    }','System.out.println(area(4, 5));'),
      task:'Write <code class="inl">static int area(int width, int height)</code> that returns width times height.',
      starter:JM('static int area(int width, int height) {\n        return 0;\n    }','System.out.println(area(4, 5));'),
      test:{fn:'area',cases:[{args:[4,5],is:20},{args:[2,9],is:18}],hint:'Just return width * height.'}}),
    L('Calling Methods from Methods',{ex:JM('static int doubleIt(int n) {\n        return n * 2;\n    }','','static int quad(int n) {\n        return doubleIt(doubleIt(n));\n    }','System.out.println(quad(3));'),
      task:'Using the given <code class="inl">doubleIt(n)</code> helper, write <code class="inl">static int quad(int n)</code> that returns n multiplied by 4 — by calling doubleIt twice.',
      starter:JM('static int doubleIt(int n) {\n        return n * 2;\n    }','','static int quad(int n) {\n        return 0;\n    }','System.out.println(quad(3));'),
      test:{fn:'quad',cases:[{args:[3],is:12},{args:[5],is:20}],hint:'Inside quad, return doubleIt(doubleIt(n)).'}}),
    C('Challenge',{ex:JM('static boolean isEven(int n) {\n        return n % 2 == 0;\n    }','System.out.println(isEven(4));'),
      task:'Write <code class="inl">static boolean isEven(int n)</code> that returns true when n is even.',
      starter:JM('static boolean isEven(int n) {\n        return false;\n    }','System.out.println(isEven(4));','System.out.println(isEven(7));'),
      test:{fn:'isEven',cases:[{args:[4],is:true},{args:[7],is:false},{args:[0],is:true}],hint:'n % 2 == 0 means even — return that comparison directly.'}})]},
   {title:'Mini Projects',lessons:[
    PJ('Project: Number Counter','PROJECT — In main, create int count = 0, write a method static int bump(int c) that returns c + 1, and call it three times through count = bump(count), printing after each call.',
      ['int count = 0;','','// write a bump method and use it three times','']),
    PJ('Project: To-Do List','PROJECT — Start with a String[] of two tasks, write static void showAll(String[] ts) that prints each task with its number, then call it.',
      ['String[] tasks = {"Practice loops", "Build a game"};','','// write showAll and call it on tasks','']),
    PJ('Project: Color Picker','PROJECT — Store 4 color names in a String[], write static String pickColor(String[] colors, int i) that returns "Color: " + colors[i], and print two picks.',
      ['String[] colors = {"red", "green", "blue", "gold"};','','// write pickColor and print two picks','']),
    PJ('Project: Quiz Game','PROJECT — Store the right answer in an int, write static void check(int guess) that prints "Correct!" or "Try again", and test it with both a right and a wrong guess.',
      ['int answer = 4;','','// write check(guess) and test it twice',''])]},
   {title:'Final Boss',lessons:[
    L('Project Planning',{ex:JW('// Every great build starts as a plan','// 1. What will it do?','// 2. What data do I need?','// 3. What methods?','System.out.println("Plan first, code second.");'),
      task:'In comments, plan a small project of your own: what it does, its data, and its methods. Then print "Plan ready!".',
      starter:JW('// your plan here',''),
      test:{logs:true,hint:'Write your plan as comments and finish with System.out.println("Plan ready!");'}}),
    PJ('Project: Build It — Core','PROJECT — Write the core feature of the project you planned: at least one variable, one method, and one println proving it works.',
      ['// build the core of your planned project','']),
    PJ('Project: Build It — Polish','PROJECT — Extend your build: add a second method and make the two work together.',
      ['// extend your build with a second method','']),
    PJ('Ship It & Share','FINAL PROJECT — Print a short demo output of everything your project does, then print "Shipped!" to celebrate.',
      ['// demo your project, then print "Shipped!"',''])]}
  ];
}
const BASE_COURSES=[
 {id:'py',name:'Python Crash Course',glyph:'Py',color:'#34d399',level:'Beginner',lang:'py',
  blurb:'Your journey from zero to Python builder — clean syntax, instant results.',
  modules:pyCourse()},
 {id:'java',name:'Java Crash Course',glyph:'Jv',color:'#fb923c',level:'Beginner',lang:'java',
  blurb:'Learn the language behind Android apps and Minecraft — types, methods and real structure.',
  modules:javaCourse()}];
function allCourses(){
  const extra=DB.extraMods||{};
  return BASE_COURSES.concat(DB.customCourses||[]).map(c=>{
    const mods=(c.modules||[]).concat((extra[c.id]||[]).map(m=>({title:m.title,lessons:m.lessons.slice()})));
    const flat=[]; mods.forEach((m,mi)=>m.lessons.forEach((l,li)=>{l._mi=mi;l._li=li;l._lang=c.lang;l._fi=flat.length;flat.push(l)}));
    return Object.assign({},c,{modules:mods,flat,total:flat.length,
      xpTotal:flat.reduce((s,l)=>s+(l.xp||100)+(l.type==='project'?400:0),0),
      est:Math.max(1,Math.round(flat.length*12/60))});
  });
}
const getCourse=id=>allCourses().find(c=>c.id===id);

/* ---------- auth ---------- */
function signUp(name,email,pass){
  if(DB.users.some(u=>u.email.toLowerCase()===email.toLowerCase()))return 'That email already has an account — try logging in.';
  const u=makeUser({name,email,pass:hsh(pass)});DB.users.push(u);DB.session=u.id;save();return null;
}
function login(email,pass){
  const u=DB.users.find(x=>x.email.toLowerCase()===email.toLowerCase()&&x.pass===hsh(pass));
  if(!u)return 'Wrong email or password.';
  DB.session=u.id;save();return null;
}
function logout(){DB.session=null;save();location.hash='#/'}

/* ---------- levels / stats / achievements ---------- */
const LEVELS=[{xp:0,name:'Rookie'},{xp:800,name:'Explorer'},{xp:1800,name:'Builder'},{xp:3000,name:'Coder'},{xp:5000,name:'Developer'},{xp:8000,name:'Code Master'}];
function levelOf(xp){let i=0;for(let j=0;j<LEVELS.length;j++)if(xp>=LEVELS[j].xp)i=j;return{i,name:LEVELS[i].name,base:LEVELS[i].xp,next:LEVELS[i+1]||null}}
const BASE_ACH=[
 {id:'first-steps',icon:'play',name:'First Steps',desc:'Complete your first lesson.',stat:'lessons',target:1},
 {id:'speed-coder',icon:'bolt',name:'Speed Coder',desc:'Complete 5 lessons in one day.',stat:'lessonsDay',target:5},
 {id:'module-master',icon:'target',name:'Module Master',desc:'Complete your first module.',stat:'modules',target:1},
 {id:'code-builder',icon:'rocket',name:'Code Builder',desc:'Complete your first project.',stat:'projects',target:1},
 {id:'streak-7',icon:'flame',name:'7 Day Streak',desc:'Learn for 7 consecutive days.',stat:'streak',target:7},
 {id:'champion',icon:'trophy',name:'Crash Course Champion',desc:'Complete an entire crash course.',stat:'courses',target:1},
 {id:'century',icon:'layers',name:'Century',desc:'Complete 100 lessons in total.',stat:'lessons',target:100},
 {id:'xp-5k',icon:'crown',name:'XP Hoarder',desc:'Earn 5,000 total XP.',stat:'xp',target:5000},
 {id:'quiz-whiz',icon:'book',name:'Quiz Whiz',desc:'Pass 3 quizzes.',stat:'quizzes',target:3}];
const allAch=()=>BASE_ACH.concat(DB.customAch||[]);
function lessonStates(c,u){
  /* modules are open anytime: the first unfinished lesson of EVERY module
     is "current"; only lessons inside a module chain behind each other. */
  const done=u.done[c.id]||[],st=[];
  c.modules.forEach(m=>{let curSet=false;
    m.lessons.forEach(l=>{
      if(done.includes(l._fi))st.push('done');
      else if(!curSet){curSet=true;st.push('current')}
      else st.push('locked');
    });});
  return st;
}
function courseDone(c,u){const d=u.done[c.id]||[];return c.total>0&&d.length>=c.total}
function moduleDone(c,mi,u){const d=u.done[c.id]||[];return c.modules[mi].lessons.every(l=>d.includes(l._fi))}
function stats(u){
  let lessons=0,modules=0,projects=0,courses=0;
  allCourses().forEach(c=>{const d=u.done[c.id]||[];lessons+=d.length;
    c.modules.forEach((m,mi)=>{if(m.lessons.length&&moduleDone(c,mi,u))modules++});
    projects+=c.flat.filter(l=>l.type==='project'&&d.includes(l._fi)).length;
    if(courseDone(c,u))courses++;});
  return{lessons,modules,projects,courses,xp:u.xp,streak:u.streak,quizzes:u.quizzes.length,lessonsDay:u.lessonsDay[dayKey()]||0};
}
function checkAch(){
  const u=user();if(!u)return;
  const s=stats(u);const have=new Set(u.unlocked.map(a=>a.id));
  allAch().forEach(a=>{if(!have.has(a.id)&&(s[a.stat]||0)>=a.target){
    u.unlocked.push({id:a.id,at:Date.now()});save();
    later(()=>badgeFX(a),600);}});
}

/* ---------- XP engine ---------- */
function grantXP(n,label,opts={}){
  const u=user();if(!u)return;
  u.xp+=n;const k=dayKey();u.dailyXP[k]=(u.dailyXP[k]||0)+n;
  const before=levelOf(u.xp-n).i,after=levelOf(u.xp).i;
  if(!opts.silent)toast('+'+fmt(n)+' XP',label,'xp');
  if(after>before)later(()=>levelUpFX(after),700);
  checkAch();save();refreshHud();
}
function completeLesson(c,lesson,award){
  const u=user();const arr=u.done[c.id]||(u.done[c.id]=[]);
  if(arr.includes(lesson._fi))return{already:true};
  arr.push(lesson._fi);
  u.lessonsDay[dayKey()]=(u.lessonsDay[dayKey()]||0)+1;
  u.lastCourse=c.id;
  const bonusXP=(lesson.xp||100)+(lesson.type==='project'?400:0);
  const moduleCleared=moduleDone(c,lesson._mi,u),courseCleared=courseDone(c,u);
  grantXP(bonusXP,award||'Lesson completed',{silent:true});
  toast('+'+fmt(bonusXP)+' XP',award||'Lesson completed','xp');
  if(moduleCleared){later(()=>confetti(140),350);later(()=>toast('+300 XP','Module cleared — bonus earned','xp'),500);u.xp+=300;u.dailyXP[dayKey()]=(u.dailyXP[dayKey()]||0)+300}
  if(courseCleared){later(()=>confetti(260),600);later(()=>toast('+1,000 XP','COURSE COMPLETE — bonus earned','xp'),800);u.xp+=1000;u.dailyXP[dayKey()]=(u.dailyXP[dayKey()]||0)+1000}
  save();refreshHud();
  return{already:false};
}
function touchStreak(){
  const u=user();if(!u)return;
  const t=dayKey(),y=dayKey(daysAgo(1));
  if(u.lastActive===t)return;
  if(u.lastActive===y){u.streak++;toast(u.streak+' day streak!','Streak extended — keep the flame alive','xp')}
  else{if(u.streak>1)toast('Streak reset','A new flame begins today');u.streak=1}
  u.lastActive=t;save();
}

/* ---------- fx ---------- */
function toast(title,sub,kind){
  const el=document.createElement('div');el.className='toast'+(kind==='xp'?' xp':'');
  el.innerHTML=`<span class="t-xp">${esc(title)}</span>${sub?`<small>${esc(sub)}</small>`:''}`;
  $('#toasts').appendChild(el);
  setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),320)},3400);
}
const FXc=$('#fx'),FXx=FXc.getContext('2d');let parts=[],fxRun=false;
function fxSize(){FXc.width=innerWidth;FXc.height=innerHeight}
addEventListener('resize',fxSize);fxSize();
const FCOLORS=['#34d399','#2dd4bf','#a78bfa','#fbbf24','#5b8cff','#f472b6'];
function confetti(n=140){
  for(let i=0;i<n;i++)parts.push({x:innerWidth/2+(Math.random()-.5)*220,y:innerHeight*0.32,
    vx:(Math.random()-.5)*11,vy:-Math.random()*10-3,g:.28+Math.random()*.12,
    rot:Math.random()*6.3,vr:(Math.random()-.5)*.3,s:5+Math.random()*7,
    c:FCOLORS[i%6],sh:['r','c','t'][i%3],life:90+Math.random()*50});
  if(!fxRun){fxRun=true;fxLoop()}
}
function fxLoop(){
  FXx.clearRect(0,0,FXc.width,FXc.height);
  parts=parts.filter(p=>p.life>0);
  parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=.99;p.rot+=p.vr;p.life--;
    FXx.save();FXx.translate(p.x,p.y);FXx.rotate(p.rot);FXx.globalAlpha=Math.min(1,p.life/34);FXx.fillStyle=p.c;
    if(p.sh==='r')FXx.fillRect(-p.s/2,-p.s*.75,p.s,p.s*1.5);
    else if(p.sh==='c'){FXx.beginPath();FXx.arc(0,0,p.s*.55,0,7);FXx.fill()}
    else{FXx.beginPath();FXx.moveTo(0,-p.s*.7);FXx.lineTo(p.s*.62,p.s*.5);FXx.lineTo(-p.s*.62,p.s*.5);FXx.closePath();FXx.fill()}
    FXx.restore()});
  if(parts.length)requestAnimationFrame(fxLoop);else{fxRun=false;FXx.clearRect(0,0,FXc.width,FXc.height)}
}
function ovl(html,onMount){
  const w=document.createElement('div');w.className='ovl';w.innerHTML=html;
  $('#overlays').appendChild(w);
  const close=()=>w.remove();
  w.addEventListener('click',e=>{if(e.target===w||e.target.closest('[data-close]'))close()});
  if(onMount)onMount(w,close);
  return close;
}
function levelUpFX(li){
  const lv=LEVELS[li];confetti(240);
  ovl(`<div class="ovl-card card">
    <div class="lvl-ring"><div class="in"><b>${li+1}</b><span class="small mut">LEVEL</span></div></div>
    <h2 style="font-size:1.9rem">Level Up</h2>
    <p class="mut" style="margin:8px 0 24px">You are now a <b style="color:var(--yellow)">${esc(lv.name)}</b>. New territory unlocked.</p>
    <button class="btn btn-gold" data-close>Keep Going</button></div>`);
}
function badgeFX(a){
  confetti(90);
  ovl(`<div class="ovl-card card">
    <div class="medal-big">${ic(a.icon,52)}</div>
    <p class="chip y" style="margin-bottom:12px">Achievement unlocked</p>
    <h2 style="font-size:1.5rem">${esc(a.name)}</h2>
    <p class="mut" style="margin:8px 0 24px">${esc(a.desc)}</p>
    <button class="btn btn-pri" data-close>Nice</button></div>`);
}

/* =====================================================================
   PYTHON ENGINE — subset transpiler + runner (print, if/elif/else,
   for/range, while, def, lists, dicts, strings, f-strings, builtins).
===================================================================== */
function pyRange(a,b,c){
  let st=a,en=b,step=(c==null?1:c);
  if(b==null){st=0;en=a}
  const arr=[];
  if(step===0)throw new Error('range() step cannot be zero');
  for(let i=st;(step>0?i<en:i>en);i+=step){arr.push(i);if(arr.length>1000000)throw new Error('range is too large')}
  return arr;
}
function pyStr(v){
  if(Array.isArray(v))return '['+v.map(pyStr).join(', ')+']';
  if(typeof v==='boolean')return v?'True':'False';
  if(v==null||v===undefined)return 'None';
  return String(v);
}
function pyEq(a,b){
  if(Array.isArray(a)&&Array.isArray(b))return a.length===b.length&&a.every((x,i)=>pyEq(x,b[i]));
  return a===b;
}
function protectLine(s){
  const strs=[];
  const p=s.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,m=>{strs.push(m);return '\u0000'+(strs.length-1)+'\u0000'});
  return{p,restore:t=>t.replace(/\u0000(\d+)\u0000/g,(_,i)=>strs[+i])};
}
function fString(line){
  const tpl=inner=>'`'+inner.replace(/\{([^{}]+)\}/g,'\${$1}')+'`';
  return line.replace(/\bf"([^"\\]*)"/g,(m,i)=>tpl(i)).replace(/\bf'([^'\\]*)'/g,(m,i)=>tpl(i));
}
function convExprFull(code){
  return code
   .replace(/(\S+)\s+not\s+in\s+(\S+)/g,'!__in($1,$2)')
   .replace(/(\S+)\s+in\s+(\S+)/g,'__in($1,$2)')
   .replace(/\bprint\s*\(/g,'__print(')
   .replace(/\binput\s*\(/g,'__input(')
   .replace(/\.append\(/g,'.push(')
   .replace(/\.upper\(\)/g,'.toUpperCase()')
   .replace(/\.lower\(\)/g,'.toLowerCase()')
   .replace(/\.split\(\)/g,".split(' ')")
   .replace(/\bpass\b/g,'')
   .replace(/\bTrue\b/g,'true').replace(/\bFalse\b/g,'false').replace(/\bNone\b/g,'null')
   .replace(/\band\b/g,'&&').replace(/\bor\b/g,'||')
   .replace(/\bnot\b/g,'!');
}
function convHead(head){
  let m;
  if(m=/^def\s+([A-Za-z_]\w*)\s*\((.*)\)\s*$/.exec(head))return 'function '+m[1]+'('+m[2]+')';
  if(m=/^elif\s+(.+)$/.exec(head))return 'else if ('+convExprFull(m[1])+')';
  if(/^else\b/.test(head))return 'else';
  if(m=/^if\s+(.+)$/.exec(head))return 'if ('+convExprFull(m[1])+')';
  if(m=/^while\s+(.+)$/.exec(head))return 'while (__guard()&&('+convExprFull(m[1])+'))';
  if(m=/^for\s+(.+)$/.exec(head)){
    const mm=/^([A-Za-z_]\w*)\s+in\s+(.+)$/.exec(m[1]);
    if(mm)return 'for (let '+mm[1]+' of __iter('+convExprFull(mm[2])+'))';
    return convExprFull(m[1]);
  }
  if(/^(import|from|global|nonlocal)\b/.test(head))return ';';
  if(/^pass$/.test(head))return ';';
  return convExprFull(head);
}
function py2js(src){
  const lines=String(src).replace(/\r/g,'').replace(/\t/g,'    ').split('\n');
  const out=[],stack=[0];
  for(const raw of lines){
    if(!raw.trim()){out.push('');continue}
    const ind=(raw.match(/^ */)||[''])[0].length;
    const bodyRaw=raw.slice(ind);
    if(bodyRaw.trim().startsWith('#')){out.push('    '.repeat(Math.max(0,stack.length-1))+'//'+bodyRaw.trim().slice(1));continue}
    while(ind<stack[stack.length-1]){stack.pop();out.push('}')}
    if(ind>stack[stack.length-1])stack.push(ind);
    const{p,restore}=protectLine(fString(bodyRaw));
    let lineP=p.replace(/([\w\)\]])\s*\/\/\s*([\w\(])/g,'Math.floor($1/$2)');
    const cut=lineP.indexOf('#');
    if(cut>=0)lineP=lineP.slice(0,cut)+'//'+lineP.slice(cut+1);
    let depth=0,colon=-1;
    for(let i=0;i<lineP.length;i++){
      const ch=lineP[i];
      if(ch==='('||ch==='['||ch==='{')depth++;
      else if(ch===')'||ch===']'||ch==='}')depth--;
      else if(ch===':'&&depth===0){colon=i;break}
    }
    let head,body=null;
    if(colon>=0){head=lineP.slice(0,colon).trim();body=lineP.slice(colon+1).trim()}
    else head=lineP.trim();
    let js=convHead(head);
    if(/^(else|else\s+if)/.test(js)&&out.length&&out[out.length-1].trim()==='}'){out.pop();js='} '+js}
    if(colon>=0){js+=body?' { '+convExprFull(body).replace(/;*\s*$/,';')+' }':' {'}
    out.push(restore(js));
  }
  while(stack.length>1){stack.pop();out.push('}')}
  return out.join('\n');
}
function runPy(src,captures=[]){
  const logs=[];let steps=0;
  const guard=()=>{if(++steps>400000)throw new Error('your loop ran too long — check for an infinite loop');return true};
  const H={
    __print:(...a)=>logs.push(a.map(pyStr).join(' ')),
    __input:p=>{logs.push('[input] '+(p!=null?pyStr(p):'')+' — sandbox input returns ""');return ''},
    __iter:v=>{if(Array.isArray(v))return v;if(typeof v==='string')return v.split('');if(typeof v==='number')return pyRange(0,v);if(v&&typeof v==='object')return Object.keys(v);return []},
    __in:(a,b)=>Array.isArray(b)?b.some(x=>pyEq(x,a)):typeof b==='string'?b.includes(String(a)):(b&&typeof b==='object')?Object.prototype.hasOwnProperty.call(b,a):false,
    range:pyRange,
    len:x=>x==null?0:(x.length!=null?x.length:0),
    str:pyStr,
    int:x=>{const n=Math.trunc(Number(x));return isNaN(n)?0:n},
    float:x=>{const n=Number(x);return isNaN(n)?0:n},
    sum:a=>(Array.isArray(a)?a:[a]).reduce((s,x)=>s+(+x||0),0),
    max:(...a)=>Math.max(...(a.length===1&&Array.isArray(a[0])?a[0]:a)),
    min:(...a)=>Math.min(...(a.length===1&&Array.isArray(a[0])?a[0]:a)),
    abs:Math.abs,
    round:(x,n)=>{const p=Math.pow(10,n||0);return Math.round(x*p)/p},
    sorted:a=>[...a].sort((x,y)=>(typeof x==='string'||typeof y==='string')?String(x).localeCompare(String(y)):x-y),
    type:t=>Array.isArray(t)?'list':t===null||t===undefined?'NoneType':typeof t==='boolean'?'bool':typeof t==='number'?(Number.isInteger(t)?'int':'float'):typeof t==='string'?'str':typeof t==='object'?'dict':'unknown'};
  let js;
  try{js=py2js(src)}catch(e){return{logs:[],env:{},err:'translation error: '+e.message}}
  const cap=captures.map(n=>n+": (typeof "+n+"!=='undefined'?"+n+':undefined)').join(',');
  try{
    const f=new Function(...Object.keys(H),'__guard',js+'\n;return {'+cap+'};');
    const env=f(...Object.values(H),guard);
    return{logs,env:env||{},err:null};
  }catch(e){return{logs,env:{},err:e.message}}
}
/* =====================================================================
   JAVA ENGINE — subset transpiler + runner. Handles the class/Main
   wrapper, static methods, typed declarations, arrays, if/else,
   for & while loops, enhanced-for, strings, and the Math class.
===================================================================== */
const JAVA_TYPES='(?:int|long|short|byte|double|float|boolean|char|String|var)';
function parseJavaMembers(rest){
  const members=[];let d=0,hs=0;
  for(let i=0;i<rest.length;i++){
    const ch=rest[i];
    if(ch==='"'||ch==="'"){const q=ch;i++;while(i<rest.length&&rest[i]!==q){if(rest[i]==='\\')i++;i++}continue}
    if(ch==='/'&&rest[i+1]==='/'){while(i<rest.length&&rest[i]!=='\n')i++;continue}
    if(ch==='/'&&rest[i+1]==='*'){i+=2;while(i<rest.length&&!(rest[i]==='*'&&rest[i+1]==='/'))i++;i++;continue}
    if(ch==='{'){if(d===0)members.push({header:rest.slice(hs,i).trim(),start:i+1});d++}
    else if(ch==='}'){d--;if(d===0&&members.length){const m=members[members.length-1];if(m.body===undefined)m.body=rest.slice(m.start,i);hs=i+1}}
  }
  return members.filter(m=>m.body!==undefined);
}
function wrapLoop(t,kw){
  let i=0;
  while((i=t.indexOf(kw,i))>=0){
    if(i>0&&/[\w$]/.test(t[i-1])){i+=kw.length;continue}
    const j=t.indexOf('(',i);if(j<0)break;
    let d=0,k=j;
    for(;k<t.length;k++){const c=t[k];if(c==='(')d++;else if(c===')'){d--;if(d===0)break}}
    if(d!==0)break;
    const inner=t.slice(j+1,k);
    if(kw==='for'){
      const p1=inner.indexOf(';');
      if(p1<0){i=k;continue}
      const p2=inner.indexOf(';',p1+1);
      if(p2<0){i=k;continue}
      const cond=inner.slice(p1+1,p2);
      if(!cond.trim()){i=k;continue}
      t=t.slice(0,j+1)+inner.slice(0,p1+1)+' __guard()&&('+cond+') '+inner.slice(p2)+t.slice(k);
    }else{
      if(!inner.trim()){i=k;continue}
      t=t.slice(0,i)+'while (__guard()&&('+inner+'))'+t.slice(k+1);
    }
    i+=kw.length+12;
  }
  return t;
}
function jBody(code){
  const strs=[];
  let t=String(code).replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g,m=>{strs.push(m);return '\u0000'+(strs.length-1)+'\u0000'});
  t=t.replace(/System\.out\.println\s*\(|System\.out\.print\s*\(/g,'__print(');
  t=t.replace(/\b(?:final|static)\b/g,'');
  t=t.replace(new RegExp('\\b'+JAVA_TYPES+'\\s*\\[\\s*\\]\\s*','g'),'');
  t=t.replace(/\bnew\s+(?:int|long|double|float|boolean|char|String)\s*\[\s*\]\s*\{([^{}]*)\}/g,'[$1]');
  t=t.replace(/\bnew\s+(?:int|long|double|float|boolean|char|String)\s*\[\s*([^\]]*)\s*\]/g,(m,n)=>'Array('+(n.trim()||'0')+').fill(0)');
  t=t.replace(/=\s*\{([^{}]*)\}/g,'= [$1]');
  t=t.replace(/\b(?:public|private|protected)\s+/g,'');
  t=t.replace(new RegExp('\\b'+JAVA_TYPES+'\\s+(?=[A-Za-z_$][\\w$]*\\s*(?:=|;|,|\\)))','g'),'');
  t=t.replace(/Integer\.parseInt\s*\(/g,'parseInt(').replace(/Double\.parseDouble\s*\(/g,'parseFloat(');
  t=t.replace(/String\.valueOf\s*\(/g,'String(');
  t=t.replace(/\.length\s*\(\s*\)/g,'.length');
  t=t.replace(/\((?:int|double|float|long)\)\s*/g,'');
  t=t.replace(/for\s*\(\s*[A-Za-z_$][\w$]*(?:\s*\[\s*\])?\s+(\w+)\s*:\s*([^)]+)\)/g,'for (let $1 of __iter($2))');
  t=wrapLoop(t,'while');t=wrapLoop(t,'for');
  return t.replace(/\u0000(\d+)\u0000/g,(_,i)=>strs[+i]);
}
function java2js(src){
  const s=String(src||'').replace(/\r/g,'');
  const cls=/\bclass\s+\w+[^{]*\{/.exec(s);
  let body='',methods=[],fields=[];
  if(cls){
    const members=parseJavaMembers(s.slice(cls.index+cls[0].length));
    for(const m of members){
      if(/static\s+void\s+main\s*\(/.test(m.header))body=m.body;
      else methods.push(m);
    }
    if(!body){const h=members.find(m=>!m.header);if(h)body=h.body}
  }else body=s;
  const defs=methods.map(m=>{
    const h=m.header.replace(/\s+/g,' ').trim();
    const mm=/(?:(?:public|private|protected)\s+)?(?:static\s+)?[\w\[\]]+\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*$/.exec(h);
    if(!mm)return'';
    const params=mm[2].split(',').map(p=>p.trim().split(/\s+/).pop()).filter(Boolean).join(',');
    return 'function '+mm[1]+'('+params+'){'+jBody(m.body)+'}';
  }).join('\n');
  return defs+'\n'+jBody(body);
}
function jStr(v){return Array.isArray(v)?'['+v.map(jStr).join(', ')+']':typeof v==='boolean'?(v?'true':'false'):String(v)}
function runJava(src,captures=[]){
  const logs=[];let steps=0;
  const guard=()=>{if(++steps>400000)throw new Error('your loop ran too long — check for an infinite loop');return true};
  const HJ={
    __print:(...a)=>logs.push(a.map(jStr).join(' ')),
    __iter:v=>Array.isArray(v)?v:(typeof v==='string'?v.split(''):[]),
  };
  let js;
  try{js=java2js(src)}catch(e){return{logs:[],env:{},err:'translation error: '+e.message}}
  const pre='if(!String.prototype.equals)String.prototype.equals=function(o){return String(this)===String(o)};';
  const cap=captures.map(n=>n+": (typeof "+n+"!=='undefined'?"+n+':undefined)').join(',');
  try{
    const f=new Function('__guard','__print','__iter',pre+js+'\n;return {'+cap+'};');
    return{logs,env:f(guard,HJ.__print,HJ.__iter)||{},err:null};
  }catch(e){return{logs,env:{},err:e.message}}
}
const runSrc=(code,lang)=>lang==='java'?runJava(code):runPy(code);
const show=v=>typeof v==='string'?JSON.stringify(v):pyStr(v);
function checkLesson(l,code){
  const lang=l.lang||l._lang||'py';
  const run=code2=>runSrc(code2,lang);
  if(!code||code.trim().length<3)return{ok:false,hint:'Write some code first — the editor is feeling lonely.'};
  const t=l.test;
  if(t){
    const caps=[...(t.fn?[t.fn]:[]),...(t.vars?Object.keys(t.vars):[])];
    const r=run(code,caps);
    if(r.err)return{ok:false,hint:(lang==='java'?'Java':'Python')+' hit an error: '+r.err};
    if(t.logs&&!r.logs.length)return{ok:false,hint:t.hint||'Your code ran, but nothing was printed — add a print.'};
    if(t.fn){
      const fn=r.env[t.fn];
      if(typeof fn!=='function')return{ok:false,hint:'Define a method called '+t.fn+' (check the spelling).'};
      for(const c of t.cases){
        let got;
        try{got=fn(...c.args)}catch(e){return{ok:false,hint:t.fn+'('+c.args.map(show).join(', ')+') crashed: '+e.message}}
        if(!pyEq(got,c.is))return{ok:false,hint:t.hint||(t.fn+'('+c.args.map(show).join(', ')+') returned '+show(got)+' but expected '+show(c.is)+'.')};
      }
      return{ok:true,logs:r.logs};
    }
    if(t.vars){
      for(const[name,chk]of Object.entries(t.vars)){
        if(!chk(r.env[name]))return{ok:false,hint:t.hint||('Check the variable "'+name+'".')};
      }
      return{ok:true,logs:r.logs};
    }
    return{ok:true,logs:r.logs};
  }
  const r=run(code);
  if(r.err)return{ok:false,hint:(lang==='java'?'Java':'Python')+' hit an error: '+r.err};
  return{ok:true,logs:r.logs};
}
/* syntax highlighter (python + java keywords) */
function hl(code){
  return esc(code).replace(/(#[^\n]*|\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|\b(def|return|if|elif|else|for|while|in|and|or|not|True|False|None|import|from|class|pass|break|continue|print|range|len|lambda|is|type|str|int|float|public|private|protected|static|void|final|new|String|boolean|char|double|long|short|byte|System|out|true|false|null|this)\b|(\b\d+(?:\.\d+)?\b)/g,
    (m,cm,st,kw,nu)=>cm?`<span class="tk-cm">${cm}</span>`:st?`<span class="tk-st">${st}</span>`:kw?`<span class="tk-kw">${kw}</span>`:nu?`<span class="tk-nu">${nu}</span>`:m);
}
function paint(out,r){
  out.innerHTML=r.logs.map(l=>`<div>&gt; ${esc(l)}</div>`).join('')+(r.err?`<div style="color:var(--red)">x ${esc(r.err)}</div>`:'');
}
function mountEditor(host,{value='',lang='py',run=true,submitLabel=null,onSubmit,readonly=false,output=true}){
  host.classList.add('codebox');
  host.innerHTML=`<div class="cb-bar"><span class="dots"><i class="dot" style="background:#fb7185"></i><i class="dot" style="background:#fbbf24"></i><i class="dot" style="background:#34d399"></i></span><span class="fn">${lang==='java'?'Main.java':'main.py'}</span></div>
    <div class="editor ${readonly?'ed-view':''}"><pre aria-hidden="true"></pre><textarea spellcheck="false" wrap="off" aria-label="code editor"></textarea></div>
    <div class="cb-bar" style="gap:10px">
      ${run?`<button class="btn btn-soft btn-sm run">${ic('play',13)} Run Code</button>`:''}
      ${submitLabel?`<button class="btn btn-grn btn-sm sub">${esc(submitLabel)}</button>`:''}
      <span class="fn" style="margin-left:auto">${lang==='java'?'java sandbox':'python sandbox'}</span>
    </div>
    ${output?'<pre class="console-out"></pre>':''}`;
  const ta=$('textarea',host),pre=$('pre',host),out=$('.console-out',host);
  const sync=()=>{pre.innerHTML=hl(ta.value)+'\n';ta.style.height='auto';ta.style.height=Math.max(150,ta.scrollHeight)+'px'};
  ta.value=value;sync();
  ta.addEventListener('input',sync);
  ta.addEventListener('scroll',()=>{pre.scrollTop=ta.scrollTop;pre.scrollLeft=ta.scrollLeft});
  ta.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const s=ta.selectionStart;ta.value=ta.value.slice(0,s)+'    '+ta.value.slice(ta.selectionEnd);ta.selectionStart=ta.selectionEnd=s+4;sync()}});
  if(run)$('.run',host).addEventListener('click',()=>paint(out,runSrc(ta.value,lang)));
  if(readonly)ta.readOnly=true;
  return{get:()=>ta.value,set:v=>{ta.value=v;sync()},shake:()=>{const e=$('.editor',host);e.style.animation='none';void e.offsetWidth;e.style.animation='shake .4s'}};
}

/* ---------- shared components ---------- */
const stIcon=s=>s==='done'?`<span class="st-ic st-done">${ic('check',15)}</span>`:s==='locked'?`<span class="st-ic st-lock">${ic('lock',15)}</span>`:`<span class="st-ic st-cur">${ic('play',15)}</span>`;
const AV=[['#5b8cff','#a78bfa'],['#2dd4bf','#34d399'],['#fbbf24','#f472b6'],['#f472b6','#8b5cf6'],['#22d3ee','#34d399'],['#34d399','#fbbf24']];
const avatar=(u,size=40)=>`<span class="avatar" style="width:${size}px;height:${size}px;font-size:${size*.42}px;background:linear-gradient(135deg,${AV[u.avatar%6][0]},${AV[u.avatar%6][1]})">${esc((u.name||'?')[0].toUpperCase())}</span>`;
function prog(c,u){const d=(u.done[c.id]||[]).length;return{done:d,pct:Math.round(d/c.total*100),xpDone:d*100}}
function courseCard(c,u,{link=true}={}){
  const p=prog(c,u),started=p.done>0,fin=p.pct>=100;
  return`<article class="card lift ccard">
    <div class="ccard-top">
      <span class="c-ico" style="background:linear-gradient(135deg,${c.color},${c.color}b0)">${esc(c.glyph)}</span>
      <div style="min-width:0">
        <h3>${esc(c.name)}</h3>
        <div class="meta">
          <span class="chip g">${esc(c.level)}</span>
          <span class="chip">${c.modules.length} Modules</span>
          <span class="chip">${c.total} Lessons</span>
          <span class="chip">~${c.est} hrs</span>
        </div>
      </div>
    </div>
    <div>
      <div class="pct-row"><span>${fin?'Completed':started?p.done+' / '+c.total+' lessons':'Not started'}</span><span>${p.pct}%</span></div>
      <div class="pbar sm" style="margin-top:7px"><i data-w="${p.pct}"></i></div>
    </div>
    <div class="ccard-foot">
      <span class="chip c">+${fmt(c.xpTotal)} XP available</span>
      ${link?`<a class="btn ${fin?'btn-soft':'btn-pri'} btn-sm" href="#/app/course/${c.id}">${fin?'Review':started?'Continue':'Start Course'}</a>`:''}
    </div></article>`;
}
const animateBars=root=>$$('[data-w]',root).forEach(el=>later(()=>el.style.width=el.dataset.w+'%',60));

/* ---------- shell / hud ---------- */
const NAV=[['dashboard','home','Home'],['my-courses','book','My Courses'],['courses','grid','Explore Courses'],['live','video','Live Classes'],['challenges','target','Challenges'],['achievements','award','Achievements'],['progress','chart','Progress'],['leaderboard','trophy','Leaderboard'],['profile','user','Profile'],['settings','gear','Settings']];
const MEET_URL='https://meet.google.com/landing';
const PHONE='0117489795';
function shell(active,inner,title){
  const u=user();
  $('#app').innerHTML=`<div class="shell">
    <aside class="side" id="side">
      <a class="logo" href="#/app/dashboard"><span class="mark">${ic('bolt',20)}</span>BrightByte</a>
      <nav class="nav">
        ${NAV.map(([id,icn,lbl])=>`<a href="#/app/${id}" class="${active===id?'on':''}"><span class="ic">${ic(icn,18)}</span>${lbl}</a>`).join('')}
        ${u.role==='admin'?`<a href="#/app/admin" class="${active==='admin'?'on':''}"><span class="ic">${ic('terminal',18)}</span>Admin</a>`:''}
      </nav>
      <a class="side-user" href="#/app/profile">
        <div class="su-top">${avatar(u,38)}<div><div class="su-name">${esc(u.name)}</div><div class="su-lvl">Lv ${levelOf(u.xp).i+1} · ${levelOf(u.xp).name}</div></div></div>
        <div class="su-xp"><span>${fmt(u.xp)} XP</span><span>${xpPct(u)}%</span></div>
        <div class="pbar sm"><i data-w="${xpPct(u)}"></i></div>
      </a>
    </aside>
    <div class="main">
      <div class="topbar">
        <button class="btn btn-soft btn-sm" id="burger" aria-label="menu">${ic('menu',18)}</button>
        <a class="logo" href="#/app/dashboard"><span class="mark">${ic('bolt',16)}</span>BrightByte</a>
        <div class="hud" style="margin-left:auto">${hudHTML(u)}</div>
      </div>
      <div class="page" id="view">${inner}</div>
    </div></div>`;
  const side=$('#side');
  $('#burger').addEventListener('click',()=>{side.classList.add('open');
    const b=document.createElement('div');b.className='backdrop';b.onclick=()=>{side.classList.remove('open');b.remove()};document.body.appendChild(b)});
  $$('.join').forEach(b=>b.addEventListener('click',()=>{window.open(MEET_URL,'_blank','noopener');toast('Opening Google Meet','Joining: '+b.dataset.name)}));
  animateBars();
  document.title=(title?title+' · ':'')+'BrightByte';
}
function xpPct(u){const l=levelOf(u.xp);return l.next?Math.round((u.xp-l.base)/(l.next.xp-l.base)*100):100}
function hudHTML(u){
  return`<span class="hud-chip"><span class="flame">${ic('flame',14)}</span>${u.streak}</span>
  <span class="hud-chip" style="color:var(--cyan)">${ic('bolt',14)} <span class="hud-xp">${fmt(u.xp)}</span> XP</span>
  <a href="#/app/profile">${avatar(u,34)}</a>`;
}
function refreshHud(){
  const u=user();
  $$('.hud-xp').forEach(el=>{
    const from=Number(el.dataset.cur||u.xp),to=u.xp;el.dataset.cur=to;
    if(from===to){el.textContent=fmt(to);return}
    const t0=performance.now();
    const step=t=>{const k=Math.min(1,(t-t0)/650);el.textContent=fmt(Math.round(from+(to-from)*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);});
}
function bindCountdown(){
  const ms=()=>{const n=new Date();n.setHours(24,0,0,0);return n-Date.now()};
  const paint=()=>$$('[data-countdown]').forEach(el=>{const s=Math.floor(ms()/1000);
    el.textContent=Math.floor(s/3600)+'h '+Math.floor(s%3600/60)+'m '+pad2(s%60)+'s'});
  paint();every(paint,1000);
}

/* ---------- landing ---------- */
function vLanding(){
  const heroLines=['public class Main {','','  public static void main(String[] args) {','    int skills = 0;','','    for (int i = 0; i < 10; i++) {','      skills += 100;','    }','','    System.out.println("Level up! XP: " + skills);','  }','}'];
  const chips=[['class','top:6%;left:-7%;color:var(--cyan)'],['static','top:14%;right:-5%;color:var(--purple)'],['System.out.println','bottom:16%;left:-9%;color:var(--yellow)'],['void','top:44%;right:-8%;color:var(--pink)'],['Jv','bottom:-5%;right:22%;color:var(--blue)'],['final','top:-4%;right:30%;color:var(--green)']];
  const u=user();
  $('#app').innerHTML=`
  <header class="land-top">
    <a class="logo" href="#/"><span class="mark">${ic('bolt',20)}</span>BrightByte</a>
    <div style="display:flex;gap:10px">
      ${u?`<a class="btn btn-pri btn-sm" href="#/app/dashboard">My Dashboard</a>`:`<a class="btn btn-soft btn-sm" href="#/login">Log In</a>
      <a class="btn btn-pri btn-sm" href="#/signup">Sign Up Free</a>`}
    </div>
  </header>
  <section class="hero">
    <div>
      <span class="chip c" style="margin-bottom:20px">Java &amp; Python crash courses for grades 7 to 12</span>
      <h1>Learn. Build.<br><span class="hl">Level Up.</span></h1>
      <p class="sub">Master Java and Python through fast, fun crash courses designed to get you building real programs — earning XP, badges and levels only when you actually do the work.</p>
      <div class="hero-cta">
        <a class="btn btn-pri" href="#/signup">${ic('rocket',17)} Start Learning</a>
        <a class="btn btn-soft" href="#showcase">${ic('grid',16)} Explore Courses</a>
      </div>
      <div class="hero-meta">
        <span>${ic('check',14)} No experience needed</span>
        <span>${ic('check',14)} Build from lesson one</span>
        <span>${ic('check',14)} Live classes on Google Meet</span>
      </div>
    </div>
    <div class="hero-vis" id="heroVis">
      ${chips.map(([t,pos,c],i)=>`<span class="f-chip" style="${pos};color:${c};animation-delay:${i*.5}s">${esc(t)}</span>`).join('')}
      <div class="ed-win" id="edWin">
        <div class="bar"><i class="dot" style="background:#fb7185"></i><i class="dot" style="background:#fbbf24"></i><i class="dot" style="background:#34d399"></i><span class="ttl">Main.java — BrightByte Editor</span></div>
        <pre id="heroCode"></pre>
      </div>
    </div>
  </section>
  <section class="sec">
    <h2>Why Learn With Us?</h2>
    <p class="lead">Short lessons, real projects and a progression system where every point of progress is earned.</p>
    <div class="feat-grid">
      ${[['bolt','Fast-Paced Courses','Learn the important concepts without wasting a single minute — every lesson moves you forward.','rgba(91,140,255,.16)'],
         ['target','Project-Based Learning','Build real things while you learn. No dry theory marathons, ever.','rgba(52,211,153,.16)'],
         ['trophy','Earn XP & Badges','Complete lessons and challenges to level up from Rookie to Code Master.','rgba(251,191,36,.18)'],
         ['chart','Track Your Progress','See exactly how far you have come — every lesson, streak and badge, at a glance.','rgba(244,114,182,.18)']]
        .map(([icn,t,d,bg])=>`<div class="card lift feat"><div class="f-ico" style="background:${bg}">${ic(icn,24)}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>
  </section>
  <section class="sec" id="showcase" style="padding-top:20px">
    <h2>Pick your language</h2>
    <p class="lead">Two complete crash courses — everything you need to go from zero to building real programs, in Python or Java.</p>
    <div class="show-grid">${allCourses().map(c=>courseCard(c,u||{done:{},xp:0},{link:false})).join('')}</div>
  </section>
  <div class="eps-strip"><div class="card eps-inner">
    <span class="chip k">${ic('shield',13)} Proudly part of Epsilon</span>
    <a class="chip c" href="tel:${PHONE}">${ic('phone',13)} ${PHONE}</a>
    <span class="small mut">Questions about enrollment or live classes? Give us a call.</span>
  </div></div>
  <div class="cta-band"><div class="cta-inner">
    <h2>Ready to press <span style="color:var(--yellow)">Start</span>?</h2>
    <p>Your first lesson takes under 10 minutes. Your first project? Today.</p>
    <a class="btn btn-pri" href="#/signup">${ic('rocket',17)} Create free account</a>
  </div></div>
  <footer>BrightByte — Learn. Build. Level Up. · <b>Part of Epsilon</b> · <a href="tel:${PHONE}" style="color:var(--cyan)">${PHONE}</a> · Progress is saved on this device.</footer>`;
  const el=$('#heroCode');let li=0,ci=0;
  const tick=()=>{if(!document.contains(el))return;
    if(li>=heroLines.length){later(()=>{li=0;ci=0;tick()},3200);el.innerHTML=hl(heroLines.join('\n'))+'<span class="caret"></span>';return}
    ci++;if(ci>heroLines[li].length){li++;ci=0}
    el.innerHTML=hl(heroLines.slice(0,li).concat(heroLines[li].slice(0,ci)).join('\n'))+'<span class="caret"></span>';
    later(tick,heroLines[li]===''?60:26)};
  tick();
  const vis=$('#heroVis'),win=$('#edWin');
  vis.addEventListener('mousemove',e=>{const r=vis.getBoundingClientRect();
    win.style.transform=`rotateY(${((e.clientX-r.left)/r.width-.5)*8}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*8}deg)`});
  vis.addEventListener('mouseleave',()=>win.style.transform='');
}
/* ---------- auth views ---------- */
function vLogin(){
  $('#app').innerHTML=`<div class="auth-wrap"><div class="card auth-card">
    <a class="logo" href="#/"><span class="mark">${ic('bolt',20)}</span>BrightByte</a>
    <h1>Welcome back</h1><p class="sub">Your streak missed you.</p>
    <div class="fld"><label>Email</label><input id="liEmail" type="email" placeholder="you@example.com" autocomplete="email"></div>
    <div class="fld"><label>Password</label><input id="liPass" type="password" placeholder="........"></div>
    <div class="f-err" id="liErr"></div>
    <button class="btn btn-pri" id="liGo" style="width:100%">Log In</button>
    <p class="f-note">New here? <button data-go="#/signup">Create an account</button> · <button data-go="#/forgot">Forgot password?</button></p>
  </div></div>`;
  $$('[data-go]').forEach(b=>b.onclick=()=>location.hash=b.dataset.go);
  const go=()=>{const err=login($('#liEmail').value.trim(),$('#liPass').value);
    if(err){$('#liErr').textContent=err;$('#liErr').style.margin='0 0 14px'}else{touchStreak();location.hash=user().role==='admin'?'#/app/admin':'#/app/dashboard'}};
  $('#liGo').onclick=go;
  $('#liPass').addEventListener('keydown',e=>e.key==='Enter'&&go());
}
function vSignup(){
  $('#app').innerHTML=`<div class="auth-wrap"><div class="card auth-card">
    <a class="logo" href="#/"><span class="mark">${ic('bolt',20)}</span>BrightByte</a>
    <h1>Create your account</h1><p class="sub">Free forever. Level up in minutes.</p>
    <div class="fld"><label>Your name</label><input id="suName" placeholder="What should we call you?"></div>
    <div class="fld"><label>Email</label><input id="suEmail" type="email" placeholder="you@example.com"></div>
    <div class="fld"><label>Password (6+ characters)</label><input id="suPass" type="password" placeholder="Make it a good one"></div>
    <div class="f-err" id="suErr"></div>
    <button class="btn btn-pri" id="suGo" style="width:100%">Sign Up & Start</button>
    <p class="f-note">Already coding with us? <button onclick="location.hash='#/login'">Log in</button></p>
  </div></div>`;
  $('#suGo').onclick=()=>{
    const name=$('#suName').value.trim(),email=$('#suEmail').value.trim(),pass=$('#suPass').value,err=$('#suErr');
    if(name.length<2)return err.textContent='Tell us your name (2+ characters).';
    if(!/^\S+@\S+\.\S+$/.test(email))return err.textContent="That email doesn't look right.";
    if(pass.length<6)return err.textContent='Password needs at least 6 characters.';
    const e=signUp(name,email,pass);
    if(e)return err.textContent=e;
    location.hash='#/app/dashboard';startOnboarding();
  };
}
function vForgot(){
  $('#app').innerHTML=`<div class="auth-wrap"><div class="card auth-card">
    <h1>Reset password</h1><p class="sub">We will verify it is really you.</p>
    <div id="fg1"><div class="fld"><label>Account email</label><input id="fgEmail" type="email" placeholder="you@example.com"></div>
    <div class="f-err" id="fgErr"></div><button class="btn btn-pri" id="fgGo" style="width:100%">Send recovery code</button></div>
    <div id="fg2" style="display:none"><div class="demo-box" id="fgCode" style="margin:0 0 16px"></div>
    <div class="fld"><label>Recovery code</label><input id="fgIn" inputmode="numeric" placeholder="6-digit code"></div>
    <div class="fld"><label>New password</label><input id="fgNew" type="password"></div>
    <div class="f-err" id="fgErr2"></div><button class="btn btn-pri" id="fgReset" style="width:100%">Reset password</button></div>
    <p class="f-note"><button onclick="location.hash='#/login'">Back to login</button></p>
  </div></div>`;
  let code=null,target=null;
  $('#fgGo').onclick=()=>{
    const em=$('#fgEmail').value.trim();target=DB.users.find(u=>u.email.toLowerCase()===em.toLowerCase());
    if(!target)return $('#fgErr').textContent='No account with that email — check for typos.';
    code=String(Math.floor(100000+Math.random()*900000));
    $('#fg1').style.display='none';$('#fg2').style.display='block';
    $('#fgCode').innerHTML='Demo mode — your recovery code is <b class="mono" style="color:var(--cyan)">'+code+'</b> (a real deployment would email this).';
  };
  $('#fgReset').onclick=()=>{
    if($('#fgIn').value.trim()!==code)return $('#fgErr2').textContent="That code doesn't match.";
    if($('#fgNew').value.length<6)return $('#fgErr2').textContent='New password needs 6+ characters.';
    target.pass=hsh($('#fgNew').value);save();
    toast('Password updated','Log in with your new password','xp');
    location.hash='#/login';
  };
}
/* ---------- live classes (Google Meet) ---------- */
const CLASSES=[
 {name:'Live Lab — Python & Java',when:'Mon & Wed · 5:00 PM',desc:'Live guided practice on your current module. Bring questions.',room:'Foundations Room'},
 {name:'Project Workshop',when:'Fri · 4:30 PM',desc:'Build a mini project together, step by step, on screen.',room:'Workshop Room'},
 {name:'Office Hours',when:'Sat · 11:00 AM',desc:'Small-group help with anything you are stuck on.',room:'Help Desk'}];
function vLive(){
  shell('live',`
    <div class="ph"><h1>Live Classes</h1><p>Join a real session with a real mentor — powered by Google Meet.</p></div>
    <div style="display:flex;flex-direction:column;gap:14px">
      ${CLASSES.map(c=>`<div class="card lift live-item">
        <span class="c-ico" style="background:linear-gradient(135deg,#34d399,#0ea5e9)">${ic('video',24)}</span>
        <div style="flex:1;min-width:220px">
          <b style="font-family:var(--disp);font-size:1.05rem">${esc(c.name)}</b>
          <div class="small mut">${esc(c.desc)}</div>
          <div class="small" style="margin-top:7px;display:flex;gap:16px;color:var(--cyan);font-weight:600;flex-wrap:wrap">
            <span style="display:inline-flex;align-items:center;gap:6px">${ic('calendar',13)} ${esc(c.when)}</span>
            <span style="display:inline-flex;align-items:center;gap:6px">${ic('user',13)} ${esc(c.room)}</span></div>
        </div>
        <button class="btn btn-grn join" data-name="${esc(c.name)}">${ic('video',15)} Join Class</button>
      </div>`).join('')}
    </div>
    <div class="demo-box" style="margin-top:20px">Join opens Google Meet in a new tab. Enter the room code your mentor shares and you are in.</div>`,`Live Classes`);
}
/* ---------- dashboard ---------- */
function vDashboard(){
  const u=user(),lv=levelOf(u.xp),s=stats(u);
  const c=getCourse(u.lastCourse)||allCourses().find(x=>prog(x,u).pct>0);
  const cur=c&&c.flat.find(l=>!(u.done[c.id]||[]).includes(l._fi));
  const recent=u.unlocked.slice(-4).reverse().map(x=>({...allAch().find(a=>a.id===x.id),at:x.at})).filter(a=>a.id);
  const days=[...Array(7)].map((_,i)=>{const d=daysAgo(6-i);return{l:'SMTWTFS'[d.getDay()],v:u.dailyXP[dayKey(d)]||0}});
  const maxV=Math.max(60,...days.map(d=>d.v));
  shell('dashboard',`
    <div class="wave-hi">
      <div><h1>Welcome back, ${esc(u.name)}</h1><p class="mut">${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})} — progress only moves when you do. Let's build.</p></div>
      <div class="hud">${hudHTML(u)}</div>
    </div>
    <div class="dash-grid">
      <div style="display:flex;flex-direction:column;gap:18px;min-width:0">
        <div class="card panel cont-card">
          <h3 style="font-size:1.1rem">Continue Learning</h3>
          ${c?`<div class="cont-course">
              <span class="c-ico" style="background:linear-gradient(135deg,${c.color},${c.color}b0)">${esc(c.glyph)}</span>
              <div style="flex:1;min-width:0">
                <b style="font-family:var(--disp)">${esc(c.name)}</b>
                <div class="small mut">Module ${pad2(cur._mi+1)} · ${esc(c.modules[cur._mi].title)} — ${esc(cur.title)}</div>
              </div>
              <a class="btn btn-pri btn-sm" href="#/app/lesson/${c.id}/${cur._mi}/${cur._li}">Continue ${ic('arrow',14)}</a>
            </div>
            <div><div class="small mut" style="display:flex;justify-content:space-between;font-weight:600"><span>Course progress</span><span>${prog(c,u).pct}%</span></div>
            <div class="pbar" style="margin-top:7px"><i data-w="${prog(c,u).pct}"></i></div></div>`
          :`<div class="empty"><div class="big">${ic('compass',40)}</div>No progress yet — your first completed lesson will light this card up.<br><br><a class="btn btn-pri" href="#/app/courses">${ic('play',15)} Start a Course</a></div>`}
        </div>
        <div class="card panel" style="border-color:rgba(251,191,36,.35)">
          <a href="#/app/challenges" style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">
            <div><span class="chip y">${ic('bolt',13)} Today's Challenge</span>
            <h3 style="font-size:1.1rem;margin-top:8px">Largest of Two</h3>
            <p class="small mut">Write a Python function that returns the larger of two numbers.</p></div>
            <div style="text-align:right"><span class="chip c">+150 XP</span>
            <div class="small mut" style="margin-top:8px">Expires in <b class="count" data-countdown></b></div></div>
          </a>
        </div>
        <div class="card panel">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3 style="font-size:1.1rem">Recent Achievements</h3><a href="#/app/achievements" class="small" style="color:var(--green);font-weight:600;display:inline-flex;align-items:center;gap:4px">View all ${ic('arrow',12)}</a></div>
          ${recent.length?`<div class="badge-strip">${recent.map(a=>`<div class="mini-badge"><span class="b-ic">${ic(a.icon,20)}</span><div><b class="small">${esc(a.name)}</b><div class="small mut" style="font-size:.72rem">${esc(a.desc)}</div></div></div>`).join('')}</div>`
            :`<p class="mut small">Complete your first lesson to start collecting badges.</p>`}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px;min-width:0">
        <div class="card panel ring-wrap">
          <div class="ring" style="--p:${xpPct(u)}"><div class="in"><b>${lv.i+1}</b><span>${esc(lv.name)}</span></div></div>
          <div><b style="font-family:var(--disp);font-size:1.3rem">${fmt(u.xp)} XP</b>
          <p class="small mut">${lv.next?fmt(lv.next.xp-u.xp)+' XP to '+esc(lv.next.name):'Max level — legend status'}</p></div>
        </div>
        <div class="card panel">
          <div style="display:flex;align-items:center;gap:12px"><span class="flame" style="font-size:1.6rem">${ic('flame',26)}</span>
            <div><b style="font-family:var(--disp);font-size:1.3rem">${u.streak} Day Streak</b><p class="small mut">Show up daily to grow the flame</p></div></div>
          <div class="wk-bars">${days.map((d,i)=>`<div class="wk-bar ${i===6?'today':''}"><i style="height:${Math.max(5,d.v/maxV*100)}%" title="${d.v} XP"></i><span>${d.l}</span></div>`).join('')}</div>
        </div>
        <div class="card panel">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">
            <div><span class="chip k">${ic('video',13)} Live Class</span>
              <h3 style="font-size:1.1rem;margin-top:8px">Live Lab</h3>
              <p class="small mut">Mon & Wed · 5:00 PM — guided practice with a mentor.</p></div>
            <button class="btn btn-grn btn-sm join" data-name="Live Lab">${ic('video',14)} Join Class</button>
          </div>
        </div>
      </div>
    </div>
    <h3 style="margin:30px 0 4px;font-size:1.2rem">Your Progress</h3>
    <p class="small mut" style="margin-bottom:4px">Every number below was earned by completing real work.</p>
    <div class="stat-row">
      ${[[s.lessons,'Lessons completed','#5b8cff'],[s.modules,'Modules completed','#34d399'],[s.projects,'Projects completed','#f472b6'],[fmt(s.xp),'XP earned','#fbbf24']]
        .map(([n,l,c2])=>`<div class="card stat-tile"><div class="num" style="color:${c2}">${n}</div><div class="lbl">${l}</div></div>`).join('')}
    </div>`,`Dashboard`);
  refreshHud();bindCountdown();
}
/* ---------- courses ---------- */
function vCourses(){
  const u=user();
  shell('courses',`
    <div class="ph"><h1>Explore Courses</h1><p>Course → Modules → Lessons → Challenges → Projects. Two flagships, built properly.</p></div>
    <div class="course-grid">${allCourses().map(c=>courseCard(c,u)).join('')}</div>`,`Courses`);
  animateBars();
}
function vMyCourses(){
  const u=user();const list=allCourses().filter(c=>prog(c,u).done>0);
  shell('my-courses',`
    <div class="ph"><h1>My Courses</h1><p>Pick up right where you left off.</p></div>
    ${list.length?`<div class="course-grid">${list.map(c=>courseCard(c,u)).join('')}</div>`
      :`<div class="card empty"><div class="big">${ic('book',40)}</div>Your shelf is empty — time to change that.<br><br><a class="btn btn-pri" href="#/app/courses">Explore Courses</a></div>`}`,`My Courses`);
  animateBars();
}
/* ---------- course detail (modules open anytime) ---------- */
function vCourse(id){
  const c=getCourse(id);if(!c){location.hash='#/app/courses';return}
  const u=user();u.lastCourse=c.id;save();
  const st=lessonStates(c,u),p=prog(c,u),hasProgress=p.done>0;
  shell('courses',`
    <div class="card cd-hero">
      <span class="c-ico" style="background:linear-gradient(135deg,${c.color},${c.color}b0)">${esc(c.glyph)}</span>
      <div style="flex:1;min-width:260px">
        <h1 style="font-size:clamp(1.4rem,2.6vw,2rem)">${esc(c.name)}</h1>
        <p class="mut">${esc(c.blurb)}</p>
        <div class="cd-stats">
          <div><b>${p.pct}%</b><span>Course Progress</span></div>
          <div><b>${p.done} / ${c.total}</b><span>Lessons completed</span></div>
          <div><b>${fmt(p.xpDone)} / ${fmt(c.xpTotal)}</b><span>XP earned</span></div>
          <div><b>${c.modules.length}</b><span>Modules — all open</span></div>
        </div>
        <div class="pbar" style="margin-top:16px"><i data-w="${p.pct}"></i></div>
      </div>
    </div>
    <p class="small mut" style="margin-top:18px">You can start any module at any time — hit "Start Module" and jump straight in. Inside a module, lessons unlock one by one.</p>
    <div class="mod-acc">
      ${c.modules.map((m,mi)=>{
        const md=moduleDone(c,mi,u);
        const curL=m.lessons.find(l=>st[l._fi]==='current');
        const anyDone=m.lessons.some(l=>st[l._fi]==='done');
        const open=mi===0||(hasProgress&&anyDone);
        return`<div class="card mod-item ${open?'open':''}">
          <div class="mod-h" data-mod="${mi}" role="button" tabindex="0">
            <span class="mod-num">MODULE ${pad2(mi+1)}</span>
            <span class="tt"><b>${esc(m.title)}</b><span>${m.lessons.filter((_,li)=>st[m.lessons[li]._fi]==='done').length} / ${m.lessons.length} lessons${md?' · cleared':''}</span></span>
            ${curL?`<button class="btn ${anyDone?'btn-soft':'btn-pri'} btn-sm mod-start" data-goto="${curL._mi}/${curL._li}">${anyDone?'Continue Module':'Start Module'}</button>`:''}
            <span class="chev">${ic('chev',18)}</span>
          </div>
          <div class="mod-body">
            ${m.lessons.map((l,li)=>{const s2=st[l._fi];
              return`<button class="lrow ${s2==='current'?'cur':''} ${s2==='locked'?'locked':''}" data-goto="${l._mi}/${l._li}" data-locked="${s2==='locked'}">
                ${stIcon(s2)}<span style="flex:1;text-align:left">${l.type==='project'?'Project · ':l.type==='quiz'?'Quiz · ':''}${esc(l.title)}</span>
                ${l.type==='project'?'<span class="tag" style="background:rgba(244,114,182,.15);color:var(--pink)">Project</span>':l.type==='quiz'?'<span class="tag" style="background:rgba(167,139,250,.15);color:var(--purple)">Quiz</span>':''}
                <span class="lx">+${(l.xp||100)+(l.type==='project'?400:0)} XP</span></button>`}).join('')}
          </div></div>`}).join('')}
    </div>`,c.name);
  animateBars();
  $$('.mod-h').forEach(h=>h.addEventListener('click',e=>{if(e.target.closest('.mod-start'))return;h.parentElement.classList.toggle('open')}));
  $$('.mod-start').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();location.hash='#/app/lesson/'+c.id+'/'+b.dataset.goto}));
  $$('[data-goto]:not(.mod-start)').forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.locked==='true'){b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');
      toast('Still locked','Finish the previous lesson in this module first');return}
    location.hash='#/app/lesson/'+c.id+'/'+b.dataset.goto;}));
}
/* ---------- lesson ---------- */
function lessonHTML(c,l){
  const learn=l.learn||genericLearn(l.title);
  const starter=l.starter!==undefined?l.starter:(c.lang==='java'?JW('// '+l.title):'# '+l.title+'\n');
  const isJava=c.lang==='java';
  return`
    <p class="crumb"><a href="#/app/course/${c.id}">${esc(c.name)}</a> · Module ${pad2(l._mi+1)} · Lesson ${pad2(l._li+1)}</p>
    <h1>${esc(l.title)}</h1>
    <div class="card learn-box"><h3>What you'll learn</h3>
      <ul>${learn.map(x=>`<li>${ic('check',14)}<span>${x}</span></li>`).join('')}</ul></div>
    ${l.diagram?`<h2>Variables are labeled boxes</h2>
      <p>A variable is a named container in your computer's memory. You label the box, put a value inside, and ${isJava?'Java':'Python'} remembers it for you.</p>
      <div class="diagram">
        <div class="dbox"><span class="lbl">${isJava?'playerName':'player_name'}</span><span class="val">"Ethan"</span></div>
        <div class="dbox"><span class="lbl">score</span><span class="val">100</span></div>
        <div class="dbox"><span class="lbl">${isJava?'isReady':'is_ready'}</span><span class="val">${isJava?'true':'True'}</span></div>
      </div>`:''}
    <h2>${l.diagram?'Creating them in code':'The idea'}</h2>
    <p>${l.diagram?(isJava?'In Java you declare the type up front — int for whole numbers, double for decimals, String for text, boolean for true/false. The type is locked in forever, which keeps big programs honest. If a value should never change, mark it final.':'Python keeps it simple: name, equals sign, value. No keywords needed — the first assignment creates the box. If a value should never change, write it in ALL_CAPS as a signal to other coders.'):'Every concept clicks fastest when you see it working. Read the example, then press Run and watch it come alive.'}</p>
    <div id="exEd"></div>
    ${l.extra?`<p class="small mut" style="margin-top:8px">${l.extra}</p>`:''}
    <div class="chal-card">
      <h3>${l.type==='project'?ic('rocket',20)+' Project Quest':ic('target',20)+' Coding Challenge'} <span class="chip c" style="margin-left:auto">+${(l.xp||100)+(l.type==='project'?400:0)} XP</span></h3>
      <p style="color:#dfe3ff">${l.task}</p>
      <div id="chalEd" style="margin-top:16px"></div>
      <div id="verdict"></div>
    </div>`;
}
const TIPS=['Type the examples yourself — muscle memory is real.','Break things on purpose, then fix them. That is how coders learn.','Stuck? Read the error message out loud. Seriously, it works.','Small wins daily beat heroic weekends.','If a test fails, print your values and see what they actually are.','Missing a semicolon in Java? It is almost always the first thing to check.'];
function vLesson(cid,mi,li){
  const c=getCourse(cid);if(!c){location.hash='#/app/courses';return}
  const u=user();u.lastCourse=c.id;save();
  const m=c.modules[+mi],l=m&&m.lessons[+li];
  if(!l){location.hash='#/app/course/'+cid;return}
  const st=lessonStates(c,u);
  if(st[l._fi]==='locked'){location.hash='#/app/course/'+cid;return}
  const p=prog(c,u),lv=levelOf(u.xp);
  const doneAlready=(u.done[c.id]||[]).includes(l._fi);
  if(l.type==='quiz')return vQuiz(c,l);
  shell('courses',`
    <div class="lesson-grid">
      <aside class="card lnav">
        <div class="lnav-t">${esc(c.name)}</div>
        ${c.modules.map((mm,mmi)=>{
          const open=mmi===+mi;
          return`<div class="lnav-mod ${open?'open':''}">
            <div class="lnav-mh" data-mmod="${mmi}"><b>MODULE ${pad2(mmi+1)}</b><span>${esc(mm.title)}</span></div>
            <div class="lnav-rows">${mm.lessons.map((ll,lli)=>{
              const ss=st[ll._fi];
              return`<button class="lnav-row ${ss} ${mmi===+mi&&lli===+li?'now':''}" data-jump="${mmi}/${lli}" ${ss==='locked'?'disabled':''}>${stIcon(ss)}<span>${esc(ll.title)}</span></button>`}).join('')}</div></div>`}).join('')}
      </aside>
      <div class="lcontent">
        ${lessonHTML(c,l)}
        <div id="nextWrap" style="margin-top:26px"></div>
      </div>
      <aside class="rpanel">
        <div class="card rp-tile"><h4>Course Progress</h4>
          <div style="display:flex;justify-content:space-between" class="small mut"><span>${p.done}/${c.total} lessons</span><b style="color:var(--cyan)">${p.pct}%</b></div>
          <div class="pbar sm" style="margin:8px 0 14px"><i data-w="${p.pct}"></i></div>
          <div class="kv"><span>XP in course</span><b>${fmt(p.xpDone)} / ${fmt(c.xpTotal)}</b></div>
          <div class="kv"><span>This module</span><b>${moduleDone(c,+mi,u)?'Cleared':m.lessons.filter(x=>st[x._fi]==='done').length+'/'+m.lessons.length}</b></div>
        </div>
        <div class="card rp-tile"><h4>Your Status</h4>
          <div class="kv"><span>Level</span><b>${lv.i+1} · ${lv.name}</b></div>
          <div class="kv"><span>Total XP</span><b style="color:var(--cyan)" class="hud-xp">${fmt(u.xp)}</b></div>
          <div class="kv"><span>Streak</span><b>${u.streak} days</b></div>
        </div>
        <div class="card rp-tile"><h4>Tip of the lesson</h4>
          <p class="small mut">${esc(TIPS[Math.floor(Math.random()*TIPS.length)])}</p></div>
      </aside>
    </div>`,l.title);
  animateBars();
  $$('.lnav-mh').forEach(h=>h.onclick=()=>h.parentElement.classList.toggle('open'));
  $$('[data-jump]').forEach(b=>b.onclick=()=>location.hash='#/app/lesson/'+c.id+'/'+b.dataset.jump);
  mountEditor($('#exEd'),{value:l.ex||(c.lang==='java'?JW('// '+l.title,'System.out.println("Run me!");'):'# '+l.title+'\nprint("Run me!")\n'),lang:c.lang,run:true,readonly:true});
  const chal=mountEditor($('#chalEd'),{value:l.starter||'',lang:c.lang,submitLabel:l.type==='project'?'Submit Project':'Submit Challenge',
    onSubmit:()=>{
      const res=checkLesson(l,chal.get());
      const v=$('#verdict');
      if(res.ok){
        let awarded=false;
        if(!doneAlready){const r=completeLesson(c,l,l.type==='project'?'Project completed':l.type==='challenge'?'Challenge passed':'Lesson completed');awarded=!r.already}
        v.innerHTML=`<div class="verdict ok"><span class="v-ic">${ic('check',18)}</span><div>
          <b>${awarded?'Correct! XP earned and progress saved.':'Correct! (Already completed — no double XP.)'}</b>
          <div class="small mut" style="margin-top:4px">${res.logs&&res.logs.length?'Output: '+esc(res.logs.slice(0,3).join(' · ')):'Great work — onto the next one.'}</div></div></div>`;
        if(awarded)confetti(70);
        showNext(c,l);
      }else{
        chal.shake();
        v.innerHTML=`<div class="verdict no"><span class="v-ic">${ic('lock',16)}</span><div><b>Not yet — try again</b><div class="small" style="margin-top:3px">${esc(res.hint||'')}</div></div></div>`;
      }
    }});
  if(doneAlready)$('#verdict').innerHTML=`<div class="verdict ok"><span class="v-ic">${ic('check',18)}</span><div><b>Already completed</b><div class="small mut">Review freely — resubmitting will not double your XP.</div></div></div>`;
}
function showNext(c,l){
  const nxt=c.flat.find(x=>x._fi===l._fi+1);
  const nextUndone=nxt&&!(user().done[c.id]||[]).includes(nxt._fi);
  $('#nextWrap').innerHTML=`<div style="display:flex;gap:12px;flex-wrap:wrap">
    <a class="btn btn-soft" href="#/app/course/${c.id}">Back to Course</a>
    ${nextUndone?`<button class="btn btn-pri" id="nextBtn">Next Lesson ${ic('arrow',14)}</button>`:''}</div>`;
  const nb=$('#nextBtn');
  if(nb)nb.onclick=()=>location.hash='#/app/lesson/'+c.id+'/'+nxt._mi+'/'+nxt._li;
}
function vQuiz(c,l){
  const u=user();const passed=u.quizzes.includes(c.id+':'+l._fi);
  shell('courses',`
    <div class="lesson-grid">
      <div class="lcontent" style="max-width:640px;margin:0 auto;width:100%">
        <p class="crumb"><a href="#/app/course/${c.id}">${esc(c.name)}</a> · Module ${pad2(l._mi+1)}</p>
        <h1>${esc(l.title)}</h1>
        <p class="mut">Answer all questions correctly to pass. Worth <b style="color:var(--cyan)">+${l.xp||100} XP</b>.</p><br>
        ${l.quiz.map((q,qi)=>`<div class="card q-card"><h4>${qi+1}. ${esc(q.q)}</h4>
          ${q.opts.map((o,oi)=>`<button class="q-opt" data-q="${qi}" data-o="${oi}"><span class="key">${'ABC'[oi]}</span>${esc(o)}</button>`).join('')}</div>`).join('')}
        <button class="btn btn-grn" id="qSub">Submit Quiz</button>
        <div id="qVerdict"></div>
        <div id="nextWrap" style="margin-top:20px"></div>
      </div>
      <aside class="rpanel"><div class="card rp-tile"><h4>How grading works</h4>
        <p class="small mut">Pick an answer for every question, then submit. You can retry as often as you like — XP is awarded once.</p></div></aside>
    </div>`,l.title);
  const picks={};
  $$('.q-opt').forEach(b=>b.onclick=()=>{
    const qi=b.dataset.q;picks[qi]=+b.dataset.o;
    $$('.q-opt[data-q="'+qi+'"]').forEach(x=>x.classList.toggle('sel',x===b));});
  $('#qSub').onclick=()=>{
    if(Object.keys(picks).length<l.quiz.length){toast('Almost','Answer every question first');return}
    const allOk=l.quiz.every((q,qi)=>picks[qi]===q.a);
    l.quiz.forEach((q,qi)=>$$('.q-opt[data-q="'+qi+'"]').forEach(x=>{
      const oi=+x.dataset.o;x.classList.remove('sel');
      if(oi===q.a)x.classList.add('right');
      else if(picks[qi]===oi)x.classList.add('wrong');}));
    const v=$('#qVerdict');
    if(allOk){
      const key=c.id+':'+l._fi;let awarded=false;
      if(!u.quizzes.includes(key)){u.quizzes.push(key);completeLesson(c,l,'Quiz passed');awarded=true;confetti(90)}
      v.innerHTML=`<div class="verdict ok"><span class="v-ic">${ic('check',18)}</span><div><b>${awarded?'Perfect! Quiz passed and XP earned.':'Perfect score!'}</b></div></div>`;
      showNext(c,l);
    }else v.innerHTML=`<div class="verdict no"><span class="v-ic">${ic('lock',16)}</span><div><b>Some answers slipped by.</b><div class="small" style="margin-top:3px">The green rows show the correct choices — fix yours and resubmit.</div></div></div>`;
  };
  if(passed)$('#nextWrap').innerHTML='<span class="chip g">Already passed — retake for practice anytime</span>';
}
/* ---------- achievements ---------- */
function vAchievements(){
  const u=user();const owned=new Map(u.unlocked.map(a=>[a.id,a.at]));
  const s=stats(u);
  const statLbl=k=>({lessonsDay:'today',streak:'days',quizzes:'quizzes',xp:'XP'}[k]||'lessons');
  shell('achievements',`
    <div class="ph"><h1>Achievements</h1><p>${owned.size} of ${allAch().length} unlocked — keep collecting.</p></div>
    <div class="ach-grid">
      ${allAch().map(a=>{const at=owned.get(a.id);
        return`<div class="card ach lift ${at?'':'locked'}"><div class="medal">${ic(a.icon,34)}</div>
          <h3>${esc(a.name)}</h3><p>${esc(a.desc)}</p>
          ${at?`<div class="when">Unlocked ${new Date(at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>`
            :`<div class="when" style="color:var(--dim)">${s[a.stat]||0} / ${a.target} ${statLbl(a.stat)}</div>`}</div>`}).join('')}
    </div>`,`Achievements`);
}
/* ---------- leaderboard ---------- */
const BOTS=[['NovaKim',9120,1840,5230],['PyPirate',8450,1610,4870],['ByteWizard',7830,1475,4410],['Zara.dev',6120,1290,3960],['KiraKode',5640,1150,3520],['MaxLoop',4310,980,2980],['PixelPanda',3890,860,2610],['TheoPy',3050,720,2240],['SamSyntax',2460,610,1870],['EchoZero',1980,540,1610]];
let lbMode='w';
function vLeaderboard(){
  const u=user();
  shell('leaderboard',`
    <div class="ph"><h1>Weekly Leaderboard</h1><p>Friendly competition — everyone climbs by doing the work.</p></div>
    <div class="filter-row" style="display:flex;gap:9px;flex-wrap:wrap;margin-bottom:8px">${[['w','Weekly'],['m','Monthly'],['a','All Time']].map(([k,l])=>`<button class="btn ${lbMode===k?'btn-pri':'btn-soft'} btn-sm" data-m="${k}">${l}</button>`).join('')}</div>
    <div id="lbBody"></div>`,`Leaderboard`);
  const draw=()=>{
    const xpOf=x=>lbMode==='w'?x[2]:lbMode==='m'?x[3]:x[1];
    let rows=BOTS.map((x,i)=>({name:x[0],xp:xpOf(x),all:x[1],av:(i+2)%6}));
    const weekSum=[0,1,2,3,4,5,6].reduce((s,n)=>s+(u.dailyXP[dayKey(daysAgo(n))]||0),0);
    rows.push({name:u.name+' (you)',xp:lbMode==='w'?weekSum:u.xp,all:u.xp,av:u.avatar,me:true});
    rows.sort((a,b)=>b.xp-a.xp);
    const medalSvg=['trophy','award','award'];
    $('#lbBody').innerHTML=`
      <div class="podium">
        ${[1,0,2].map(i=>{const r=rows[i];if(!r)return'';const l=levelOf(r.all);
          return`<div class="pod p${i+1}" style="animation-delay:${i*.12}s">
            ${avatar({name:r.name.replace(' (you)',''),avatar:r.av},52)}
            <div style="margin:8px 0 2px;font-weight:700;font-family:var(--disp)">${esc(r.name)}</div>
            <div class="small" style="color:var(--cyan);font-weight:600">Lv ${l.i+1} ${esc(l.name)}</div>
            <div class="small mut">${fmt(r.xp)} XP</div>
            <div class="step"><div class="medal-c">${ic(medalSvg[i],20)}</div></div></div>`}).join('')}
      </div>
      <div class="card">
        ${rows.map((r,i)=>`<div class="lb-row ${r.me?'me':''}">
          <span class="lb-rank">${i<3?'':'#'}${i+1}</span>${avatar({name:r.name.replace(' (you)',''),avatar:r.av},36)}
          <b style="flex:1">${esc(r.name)}</b>
          <span class="chip ${i===0?'y':'b'}" style="margin-right:10px">Lv ${levelOf(r.all).i+1}</span>
          <b style="color:var(--cyan);min-width:80px;text-align:right">${fmt(r.xp)} XP</b></div>`).join('')}
      </div>`;
  };
  draw();
  $$('[data-m]').forEach(b=>b.onclick=()=>{lbMode=b.dataset.m;$$('[data-m]').forEach(x=>x.classList.toggle('btn-pri',x===b));draw()});
}
/* ---------- challenges ---------- */
const EXTRAS=[
 {id:'daily',name:'Largest of Two',xp:150,icon:'bolt',daily:true,lang:'py',
  prompt:'Write a Python function <code class="inl">largest(a, b)</code> that returns the larger of the two numbers.',
  starter:'def largest(a, b):\n    # return the bigger number\n    pass\n\nprint(largest(4, 9))  # should print 9',
  test:{fn:'largest',cases:[{args:[4,9],is:9},{args:[23,7],is:23},{args:[-5,-2],is:-2}],hint:'largest(4, 9) is 9, largest(23, 7) is 23, largest(-5, -2) is -2. An if/else works great here.'}},
 {id:'w1',name:'Reverse Replay',xp:100,icon:'play',lang:'py',
  prompt:'Write <code class="inl">reverse_word(word)</code> that returns the word spelled backwards.',
  starter:'def reverse_word(word):\n    pass\n\nprint(reverse_word("code"))  # edoc',
  test:{fn:'reverse_word',cases:[{args:['code'],is:'edoc'},{args:['hi'],is:'ih'},{args:['a'],is:'a'}],hint:'Start with an empty string and loop over the letters, adding each one to the FRONT: result = letter + result'}},
 {id:'w2',name:'Word Counter',xp:120,icon:'book',lang:'py',
  prompt:'Write <code class="inl">count_words(s)</code> that returns how many words are in the sentence (separated by spaces).',
  starter:'def count_words(s):\n    pass\n\nprint(count_words("hello bright world"))  # 3',
  test:{fn:'count_words',cases:[{args:['hello bright world'],is:3},{args:['one'],is:1},{args:['a b c d'],is:4}],hint:'s.split(" ") turns a sentence into a list of words — len() of that is your answer.'}},
 {id:'j1',name:'Java: Sum It Up',xp:130,icon:'chart',lang:'java',
  prompt:'Write a Java method <code class="inl">static int sumTo(int n)</code> that returns the sum of every number from 1 to n.',
  starter:JM('static int sumTo(int n) {\n        return 0;\n    }','System.out.println(sumTo(5));'),
  test:{fn:'sumTo',cases:[{args:[5],is:15},{args:[3],is:6},{args:[1],is:1}],hint:'Loop with for (int i = 1; i <= n; i++) and add into a total.'}},
 {id:'j2',name:'Java: Is Even',xp:100,icon:'check',lang:'java',
  prompt:'Write a Java method <code class="inl">static boolean isEven(int n)</code> that returns true when n is even.',
  starter:JM('static boolean isEven(int n) {\n        return false;\n    }','System.out.println(isEven(4));','System.out.println(isEven(7));'),
  test:{fn:'isEven',cases:[{args:[4],is:true},{args:[7],is:false},{args:[0],is:true}],hint:'n % 2 == 0 means even — return that comparison directly.'}}];
function vChallenges(){
  const u=user();const t=dayKey();
  shell('challenges',`
    <div class="ph"><h1>Challenges</h1><p>Quick brain-teasers with real XP on the line — graded by running your actual code.</p></div>
    <div class="card panel" style="margin-bottom:26px" id="dailyCard"></div>
    <h3 style="margin-bottom:14px;font-size:1.2rem">Skill Blitz — Python & Java, always open</h3>
    <div class="blitz" id="blitzGrid">${EXTRAS.slice(1).map((x,i)=>`<div class="card panel blitz-item" data-i="${i}" style="padding:20px"></div>`).join('')}</div>`,`Challenges`);
  const renderOne=(host,x)=>{
    const flag=x.daily?u.extra['d_'+t+'_'+x.id]:u.extra[x.id];
    host.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap">
        <div><span class="chip ${x.daily?'y':'b'}" style="margin-bottom:10px">${ic(x.icon,13)} ${x.daily?"Today's Challenge":(x.lang==='java'?'Java Blitz':'Python Blitz')}</span>
        <h3 style="font-size:1.25rem;display:flex;align-items:center;gap:10px">${ic(x.icon,20)} ${esc(x.name)}</h3>
        <p class="mut" style="margin-top:8px">${x.prompt}</p></div>
        <div style="text-align:right">${flag?'<span class="chip g">Completed</span>':'<span class="chip c">+'+x.xp+' XP</span>'}
        ${x.daily?'<div class="small mut" style="margin-top:10px">Expires in <b class="count" data-countdown></b></div>':''}</div>
      </div>
      <div class="ed-slot" style="margin-top:18px"></div>
      <div class="verdict-slot"></div>`;
    if(flag)return;
    const ed=mountEditor($('.ed-slot',host),{value:x.starter,lang:x.lang,submitLabel:'Submit Challenge',
      onSubmit:()=>{
        const res=checkLesson(x,ed.get());
        if(res.ok){
          if(x.daily)u.extra['d_'+t+'_'+x.id]=true;else u.extra[x.id]=true;
          grantXP(x.xp,x.daily?'Daily challenge complete':'Blitz challenge complete');
          confetti(90);save();
          $('.verdict-slot',host).innerHTML=`<div class="verdict ok"><span class="v-ic">${ic('check',18)}</span><div><b>Correct — +${x.xp} XP banked.</b><div class="small mut">Output: ${esc((res.logs||[]).slice(0,2).join(' · ')||'—')}</div></div></div>`;
        }else{ed.shake();$('.verdict-slot',host).innerHTML=`<div class="verdict no"><span class="v-ic">${ic('lock',16)}</span><div><b>Not yet.</b><div class="small" style="margin-top:3px">${esc(res.hint||'')}</div></div></div>`}
      }});
  };
  renderOne($('#dailyCard'),EXTRAS[0]);
  $$('.blitz-item').forEach(el=>renderOne(el,EXTRAS[+el.dataset.i+1]));
  bindCountdown();
}
/* ---------- progress ---------- */
function vProgress(){
  const u=user(),s=stats(u);
  const days=[...Array(7)].map((_,i)=>{const d=daysAgo(6-i);return{l:'SMTWTFS'[d.getDay()],v:u.dailyXP[dayKey(d)]||0}});
  const maxV=Math.max(60,...days.map(d=>d.v));
  shell('progress',`
    <div class="ph"><h1>Progress</h1><p>The receipts on all your hard work — nothing here is given, everything is earned.</p></div>
    <div class="stat-row" style="margin:0 0 20px">
      ${[[s.lessons,'Lessons completed','#5b8cff'],[s.modules,'Modules completed','#34d399'],[s.projects,'Projects completed','#f472b6'],[fmt(s.xp),'XP earned','#fbbf24']]
        .map(([n,l,c2])=>`<div class="card stat-tile"><div class="num" style="color:${c2}">${n}</div><div class="lbl">${l}</div></div>`).join('')}
    </div>
    <div class="card panel" style="margin-bottom:18px"><h3 style="margin-bottom:4px">XP — last 7 days</h3><p class="small mut">Total this week: <b style="color:var(--cyan)">${fmt(days.reduce((a,b)=>a+b.v,0))} XP</b></p>
      <div class="wk-bars" style="height:150px">${days.map((d,i)=>`<div class="wk-bar ${i===6?'today':''}"><i style="height:${Math.max(4,d.v/maxV*100)}%" title="${d.v} XP"></i><span>${d.l}</span></div>`).join('')}</div></div>
    <h3 style="margin:24px 0 14px;font-size:1.2rem">Course breakdown</h3>
    <div class="card panel">
      ${allCourses().map(c=>{const p=prog(c,u);return`<div style="margin-bottom:18px">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px"><span class="icon-tile" style="background:linear-gradient(135deg,${c.color},${c.color}b0)">${esc(c.glyph)}</span>
        <div style="flex:1"><b>${esc(c.name)}</b><div class="small mut">${p.done}/${c.total} lessons · ${fmt(p.xpDone)}/${fmt(c.xpTotal)} XP</div></div>
        <b style="font-family:var(--disp)">${p.pct}%</b></div>
        <div class="pbar sm"><i data-w="${p.pct}"></i></div></div>`}).join('')}
    </div>`,`Progress`);
  animateBars();
}
/* ---------- profile & settings ---------- */
function vProfile(){
  const u=user(),lv=levelOf(u.xp),s=stats(u);
  shell('profile',`
    <div class="ph"><h1>Profile</h1><p>How the BrightByte universe sees you.</p></div>
    <div class="prof-grid">
      <div class="card panel" style="text-align:center">
        ${avatar(u,96)}
        <h2 style="margin-top:14px">${esc(u.name)}</h2>
        <p class="mut small">${esc(u.email)}</p>
        <div style="display:flex;gap:8px;justify-content:center;margin:14px 0;flex-wrap:wrap">
          <span class="chip b">Lv ${lv.i+1} · ${esc(lv.name)}</span><span class="chip c">+${fmt(u.xp)} XP</span><span class="chip y">${ic('flame',13)} ${u.streak}</span></div>
        <p class="small mut">Joined ${new Date(u.joined).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</p>
        ${u.interests.length?`<div style="display:flex;gap:7px;justify-content:center;margin-top:12px;flex-wrap:wrap">${u.interests.map(i=>`<span class="chip">${esc(i)}</span>`).join('')}</div>`:''}
      </div>
      <div class="card panel">
        <h3 style="margin-bottom:14px">Edit profile</h3>
        <div class="fld"><label>Display name</label><input id="pfName" value="${esc(u.name)}"></div>
        <div class="fld"><label>Avatar</label><div class="av-pick" id="pfAv">
          ${AV.map((a,i)=>`<span class="avatar ${i===u.avatar?'sel':''}" data-i="${i}" style="width:46px;height:46px;background:linear-gradient(135deg,${a[0]},${a[1]})">${esc(u.name[0].toUpperCase())}</span>`).join('')}</div></div>
        <div class="kv"><span>Lessons completed</span><b>${s.lessons}</b></div>
        <div class="kv"><span>Badges owned</span><b>${u.unlocked.length}</b></div>
        <button class="btn btn-pri" id="pfSave" style="margin-top:14px;width:100%">Save Changes</button>
      </div>
    </div>`,`Profile`);
  let av=u.avatar;
  $$('#pfAv .avatar').forEach(a=>a.onclick=()=>{av=+a.dataset.i;$$('#pfAv .avatar').forEach(x=>x.classList.toggle('sel',x===a))});
  $('#pfSave').onclick=()=>{const n=$('#pfName').value.trim();if(n.length<2)return toast('Name too short','At least 2 characters');
    u.name=n;u.avatar=av;save();toast('Profile saved','Looking sharp','xp');render()};
}
function vSettings(){
  const u=user();
  shell('settings',`
    <div class="ph"><h1>Settings</h1><p>Tune the experience to your taste.</p></div>
    <div class="card panel" style="max-width:560px">
      <h3 style="margin-bottom:16px">Preferences</h3>
      <label style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;cursor:pointer">
        <span>Reduce motion <span class="small mut">(calms animations)</span></span>
        <input type="checkbox" id="stMotion" ${u.prefs.reduceMotion?'checked':''} style="width:20px;height:20px;accent-color:#34d399"></label>
      <hr style="border:none;border-top:1px solid var(--line);margin:14px 0">
      <h3 style="margin-bottom:12px">Account</h3>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-soft" id="stLogout">Log Out</button>
        <button class="btn btn-danger" id="stReset">Reset All Progress</button>
      </div>
      <p class="small mut" style="margin-top:16px">Data lives in this browser's local storage — persistent across visits on this device, and structured so a real backend can take over anytime.</p>
    </div>`,`Settings`);
  $('#stMotion').onchange=e=>{u.prefs.reduceMotion=e.target.checked;save();applyMotion()};
  $('#stLogout').onclick=()=>ovl(`<div class="ovl-card card"><h2 style="font-size:1.3rem">Log out?</h2><p class="mut" style="margin:8px 0 22px">Your progress is saved — the streak will be waiting.</p>
    <div style="display:flex;gap:10px;justify-content:center"><button class="btn btn-soft" data-close>Stay</button><button class="btn btn-pri" id="loYes">Log Out</button></div></div>`,
    w=>{$('#loYes',w).onclick=()=>logout()});
  $('#stReset').onclick=()=>ovl(`<div class="ovl-card card"><div class="medal-big" style="background:linear-gradient(135deg,#fb7185,#f43f5e)">${ic('shield',52)}</div>
    <h2 style="font-size:1.3rem">Reset everything?</h2><p class="mut" style="margin:8px 0 22px">XP, badges, completed lessons — all of it goes back to zero. This cannot be undone.</p>
    <div style="display:flex;gap:10px;justify-content:center"><button class="btn btn-soft" data-close>Keep my progress</button><button class="btn btn-danger" id="rsYes">Reset</button></div></div>`,
    w=>{$('#rsYes',w).onclick=()=>{
      Object.assign(u,{xp:0,streak:0,done:{},quizzes:[],extra:{},dailyXP:{},lessonsDay:{},unlocked:[],lastCourse:null});
      save();toast('Fresh start','All progress cleared');location.hash='#/app/dashboard'}});
}
/* ---------- admin ---------- */
let admTab='overview';
function vAdmin(){
  const u=user();
  if(u.role!=='admin'){location.hash='#/app/dashboard';return}
  const students=DB.users.filter(x=>x.role==='student');
  const totalLessons=allCourses().reduce((s,c)=>s+c.total,0);
  shell('admin',`
    <div class="ph"><h1>Admin Console</h1><p>Course → Modules → Lessons → Challenges → Projects. Build away.</p></div>
    <div class="tab-row">${[['overview','Overview'],['content','Content Builder'],['students','Students'],['ach','Achievements']].map(([k,l])=>`<button class="${admTab===k?'on':''}" data-t="${k}">${l}</button>`).join('')}</div>
    <div id="admBody"></div>`,`Admin`);
  $$('.tab-row button').forEach(b=>b.onclick=()=>{admTab=b.dataset.t;render()});
  const B=$('#admBody');
  if(admTab==='overview'){
    B.innerHTML=`<div class="stat-row" style="margin:0 0 18px">
      ${[[students.length,'Students'],[allCourses().length,'Courses'],[totalLessons,'Lessons'],[fmt(students.reduce((s,x)=>s+x.xp,0)),'XP awarded']]
        .map(([n,l])=>`<div class="card stat-tile"><div class="num" style="color:var(--green)">${n}</div><div class="lbl">${l}</div></div>`).join('')}</div>
      <div class="card panel"><h3 style="margin-bottom:10px">Catalog</h3>
      ${allCourses().map(c=>`<div class="kv"><span>${esc(c.glyph)} ${esc(c.name)} <span class="chip" style="margin-left:6px">${c.total} lessons</span></span><b>${esc(c.level)}</b></div>`).join('')}</div>`;
  }
  if(admTab==='content'){
    B.innerHTML=`
      <div class="card adm-form">
        <div class="full" style="font-weight:700;font-family:var(--disp)">+ New Course</div>
        <div class="fld" style="margin:0"><label>Name</label><input id="acName" placeholder="Game Dev Crash Course"></div>
        <div class="fld" style="margin:0"><label>Icon (short text)</label><input id="acIcon" placeholder="GFX" maxlength="4"></div>
        <div class="fld" style="margin:0"><label>Language</label><select id="acLang"><option value="py">Python</option><option value="java">Java</option></select></div>
        <div class="fld" style="margin:0"><label>Difficulty</label><select id="acLvl"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
        <div class="fld full" style="margin:0"><label>Blurb</label><input id="acBlurb" placeholder="One exciting sentence"></div>
        <button class="btn btn-pri full" id="acGo">Create Course</button>
      </div>
      <div class="card panel" style="margin-top:18px">
        <h3 style="margin-bottom:12px">Manage modules & lessons</h3>
        <div class="fld"><label>Course</label><select id="amCourse">${allCourses().map(c=>`<option value="${c.id}">${esc(c.name)}${c.custom?' (custom)':' (built-in)'}</option>`).join('')}</select></div>
        <div id="amDetail"></div>
      </div>`;
    const detail=()=>{
      const c=getCourse($('#amCourse').value);
      const extraArr=DB.extraMods[c.id]||[];
      $('#amDetail').innerHTML=`
        <div class="card adm-form" style="background:rgba(255,255,255,.03);margin-bottom:14px">
          <div class="fld" style="margin:0"><label>New module title</label><input id="amTitle" placeholder="Advanced Techniques"></div>
          <div class="fld" style="margin:0"><label>Lesson count (auto-named)</label><input id="amN" type="number" min="1" max="8" value="4"></div>
          <button class="btn btn-soft" id="amGo">+ Add Module</button>
          ${c.custom?'<button class="btn btn-danger" id="acDel">Delete Course</button>':''}
        </div>
        ${c.modules.map((m,mi)=>{const isCustom=c.custom||mi>=c.modules.length-extraArr.length;
          return`<div style="border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap">
            <b>Module ${pad2(mi+1)} — ${esc(m.title)}</b><span class="small mut">${m.lessons.length} lessons ${isCustom?'· editable':'· built-in, read-only'}</span></div>
          <div class="small mut" style="margin:8px 0">${m.lessons.map(l=>esc(l.title)).join(' · ')}</div>
          ${isCustom?`<div style="display:flex;gap:8px;flex-wrap:wrap">
            <input id="alTitle-${mi}" placeholder="New lesson title" style="flex:1;min-width:150px;background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:10px;padding:8px 12px;outline:none">
            <select id="alType-${mi}" style="background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:10px;padding:8px"><option value="lesson">Lesson</option><option value="challenge">Challenge</option><option value="project">Project</option></select>
            <button class="btn btn-soft btn-sm" data-addl="${mi}">+ Add Lesson</button>
            <button class="btn btn-danger btn-sm" data-delm="${mi}">Delete Module</button></div>`:''}</div>`}).join('')}`;
      $('#amGo').onclick=()=>{
        const t=$('#amTitle').value.trim(),n=Math.max(1,Math.min(8,+$('#amN').value||4));
        if(!t)return toast('Name the module first');
        const entry=DB.extraMods[c.id]||(DB.extraMods[c.id]=[]);
        entry.push({title:t,lessons:genLessons(t,n,c.lang,entry.length)});save();
        toast('Module added',n+' lessons generated','xp');render();};
      $$('[data-addl]').forEach(b=>b.onclick=()=>{
        const mi=+b.dataset.addl;const title=$('#alTitle-'+mi).value.trim();
        if(!title)return toast('Give the lesson a title');
        const type=$('#alType-'+mi).value;
        if(c.custom)DB.customCourses.find(x=>x.id===c.id).modules[mi].lessons.push({title,type,xp:100});
        else extraArr[mi-(c.modules.length-extraArr.length)].lessons.push({title,type,xp:100});
        save();toast('Lesson added',title,'xp');render();});
      $$('[data-delm]').forEach(b=>b.onclick=()=>{
        const mi=+b.dataset.delm;
        if(c.custom)DB.customCourses.find(x=>x.id===c.id).modules.splice(mi,1);
        else extraArr.splice(mi-(c.modules.length-extraArr.length),1);
        save();render();});
      const del=$('#acDel');if(del)del.onclick=()=>{DB.customCourses=DB.customCourses.filter(x=>x.id!==c.id);save();toast('Course deleted');render()};
    };
    $('#amCourse').onchange=detail;detail();
    $('#acGo').onclick=()=>{
      const name=$('#acName').value.trim();if(name.length<3)return toast('Course needs a name');
      const langV=$('#acLang').value;
      DB.customCourses.push({id:'c_'+uid(),custom:true,name,glyph:($('#acIcon').value.trim()||'NEW').slice(0,4),
        color:FCOLORS[DB.customCourses.length%6],level:$('#acLvl').value,lang:langV,
        blurb:$('#acBlurb').value.trim()||'A brand new adventure.',modules:[]});
      save();toast('Course created','Now add modules','xp');render();};
  }
  if(admTab==='students'){
    B.innerHTML=`<div class="card" style="overflow-x:auto"><table class="table"><tr><th>Student</th><th>Level</th><th>XP</th><th>Lessons</th><th>Streak</th><th>Award XP</th></tr>
      ${students.map(s=>{const l=levelOf(s.xp);return`<tr><td><b>${esc(s.name)}</b><div class="small mut">${esc(s.email)}</div></td>
        <td>Lv ${l.i+1} · ${l.name}</td><td>${fmt(s.xp)}</td><td>${stats(s).lessons}</td><td>${s.streak}</td>
        <td><div style="display:flex;gap:6px"><input id="aw-${s.id}" type="number" placeholder="50" style="width:74px;background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:9px;padding:7px 10px;outline:none">
        <button class="btn btn-soft btn-sm" data-aw="${s.id}">Award</button></div></td></tr>`}).join('')}</table></div>`;
    $$('[data-aw]').forEach(b=>b.onclick=()=>{
      const t=DB.users.find(x=>x.id===b.dataset.aw);const n=Math.round(+($('#aw-'+t.id).value)||0);
      if(n<=0)return toast('Enter a positive XP amount');
      const before=levelOf(t.xp).i;t.xp+=n;const after=levelOf(t.xp).i;save();
      toast('Awarded +'+n+' XP','To '+t.name,'xp');if(after>before)later(()=>toast('Level up',t.name+' is now '+LEVELS[after].name,'xp'),400);render();});
  }
  if(admTab==='ach'){
    B.innerHTML=`<div class="prof-grid">
      <div class="card adm-form"><div class="full" style="font-weight:700;font-family:var(--disp)">+ New Achievement</div>
        <div class="fld" style="margin:0"><label>Icon</label><select id="naIcon">${Object.keys(ICONS).map(k=>`<option value="${k}">${k}</option>`).join('')}</select></div>
        <div class="fld" style="margin:0"><label>Name</label><input id="naName" placeholder="Marathoner"></div>
        <div class="fld full" style="margin:0"><label>Description</label><input id="naDesc" placeholder="Complete 25 lessons."></div>
        <div class="fld" style="margin:0"><label>Tracked stat</label><select id="naStat"><option value="lessons">lessons completed</option><option value="projects">projects completed</option><option value="streak">streak days</option><option value="xp">total XP</option><option value="quizzes">quizzes passed</option><option value="lessonsDay">lessons in one day</option></select></div>
        <div class="fld" style="margin:0"><label>Target</label><input id="naTarget" type="number" value="25" min="1"></div>
        <button class="btn btn-pri full" id="naGo">Create Badge</button></div>
      <div class="card panel"><h3 style="margin-bottom:12px">All badges</h3>
        ${allAch().map(a=>`<div class="kv"><span>${ic(a.icon,15)} <b>${esc(a.name)}</b> <span class="small mut">— ${esc(a.desc)}</span></span><span class="chip">${a.stat} &ge; ${a.target}</span></div>`).join('')}</div></div>`;
    $('#naGo').onclick=()=>{
      const name=$('#naName').value.trim();if(name.length<2)return toast('Badge needs a name');
      DB.customAch.push({id:'ca_'+uid(),icon:$('#naIcon').value,name,desc:$('#naDesc').value.trim()||'A custom badge.',
        stat:$('#naStat').value,target:Math.max(1,+$('#naTarget').value||1)});
      save();toast('Badge created','It can now be earned by students','xp');render();};
  }
}
/* ---------- onboarding ---------- */
function startOnboarding(){
  const u=user();let step=0,av=u.avatar,likes=new Set(),pref='Complete Beginner';
  ovl(`<div class="ovl-card card ob-card" id="obCard"></div>`,w=>{
    const box=$('#obCard',w);
    const draw=()=>{
      const dots='<div class="ob-dots">'+[0,1,2,3].map(i=>`<i class="${i<=step?'on':''}"></i>`).join('')+'</div>';
      if(step===0)box.innerHTML=dots+`<h2>Welcome to BrightByte, ${esc(u.name.split(' ')[0])}</h2>
        <p class="sub">Java and Python crash courses that feel like a game — you'll build real things from lesson one, and every bit of progress is earned. Setup takes 20 seconds.</p>
        <div class="fld"><label>Pick your avatar</label><div class="av-pick">${AV.map((a,i)=>`<span class="avatar ${i===av?'sel':''}" data-av="${i}" style="width:50px;height:50px;background:linear-gradient(135deg,${a[0]},${a[1]})">${esc(u.name[0].toUpperCase())}</span>`).join('')}</div></div>
        <div style="display:flex;justify-content:flex-end;margin-top:10px"><button class="btn btn-pri" id="obNext">Continue ${ic('arrow',14)}</button></div>`;
      if(step===1)box.innerHTML=dots+`<h2>What do you want to learn?</h2><p class="sub">Pick as many as you like — it shapes your recommendations.</p>
        <div class="ob-choice">${['Python Basics','Java','Games & Projects','Automation & Scripts','Data & Numbers'].map(t=>`<button class="ob-chip ${likes.has(t)?'sel':''}" data-like="${t}">${t}</button>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;margin-top:24px"><button class="btn btn-soft" id="obBack">Back</button><button class="btn btn-pri" id="obNext">Continue ${ic('arrow',14)}</button></div>`;
      if(step===2)box.innerHTML=dots+`<h2>Choose your experience level.</h2><p class="sub">Be honest — we'll pace things to match.</p>
        <div class="ob-choice">${['Complete Beginner','Beginner','Intermediate','Advanced'].map(t=>`<button class="ob-chip ${pref===t?'sel':''}" data-pref="${t}">${t}</button>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;margin-top:24px"><button class="btn btn-soft" id="obBack">Back</button><button class="btn btn-pri" id="obNext">Continue ${ic('arrow',14)}</button></div>`;
      if(step===3)box.innerHTML=dots+`<div class="medal-big">${ic('bolt',48)}</div>
        <h2 style="text-align:center">Your coding journey starts NOW.</h2>
        <p class="sub" style="text-align:center">Your first lesson is ready — and your progress bar starts at zero, waiting to be earned.</p>
        <button class="btn btn-pri" id="obGo" style="width:100%">${ic('rocket',16)} Enter Dashboard</button>`;
      $$('[data-av]',box).forEach(a=>a.onclick=()=>{av=+a.dataset.av;$$('[data-av]',box).forEach(x=>x.classList.toggle('sel',x===a))});
      $$('[data-like]',box).forEach(b=>b.onclick=()=>{const t=b.dataset.like;likes.has(t)?likes.delete(t):likes.add(t);b.classList.toggle('sel')});
      $$('[data-pref]',box).forEach(b=>b.onclick=()=>{pref=b.dataset.pref;$$('[data-pref]',box).forEach(x=>x.classList.toggle('sel',x===b))});
      const nx=$('#obNext',box);
      if(nx)nx.onclick=()=>{
        if(step===0)u.avatar=av;
        if(step===1&&!likes.size)return toast('Pick at least one topic','It shapes your first quest');
        step++;draw();};
      const bk=$('#obBack',box);if(bk)bk.onclick=()=>{step--;draw()};
      const go=$('#obGo',box);
      if(go)go.onclick=()=>{
        u.avatar=av;u.interests=[...likes];u.pref=pref;u.onboarded=true;save();
        confetti(200);later(()=>confetti(160),450);
        close();toast('Journey started','Complete your first lesson to earn your first XP');
        location.hash='#/app/dashboard';};
    };
    draw();
  });
}
/* ---------- router ---------- */
function applyMotion(){document.body.classList.toggle('reduced',!!(user()&&user().prefs.reduceMotion))}
function render(){
  clearTimers();
  $$('.backdrop').forEach(b=>b.remove());
  const h=(location.hash||'#/').replace(/^#\/?/,'');
  const p=h.split('/');
  const u=user();applyMotion();
  if(p[0]==='app'){
    if(!u){location.hash='#/login';return}
    const sub=p[1]||'dashboard';
    const views={dashboard:vDashboard,courses:vCourses,'my-courses':vMyCourses,live:vLive,challenges:vChallenges,achievements:vAchievements,leaderboard:vLeaderboard,progress:vProgress,profile:vProfile,settings:vSettings,admin:vAdmin};
    (views[sub]||vDashboard)();
    if(sub==='course')vCourse(p[2]);
    if(sub==='lesson')vLesson(p[2],p[3],p[4]);
  }else if(p[0]==='login')vLogin();
  else if(p[0]==='signup')vSignup();
  else if(p[0]==='forgot')vForgot();
  else{if(u){location.hash='#/app/dashboard';return}vLanding()}
  window.scrollTo(0,0);
}
addEventListener('hashchange',render);
document.addEventListener('click',e=>{
  const b=e.target.closest('.btn');if(!b)return;
  const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height);
  const el=document.createElement('span');el.className='ripple';
  el.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(e.clientX-r.left-s/2)+'px;top:'+(e.clientY-r.top-s/2)+'px';
  b.appendChild(el);setTimeout(()=>el.remove(),520);
});
loadDB();
if(user())touchStreak();
render();