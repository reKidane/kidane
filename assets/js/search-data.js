// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/kidane/";
    },
  },{id: "nav-research",
          title: "Research",
          description: "Research program in crop stress physiology, plant metabolism, multi-omics integration, and predictive modeling.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/research/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Peer-reviewed articles, reviews, manuals, thesis outputs, and Google Scholar-indexed work.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Research projects spanning crop physiology, plant metabolomics, phenotyping, and climate-resilient crop improvement.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/projects/";
          },
        },{id: "nav-presentations",
          title: "Presentations",
          description: "Oral and poster presentations at international scientific conferences and research meetings.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/presentations/";
          },
        },{id: "nav-teaching-amp-mentoring",
          title: "Teaching &amp; Mentoring",
          description: "Training, supervision, mentoring, and technical instruction in crop physiology, plant breeding, and data analysis.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/teaching/";
          },
        },{id: "nav-service",
          title: "Service",
          description: "Peer review, professional memberships, research coordination, and scientific leadership.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/service/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Academic CV of Kidanemaryam Wagaw Reta.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/cv/";
          },
        },{id: "nav-blog",
          title: "Blog",
          description: "Short-form research notes and placeholders for future updates from ongoing research.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/blog/";
          },
        },{id: "nav-gallery",
          title: "Gallery",
          description: "Photos and visual placeholders for fieldwork, phenotyping, crops, and research activities.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/gallery/";
          },
        },{id: "nav-people-amp-collaborators",
          title: "People &amp; Collaborators",
          description: "Research team structure, collaborators, staff, trainees, and alumni.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/people/";
          },
        },{id: "nav-contact",
          title: "Contact",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/kidane/contact/";
          },
        },{id: "dropdown-news",
              title: "News",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/kidane/news/";
              },
            },{id: "dropdown-resources",
              title: "Resources",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/kidane/repositories/";
              },
            },{id: "dropdown-reading-list",
              title: "Reading List",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/kidane/books/";
              },
            },{id: "books-climate-resilient-crop-science-references",
          title: 'Climate-Resilient Crop Science References',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/kidane/books/climate_resilient_crop_science/";
            },},{id: "news-awarded-an-international-organisation-of-vine-and-wine-research-grant-for-integrative-metabolomics-physiology-uav-thermal-phenotyping-and-predictive-modeling-in-vitis-vinifera-under-elevated-temperature",
          title: 'Awarded an International Organisation of Vine and Wine research grant for integrative metabolomics,...',
          description: "",
          section: "News",},{id: "news-received-the-akis-publication-prize-at-ben-gurion-university-of-the-negev",
          title: 'Received the AKIS Publication Prize at Ben-Gurion University of the Negev.',
          description: "",
          section: "News",},{id: "news-started-a-postdoctoral-research-appointment-in-plant-metabolomics-and-physiology-at-ben-gurion-university-of-the-negev",
          title: 'Started a postdoctoral research appointment in plant metabolomics and physiology at Ben-Gurion University...',
          description: "",
          section: "News",},{id: "projects-integrative-grapevine-phenotyping-and-predictive-modeling",
          title: 'Integrative Grapevine Phenotyping And Predictive Modeling',
          description: "OIV-funded project linking plant physiology, metabolomics, UAV thermal sensing, gene expression, and AI-assisted forecasting under elevated temperature.",
          section: "Projects",handler: () => {
              window.location.href = "/kidane/projects/1_project/";
            },},{id: "projects-rootstock-mediated-responses-to-combined-salinity-and-water-deficit",
          title: 'Rootstock-Mediated Responses To Combined Salinity And Water Deficit',
          description: "PhD research on physiology, metabolism, ion regulation, root-shoot traits, and agronomic performance in grafted Syrah.",
          section: "Projects",handler: () => {
              window.location.href = "/kidane/projects/2_project/";
            },},{id: "projects-sorghum-crop-improvement-for-dryland-systems",
          title: 'Sorghum Crop Improvement For Dryland Systems',
          description: "Breeding, physiological phenotyping, genotype-by-environment analysis, and variety development for stress-prone production environments.",
          section: "Projects",handler: () => {
              window.location.href = "/kidane/projects/3_project/";
            },},{id: "projects-climate-smart-and-community-biorefining-initiatives",
          title: 'Climate-Smart And Community Biorefining Initiatives',
          description: "Internationally funded collaborative projects for sorghum value chains, smallholder resilience, and crop improvement modernization.",
          section: "Projects",handler: () => {
              window.location.href = "/kidane/projects/4_project/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/kidane/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/kidane/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6B%69%64%61%6E%65.%65%74@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=0C-PTFgAAAAJ", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0002-2823-5376", "_blank");
        },
      },{
        id: 'social-researchgate',
        title: 'ResearchGate',
        section: 'Socials',
        handler: () => {
          window.open("https://www.researchgate.net/profile/Kidanemaryam-Wagaw/", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/kidanemaryam", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/reKidane", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
