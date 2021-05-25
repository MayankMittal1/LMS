document.querySelector('.search-button').addEventListener('click',()=>{
    window.location=window.location.pathname+"?q="+document.querySelector('#search').value
})
reqButton=document.querySelector('.requests')
reqDiv=document.querySelector('.requests-div')
overlay=document.querySelector('.overlay-main')
closeBut=document.querySelector('#close')
const displayToggle=()=>{
    reqDiv.classList.toggle('display-f')
    overlay.classList.toggle('display')
}

reqButton.addEventListener('click',displayToggle)
closeBut.addEventListener('click',displayToggle)