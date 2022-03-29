class Sprite {
  constructor({
    position,
    velocity = 2,
    image,
    frames = {max: 1, hold: 20},
    sprites,
    animate = false,
    isEnemy = false,
    rotation = 0
  }) {
    this.position = position
    this.image = image
    this.velocity = velocity
    this.frames = {...frames, val: 0, elapse: 0}

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
    this.health = 100
    this.isEnemy = isEnemy
    this.rotation = rotation
  }

  draw() {
    c.save()
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )
    c.rotate(this.rotation)
    c.translate(
        -this.position.x - this.width / 2,
        -this.position.y - this.height / 2
      )
    c.globalAlpha = this.opacity
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
    c.restore()

    if (!this.animate) return

    if (this.frames.max > 1) {
      this.frames.elapse++
    }

    if (this.frames.elapse % this.frames.hold == 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }

  attack({attack, recipient, renderSprites}) {
    let healthBar = ".enemyHp"
    if (this.isEnemy) healthBar = ".ourHp"

    this.health -= attack.damage

    switch (attack.name) {
      case "Fireball":
        const fireballImage = new Image()
        fireballImage.src = "./images/fireball.png"
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10
          },
          animate: true,
          rotation: 1
        })

        renderSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          duration: 0.7,
          onComplete: () => {
            gsap.to(healthBar, {
              width: this.health + "%"
            })
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            })
            gsap.to(recipient, {
              opacity: 0,
              yoyo: true,
              repeat: 5,
              duration: 0.2
            })
            renderSprites.splice(1, 1)
          }
        })

        break

      case "Tackle":
        const tl = gsap.timeline()
        let movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        tl.to(this.position, {
          x: this.position.x - movementDistance
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              gsap.to(healthBar, {
                width: this.health + "%"
              })
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08
              })
              gsap.to(recipient, {
                opacity: 0,
                yoyo: true,
                repeat: 5,
                duration: 0.2
              })
            }
          })
          .to(this.position, {
            x: this.position.x
          })
        break
    }
  }
}

class Boundary {
  static width = 48
  static height = 48

  constructor({position}) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.5)"
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
