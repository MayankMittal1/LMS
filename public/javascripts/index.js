let controller = new ScrollMagic.Controller();
let timline = new TimelineMax();
timline
    .to(".rock",3,{y:-500})
    .to(".girl",3,{y:-200},"-=3")
    .fromTo(".bg1",{y:-50},{y:0, duration:3},"-=3")
    .to('.content',3,{top:'0%'},'-=3')
    
    let scene=new ScrollMagic.Scene({
        triggerElement: "section",
        duration: "200%",
        triggerHook: 0,
    })
    .setTween(timline)
    .setPin('section')
    .addTo(controller)

studentDiv=document.querySelector('#stu')
teacherDiv=document.querySelector('#tea')
mainOverlay=document.querySelector('.overlay-main')
studentForm=document.querySelector('#student-login')
teacherForm=document.querySelector('#teacher-login')
loginDiv=document.querySelector('.login')
closeBut1=document.querySelector('.c1')
closeBut2=document.querySelector('.c2')

const displayToggle = () =>{
    loginDiv.classList.toggle('display')
    mainOverlay.classList.toggle('display')
}

studentDiv.addEventListener('click',()=>{
    studentForm.classList.add('display-form')
    displayToggle()
})

teacherDiv.addEventListener('click',()=>{
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