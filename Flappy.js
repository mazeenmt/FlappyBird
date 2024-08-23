let field = document.querySelector(".field")
let scoreHTML = document.querySelector(".score")
let resetButton = document.querySelector(".reset")
let listObs = []
let time = 0
let player = {
    playerHTMl: document.querySelector(".player"),
    x: 150,
    y: 250,
    width: 75,
    height: 35,
    jumpingTime: 0,
    lose: false,
    score: 0,
    icons: (frame)=>`./img/player${frame}.png`,
    frame: 0
}
function randint(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
}

//Event Listeners
//Jump
document.addEventListener("keydown", function(e){
    if (e.key === " " && player.y >= 0){
        player.jumpingTime = 0
    }
    if (e.key === " " && player.lose) reset()
})
//Reset
resetButton.addEventListener("click", reset())
function reset(){
    player.lose = false
    player.jumpingTime = 0
    player.score = 0
    scoreHTML.textContent = 0
    player.x = 150
    player.y = 250
    resetButton.style.display = 'none'
    field.style.opacity = 1
    listObs.forEach(function(obs){
        listObs = removeItem(listObs, obs)
        obs[0].remove()
    })
}
//1)Create one obstacle
function createObs(x, y, height, pos){
    coords = {
        x: x,
        y: y,
        height: height,
        width: 50
    }
    document.createElement("div")
    let firstElement = document.createElement("div")
    let secondElement = document.createElement("div")
    firstElement.style.cssText = `position: absolute; left: ${x}px; top: ${y}px; height: ${height}px; width: ${50}px; background-color: #333;`
    secondElement.style.cssText = `position: relative; left: ${-8}px; top: ${pos?0:height-42}px; height: ${45}px; width: ${65}px; background-color: blue; z-index: 3; border-radius: 5px;`
    field.appendChild(firstElement)
    firstElement.appendChild(secondElement)
    return [firstElement, coords]
}

//Collision of the player with the obstacles
function isCollid(player, obstacle){
    return !(
        ((player.y + player.height -10) < (obstacle.y)) ||
        (player.y > (obstacle.y + obstacle.height)) ||
        ((player.x + player.width -10) < obstacle.x) ||
        (player.x > (obstacle.x + obstacle.width))
    );
}

//2)Make two obstacles, one on top and one on bottom
function combineObs(x, y, depth){ 
    let emptySpace = 250 //Space between the top and the bottom obstacle
    let fieldHeight = window.getComputedStyle(field).height //We can't use field.style because it's defined in an external css file
    fieldHeight = parseInt(fieldHeight.substring(0,fieldHeight.length-2)) //To remove 'px'
    listObs.push(createObs(x, y, fieldHeight-depth-emptySpace , false))
    listObs.push(createObs(x, fieldHeight-depth, depth ,true))
}

//4)Remove the obstacles that are off-screen from the obstacles list (or the list will have a massive length)
function removeItem(list, item){
    let newList=[]
    list.forEach(function(e){
        if (e!==item){
            newList.push(e)
        }
    })
    return newList
}

//Player Jump
function jump(){
    player.playerHTMl.style.cssText = `top: ${player.y}px;`
    if(!player.lose){
        player.jumpingTime += 0.1
        player.y += 4 * player.jumpingTime - 11 // vitesse = accélération(gravity) * temps + vitesseInitiale
    }
}

//Updates the screen every 15ms
function update(){
    jump()
    listObs.forEach(function(obs){
        //3)Moving the obstacles to the left
        obs[0].style.left = `${obs[1].x}px`
        obs[1].x -= !player.lose * 5   
        if (obs[1].x <= -50){
            listObs = removeItem(listObs, obs)
            obs[0].remove()
        }
        //Collision
        if (isCollid(obs[1], player)){
            player.lose = true
        }
        //Score
        if(player.x === obs[1].x && !player.lose){
            player.score += 0.5
            scoreHTML.textContent = Math.round(player.score)
        }
        //Reset
        if(player.lose){
            resetButton.style.display = 'flex'
            field.style.opacity = 0.5
        }
    })
    //Display a combined obstacle whenever time reaches 75
    if(!player.lose)
        time += 1
    if (time >= 70) {
        combineObs(1000, 0, randint(50, 300))
        time = 0
    }
    if (player.y > 700) player.lose = true
    //Animation
    player.playerHTMl.src = `${player.icons(player.frame)}`
    /*if (player.frame < 8) player.frame += 1
    else player.frame = 0*/
    
}
setInterval(update, 15)