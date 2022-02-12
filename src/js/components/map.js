const btn = document.querySelector('.map-mask__btn');
const mapMask = document.querySelector('.map-mask');

window.addEventListener('DOMContentLoaded', function () {
    btn.addEventListener('click', function () {
        mapMask.classList.toggle('close');
    })
})