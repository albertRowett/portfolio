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

// PROJECTS SECTION: IMAGE SLIDESHOWS
const projects = document.querySelectorAll("[data-project]");
let slideshows = {};

projects.forEach((project) => {
  const projectName = project.dataset.project;
  const projectImages = project.querySelectorAll("[data-project-img]");

  slideshows[projectName] = {
    images: projectImages,
    noOfImages: projectImages.length,
    currentImage: 0,
    interval: null,
    timeout: null,
  };
});

const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)");

function initInteraction() {
  if (isTouchDevice.matches) {
    const slideFrames = document.querySelectorAll("[data-slide-frame]");
    const viewportHeight = window.innerHeight;
    const headerHeight = document.querySelector("header").offsetHeight;
    const frameHeight = document.querySelector("[data-slide-frame]").offsetHeight;

    const observerOptions = {
      // Options combine for check of whether top of slide frame is between middle of viewport and bottom of header
      rootMargin: `-${headerHeight}px 0px -${viewportHeight / 2 - frameHeight}px 0px`,
      threshold: 1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const projectName = entry.target.dataset.slideFrame;

        if (entry.isIntersecting) {
          startSlideshow(projectName);
        } else {
          stopSlideshow(projectName);
        }
      });
    }, observerOptions);

    slideFrames.forEach((slideFrame) => {
      observer.observe(slideFrame);
    });
  } else {
    // i.e. non-touch device
    projects.forEach((project) => {
      const projectName = project.dataset.project;

      project.addEventListener("mouseenter", () => {
        startSlideshow(projectName);
      });
      project.addEventListener("focusin", () => {
        startSlideshow(projectName);
      });
      project.addEventListener("mouseleave", () => {
        stopSlideshow(projectName);
      });
      project.addEventListener("focusout", () => {
        // Delay prevents slideshow stopping and restarting when focus changed within a project
        slideshows[projectName].timeout = setTimeout(() => {
          stopSlideshow(projectName);
        }, 10);
      });
    });
  }
}

function startSlideshow(projectName) {
  const project = slideshows[projectName];

  if (project.interval === null) {
    showNextImage(project);
    project.interval = setInterval(() => {
      showNextImage(project);
    }, 2000);
  }

  if (project.timeout !== null) {
    clearTimeout(project.timeout);
    project.timeout = null;
  }
}

function showNextImage(project) {
  project.images[project.currentImage].classList.add("opacity-0");
  project.currentImage = (project.currentImage + 1) % project.noOfImages;
  project.images[project.currentImage].classList.remove("opacity-0");
}

function stopSlideshow(projectName) {
  const project = slideshows[projectName];

  clearInterval(project.interval);
  project.interval = null;

  if (project.currentImage !== 0) {
    project.images[project.currentImage].classList.add("opacity-0");
    project.currentImage = 0;
    project.images[project.currentImage].classList.remove("opacity-0");
  }
}

initInteraction();

isTouchDevice.addEventListener("change", () => {
  // Ensures interactions re-initialised if device type changed
  window.location.reload();
});
