document.addEventListener('DOMContentLoaded', function() {
    const regButton = document.querySelector('.RegButton');
    const regInputField = document.querySelector('.regInputField');
    const homeIconButton = document.querySelector('.goHome');
    const charIconButton = document.querySelector('.goChar');
    const sittingsIconButton = document.querySelector('.goSettings');
    const saveButton = document.querySelector('.save-button');
    const textFieldInput = document.querySelector('.text-field-input');
    const charAvatarContainer = document.querySelector('.char-avatar');
    const fightButton = document.querySelector('.fight-button');
    const charAvatarImg = document.querySelector('.char-container img');
    const charName = document.querySelector('.char-name');
    const winsElement = document.querySelector('.char-data-wins');
    const losesElement = document.querySelector('.char-data-loses');
    const charProgress = document.querySelector('.char-progress');
    const charHealth = document.querySelector('.char-health');
    const enemyName = document.querySelector('.enemy-name');
    const enemyAvatarImg = document.querySelector('.enemyAvatarImg');
    const enemyProgress = document.querySelector('.enemy-progress');
    const enemyHealth = document.querySelector('.enemy-health');
    const attackButton = document.querySelector('.ButtonContainer');
    const attackRadios = document.querySelectorAll('.atack-zones .radio-input');
    const defenceRadios = document.querySelectorAll('.defence .radio-input');

    let wins = parseInt(localStorage.getItem('wins')) || 0;
    let loses = parseInt(localStorage.getItem('loses')) || 0;

    function updateScoreDisplay() {
        if (winsElement) winsElement.textContent = `Wins: ${wins}`;
        if (losesElement) losesElement.textContent = `Loses: ${loses}`;
    }

    function saveScore() {
        localStorage.setItem('wins', wins);
        localStorage.setItem('loses', loses);
    }

    function addWin() {
        wins++;
        saveScore();
        updateScoreDisplay();
    }

    function addLose() {
        loses++;
        saveScore();
        updateScoreDisplay();
    }
    
    if (regButton && regInputField) {
        regButton.addEventListener('click', function() {
            const fighterName = regInputField.value.trim();
            if (fighterName) {
                localStorage.setItem('fighterName', fighterName);
                alert(`Имя "${fighterName}" успешно сохранено!`);
                regInputField.value = '';
                window.location.href = 'home.html';
            } else {
                alert('Пожалуйста, введите имя бойца!');
            }
        });
    }

    if (homeIconButton) {
        homeIconButton.addEventListener('click', function(){
            window.location.href = 'home.html';
        });
    }

    if (charIconButton) {
        charIconButton.addEventListener('click', function(){
            window.location.href = 'character.html';
        });
    }

    if (sittingsIconButton) {
        sittingsIconButton.addEventListener('click', function(){
            window.location.href = 'settings.html';
        });
    }

    if (fightButton) {
        fightButton.addEventListener('click', function(){
            window.location.href = 'battle.html';
        });
    }

    if (saveButton && textFieldInput) {
        const currentName = localStorage.getItem('fighterName');
        if (currentName) {
            textFieldInput.value = currentName;
            textFieldInput.placeholder = `Текущее имя: ${currentName}`;
        }
        
        saveButton.addEventListener('click', function() {
            const newName = textFieldInput.value.trim();
            
            if (newName) {
                localStorage.setItem('fighterName', newName);
                alert(`Имя успешно изменено на "${newName}"!`);
                textFieldInput.value = '';
                textFieldInput.placeholder = newName;
                
                if (charName) {
                    charName.textContent = newName;
                }
            } else {
                alert('Пожалуйста, введите новое имя!');
                textFieldInput.focus();
            }
        });
    }

    if (charAvatarContainer) {
        const avatarImages = charAvatarContainer.querySelectorAll('img');
        const savedAvatar = localStorage.getItem('selectedAvatar');
        
        function selectAvatar(selectedImg) {
            avatarImages.forEach(img => img.classList.remove('selected'));
            selectedImg.classList.add('selected');
            
            localStorage.setItem('selectedAvatar', selectedImg.getAttribute('src'));
            localStorage.setItem('selectedAvatarName', selectedImg.getAttribute('alt'));
        }
        
        avatarImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                selectAvatar(this);
            });
        });

        if (savedAvatar) {
            avatarImages.forEach(img => {
                if (img.getAttribute('src') === savedAvatar) {
                    img.classList.add('selected');
                }
            });
        }
    }

    if (charName) {
        const currentName = localStorage.getItem('fighterName');
        charName.textContent = currentName || 'Безымянный воин';
    }

    if (charAvatarImg) {
        const savedAvatar = localStorage.getItem('selectedAvatar');
        if (savedAvatar) {
            charAvatarImg.src = savedAvatar;
        }
    }

    updateScoreDisplay();

    if (attackButton && charProgress && enemyProgress) {
        const player = {
            name: localStorage.getItem('fighterName') || 'Боец',
            maxHealth: 150,
            currentHealth: 150,
            damage: 20,
            critChance: 0.2,
            critMultiplier: 1.5,
            getHealthPercent: function() {
                return (this.currentHealth / this.maxHealth) * 100;
            }
        };

        const enemies = [
            {
                name: "SubZero",
                avatar: "assets/img/enemy1.jpg",
                maxHealth: 120,
                currentHealth: 120,
                damage: 18,
                attackZones: 1,
                defenceZones: 2,
                critChance: 0.15,
                critMultiplier: 1.4,
                getHealthPercent: function() {
                    return (this.currentHealth / this.maxHealth) * 100;
                }
            },
            {
                name: "Spider",
                avatar: "assets/img/enemy2.jpg", 
                maxHealth: 100,
                currentHealth: 100,
                damage: 15,
                attackZones: 2,
                defenceZones: 1,
                critChance: 0.25,
                critMultiplier: 1.6,
                getHealthPercent: function() {
                    return (this.currentHealth / this.maxHealth) * 100;
                }
            },
            {
                name: "Troll",
                avatar: "assets/img/enemy3.jpg",
                maxHealth: 200,
                currentHealth: 200,
                damage: 25,
                attackZones: 1,
                defenceZones: 3,
                critChance: 0.1,
                critMultiplier: 1.8,
                getHealthPercent: function() {
                    return (this.currentHealth / this.maxHealth) * 100;
                }
            }
        ];

        let currentEnemyIndex = 0;
        let currentEnemy = {...enemies[currentEnemyIndex]};

        function initGame() {
            updateHealthDisplay();
            updateEnemyHealthDisplay();
            
            if (enemyName) enemyName.textContent = currentEnemy.name;
            if (enemyAvatarImg) enemyAvatarImg.src = currentEnemy.avatar;
            
            initRadioButtons();
        }

        function initRadioButtons() {
            attackRadios.forEach(radio => radio.checked = false);
            defenceRadios.forEach(radio => radio.checked = false);

            attackRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        attackRadios.forEach(r => {
                            if (r !== this) r.checked = false;
                        });
                    }
                    updateAttackButton();
                });
            });

            defenceRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const selectedDefence = document.querySelectorAll('.defence .radio-input:checked');
                    if (selectedDefence.length > 2) {
                        this.checked = false;
                    }
                    updateAttackButton();
                });
            });

            updateAttackButton();
        }

        function updateAttackButton() {
            const selectedAttack = document.querySelectorAll('.atack-zones .radio-input:checked');
            const selectedDefence = document.querySelectorAll('.defence .radio-input:checked');
            
            if (selectedAttack.length === 1 && selectedDefence.length === 2) {
                attackButton.disabled = false;
                attackButton.style.opacity = '1';
                attackButton.style.cursor = 'pointer';
            } else {
                attackButton.disabled = true;
                attackButton.style.opacity = '0.5';
                attackButton.style.cursor = 'not-allowed';
            }
        }

        function updateHealthDisplay() {
            if (charProgress && charHealth) {
                charProgress.value = player.currentHealth;
                charProgress.max = player.maxHealth;
                charHealth.textContent = `${player.currentHealth}/${player.maxHealth}`;
                
                if (player.getHealthPercent() < 25) {
                    charProgress.style.accentColor = '#ff4444';
                } else if (player.getHealthPercent() < 50) {
                    charProgress.style.accentColor = '#ffaa00';
                } else {
                    charProgress.style.accentColor = '#4CAF50';
                }
            }
        }

        function updateEnemyHealthDisplay() {
            if (enemyProgress && enemyHealth) {
                enemyProgress.value = currentEnemy.currentHealth;
                enemyProgress.max = currentEnemy.maxHealth;
                enemyHealth.textContent = `${currentEnemy.currentHealth}/${currentEnemy.maxHealth}`;
                
                if (currentEnemy.getHealthPercent() < 25) {
                    enemyProgress.style.accentColor = '#ff4444';
                } else if (currentEnemy.getHealthPercent() < 50) {
                    enemyProgress.style.accentColor = '#ffaa00';
                } else {
                    enemyProgress.style.accentColor = '#F44336';
                }
            }
        }

        attackButton.addEventListener('click', function() {
            if (attackButton.disabled) return;
            
            const playerAttackZone = getSelectedZone(attackRadios);
            const playerDefenceZones = getSelectedZones(defenceRadios);
            
            const enemyAttackZones = getRandomZones(currentEnemy.attackZones);
            const enemyDefenceZones = getRandomZones(currentEnemy.defenceZones);
            
            const playerDamage = calculateDamage(player, playerAttackZone, enemyDefenceZones);
            const enemyDamage = calculateDamage(currentEnemy, enemyAttackZones, playerDefenceZones);
            
            applyDamage(player, enemyDamage);
            applyDamage(currentEnemy, playerDamage);
            
            updateHealthDisplay();
            updateEnemyHealthDisplay();
            
            checkGameEnd();
            
            setTimeout(() => {
                attackRadios.forEach(radio => radio.checked = false);
                defenceRadios.forEach(radio => radio.checked = false);
                updateAttackButton();
            }, 1000);
        });

        function getSelectedZone(radios) {
            const selected = Array.from(radios).find(radio => radio.checked);
            return selected ? selected.parentElement.querySelector('.radio-label').textContent.trim() : null;
        }

        function getSelectedZones(radios) {
            return Array.from(radios)
                .filter(radio => radio.checked)
                .map(radio => radio.parentElement.querySelector('.radio-label').textContent.trim());
        }

        function getRandomZones(count) {
            const zones = ["Head", "Neck", "Body", "Belly", "Legs"];
            const result = [];
            
            while (result.length < count && result.length < zones.length) {
                const randomZone = zones[Math.floor(Math.random() * zones.length)];
                if (!result.includes(randomZone)) {
                    result.push(randomZone);
                }
            }
            
            return result;
        }

        function calculateDamage(attacker, attackZones, defenceZones) {
            let totalDamage = 0;
            const attackArray = Array.isArray(attackZones) ? attackZones : [attackZones];
            
            for (const attackZone of attackArray) {
                const isBlocked = defenceZones.includes(attackZone);
                const isCrit = Math.random() < attacker.critChance;
                
                let damage = attacker.damage;
                if (isCrit) {
                    damage *= attacker.critMultiplier;
                    console.log(`⚡ КРИТИЧЕСКИЙ УДАР! ${attacker.name} бьет в ${attackZone}`);
                }
                
                if (isBlocked && !isCrit) {
                    console.log(`🛡️ ${attacker.name} атаковал в ${attackZone}, но защита сработала!`);
                    damage = 0;
                } else if (isBlocked && isCrit) {
                    console.log(`💥 КРИТ пробил защиту ${attackZone}!`);
                } else if (!isBlocked) {
                    console.log(`🎯 ${attacker.name} попал в ${attackZone} на ${damage} урона!`);
                }
                
                totalDamage += damage;
            }
            
            return Math.round(totalDamage);
        }

        function applyDamage(target, damage) {
            target.currentHealth = Math.max(0, target.currentHealth - damage);
            console.log(`❤️ ${target.name} получил ${damage} урона. Осталось HP: ${target.currentHealth}`);
        }

        function checkGameEnd() {
            if (player.currentHealth <= 0) {
                setTimeout(() => {
                    alert("Вы проиграли! 😢");
                    addLose();
                    resetBattle();
                }, 500);
            } else if (currentEnemy.currentHealth <= 0) {
                setTimeout(() => {
                    alert("Вы победили! 🎉");
                    addWin();
                    nextEnemy();
                }, 500);
            }
        }

        function nextEnemy() {
            currentEnemyIndex = (currentEnemyIndex + 1) % enemies.length;
            currentEnemy = {...enemies[currentEnemyIndex]};
            resetBattle();
        }
        function resetBattle() {
            player.currentHealth = player.maxHealth;
            currentEnemy.currentHealth = currentEnemy.maxHealth;
            updateHealthDisplay();
            updateEnemyHealthDisplay();
            
            if (enemyName) enemyName.textContent = currentEnemy.name;
            if (enemyAvatarImg) enemyAvatarImg.src = currentEnemy.avatar;
        }
        initGame();
    }
});