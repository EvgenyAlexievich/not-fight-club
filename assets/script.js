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
    const attackRadios = document.querySelectorAll('.attack-zones .radio-input');
    const defenseRadios = document.querySelectorAll('.defense .radio-input');

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
            // localStorage.removeItem('battleState');
            // localStorage.removeItem('battleLogs');
            window.location.href = 'battle.html';
        });
    }

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
                localStorage.removeItem('battleState');
                localStorage.removeItem('battleLogs');
                alert(`Имя "${fighterName}" успешно сохранено!`);
                regInputField.value = '';
                window.location.href = 'home.html';
            } else {
                alert('Пожалуйста, введите имя бойца!');
            }
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

    const battleLogs = {
        logsWrapper: document.querySelector('.logs-wrapper'),
        fullBattleLog: [],
        styles: {
            player: 'color: #4CAF50; font-weight: bold; text-decoration-line: underline;',
            enemy: 'color: #F44336; font-weight: bold; text-decoration-line: underline;',
            critical: 'color: #FF9800; font-weight: bold;',
            blocked: 'color: #9E9E9E; font-style: italic;',
            zone: 'color: #FF9800; font-weight: bold;',
        },
        
        addLog: function(message, isImportant = false) {
            if (!this.logsWrapper) return;
            
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${isImportant ? 'important' : ''}`;
            logEntry.innerHTML = message;
            
            this.logsWrapper.appendChild(logEntry);
            this.logsWrapper.scrollTop = this.logsWrapper.scrollHeight;
            
            this.fullBattleLog.push({
                message: message,
                isImportant: isImportant,
                timestamp: new Date().toLocaleTimeString()
            });
            
            this.saveLogs();
        },
        
        clearLogs: function() {
            if (this.logsWrapper) {
                this.logsWrapper.innerHTML = '';
            }
        },
        
        clearFullLog: function() {
            this.fullBattleLog = [];
        },
        
        formatText: function(text, styleType) {
            return `<span style="${this.styles[styleType]}">${text}</span>`;
        },
        
        logAttackResult: function(attacker, target, zone, damage, isCritical = false, isBlocked = false) {
            const attackerName = this.formatText(attacker.name, attacker.isPlayer ? 'player' : 'enemy');
            const targetName = this.formatText(target.name, target.isPlayer ? 'player' : 'enemy');
            const zoneName = this.formatText(zone, 'zone');
            const damageText = this.formatText(damage, 'damage');
            
            let message = '';
            
            if (isBlocked && !isCritical) {
                message = `👊🛡️${attackerName} атаковал ${targetName} в ${zoneName}, но удар заблокирован!`;
            } else if (isBlocked && isCritical) {
                message = `👊🛡️💥${attackerName} наносит КРИТИЧЕСКИЙ удар ${targetName} в ${zoneName} и пробивает защиту (Нанесено ${damageText} урона)`;
            } else if (isCritical) {
                message = `👊💥${attackerName} наносит КРИТИЧЕСКИЙ удар ${targetName} в ${zoneName} (Нанесено ${damageText} урона)`;
            } else if (damage > 0) {
                message = `👊${attackerName} атакует ${targetName} в ${zoneName}. Нанесено ${damageText} урона`;
            } else {
                message = `${attackerName} промахивается по ${targetName}`;
            }
            
            this.addLog(message, isCritical);
        },
        
        logBattleStart: function(player, enemy) {
            this.addLog(`⚔️ Бой начинается: ${this.formatText(player.name, 'player')} vs ${this.formatText(enemy.name, 'enemy')}`, true);
        },
        
        logZoneSelection: function(character, attackZones, defenseZones) {
            const characterName = this.formatText(character.name, character.isPlayer ? 'player' : 'enemy');
            const attackText = attackZones.length > 0 ? 
                `атакует в ${attackZones.map(zone => this.formatText(zone, 'zone')).join(', ')}` : 
                'не атакует';
            const defenseText = defenseZones.length > 0 ? 
                `защищает ${defenseZones.map(zone => this.formatText(zone, 'zone')).join(', ')}` : 
                'не защищается';
            
            this.addLog(`${characterName} ${attackText} и ${defenseText}`);
        },
        
        logRoundSummary: function(playerDamage, enemyDamage, player, enemy) {
            const playerDmg = this.formatText(playerDamage, 'damage');
            const enemyDmg = this.formatText(enemyDamage, 'damage');
            
            this.addLog(`Итог раунда: ${this.formatText(player.name, 'player')} нанес ${playerDmg} урона, ${this.formatText(enemy.name, 'enemy')} нанес ${enemyDmg} урона`, true);
        },
        
        logHealthStatus: function(character) {
            const characterName = this.formatText(character.name, character.isPlayer ? 'player' : 'enemy');
            const healthPercent = (character.currentHealth / character.maxHealth) * 100;
            let healthColor = '#fff';
            this.addLog(`${characterName}: ${character.currentHealth}/${character.maxHealth} HP <span style="color: ${healthColor}; font-weight: bold;">(${Math.round(healthPercent)}%)</span>`);
        },
        
        logBattleEnd: function(winner, loser) {
            const winnerName = this.formatText(winner.name, winner.isPlayer ? 'player' : 'enemy');
            const loserName = this.formatText(loser.name, loser.isPlayer ? 'player' : 'enemy');
            this.addLog(`${winnerName} побеждает ${loserName} в бою!`, true);
        },
        
        saveLogs: function() {
            localStorage.setItem('battleLogs', JSON.stringify(this.fullBattleLog));
        },
        
        loadLogs: function() {
            const savedLogs = localStorage.getItem('battleLogs');
            if (savedLogs) {
                this.fullBattleLog = JSON.parse(savedLogs);
                this.renderSavedLogs();
                return true;
            }
            return false;
        },
        
        renderSavedLogs: function() {
            if (!this.logsWrapper) return;
            
            this.clearLogs();
            this.fullBattleLog.forEach(log => {
                const logEntry = document.createElement('div');
                logEntry.className = `log-entry ${log.isImportant ? 'important' : ''}`;
                logEntry.innerHTML = log.message;
                
                this.logsWrapper.appendChild(logEntry);
            });
            
            this.logsWrapper.scrollTop = this.logsWrapper.scrollHeight;
        },
        
        clearSavedLogs: function() {
            localStorage.removeItem('battleLogs');
            this.clearLogs();
            this.clearFullLog();
        }
    };

    if (attackButton && charProgress && enemyProgress) {
        const player = {
            name: localStorage.getItem('fighterName') || 'Боец',
            maxHealth: 150,
            currentHealth: 150,
            damage: 20,
            critChance: 0.2,
            critMultiplier: 1.5,
            isPlayer: true,
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
                defenseZones: 2,
                critChance: 0.15,
                critMultiplier: 1.4,
                isPlayer: false,
                getHealthPercent: function() {
                    return (this.currentHealth / this.maxHealth) * 100;
                }
            },
            {
                name: "Scorpion",
                avatar: "assets/img/enemy2.jpg", 
                maxHealth: 100,
                currentHealth: 100,
                damage: 15,
                attackZones: 2,
                defenseZones: 1,
                critChance: 0.25,
                critMultiplier: 1.6,
                isPlayer: false,
                getHealthPercent: function() {
                    return (this.currentHealth / this.maxHealth) * 100;
                }
            },
            {
                name: "ShaoKan",
                avatar: "assets/img/enemy3.jpg",
                maxHealth: 200,
                currentHealth: 200,
                damage: 25,
                attackZones: 1,
                defenseZones: 3,
                critChance: 0.1,
                critMultiplier: 1.8,
                isPlayer: false,
                getHealthPercent: function() {
                    return (this.currentHealth / this.maxHealth) * 100;
                }
            },
            {
                name: "Goro",
                avatar: "assets/img/enemy5.jpg",
                maxHealth: 300,
                currentHealth: 300,
                damage: 25,
                attackZones: 4,
                defenseZones: 0,
                critChance: 0.1,
                critMultiplier: 1.8,
                isPlayer: false,
                getHealthPercent: function() {
                    return (this.currentHealth / this.maxHealth) * 100;
                }
            }
        ];

        let currentEnemyIndex = 0;
        let currentEnemy = {...enemies[currentEnemyIndex]};

        function saveBattleState() {
            const battleState = {
                player: {
                    currentHealth: player.currentHealth
                },
                enemy: {
                    currentHealth: currentEnemy.currentHealth,
                    index: currentEnemyIndex
                },
                timestamp: new Date().getTime()
            };
            
            localStorage.setItem('battleState', JSON.stringify(battleState));
        }

        function loadBattleState() {
            const savedState = localStorage.getItem('battleState');
            if (savedState) {
                const battleState = JSON.parse(savedState);
                
                const oneHour = 60 * 60 * 1000;
                if (new Date().getTime() - battleState.timestamp < oneHour) {
                    player.currentHealth = battleState.player.currentHealth;
                    currentEnemyIndex = battleState.enemy.index;
                    currentEnemy = {...enemies[currentEnemyIndex]};
                    currentEnemy.currentHealth = battleState.enemy.currentHealth;
                    
                    return true;
                } else {
                    localStorage.removeItem('battleState');
                    localStorage.removeItem('battleLogs');
                }
            }
            return false;
        }

        function initGame() {
            const hasSavedState = loadBattleState();
            const hasSavedLogs = battleLogs.loadLogs();
            
            if (!hasSavedState) {
                battleLogs.clearLogs();
                battleLogs.clearFullLog();
                battleLogs.logBattleStart(player, currentEnemy);
            }
            
            updateHealthDisplay();
            updateEnemyHealthDisplay();
            
            if (enemyName) enemyName.textContent = currentEnemy.name;
            if (enemyAvatarImg) enemyAvatarImg.src = currentEnemy.avatar;
            
            if (!hasSavedState) {
                battleLogs.logHealthStatus(player);
                battleLogs.logHealthStatus(currentEnemy);
            }
            
            initRadioButtons();
        
            saveBattleState();
        }

        function initRadioButtons() {
            attackRadios.forEach(radio => radio.checked = false);
            defenseRadios.forEach(radio => radio.checked = false);
        
            document.querySelectorAll('input').forEach(function(n) {
                n.addEventListener('click', this);
            }, function({ target: t }) {
                if (t.classList.contains('attack-radio')) {
                    attackRadios.forEach(r => {
                        if (r !== t) r.checked = false;
                    });
                }
                
                if (t.classList.contains('defense-radio')) {
                    const selectedDefense = document.querySelectorAll('.defense .radio-input:checked');
                    if (selectedDefense.length > 2 && t.checked) {
                        t.checked = false;
                        return;
                    }
                }
            
                t.checked = !!(this[0] = this[0] === t ? null : t);
                updateAttackButton();
            }.bind([]));
        
            updateAttackButton();
        }

        function updateAttackButton() {
            const selectedAttack = document.querySelectorAll('.attack-zones .radio-input:checked');
            const selectedDefense = document.querySelectorAll('.defense .radio-input:checked');
            
            if (selectedAttack.length === 1 && selectedDefense.length === 2) {
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
            }
        }

        function updateEnemyHealthDisplay() {
            if (enemyProgress && enemyHealth) {
                enemyProgress.value = currentEnemy.currentHealth;
                enemyProgress.max = currentEnemy.maxHealth;
                enemyHealth.textContent = `${currentEnemy.currentHealth}/${currentEnemy.maxHealth}`;
            }
        }


        attackButton.addEventListener('click', function() {
            if (attackButton.disabled) return;
            
            const playerAttackZone = getSelectedZone(attackRadios);
            const playerDefenseZones = getSelectedZones(defenseRadios);
            
            const enemyAttackZones = getRandomZones(currentEnemy.attackZones);
            const enemyDefenseZones = getRandomZones(currentEnemy.defenseZones);
            
            battleLogs.logZoneSelection({...player, isPlayer: true}, [playerAttackZone], playerDefenseZones);
            battleLogs.logZoneSelection({...currentEnemy, isPlayer: false}, enemyAttackZones, enemyDefenseZones);
            
            battleLogs.addLog('================================================================================НАЧАЛО РАУНДА================================================================================', true);
            
            const playerDamage = calculateDamage(player, currentEnemy, [playerAttackZone], enemyDefenseZones);
            const enemyDamage = calculateDamage(currentEnemy, player, enemyAttackZones, playerDefenseZones);
            
            battleLogs.logRoundSummary(playerDamage, enemyDamage, player, currentEnemy);
            battleLogs.addLog('================================================================================КОНЕЦ РАУНДА================================================================================', true);
            
            applyDamage(player, enemyDamage);
            applyDamage(currentEnemy, playerDamage);
            
            updateHealthDisplay();
            updateEnemyHealthDisplay(); 
            saveBattleState();
            checkGameEnd();
            // setTimeout(() => {
            //     attackRadios.forEach(radio => radio.checked = false);
            //     defenseRadios.forEach(radio => radio.checked = false);
            //     updateAttackButton();
            // }, 1000);
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

        function calculateDamage(attacker, target, attackZones, defenseZones) {
            let totalDamage = 0;
            
            for (const attackZone of attackZones) {
                const isBlocked = defenseZones.includes(attackZone);
                const isCrit = Math.random() < attacker.critChance;
                
                let damage = attacker.damage;
                if (isCrit) {
                    damage *= attacker.critMultiplier;
                }
                
                if (isBlocked && !isCrit) {
                    damage = 0;
                }
                
                battleLogs.logAttackResult(
                    {...attacker, isPlayer: attacker === player},
                    {...target, isPlayer: target === player},
                    attackZone,
                    Math.round(damage),
                    isCrit,
                    isBlocked && !isCrit
                );
                
                totalDamage += damage;
            }
            
            return Math.round(totalDamage);
        }

        function applyDamage(target, damage) {
            const oldHealth = target.currentHealth;
            target.currentHealth = Math.max(0, target.currentHealth - damage);
            
            if (damage > 0) {
                battleLogs.logHealthStatus({...target, isPlayer: target === player});
            }
        }

        function checkGameEnd() {
            if (player.currentHealth <= 0) {
                setTimeout(() => {
                    battleLogs.logBattleEnd(currentEnemy, player);
                    alert("WASTED!!!");
                    addLose();
                    localStorage.removeItem('battleState');
                    localStorage.removeItem('battleLogs');
                    resetBattle();
                }, 1000);
            } else if (currentEnemy.currentHealth <= 0) {
                setTimeout(() => {
                    battleLogs.logBattleEnd(player, currentEnemy);
                    alert("YOU WIN!!!");
                    addWin();
                    localStorage.removeItem('battleState');
                    localStorage.removeItem('battleLogs');
                    nextEnemy();
                }, 1000);
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
            
            // battleLogs.clearLogs();
            // battleLogs.clearFullLog();
            battleLogs.logBattleStart(player, currentEnemy);
            battleLogs.logHealthStatus(player);
            battleLogs.logHealthStatus(currentEnemy);
            
            saveBattleState();
        }

        window.addEventListener('beforeunload', function() {
            saveBattleState();
        });

        initGame();
    }
});