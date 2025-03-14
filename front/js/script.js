document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop(); 
    const navLinks = document.querySelectorAll("#nav-tabs .tab");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href").split("/").pop();
        if (linkHref === currentPage) {
            link.classList.add("active"); 
        } else {
            link.classList.remove("active");
        }
    });
});
