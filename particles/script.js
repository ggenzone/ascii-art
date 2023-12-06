const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

let adjustX = 10
let adjustY = 0
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particlesArray = []

const mouse = {
    x: null,
    y: null,
    radius: 250
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x
    mouse.y = event.y
})

ctx.font = '30px Verdana'
ctx.fillStyle = 'white'
ctx.fillText('Labs', 0, 40) 
//ctx.strokeStyle = 'white'
//ctx.strokeRect(0,0,80,80)
const textCoordinates = ctx.getImageData(0,0,100,100)


class Particle {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = 3
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 40) + 5
    }

    draw() {
        ctx.fillStyle = 'yellow'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
    }

    update() {
        let dx = mouse.x - this.x 
        let dy = mouse.y - this.y 
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forceDirectionX = dx / distance
        let forceDirectionY = dy / distance
        let maxDistance = mouse.radius
        let force = (maxDistance - distance) / maxDistance
        let directionX = forceDirectionX * force * this.density
        let directionY = forceDirectionY * force * this.density
        if (distance < mouse.radius) {
            this.x -= directionX
            this.y -= directionY
            // this.size = 30
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX
                this.x -= dx/10
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY
                this.y -= dy/10
            }
        }
    }
}

function init() {
    particlesArray = []

    for (let y = 0, y2 = textCoordinates.height; y < y2; y++ ) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++ ) {
            if (textCoordinates.data[(4*y*textCoordinates.width)+ 4*x + 3] > 128) {
                let positionX = x + adjustX
                let positionY = y + adjustY
                particlesArray.push(new Particle(positionX * 10, positionY * 10))
            }
        }
    }

    /*
    for(let i = 0; i < 1000; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particlesArray.push(new Particle(x,y))

    }*/
}

init()

function animate () {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw()
        particlesArray[i].update()
    }
    connect()
    requestAnimationFrame(animate)
}

animate()


function connect() {
    let opacityValue = 1
    for (let a=0; a< particlesArray.length; a++) {
        for (let b=a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x
            let dy = particlesArray[a].y - particlesArray[b].y
            let distance = Math.sqrt(dx * dx + dy * dy)

           if (distance < 30) {
                opacityValue = 1 - (distance/30)
                ctx.strokeStyle = `rgba(255,255,255,${opacityValue})`
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
                ctx.stroke()
           }
        }
    }
}

