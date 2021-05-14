var dog,happyDog,hungryDog,database;
var foodS,foodStockRef;
var frameCountNow = 0;
var fedTime,lastFed,foodObject,currentTime;
var milk,input,name;
var gameState = "hungry";
var gameStateRef;
var bedRoomImg,gardenImg,washroomImg,sleepImg,runImg,livingRoomImg;
var feed,addFood;

function preload(){
hungryDog = loadImage("images/dogImg1.png")
happyDog = loadImage("images/dogImg.png")
bedRoomImg = loadImage("images/Bed Room.png")
gardenImg = loadImage("images/Garden.png")
washroomImg = loadImage("images/Wash Room.png")
sleepImg = loadImage("images/Lazy.png")
runImg = loadImage("images/running.png")
livingRoomImg = loadImage("images/Living Room.png")
}

function setup(){
  createCanvas(1000,500)
  database = firebase.database();

foodObject = new Food();

dog = createSprite(width/2+250,height/2,10,10)
dog.addAnimation("hungry",hungryDog)
dog.addAnimation("happy",happyDog)
dog.addAnimation("sleeping",sleepImg)
dog.addAnimation("run",runImg)
dog.scale = 0.3;

getGameState();

feed = createButton("FEED THE PET")
feed.position(950,95)
feed.mousePressed(feedDog);

addFood = createButton("ADD FOOD")
addFood.position(1050,95)
addFood.mousePressed(addFoods)

}

function draw () {
  currentTime = hour();
  if(currentTime === lastFed+1){
    gameState = "playing"
    updateGameState();
    foodObject.garden();
  }

else if(currentTime === lastFed+2){
gameState = "sleeping"
updateGameState();
foodObject.bedroom();
}

else if(currentTime> lastFed +2 && currentTime<=lastFed + 4){
  gameState = "bathing"
  updateGameState();
foodObject.washroom();
}

else {
gameState = "hungry"
updateGameState();
foodObject.display();
}

foodObject.getFoodStock();
getGameState();

fedTime = database.ref('FeedTime')
fedTime.on("value",function(data){
  lastFed = data.val();
})

if(gameState === "hungry"){
  feed.show();
  addFood.show();
  dog.addAnimation("hungry",hungryDog)
}
else{
  feed.hide();
  addFood.hide();
  dog.remove();
}

drawSprites();

textSize(32);
fill("red")
textSize(20);
text("LAST FED: ",lastFed+":00",300,95)
text("TIME SINCE LAST FED: "+(currentTime = lastFed),300,125)
}


function feedDog(){
  foodObject.deductFood();
  foodObject.updateFoodStock();
  dog.changeAnimation("happy",happyDog)
  gameState = "happy"
  updateGameState();
}

function addFoods(){
  foodObject.addFood();
  foodObject.updateFoodStock();
}

async function hour(){
  var site = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
  var siteJSON = await site.json();
var datetime = siteJSON.datetime;
var hourTime = datetime.slice(11,14)
return hourTime;

}


function createName(){
input.hide();
button.hide();
name = input.value();
var greeting = createElement('h2')
greeting.html("YOUR PET'S NAME :"+ name)
greeting.position(width/2+850,height/2+200)
}


function getGameState (){
gameStateRef = database.ref('gameState');
gameStateRef.on("value",function(data){
  gameState = data.val();
});
};


function updateGameState(){
  database.ref('/').update({
    gameState:gameState
  })
}















  

 