document.querySelector('.search-button').addEventListener('click',()=>{
    window.location="http://" + window.location.host+"/teacher?q="+document.querySelector('#search').value
})