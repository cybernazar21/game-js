document.addEventListener('DOMContentLoaded', () => {
    const desert = document.querySelector('#desert');
    const scoreDisplay = document.getElementById
    ('scoreValue');
    const bats = document.querySelector('.bats');
    const kitty = document.querySelector('.kitty');
    const grid = document.querySelector('.grid');
    const car = document.querySelector('.car');
    const car2 = document.querySelector('.car2');
    const car3 = document.querySelector('.car3');
    const bam = document.querySelector('.explosion');
    const alert = document.getElementById('alert');
    const info = document.getElementById('info');
    const jumpSound = new Audio('./sounds/press2.wav');
    const bamSound = new Audio('./sounds/explosion.mp3');
    const gameMusic2 = new Audio('./sounds/game-music2.mp3');
    const gameOverSound = new Audio('./sounds/game-over.mp3');
    const bonus1 = new Audio('./sounds/bonus1.wav');
    const bonus2 = new Audio('./sounds/bonus2.wav');
    let bonus1Played = false;
    let bonus2Played = false;
    let position = 0;
    let intervalTime = 20;
    let isJumping = false;
    let isGameOver = false;
    let score = 0;
    let scoreInterval;
    let obstacles = [];
    let fallSpeedNumber = 5;
    let timerId;
    // VITALY - the best name ever !
    function playGameMusic() {
        gameMusic2.volume = 0.6;
        gameMusic2.loop = true; // повторення музики
        gameMusic2.play()

    }
    function stopGameMusic() {
        gameMusic2.pause();
        gameMusic2.currentTime = 0;  // Скидаємо до початку
    }
    function playGameOverSound() {
        gameOverSound.volume = 0.4;
        gameOverSound.play();
    }

    function control(e) {
        if(e.keyCode === 38) {
            if(!isJumping) {
                jumpSound.play();
                jump();
            }

        }
        if (e.keyCode === 32 && isGameOver) { 
            restartGame();
        }
    }
    
    document.addEventListener('keyup', control);

    function createCar() {
        car.style.bottom = 0;
        grid.appendChild(car);
        car.style.display = 'block';
        car2.style.display = 'none';
        car3.style.display = 'none';
    }

    function createCar2() {
        car2.style.bottom = 0;
        grid.appendChild(car2);
        car.style.display = 'none';
        car2.style.display = 'block';
        car3.style.display = 'none';
    }

    function createCar3() {
        car3.style.bottom = 0;
        grid.appendChild(car3);
        car.style.display = 'none';
        car2.style.display = 'none';
        car3.style.display = 'block';
    }

    function jump() {
        isJumping = true;
        let jumpHeight = 20;
        let fallSpeed = fallSpeedNumber;
        let jumpSpeed = 18; // Плавне збільшення для стрибка
        let count = 0;

        function animateJump() {
            if (isGameOver) return;

            if (count < jumpHeight) {
                // Рух вгору
                position += jumpSpeed;
                count++;
            } else if (count >= jumpHeight && position > 0) {
                // Рух вниз
                position -= fallSpeed; 
                count++;
            } else {
                // Завершення анімації стрибка
                isJumping = false;
                return;
            }

            // Оновлення позиції машинки
            car.style.bottom = position + 'px';
            car2.style.bottom = position + 'px';
            car3.style.bottom = position + 'px';

            // Рекурсивний виклик для наступного кадру анімації
            requestAnimationFrame(animateJump);
        }

        // Запуск анімації
        requestAnimationFrame(animateJump);
    }


    function generateObstacles() {
        if(!isGameOver) {
            playGameMusic();
            let randomTime = Math.random() * 4000;
            let obstaclePosition = 1500;
            const obstacle = document.createElement('div');
            obstacle.classList.add('obstacle');
            grid.appendChild(obstacle);
            obstacles.push(obstacle);
            obstacle.style.left = obstaclePosition + 'px';
            checkScoreAndChangeCar();
            timerId = setInterval(() => {
                if(obstaclePosition > 0 &&obstaclePosition < 60 && position < 60) {
                    clearInterval(timerId);
                    alert.innerHTML = 'Game Over';
                    info.innerHTML = `Press "Space" to start again :)`;
                    isGameOver = true;
                    startExplosion();
                    stopGameMusic();
                    playGameOverSound();
                    clearInterval(scoreInterval);
                    removeAllObstacles();
                    // remove all children
                    // while(grid.firstChild) {
                    //     grid.removeChild(grid.lastChild)
                    // }
                }
    
                obstaclePosition -=10;
                obstacle.style.left = obstaclePosition + 'px';
                removeObstacleIfOffScreen(obstacle, obstaclePosition);
            }, intervalTime)
            setTimeout(generateObstacles, randomTime);

        }
  
    }

    function removeObstacleIfOffScreen(obstacle, position) {
        if(position < -300) {
            if(grid.contains(obstacle)){
                grid.removeChild(obstacle);
            }
            obstacles = obstacles.filter(item => item !== obstacle);
        }
    }

    function removeAllObstacles() {
        obstacles.forEach(obstacle => {
            if (grid.contains(obstacle)) {
                grid.removeChild(obstacle);
            }
        });

        obstacles = [];
    }

    function resetGame() {
        isGameOver = false;
        isJumping = false;
        position = 0;
        score = 0;
        intervalTime = 20;
        fallSpeedNumber = 5;
        desert.style.animationDuration = '600s';
        scoreDisplay.innerHTML = score;
        alert.innerHTML = '';
        info.innerHTML = '';
        bam.style.display = 'none';
        bats.style.display = 'none';
        createCar();
        startScoreCounter();
        // Можливо, інші параметри для скидання
    }
    
    function restartGame() {
        resetGame();
        generateObstacles();
        startScoreCounter();
    }

    function startScoreCounter() {
        clearInterval(scoreInterval);
        scoreInterval = setInterval(() => {
            if (!isGameOver) {
                score++;
                scoreDisplay.innerHTML = score;
                checkScoreAndChangeCar();
                renderingBats();
                renderingKitty();
            }
        }, 100);
    }

    function renderingBats() {
        if(score >= 213 && score <= 409) {
            bats.style.display = 'block';
        } else {
            bats.style.display = 'none';
        }
    }

    function renderingKitty() {
        if(score >= 550 && score <= 811) {
            kitty.style.display = 'block';
        } else {
            kitty.style.display = 'none';
        }
        
    }

    function playAudioOnce(audio) {
        audio.play();
        audio.volume = 0.4;
    
        audio.addEventListener('ended', function() {
            audio.currentTime = 0; // Повертає аудіо до початку після завершення
        }, { once: true }); // Виконати лише один раз
    }

    function checkScoreAndChangeCar() {

        if (score >= 300 && !bonus1Played) {
            createCar2();
            playAudioOnce(bonus1);
            bonus1Played = true;
        } if (score >= 500 && !bonus2Played) {
            createCar3();
            playAudioOnce(bonus2);
            bonus2Played = true;
        }
    }

    function startExplosion() {
        bamSound.play();
        bam.style.display = 'block';
        grid.appendChild(bam);

    }

    // Game start
    createCar();
    startScoreCounter();
    generateObstacles();
});