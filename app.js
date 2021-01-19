const canvase = document.querySelector("canvas")
const ctx = canvase.getContext("2d")
const idScope = document.getElementById("scope");
const modal = document.getElementById("modal");
const textScope = document.getElementById("textScope");
const btnstart = document.getElementById("start");


canvase.width = innerWidth;
canvase.height = innerHeight;



class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, veloctiy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.veloctiy = veloctiy;
    }

    draw() {
        // console.log("active : " , active)
        // if (this.active) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        // }
    }

    update() {
        this.draw()
        this.x = this.x + this.veloctiy.x;
        this.y = this.y + this.veloctiy.y;
    }
}


class Enemays {
    constructor(x, y, radius, color, veloctiy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.veloctiy = veloctiy;
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw()
        this.x = this.x + this.veloctiy.x;
        this.y = this.y + this.veloctiy.y;
    }
}

class Particle {
    constructor(x, y, radius, color, veloctiy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.veloctiy = veloctiy;
        this.alpha = 1;
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.draw()
        this.x = this.x + this.veloctiy.x;
        this.y = this.y + this.veloctiy.y;
        this.alpha -= 0.01;
    }
}

const x = canvase.width / 2;
const y = canvase.height / 2;

const player = new Player(x, y, 30, "white"); // create player

let projectiles = [];
let allEnemays = [];
let particles = [];

let animationId;
let scope = 0
let = start = false;

function init() {
    projectiles = [];
    allEnemays = [];
    particles = [];
    scope = 0
    idScope.innerText = scope
}

function SpawnEnemays() {
    setInterval(() => {
        let x;
        let y;
        const radius = Math.random() * (40 - 10) + 10;
        const color = `hsl(${Math.floor(Math.random()*360)}deg 100% 50%)`;
        if (Math.random < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvase.width;
            y = Math.random() * canvase.height;
        } else {
            x = Math.random() * canvase.width;
            y = Math.random() < 0.5 ? 0 - radius : canvase.height;
        }
        const angle = Math.atan2(canvase.height / 2 - y, canvase.width / 2 - x);

        const veloctiy = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };

        allEnemays.push(new Enemays(x, y, radius, color, veloctiy))
    }, 500);
}

function animation() {
    animationId = requestAnimationFrame(animation)
        // const backgroundImage = new Image()
        // backgroundImage.src = "./pic/background.jpg";
        // ctx.drawImage(backgroundImage, 0, 0);
    ctx.fillStyle = "rgb(0 0 0 / 10%)"
    ctx.fillRect(0, 0, canvase.width, canvase.height)
    player.draw()

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update()
        }
    })

    projectiles.forEach((project, index) => {
        project.update()
        if (
            project.x - project.radius < 0 || project.x + project.radius >= canvase.width ||
            project.y - project.radius < 0 || project.y + project.radius >= canvase.height
        ) {
            projectiles.splice(index, 1)
        }
    })

    allEnemays.forEach((enemay, index_enemay) => {
        enemay.update();

        const dist = Math.hypot(player.x - enemay.x, player.y - enemay.y)
        if (dist - enemay.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            modal.style.display = "block";
            textScope.innerText = scope
        }
        projectiles.forEach((pro, index_pro) => {
            const dist = Math.hypot(pro.x - enemay.x, pro.y - enemay.y)
            if (dist - enemay.radius - pro.radius < 1) {
                for (let i = 0; i < 8; i++) {
                    const veloctiy = {
                        x: (Math.random() - 0.5) * (Math.random() * 6),
                        y: (Math.random() - 0.5) * (Math.random() * 6)
                    }
                    particles.push(new Particle(pro.x, pro.y, 3, enemay.color, veloctiy))
                }
                if (enemay.radius > 20) {
                    enemay.radius -= 10;
                    // setTimeout(() => {
                    projectiles.splice(index_pro, 1);
                    // }, 0)
                } else {
                    setTimeout(() => {
                        allEnemays.splice(index_enemay, 1);
                        projectiles.splice(index_pro, 1);
                        scope += 100;
                        idScope.innerText = scope
                    }, 0)
                }

            }
        })
    })
}


addEventListener("click", (e) => {
    if (start) {
        const angle = Math.atan2(e.clientY - canvase.height / 2, e.clientX - canvase.width / 2)
        const xa = Math.cos(angle) * 10;
        const ya = Math.sin(angle) * 10;
        projectiles.push(new Projectile(x, y, 10, "white", { x: xa, y: ya }))
    }

})

btnstart.addEventListener("click", (e) => {
    e.preventDefault();
    start = true;
    modal.style.display = "none";
    init();
    animation()
    SpawnEnemays();
})