const battleBackgroundImage = new Image()
battleBackgroundImage.src = "./images/battleBackground.png"
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})
const draggleImage = new Image()
draggleImage.src = "./images/draggleSprite.png"

const draggle = new Sprite({
  position: {
    x: 800,
    y: 100
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: 50
  },
  animate: true,
  isEnemy: true,
  name: "Draggle"
})

const embyImage = new Image()
embyImage.src = "./images/embySprite.png"

const emby = new Sprite({
  position: {
    x: 280,
    y: 325
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: 50
  },
  animate: true,
  name: "Emby"
})

const renderSprites = [draggle, emby]

function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
  renderSprites.forEach((sprite) => {
    sprite.draw()
  })
}
// animatePlayer()
animateBattle()

const queue = []

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const selectedAttack = e.currentTarget.innerHTML
    if (selectedAttack === "") return

    emby.attack({
        attack: attacks[selectedAttack],
        recipient: draggle,
        renderSprites
      })
    
    queue.push(() => {
      draggle.attack({
        attack: attacks.Tackle,
        recipient: emby,
        renderSprites
      })
    })
  })
})

document.querySelector(".dialogueBox").addEventListener("click", (e) => {
    if(queue.length > 0) {
        queue[0]()
        queue.shift()
    } else {
        e.currentTarget.style.display = "none"
    }
})
