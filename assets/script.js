document.addEventListener('DOMContentLoaded', function() {
    const regButton = document.querySelector('.RegButton');
    const regInputField = document.querySelector('.regInputField');
    const homeIconButton = document.querySelector('.goHome');
    const charIconButton = document.querySelector('.goChar');
    const sittingsIconButton = document.querySelector('.goSettings');
    const saveButton = document.querySelector('.save-button');
    const textFieldInput = document.querySelector('.text-field-input');
    const charAvatarContainer = document.querySelector('.char-avatar');
    const charName = document.querySelector('.char-name');
    const fightButton = document.querySelector('.fight-button');
    const charAvatarImg = document.querySelector('.char-container img');
    const savedAvatar = localStorage.getItem('selectedAvatar');
    
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
            } else {
                alert('Пожалуйста, введите новое имя!');
                textFieldInput.focus();
            }
        });
    }

    if (charAvatarContainer) {
        const avatarImages = charAvatarContainer.querySelectorAll('img');
        
        function selectAvatar(selectedImg) {
            avatarImages.forEach(img => {
                img.classList.remove('selected');
            });
            
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
                    selectAvatar(img);
                }
            });
        }
    }

    if (charName) {
        const currentName = localStorage.getItem('fighterName');
        if (currentName) {
            charName.textContent = currentName;
        } else {
            charName.textContent = 'Безымянный воин';
        }
    }

    if (charAvatarImg) {
        const savedAvatar = localStorage.getItem('selectedAvatar');
        if (savedAvatar) {
            charAvatarImg.src = savedAvatar;
        }
    }
});