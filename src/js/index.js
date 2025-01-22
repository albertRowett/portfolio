// Hero section: tagline transition
const lines = document.querySelectorAll("[data-tagline] p");

function transition(line) {
  line.style.transform = "translateX(0px)";
  line.style.opacity = "1";
}

window.addEventListener("load", () => {
  transition(lines[0]);
});

for (let i = 0; i < lines.length - 1; i++) {
  lines[i].addEventListener("transitionend", () => {
    transition(lines[i + 1]);
  });
}

// Projects section: projects population
// fetch("projects.json")
//   .then((response) => response.json())
//   .then((data) => {
//     data.projects.forEach((project) => {
//       let content = "<ul>";
//       content += "<li>Project Type: " + project.type + "</li>";
//       content += "<li>Project Name: " + project.name + "</li>";
//       content += '<img src="' + project.image + '" alt="' + project.imageAltText + '" class="w-32 h-32" />';
//       content += "<p>Project description: " + project.description + "</p>";
//       content += '<a href="' + project.githubLink + '">GitHub</a><br>';
//       content += '<a href="' + project.siteLink + '">Site</a>';
//       content += "</ul>";
//       document.querySelector(".projects").innerHTML += content;
//     });
//   });

// Projects section: image slideshows
const projects = document.querySelectorAll("[data-project]");

projects.forEach((project) => {
  const images = project.querySelectorAll("[data-project-img]");
  const noOfImages = images.length;
  let currentIndex = 0;
  let interval = null;
  let timeout = null;

  function startSlideshow() {
    if (interval === null) {
      showNextImage();
      interval = setInterval(showNextImage, 2000);
    }

    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  }

  function showNextImage() {
    images[currentIndex].classList.add("opacity-0");
    currentIndex = (currentIndex + 1) % noOfImages;
    images[currentIndex].classList.remove("opacity-0");
  }

  function stopSlideshow() {
    clearInterval(interval);
    interval = null;

    if (currentIndex !== 0) {
      images[currentIndex].classList.add("opacity-0");
      currentIndex = 0;
      images[currentIndex].classList.remove("opacity-0");
    }
  }

  project.addEventListener("mouseenter", startSlideshow);
  project.addEventListener("focusin", startSlideshow);
  project.addEventListener("mouseleave", stopSlideshow);
  project.addEventListener("focusout", () => {
    timeout = setTimeout(stopSlideshow, 10); // Delay prevents slideshow stopping and restarting when focus changed within a project
  });
});
