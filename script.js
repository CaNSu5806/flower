const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message');

// --- Animasyon Ayarları ---
let animationState = 'GROWTH'; // GROWTH, FADING, MESSAGE
const MAX_FLOWERS = 100;
const GROWTH_TIME = 8; // 8 saniye büyüme
const FADING_TIME = 6; // 6 saniye sönme süresi
let startTime = Date.now();
let growthEndTime = 0;


// Canvas boyutlarını ayarlama ve yeniden boyutlandırma
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeFlowers(false); 
}
window.addEventListener('resize', resizeCanvas);


// Çiçek sınıfı
class Flower {
    constructor() {
        // Çiçeklerin her yerden çıkması için başlangıç X ve Y rastgele belirleniyor.
        this.baseX = Math.random() * canvas.width;
        this.x = this.baseX;
        
        // Rastgele bir noktada başlasın
        this.startY = Math.random() * canvas.height;
        this.y = this.startY;

        this.targetScale = 0.7; // Ulaşacağı son büyüklük
        this.scale = 0; // Başlangıçta minik
        
        // Renkler: kırmızı, sarı, lacivert (navy), mor, mavi (blue)
        this.colors = ['#ff4757', '#ffa502', '#000080', '#8e44ad', '#1e90ff'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        this.size = 0.5 + Math.random() * 0.4; 
        this.maxScale = 0.7; 
        this.age = 0;
        this.windOffset = Math.random() * Math.PI * 2;
        this.alpha = 1; 
        
        // Kopup dağılma için rastgele hızlar
        this.driftX = (Math.random() - 0.5) * 2; 
        this.driftY = (Math.random() - 0.5) * 2; 
    }

    draw() {
        // Sallanma/Rüzgar Efekti
        let windFactor = Math.sin((Date.now() / 1000) * 0.5 + this.windOffset) * 0.5;
        let rotation = Math.sin((Date.now() / 1000) * 2 + this.windOffset) * 0.1;

        let topX = this.x + windFactor * 10;
        let topY = this.y;

        ctx.save();
        ctx.translate(topX, topY);
        ctx.rotate(rotation);
        
        ctx.globalAlpha = this.alpha; 

        let radius = 10 * this.size; 
        let petals = 6;

        // Büyüme aşamasında sap çizimini atlıyoruz, çünkü her yerden çıkıyor
        
        // Taç Yapraklar
        for (let i = 0; i < petals; i++) {
            let angle = (i * 2 * Math.PI) / petals;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = 'white';
            ctx.ellipse(
                Math.cos(angle) * radius * this.scale,
                Math.sin(angle) * radius * this.scale,
                radius * this.scale,
                radius / 2 * this.scale,
                angle,
                0,
                2 * Math.PI
            );
            ctx.fill();
            ctx.stroke();
        }

        // Merkez
        ctx.beginPath();
        ctx.arc(0, 0, 5 * this.size * this.scale, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        ctx.globalAlpha = 1; 
    }

    update(deltaTime) {
        this.age += deltaTime;

        if (animationState === 'GROWTH') {
            const progress = Math.min(1, this.age / (GROWTH_TIME * 1000));
            // Çiçekler yavaşça büyür
            this.scale = progress * this.maxScale;
            
        } else if (animationState === 'FADING') {
            const progress = Math.min(1, (this.age - (growthEndTime)) / (FADING_TIME * 1000));
            
            // Kopma ve Dağılma Hareketi
            this.x += this.driftX;
            this.y += this.driftY;
            this.driftX *= 0.99; // Yatayda yavaşla
            this.driftY += 0.05; // Yerçekimi etkisi (hafifçe aşağı in)

            // Yıldız gibi sönme (küçülme ve şeffaflaşma)
            this.scale = this.maxScale * (1 - progress); 
            this.alpha = 1 - progress;

        } else if (animationState === 'MESSAGE') {
            this.scale = 0; 
            this.alpha = 0;
        }

        if (this.scale > 0.01) {
            this.draw();
        }
    }
}

let flowers = [];

// Çiçekleri başlangıç konumlarına yerleştir
function initializeFlowers(resetAge = true) {
    if (flowers.length === MAX_FLOWERS && !resetAge) {
        // Yeniden boyutlandırmada sadece pozisyonları ayarla
        flowers.forEach(flower => {
            flower.baseX = Math.random() * canvas.width;
            flower.startY = Math.random() * canvas.height;
        });
        return;
    }
    
    // Yeni çiçekler oluştur
    flowers = [];
    for (let i = 0; i < MAX_FLOWERS; i++) {
        flowers.push(new Flower());
    }
}

// Arka planda silik MEDİNE yazısını çizen fonksiyon
function drawBackgroundText(){
    ctx.font = 'bold 150px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; // Çok silik beyaz
    ctx.textAlign = 'center';
    // Ekranın ortasına yerleştiriyoruz
    ctx.fillText('MEDİNE', canvas.width/2, canvas.height/2 + 20); 
}

// Animasyon döngüsü
let lastTime = 0;
function animate(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elapsedTime = Date.now() - startTime;

    // Arka plan yazısını çiz (Mesaj görünene kadar)
    if (animationState !== 'MESSAGE') {
        drawBackgroundText();
    }

    // Aşamalar arası geçiş
    if (animationState === 'GROWTH' && elapsedTime > GROWTH_TIME * 1000) {
        animationState = 'FADING';
        growthEndTime = elapsedTime;
    } else if (animationState === 'FADING' && (elapsedTime - growthEndTime) > FADING_TIME * 1000) {
        animationState = 'MESSAGE';
        // Mesajı göster
        messageDiv.classList.add('visible'); 
    }

    // Çiçekleri güncelle
    for (let flower of flowers) {
        flower.update(deltaTime);
    }

    requestAnimationFrame(animate);
}

// --- Başlangıç ---
resizeCanvas(); // Canvas boyutlarını ayarla
initializeFlowers(true);
animate(0);
