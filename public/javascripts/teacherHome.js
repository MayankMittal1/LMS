returnDiv=document.querySelector('#return')
editDiv=document.querySelector('#edit')
mainOverlay=document.querySelector('.overlay-main')
studentForm=document.querySelector('#return-book')
teacherForm=document.querySelector('#edit-delete')
loginDiv=document.querySelector('.tasks')
closeBut1=document.querySelector('.c1')
closeBut2=document.querySelector('.c2')

const displayToggle = () =>{
    loginDiv.classList.toggle('display')
    mainOverlay.classList.toggle('display')
}

returnDiv.addEventListener('click',()=>{
    studentForm.classList.add('display-form')
    displayToggle()
})

editDiv.addEventListener('click',()=>{
    teacherForm.classList.add('display-form')
    displayToggle()
})

closeBut1.addEventListener('click',()=>{
    displayToggle()
    studentForm.classList.remove('display-form')
})

closeBut2.addEventListener('click',()=>{
    displayToggle()
    teacherForm.classList.remove('display-form')
})

document.querySelector('.search-button').addEventListener('click',()=>{
    window.location=window.location.pathname+"?q="+document.querySelector('#search').value
})