// Livello di potenza dei brawler del proprietario dell'app.
// GENERATO da script/fetch-profilo-brawl.js — non modificare a mano.
// Letto il 2026-09-09 dal tracker pubblico di brawlplanet.
//
// Per ogni brawler: livello di potenza, trofei, e quali gadget e star power
// sono gia' posseduti (e quali mancano, col loro costo in monete).
//
// PERCHÉ SERVE: in Classificata un brawler sotto POTENZA 9 non si può
// schierare, e da Mythic in su ne serve uno a POTENZA 11. Un consiglio su un
// brawler che non puoi mettere in campo è peggio che inutile: fa perdere i
// secondi che non hai. Qui ce ne sono 52 giocabili su 106, 39 a potenza 11.
//
// Il tag del giocatore NON sta qui apposta: questo repository è pubblico.
// È una fotografia: risbloccando o potenziando un brawler va rilanciato.
const PROFILO = {
  "8-Bit": { potenza: 11, trofei: 1000, gadget: ["Cheat Cartridge"], starPower: ["Boosted Booster","Plugged In"], gadgetMancanti: ["Extra Credits"], starPowerMancanti: [], partite: 2, vinte: 2, partiteTrofei: 0 },
  "Alli": { potenza: 1, trofei: 13, gadget: [], starPower: [], gadgetMancanti: ["Feed The Gators","Cold-Blooded"], starPowerMancanti: ["Lizard Limbs","You Better Run, You Better Take Cover"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Amber": { potenza: 9, trofei: 1000, gadget: ["Fire Starters","Dancing Flames"], starPower: ["Wild Flames","Scorchin' Siphon"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Angelo": { potenza: 7, trofei: 375, gadget: ["Stinging Flight","Master Fletcher"], starPower: [], gadgetMancanti: [], starPowerMancanti: ["Empower","Flow"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Ash": { potenza: 11, trofei: 329, gadget: ["Chill Pill"], starPower: ["First Bash","Mad As Heck"], gadgetMancanti: ["Rotten Banana"], starPowerMancanti: [], partite: 36, vinte: 24, partiteTrofei: 26 },
  "Barley": { potenza: 1, trofei: 124, gadget: [], starPower: [], gadgetMancanti: ["Sticky Syrup Mixer","Herbal Tonic"], starPowerMancanti: ["Medical Use","Extra Noxious"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Bea": { potenza: 10, trofei: 1362, gadget: ["Honey Molasses","Rattled Hive"], starPower: ["Insta Beaload","Honeycomb"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Belle": { potenza: 9, trofei: 1006, gadget: ["Nest Egg","Reverse Polarity"], starPower: ["Positive Feedback","Grounded"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Berry": { potenza: 1, trofei: 33, gadget: [], starPower: [], gadgetMancanti: ["Friendship Is Great","Healthy Additives"], starPowerMancanti: ["Floor Is Fine","Making A Mess"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Bibi": { potenza: 1, trofei: 171, gadget: [], starPower: [], gadgetMancanti: ["Vitamin Booster","Extra Sticky"], starPowerMancanti: ["Home Run","Batting Stance"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Bo": { potenza: 11, trofei: 2012, gadget: ["Super Totem","Tripwire"], starPower: ["Circling Eagle","Snare A Bear"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Bolt": { potenza: 11, trofei: 75, gadget: ["Bouncy Ball"], starPower: ["Toss Up"], gadgetMancanti: ["Oil Change"], starPowerMancanti: ["Unstoppaball"], partite: 15, vinte: 9, partiteTrofei: 5 },
  "Bonnie": { potenza: 1, trofei: 46, gadget: [], starPower: [], gadgetMancanti: ["Sugar Rush","Crash Test"], starPowerMancanti: ["Black Powder","Wisdom Tooth"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Brock": { potenza: 11, trofei: 2003, gadget: ["Rocket Laces","Rocket Fuel"], starPower: ["More Rockets!","Rocket No. 4"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Bull": { potenza: 9, trofei: 1005, gadget: ["T-Bone Missile","Stomper"], starPower: ["Berserker","Tough Guy"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Buster": { potenza: 7, trofei: 53, gadget: ["Utility Belt","Slo-Mo Replay"], starPower: [], gadgetMancanti: [], starPowerMancanti: ["Blockbuster","Kevlar Vest"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Buzz": { potenza: 10, trofei: 1006, gadget: ["Reserve Buoy","X-Ray-Shades"], starPower: ["Tougher Torpedo","Eyes Sharp"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Byron": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Shot In The Arm","Booster Shots"], starPowerMancanti: ["Malaise","Injection"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Carl": { potenza: 11, trofei: 1006, gadget: ["Heat Ejector","Flying Hook"], starPower: ["Power Throw","Protective Pirouette"], gadgetMancanti: [], starPowerMancanti: [], partite: 19, vinte: 11, partiteTrofei: 0 },
  "Charlie": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Spiders","Personal Space"], starPowerMancanti: ["Digestive","Slimy"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Chester": { potenza: 11, trofei: 1821, gadget: ["Spicy Dice","Candy Beans"], starPower: ["Single Bell'o'mania","Sneak Peek"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Chuck": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Rerouting","Ghost Train"], starPowerMancanti: ["Pit Stop","Tickets Please!"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Clancy": { potenza: 6, trofei: 165, gadget: [], starPower: [], gadgetMancanti: ["Snappy Shooting","Tactical Retreat"], starPowerMancanti: ["Recon","Pumping Up"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Colette": { potenza: 10, trofei: 1057, gadget: ["Na-Ah!","Gotcha!"], starPower: ["Push It","Mass Tax"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Colt": { potenza: 11, trofei: 1771, gadget: ["Speedloader","Silver Bullet"], starPower: ["Slick Boots","Magnum Special"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Cordelius": { potenza: 11, trofei: 1176, gadget: ["Replanting","Poison Mushroom"], starPower: ["Comboshrooms","Mushroom Kingdom"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Crow": { potenza: 11, trofei: 2007, gadget: ["Instapoison","Slowing Toxin"], starPower: ["Extra Toxic","Carrion Crow"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Damian": { potenza: 11, trofei: 1357, gadget: ["Spiritual Healing","Wall Of Sound"], starPower: ["Crowdkill","Vulgar Display Of Punch"], gadgetMancanti: [], starPowerMancanti: [], partite: 11, vinte: 1, partiteTrofei: 0 },
  "Darryl": { potenza: 1, trofei: 145, gadget: [], starPower: [], gadgetMancanti: ["Recoiling Rotator","Tar Barrel"], starPowerMancanti: ["Steel Hoops","Rolling Reload"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Doug": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Double Sausage","Extra Mustard"], starPowerMancanti: ["Fast Food","Self Service"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Draco": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Upper Cut","Last Stand"], starPowerMancanti: ["Expose","Shredding"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Dynamike": { potenza: 6, trofei: 150, gadget: [], starPower: [], gadgetMancanti: ["Fidget Spinner","Satchel Charge"], starPowerMancanti: ["Dyna-Jump","Demolition"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Edgar": { potenza: 11, trofei: 1589, gadget: ["Let's Fly","Hardcore"], starPower: ["Hard Landing","Fisticuffs"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "El Primo": { potenza: 5, trofei: 248, gadget: [], starPower: [], gadgetMancanti: ["Suplex Supplement","Asteroid Belt"], starPowerMancanti: ["El Fuego","Meteor Rush"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Emz": { potenza: 11, trofei: 2009, gadget: ["Friendzoner"], starPower: ["Bad Karma","Hype"], gadgetMancanti: ["Acid Spray"], starPowerMancanti: [], partite: 9, vinte: 3, partiteTrofei: 0 },
  "Eve": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Gotta Go!","Motherly Love"], starPowerMancanti: ["Unnatural Order","Happy Surprise"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Fang": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Corn-Fu","Roundhouse Kick"], starPowerMancanti: ["Fresh Kicks","Divine Soles"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Finx": { potenza: 1, trofei: 204, gadget: [], starPower: [], gadgetMancanti: ["Back To The Finxture","No Escape"], starPowerMancanti: ["Hieroglyph Halt","Primer"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Frank": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Active Noise Canceling","Irresistible Attraction"], starPowerMancanti: ["Power Grab","Sponge"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Gale": { potenza: 10, trofei: 1011, gadget: ["Twister"], starPower: ["Blustery Blow","Freezing Snow"], gadgetMancanti: ["Spring Ejector"], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Gene": { potenza: 10, trofei: 1006, gadget: ["Lamp Blowout"], starPower: ["Magic Puffs","Spirit Slap"], gadgetMancanti: ["Vengeful Spirits"], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Gigi": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Longer Strings","Disappearing Act"], starPowerMancanti: ["Plié Protection","A Helping Hand"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Glowy": { potenza: 9, trofei: 820, gadget: ["Slippery Savior","More Lumens!"], starPower: ["Biotic Ecosystem","Parasitism"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Gray": { potenza: 11, trofei: 1012, gadget: ["Walking Cane","Grand Piano"], starPower: ["Fake Injury","New Perspective"], gadgetMancanti: [], starPowerMancanti: [], partite: 5, vinte: 3, partiteTrofei: 0 },
  "Griff": { potenza: 11, trofei: 1619, gadget: ["Piggy Bank","Coin Shower"], starPower: ["Keep The Change","Business Resilience"], gadgetMancanti: [], starPowerMancanti: [], partite: 17, vinte: 6, partiteTrofei: 0 },
  "Grom": { potenza: 1, trofei: 131, gadget: [], starPower: [], gadgetMancanti: ["Watchtower","Radio Check"], starPowerMancanti: ["Foot Patrol","X-Factor"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Gus": { potenza: 11, trofei: 1428, gadget: ["Kooky Popper"], starPower: ["Health Bonanza","Spirit Animal"], gadgetMancanti: ["Knockback Spirit"], starPowerMancanti: [], partite: 3, vinte: 1, partiteTrofei: 0 },
  "Hank": { potenza: 1, trofei: 42, gadget: [], starPower: [], gadgetMancanti: ["Water Balloons","Barricade"], starPowerMancanti: ["It's Gonna Blow","Take Cover!"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Jacky": { potenza: 1, trofei: 145, gadget: [], starPower: [], gadgetMancanti: ["Pneumatic Booster","Rebuild"], starPowerMancanti: ["Counter Crush","Hardy Hard Hat"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Jae-Yong": { potenza: 1, trofei: 49, gadget: [], starPower: [], gadgetMancanti: ["Weekend Warrior","Time For A Slow Song"], starPowerMancanti: ["The Crowd Goes Mild","Extra High Note"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Janet": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Drop The Bass","Backstage Pass"], starPowerMancanti: ["Stage View","Vocal Warm Up"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Jessie": { potenza: 1, trofei: 145, gadget: [], starPower: [], gadgetMancanti: ["Spark Plug","Recoil Spring"], starPowerMancanti: ["Energize","Shocky"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Juju": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Voodoo Chile","Elementalist"], starPowerMancanti: ["Guarded Gris-Gris","Numbing Needles"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Kaze": { potenza: 1, trofei: 60, gadget: [], starPower: [], gadgetMancanti: ["Gracious Host","Hensojutsu"], starPowerMancanti: ["Advanced Techniques","Gratuity Included"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Kenji": { potenza: 9, trofei: 1001, gadget: ["Dashi Dash","Hosomaki Healing"], starPower: ["Studied The Blade","Nigiri Nemesis"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Kit": { potenza: 11, trofei: 1192, gadget: ["Cardboard Box","Cheeseburger"], starPower: ["Power Hungry","Overly Attached"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Larry & Lawrie": { potenza: 1, trofei: 206, gadget: [], starPower: [], gadgetMancanti: ["Order: Swap","Order: Fall Back"], starPowerMancanti: ["Protocol: Protect","Protocol: Assist"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Leon": { potenza: 11, trofei: 2006, gadget: ["Clone Projector","Lollipop Drop"], starPower: ["Smoke Trails","Invisiheal"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Lily": { potenza: 7, trofei: 432, gadget: ["Vanish","Repot"], starPower: [], gadgetMancanti: [], starPowerMancanti: ["Spiky","Vigilance"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Lola": { potenza: 1, trofei: 111, gadget: [], starPower: [], gadgetMancanti: ["Freeze Frame","Stunt Double"], starPowerMancanti: ["Improvise","Sealed With A Kiss"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Lou": { potenza: 11, trofei: 1042, gadget: ["Ice Block","Cryo Syrup"], starPower: ["Supercool","Hypothermia"], gadgetMancanti: [], starPowerMancanti: [], partite: 3, vinte: 1, partiteTrofei: 0 },
  "Lumi": { potenza: 11, trofei: 2012, gadget: ["Hit The Lights","Grim And Frostbitten"], starPower: ["42% Burnt","Half-Time"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Maisie": { potenza: 6, trofei: 227, gadget: [], starPower: [], gadgetMancanti: ["Disengage!","Finish Them!"], starPowerMancanti: ["Pinpoint Precision","Tremors"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Mandy": { potenza: 9, trofei: 415, gadget: ["Caramelize","Cookie Crumbs"], starPower: ["In My Sights","Hard Candy"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Max": { potenza: 11, trofei: 1017, gadget: ["Phase Shifter"], starPower: ["Super Charged","Run N Gun"], gadgetMancanti: ["Sneaky Sneakers"], starPowerMancanti: [], partite: 2, vinte: 2, partiteTrofei: 0 },
  "Meeple": { potenza: 11, trofei: 1095, gadget: ["Mansions Of Meeple","Ragequit"], starPower: ["Do Not Pass Go","Rule Bending"], gadgetMancanti: [], starPowerMancanti: [], partite: 2, vinte: 0, partiteTrofei: 0 },
  "Meg": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Jolting Volts","Repurpose"], starPowerMancanti: ["Force Field","Heavy Metal"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Melodie": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Perfect Pitch","Interlude"], starPowerMancanti: ["Fast Beats","Extended Mix"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Mico": { potenza: 5, trofei: 314, gadget: [], starPower: [], gadgetMancanti: ["Clipping Scream","Presto"], starPowerMancanti: ["Monkey Business","Record Smash"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Mina": { potenza: 11, trofei: 2003, gadget: ["Windmill","Capo-What?"], starPower: ["Zum Zum Zum","Blown Away"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Moe": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Dodgy Digging","Rat Race"], starPowerMancanti: ["Skipping Stones","Speeding Ticket"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Mortis": { potenza: 11, trofei: 2005, gadget: ["Combo Spinner","Creature Of The Night"], starPower: ["Creepy Harvest","Coiled Snake"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Mr. P": { potenza: 1, trofei: 10, gadget: [], starPower: [], gadgetMancanti: ["Service Bell","Porter Reinforcements"], starPowerMancanti: ["Handle With Care","Revolving Door"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Najia": { potenza: 11, trofei: 2062, gadget: ["Poison Puddles","Najia Jar"], starPower: ["Poisonous Protector","Venomous"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Nani": { potenza: 1, trofei: 60, gadget: [], starPower: [], gadgetMancanti: ["Warpin' Time","Return To Sender"], starPowerMancanti: ["Autofocus","Tempered Steel"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Nita": { potenza: 11, trofei: 2012, gadget: ["Bear Paws","Faux Fur"], starPower: ["Bear With Me","Hyper Bear"], gadgetMancanti: [], starPowerMancanti: [], partite: 8, vinte: 5, partiteTrofei: 0 },
  "Nori": { potenza: 11, trofei: 1631, gadget: ["Sushi Snack","Gonna Need A Bigger Net"], starPower: ["Big Haul","His Mother's Son"], gadgetMancanti: [], starPowerMancanti: [], partite: 11, vinte: 5, partiteTrofei: 0 },
  "Ollie": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Regulate","All Eyez On Me"], starPowerMancanti: ["Kick, Push","Renegade"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Otis": { potenza: 11, trofei: 1157, gadget: ["Dormant Star","Phat Splatter"], starPower: ["Stencil Glue","Ink Refills"], gadgetMancanti: [], starPowerMancanti: [], partite: 3, vinte: 1, partiteTrofei: 0 },
  "Pam": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Pulse Modulator","Scrapsucker"], starPowerMancanti: ["Mama's Hug","Mama's Squeeze"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Pearl": { potenza: 11, trofei: 340, gadget: ["Overcooked"], starPower: ["Heat Shield"], gadgetMancanti: ["Made With Love"], starPowerMancanti: ["Heat Retention"], partite: 16, vinte: 7, partiteTrofei: 8 },
  "Penny": { potenza: 1, trofei: 204, gadget: [], starPower: [], gadgetMancanti: ["Salty Barrel","Trusty Spyglass"], starPowerMancanti: ["Heavy Coffers","Master Blaster"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Pierce": { potenza: 11, trofei: 2007, gadget: ["Bottomless Mags","You Only Brawl Twice"], starPower: ["Mission: Swimpossible","Slip 'n Snipe"], gadgetMancanti: [], starPowerMancanti: [], partite: 3, vinte: 1, partiteTrofei: 0 },
  "Piper": { potenza: 11, trofei: 1020, gadget: ["Auto Aimer","Homemade Recipe"], starPower: ["Ambush","Snappy Sniping"], gadgetMancanti: [], starPowerMancanti: [], partite: 2, vinte: 0, partiteTrofei: 0 },
  "Poco": { potenza: 5, trofei: 117, gadget: [], starPower: [], gadgetMancanti: ["Tuning Fork","Protective Tunes"], starPowerMancanti: ["Da Capo!","Screeching Solo"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "R-T": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Out Of Line","Hacks!"], starPowerMancanti: ["Quick Maths","Recording"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Rico": { potenza: 11, trofei: 2010, gadget: ["Multiball Launcher","Multiball"], starPower: ["Super Bouncy","Robo Retreat"], gadgetMancanti: [], starPowerMancanti: [], partite: 2, vinte: 0, partiteTrofei: 0 },
  "Rosa": { potenza: 1, trofei: 145, gadget: [], starPower: [], gadgetMancanti: ["Grow Light","Unfriendly Bushes"], starPowerMancanti: ["Plant Life","Thorny Gloves"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Ruffs": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Take Cover","Air Support"], starPowerMancanti: ["Air Superiority","Field Promotion"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Sam": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Magnetic Field","Pulse Repellent"], starPowerMancanti: ["Hearty Recovery","Remote Recharge"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Sandy": { potenza: 8, trofei: 302, gadget: ["Sleep Stimulator","Sweet Dreams"], starPower: [], gadgetMancanti: [], starPowerMancanti: ["Rude Sands","Healing Winds"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Shade": { potenza: 11, trofei: 1038, gadget: ["Longarms","Jump Scare"], starPower: ["Spooky Speedster","Hardened Hoodie"], gadgetMancanti: [], starPowerMancanti: [], partite: 5, vinte: 4, partiteTrofei: 0 },
  "Shelly": { potenza: 10, trofei: 1000, gadget: ["Fast Forward","Clay Pigeons"], starPower: ["Shell Shock","Band-Aid"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Sirius": { potenza: 11, trofei: 2000, gadget: ["A Starr Is Born"], starPower: ["Dusk Runners","The Darkest Starr"], gadgetMancanti: ["Master Of Shadows"], starPowerMancanti: [], partite: 2, vinte: 2, partiteTrofei: 0 },
  "Spike": { potenza: 10, trofei: 1120, gadget: ["Popping Pincushion","Life Plant"], starPower: ["Fertilize","Curveball"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Sprout": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Garden Mulcher","Transplant"], starPowerMancanti: ["Overgrowth","Photosynthesis"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Squeak": { potenza: 6, trofei: 251, gadget: [], starPower: [], gadgetMancanti: ["Windup","Residue"], starPowerMancanti: ["Chain Reaction","Super Sticky"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Starr Nova": { potenza: 11, trofei: 1060, gadget: ["Floaty Time","Shining Starr Of Friendship And Justice"], starPower: ["Power Level: Maximum","Mystical Starr Technique"], gadgetMancanti: [], starPowerMancanti: [], partite: 2, vinte: 2, partiteTrofei: 0 },
  "Stu": { potenza: 11, trofei: 1593, gadget: ["Speed Zone","Breakthrough"], starPower: ["Zero Drag","Gaso-Heal"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Surge": { potenza: 11, trofei: 1422, gadget: ["Power Surge","Power Shield"], starPower: ["To The Max!","Serve Ice Cold"], gadgetMancanti: [], starPowerMancanti: [], partite: 5, vinte: 3, partiteTrofei: 0 },
  "Tara": { potenza: 11, trofei: 1015, gadget: ["Psychic Enhancer","Support From Beyond"], starPower: ["Black Portal","Healing Shade"], gadgetMancanti: [], starPowerMancanti: [], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Tick": { potenza: 1, trofei: 145, gadget: [], starPower: [], gadgetMancanti: ["Mine Mania","Last Hurrah"], starPowerMancanti: ["Well Oiled","Automa-Tick Reload"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Trunk": { potenza: 1, trofei: 36, gadget: [], starPower: [], gadgetMancanti: ["For The Queen!","Worker Ants"], starPowerMancanti: ["New Insect Overlords","Colony Scouts"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Wendy": { potenza: 11, trofei: 851, gadget: ["Wind-Powered","Green Grenade"], starPower: ["Slowing Shield","Solar Shield"], gadgetMancanti: [], starPowerMancanti: [], partite: 134, vinte: 90, partiteTrofei: 40 },
  "Willow": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Spellbound","Dive"], starPowerMancanti: ["Love Is Blind","Obsession"], partite: 0, vinte: 0, partiteTrofei: 0 },
  "Ziggy": { potenza: 1, trofei: 0, gadget: [], starPower: [], gadgetMancanti: ["Electric Shuffle","Now You See Me..."], starPowerMancanti: ["Thunderstruck","The Great Ziggini"], partite: 0, vinte: 0, partiteTrofei: 0 },
};

// I RECORD PER MAPPA, dal registro delle partite di Classificata.
// Servono al modello a tre livelli: quanto vali con quel brawler, quanto vali
// su quella mappa, e quel che resta della coppia. Il record per brawler da
// solo predice peggio del caso (AUC 0,474): e' la mappa a contare di piu'.
// Ogni voce e' [partite, vinte].
const PARTITE_BRAWLER = {"BOLT":[15,9],"WENDY":[133,90],"NORI":[11,5],"GRIFF":[17,6],"PEARL":[12,7],"SHADE":[5,4],"ASH":[34,24],"CARL":[19,11],"NITA":[8,5],"RICO":[2,0],"DAMIAN":[11,1],"GRAY":[5,3],"SURGE":[5,3],"OTIS":[3,1],"EMZ":[9,3],"8-BIT":[2,2],"LOU":[3,1],"MEEPLE":[2,0],"STARR NOVA":[2,2],"GUS":[3,1],"SIRIUS":[2,2],"PIERCE":[3,1],"MAX":[2,2],"PIPER":[2,0]};
const PARTITE_MAPPA = {"Undermine":[10,2],"Shooting Star":[13,8],"Safe Zone":[3,1],"Hideout":[6,3],"Dry Season":[15,10],"Ring of Fire":[8,3],"Layer Cake":[4,2],"Flaring Phoenix":[11,7],"Open Business":[14,8],"Pinball Dreams":[29,21],"Hot Potato":[11,2],"Out in the Open":[3,2],"Bridge Too Far":[20,10],"Triple Dribble":[15,6],"Sneaky Fields":[16,11],"Hard Rock Mine":[11,3],"Belle's Rock":[10,10],"Double Swoosh":[6,2],"Think Ahead":[4,2],"New Horizons":[10,7],"Parallel Plays":[2,2],"Kaboom Canyon":[6,2],"Gem Fort":[4,4],"Beach Ball":[8,3],"Deathcap Trap":[5,5],"Center Stage":[8,4],"Dueling Beetles":[12,7],"Spiraling Out":[14,9],"Backyard Bowl":[32,27]};
const PARTITE_BRAWLER_MAPPA = {"BOLT|Undermine":[5,1],"WENDY|Undermine":[5,1],"WENDY|Shooting Star":[4,4],"NORI|Safe Zone":[3,1],"GRIFF|Shooting Star":[2,0],"WENDY|Hideout":[3,2],"WENDY|Dry Season":[7,5],"WENDY|Ring of Fire":[3,2],"WENDY|Layer Cake":[4,2],"PEARL|Flaring Phoenix":[5,3],"SHADE|Open Business":[2,2],"ASH|Pinball Dreams":[25,17],"NORI|Hot Potato":[3,2],"CARL|Dry Season":[5,4],"PEARL|Out in the Open":[3,2],"WENDY|Bridge Too Far":[5,4],"CARL|Hot Potato":[2,0],"ASH|Open Business":[2,2],"WENDY|Triple Dribble":[11,4],"NORI|Bridge Too Far":[5,2],"NITA|Sneaky Fields":[3,2],"RICO|Hard Rock Mine":[2,0],"CARL|Belle's Rock":[2,2],"NITA|Pinball Dreams":[2,2],"DAMIAN|Double Swoosh":[2,0],"PEARL|Think Ahead":[4,2],"BOLT|Dry Season":[3,1],"GRAY|New Horizons":[3,1],"SURGE|Parallel Plays":[2,2],"GRIFF|Kaboom Canyon":[2,2],"GRAY|Belle's Rock":[2,2],"OTIS|Bridge Too Far":[3,1],"WENDY|New Horizons":[2,2],"EMZ|Sneaky Fields":[4,2],"BOLT|Gem Fort":[2,2],"ASH|Sneaky Fields":[3,1],"EMZ|Beach Ball":[3,1],"DAMIAN|Triple Dribble":[2,0],"BOLT|Deathcap Trap":[5,5],"DAMIAN|Open Business":[2,0],"SURGE|Hard Rock Mine":[3,1],"CARL|Shooting Star":[3,2],"WENDY|Beach Ball":[5,2],"CARL|Bridge Too Far":[7,3],"GRIFF|Hot Potato":[2,0],"WENDY|Open Business":[2,2],"NITA|Center Stage":[3,1],"8-BIT|Shooting Star":[2,2],"WENDY|Center Stage":[5,3],"WENDY|Hard Rock Mine":[3,1],"WENDY|Sneaky Fields":[6,6],"WENDY|Hot Potato":[4,0],"LOU|Ring of Fire":[3,1],"WENDY|Kaboom Canyon":[4,0],"MEEPLE|Flaring Phoenix":[2,0],"WENDY|Pinball Dreams":[2,2],"GRIFF|Dueling Beetles":[6,3],"WENDY|Dueling Beetles":[2,2],"WENDY|Belle's Rock":[6,6],"STARR NOVA|Dueling Beetles":[2,2],"DAMIAN|Dueling Beetles":[2,0],"WENDY|Flaring Phoenix":[4,4],"GUS|Open Business":[3,1],"SHADE|New Horizons":[3,2],"SIRIUS|Triple Dribble":[2,2],"WENDY|Spiraling Out":[14,9],"GRIFF|Open Business":[3,1],"GRIFF|Double Swoosh":[2,0],"WENDY|Gem Fort":[2,2],"WENDY|Backyard Bowl":[28,23],"ASH|Backyard Bowl":[4,4],"DAMIAN|Hard Rock Mine":[3,1],"WENDY|Double Swoosh":[2,2],"PIERCE|Hideout":[3,1],"EMZ|Ring of Fire":[2,0],"MAX|New Horizons":[2,2],"PIPER|Shooting Star":[2,0]};
const PARTITE_RANKED = 310;
const PARTITE_RANKED_MEDIA = 59.0;

// La media complessiva di chi usa l'app, su tutte le partite registrate.
// Serve come riferimento: il dato personale entra nel punteggio come SCARTO
// da questa media, non come valore assoluto. Sommare la win rate personale
// grezza alzerebbe il livello di ogni brawler che ha giocato, che e' un
// doppio conteggio della sua bravura generale.
const PROFILO_MEDIA = 57.7;
const PROFILO_PARTITE = 317;
