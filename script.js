const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Arka planda MEDİNE yazısı
function drawBackgroundText(){
    ctx.font = '150px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.textAlign = 'center';
    ctx.fillText('MEDİNE', canvas.width/2, canvas.height/3);
    ctx.fillText('MEDİNE', canvas.width/2, 2*canvas.height/3);
}

// Çiçek sınıfı
class Flower {
    constructor(x, y, color, size=1, rotationSpeed=0.0003){
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.rotation = Math.random() * Math.PI*2;
        this.rotationSpeed = rotationSpeed;
        this.scale = 0; 
        this.maxScale = 0.8 + Math.random()*0.5;
    }

    draw(){
        let topY = this.y;
        let petals = 5 + Math.floor(Math.random()*3);
        let radius = 15*this.size;

        ctx.save();
        ctx.translate(this.x, topY);
        ctx.rotate(this.rotation);
        for(let i=0;i<petals;i++){
            let angle = (i*2*Math.PI)/petals + Math.random()*0.5;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = 'white';
            ctx.ellipse(
                Math.cos(angle)*radius*this.scale,
                Math.sin(angle)*radius*this.scale,
                radius*this.scale,
                radius/2*this.scale,
                angle,
                0,
                2*Math.PI
            );
            ctx.fill();
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0,0, 8*this.size*this.scale,0,2*Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    update(){
        if(this.scale < this.maxScale){
            this.scale += 0.003;
        }
        this.rotation += this.rotationSpeed;
        this.draw();
    }
}

let flowers = [];
const MAX_FLOWERS = 120; // daha fazla çiçek

function spawnFlower(){
    // renk seçenekleri: kırmızı daha sık
    let colors = ['red','red','red','blue','green','purple','yellow','navy'];
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let color = colors[Math.floor(Math.random()*colors.length)];
    let size = 0.8 + Math.random()*0.7;
    let rotationSpeed = (Math.random()*0.0006 - 0.0003);
    flowers.push(new Flower(x,y,color,size,rotationSpeed));
}

let showMessage = false;

// Animasyon
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBackgroundText();

    if(flowers.length < MAX_FLOWERS){
        spawnFlower();
    }

    let allGrown = true;
    for(let flower of flowers){
        flower.update();
        if(flower.scale < flower.maxScale) allGrown = false;
    }

    if(allGrown) showMessage = true;

    if(showMessage){
        ctx.font = '60px Arial';
        ctx.fillStyle = 'pink';
        ctx.textAlign = 'center';
        ctx.fillText('Seni Seviyorum Canım Arkadaşım', canvas.width/2, canvas.height/2);
    }

    requestAnimationFrame(animate);
}

animate();
