fetch("projects.json")
  .then((response) => response.json())
  .then((data) => {
    data.projects.forEach((project) => {
      let content = "<ul>";
      content += "<li>Project Type: " + project.type + "</li>";
      content += "<li>Project Name: " + project.name + "</li>";
      content += '<img src="' + project.image + '" alt="' + project.imageAltText + '" class="w-32 h-32" />';
      content += "<p>Project description: " + project.description + "</p>";
      content += '<a href="' + project.githubLink + '">GitHub</a><br>';
      content += '<a href="' + project.siteLink + '">Site</a>';
      content += "</ul>";
      document.querySelector(".projects").innerHTML += content;
    });
  });
