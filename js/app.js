//select all the DOM element

const wrapper = document.querySelector('.wrapper');
musicImg = wrapper.querySelector('.img-area img');
musicName = wrapper.querySelector('.song-details .name');
musicArtist = wrapper.querySelector('.song-details .artist');
mainAudio = wrapper.querySelector('#main-audio');
playPauseBtn = wrapper.querySelector('.play-pause');
nextBtn = wrapper.querySelector('#next');
prevBtn = wrapper.querySelector('#prev');
progressBar = wrapper.querySelector('.progress-bar');
progressArea = wrapper.querySelector('.progress-area');
musicList = wrapper.querySelector('.music-list');
moreMusicBtn = wrapper.querySelector('#more-music');
hideMusicBtn = musicList.querySelector('#close');

let musicIndex = Math.floor((Math.random() * allMusic.length));


window.addEventListener('load', () => {
    loadMusic(musicIndex);
    playingNow()
});

function loadMusic(index) {
    musicName.innerText = allMusic[index].name;
    musicArtist.innerText = allMusic[index].artist;
    musicImg.src = allMusic[index].img;
    mainAudio.src = allMusic[index].src;
}

function playMusic() {
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').classList.remove('fa-play');
    playPauseBtn.querySelector('i').classList.add('fa-pause');
    mainAudio.play();
}

function pauseMusic() {
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').classList.remove('fa-pause');
    playPauseBtn.querySelector('i').classList.add('fa-play');
    mainAudio.pause();
}

function nextMusic() {
    if (musicIndex == allMusic.length-1) {
        musicIndex = 0;
    }
    musicIndex++;
    loadMusic(musicIndex)
    playMusic();
    playingNow()
}


function prevMusic() {
    if (musicIndex == 0) {
        musicIndex = allMusic.length-1
    }
    musicIndex--;
    loadMusic(musicIndex);
    playMusic();
    playingNow()
}

playPauseBtn.addEventListener('click', () => {
    const isMusicPaused = wrapper.classList.contains('paused');
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow()
});

nextBtn.addEventListener('click', () => {
    nextMusic();
});

prevBtn.addEventListener('click', () => {
    prevMusic();
});

mainAudio.addEventListener('timeupdate', (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector('.current');
    let musicDuration = wrapper.querySelector('.duration');

    mainAudio.addEventListener('loadeddata', () => {
        
        //update playing song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;

    });
    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener('click', (e) => {
    let progressWidthval = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    
    mainAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
    //playMusic()
});

//working on repeat and shuffle of the song

const repeatBtn = wrapper.querySelector('#repeat-plist');

repeatBtn.addEventListener('click', () => {
    if (repeatBtn.classList.contains('fa-retweet')) {
        repeatBtn.classList.remove('fa-retweet')
        repeatBtn.classList.add('fa-redo')
        repeatBtn.setAttribute("title", "current song")
    } else if (repeatBtn.classList.contains('fa-redo')) {
        repeatBtn.classList.remove('fa-redo')
        repeatBtn.classList.add('fa-random')
        repeatBtn.setAttribute("title", "shuffled")
    } else {
        repeatBtn.classList.remove('fa-random')
        repeatBtn.classList.add('fa-retweet')
        repeatBtn.setAttribute("title", "repeat playlist")
    }
});

//handle the repeat functionalities inline with it's classlists
mainAudio.addEventListener('ended', () => {
    if (repeatBtn.classList.contains('fa-retweet')) {
        //simply change to next music
        nextMusic()
        playingNow()
    } else if (repeatBtn.classList.contains('fa-redo')) {
        //change to current time of the playing song to 0,so it will start afresh
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
        playingNow()
    } else {
        let randIndex = Math.floor((Math.random() * allMusic.length));
        do {
            let randIndex = Math.floor((Math.random() * allMusic.length));
        } while (musicIndex == randIndex);//keeps looping until the random number won't be equal to the music index
        musicIndex = randIndex;//assign the value of the randIndex to the music index
        loadMusic(musicIndex);//load the music with the new value
        playMusic();//finally play the music
        playingNow()
    }
});

//show music list
moreMusicBtn.addEventListener('click', () => {
    musicList.classList.toggle('show');
});

//hide music list
hideMusicBtn.addEventListener('click', () => {
    //musicList.classList.toggle('show');
    //OR
    moreMusicBtn.click();
});

const ulTag = wrapper.querySelector('ul');

//lets create list according to the song list array length
for (let i = 0; i < allMusic.length; i++) {

    let liTag = `<li li-index="${i}">
                    <div class="row">
                        <span>${allMusic[i].name}</span> 
                        <p>${allMusic[i].artist}</p> 
                    </div> 
                    <audio class="${allMusic[i].id}" src="${allMusic[i].src}"></audio>
                    <span id="${allMusic[i].id}" class="audio-duration"></span> 
                </li>`; 
    
    ulTag.insertAdjacentHTML('beforeend', liTag);

    liAudioDuration = ulTag.querySelector(`#${allMusic[i].id}`);
    liAudioTag = ulTag.querySelector(`.${allMusic[i].id}`);
   
    liAudioTag.addEventListener('loadeddata', () => {
        //console.log(liAudioTag);
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`)
    });
}

//play any song on click event

const allLiTags = ulTag.querySelectorAll('li');
function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector('.audio-duration');

        if (allLiTags[j].classList.contains('playing')) {
            allLiTags[j].classList.remove('playing');
            let auDuration = audioTag.getAttribute('t-duration');
            audioTag.innerText = auDuration;
        }

        if (allLiTags[j].getAttribute('li-index') == musicIndex) {
            allLiTags[j].classList.add('playing');
            audioTag.innerText = 'playing';
        }
        allLiTags[j].setAttribute('onclick', 'clicked(this)');
    }
}

function clicked(element) {
    let getIndex = element.getAttribute('li-index');
    musicIndex = getIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow()
}
