var professional, esoteric, comedic;

professional = [
  "software",
  "justice",
  "entrepreneurship",
  "ai",
  "code",
  "ink",
  "hacks"
];

esoteric = [
  "<a href='https://en.wikipedia.org/wiki/Antifragility' target='_blank'>antifragility</a>",
  "blockchains",
  "<a href='https://en.wikipedia.org/wiki/Bokononism' target='_blank'>bokononism</a>",
  "<a href='https://gist.github.com/phrazzld/e50393d03c68fda6472b7fdb8df7d5ff' target='_blank'>neural nets</a>",
  "genetic algorithms",
  "refactoring legacy code",
  "growth hacking",
  "red teaming",
  "vim",
  "<a href='https://stallman.org/stallman-computing.html' target='_blank'>richard stallman</a>"
];

misc = [
  "peanut butter",
  "stranger things",
  "the singularity",
  "bojack horseman",
  "emma goldman",
  "<a href='http://moglen.law.columbia.edu/publications/anarchism.html' target='_blank'>market anarchism</a>",
  "<a href='https://en.wikipedia.org/wiki/List_of_A_Song_of_Ice_and_Fire_characters#House_Targaryen' target='_blank'>fire and blood</a>",
  "<a href='https://phrazzld.github.io/quotemachine/' target='_blank'>quotes</a>"
];

var p = professional[Math.floor(Math.random()*professional.length)];
var e = esoteric[Math.floor(Math.random()*esoteric.length)];
var m = misc[Math.floor(Math.random()*misc.length)];
var safety = Math.floor(Math.random()*1000);
var zinger = document.getElementById("zinger");

if (safety == 420) {
  zinger.innerHTML = "<a href='https://www.youtube.com/watch?v=r1-r6sXeiNY' target='_blank'>safety first, then teamwork.</a>";
} else if (safety < 500 && safety > 400) {
  zinger.innerHTML = "safety first, then teamwork.";
} else {
  /*
  document.getElementById("esoteric").innerHTML = e;
  document.getElementById("misc").innerHTML = m;
  */
}
