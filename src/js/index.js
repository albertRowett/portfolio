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

// PROJECTS SECTION
fetch("./projects.json")
  .then((response) => response.json())
  .then((data) => {
    insertProjects(data);
    initSlideshows();
  });

function insertProjects(data) {
  const projectsContainer = document.querySelector("[data-projects-container");
  const projects = data.projects;

  projectsContainer.innerHTML = projects
    .map((project) => {
      return `
        <div class="w-72 rounded-2xl bg-teal-50 p-4 shadow sm:w-140" data-project="${project.nickname}">
          <div class="mb-3 flex flex-col gap-1.5 sm:flex-row sm:justify-center">
            <h4 class="text-xl font-bold">${project.type}</h4>
            <h5 class="text-lg sm:text-xl"><span class="hidden sm:inline">- </span>${project.name}</h5>
          </div>
          <div
            class="relative float-left mb-2 mr-3 h-44 w-64 rounded border-2 border-teal-800 bg-teal-800 sm:mb-0"
            data-slide-frame="${project.nickname}"
          >
            ${imagesHTML(project)}
            <a
              href="${project.siteLink}"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute bottom-0 left-0 rounded-bl-sm rounded-tr bg-teal-800 px-1 text-xl text-white hover:bg-teal-800-opacity-50"
              ><i class="fa-solid fa-arrow-up-right-from-square"></i
            ></a>
            <a
              href="${project.githubLink}"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute bottom-0 right-0 rounded-br-sm rounded-tl bg-teal-800 px-1 text-xl text-white hover:bg-teal-800-opacity-50"
              ><i class="fa-brands fa-github"></i
            ></a>
          </div>
          <div>
            ${descriptionHTML(project)}
          </div>
        </div>
      `;
    })
    .join("");
}

function imagesHTML(project) {
  return project.images
    .map((image, i) => {
      if (i === 0) {
        return `
          <!-- Explicit height needed for first image to ensure correct offsetHeight in JS -->
          <img
            src="${image}"
            alt="${project.imageAltTexts[i]}"
            class="absolute h-43 rounded-sm transition duration-1000"
            data-project-img
          />
        `;
      } else {
        return `
          <img
            src="${image}"
            alt="${project.imageAltTexts[i]}"
            class="absolute rounded-sm opacity-0 transition duration-1000"
            data-project-img
          />
        `;
      }
    })
    .join("");
}

function descriptionHTML(project) {
  const noOfSentences = project.description.length;

  return project.description
    .map((sentence, i) => {
      if (i !== noOfSentences - 1) {
        return `<p class="mb-3">${sentence}</p>`;
      } else {
        return `<p>${sentence}</p>`;
      }
    })
    .join("");
}

const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)");
let slideshows = {};

function initSlideshows() {
  const projects = document.querySelectorAll("[data-project]");

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

  initInteraction(projects);

  isTouchDevice.addEventListener("change", () => {
    // Ensures interactions re-initialised if device type changed
    window.location.reload();
  });
}

function initInteraction(projects) {
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
