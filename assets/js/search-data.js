// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-research",
          title: "Research",
          description: "Research program in crop stress physiology, plant metabolism, multi-omics integration, and predictive modeling.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Peer-reviewed articles, reviews, manuals, thesis outputs, and Google Scholar-indexed work.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Research projects spanning crop physiology, plant metabolomics, phenotyping, and climate-resilient crop improvement.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-presentations",
          title: "Presentations",
          description: "Oral and poster presentations at international scientific conferences and research meetings.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/presentations/";
          },
        },{id: "nav-teaching-amp-mentoring",
          title: "Teaching &amp; Mentoring",
          description: "Training, supervision, mentoring, and technical instruction in crop physiology, plant breeding, and data analysis.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-service",
          title: "Service",
          description: "Peer review, professional memberships, research coordination, and scientific leadership.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/service/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Academic CV of Kidanemaryam Wagaw Reta.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-blog",
          title: "Blog",
          description: "Short-form research notes and placeholders for future updates from ongoing research.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-gallery",
          title: "Gallery",
          description: "Photos and visual placeholders for fieldwork, phenotyping, crops, and research activities.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/gallery/";
          },
        },{id: "nav-people-amp-collaborators",
          title: "People &amp; Collaborators",
          description: "Research team structure, collaborators, staff, trainees, and alumni.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "nav-contact",
          title: "Contact",
          description: "Contact information and location.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/contact/";
          },
        },{id: "dropdown-news",
              title: "News",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/news/";
              },
            },{id: "dropdown-resources",
              title: "Resources",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/repositories/";
              },
            },{id: "dropdown-reading-list",
              title: "Reading List",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/books/";
              },
            },{id: "books-climate-resilient-crop-science-references",
          title: 'Climate-Resilient Crop Science References',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/climate_resilient_crop_science/";
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
              window.location.href = "/projects/1_project/";
            },},{id: "projects-rootstock-mediated-responses-to-combined-salinity-and-water-deficit",
          title: 'Rootstock-Mediated Responses To Combined Salinity And Water Deficit',
          description: "PhD research on physiology, metabolism, ion regulation, root-shoot traits, and agronomic performance in grafted Syrah.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-sorghum-crop-improvement-for-dryland-systems",
          title: 'Sorghum Crop Improvement For Dryland Systems',
          description: "Breeding, physiological phenotyping, genotype-by-environment analysis, and variety development for stress-prone production environments.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-climate-smart-and-community-biorefining-initiatives",
          title: 'Climate-Smart And Community Biorefining Initiatives',
          description: "Internationally funded collaborative projects for sorghum value chains, smallholder resilience, and crop improvement modernization.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/Kidane_CV_Auburn_Pool_25042026.docx", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6B%69%64%61%6E%65.%65%74@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-whatsapp',
        title: 'whatsapp',
        section: 'Socials',
        handler: () => {
          window.open("https://wa.me/972587964242", "_blank");
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
