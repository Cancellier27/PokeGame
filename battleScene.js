const battleBackgroundImage = new Image()
battleBackgroundImage.src = "./images/battleBackground.png"
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

const draggle = new Monster(monstersData.Draggle)
const emby = new Monster(monstersData.Emby)

const renderSprites = [draggle, emby]
const button = document.createElement('button')
button.innerHTML = 'Fireball'
document.querySelector('.attackOptions').append(button)

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
