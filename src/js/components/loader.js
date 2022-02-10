const tl = gsap.timeline({defaults: {duration: .8, opacity: 0}});
tl
    .from(".hero-content", {y: 50, delay: .7})
    .from([".hero-content__author", ".hero-content__time", ".hero-content__btn"], {})
    .from(".hero-container__title", {})

const tlImage = gsap.timeline({defaults: {duration: .3, scale: .8, opacity: 0}})
tlImage
        .from("#photo-1", {delay: 1.5})
        .from("#photo-2", {})
        .from("#photo-3", {})