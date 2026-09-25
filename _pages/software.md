---
layout: page
permalink: /resources/software/
title: Software
description: Open tools built for breeding and plant science, free to use and to adapt.
nav: false
---

<!--
  How this page finds its entries.

  Each tool is a file in _projects/ carrying `category: Software`. The Projects
  page only displays the categories listed in its own `display_categories`
  (Current and Previous), so a Software item never appears there; it appears
  here instead. The card markup is the same include the Projects page uses, so
  these cards match the rest of the site.

  To add a tool: copy an existing file in _projects/, set `category: Software`,
  give it a `permalink` under /resources/software/, and it shows up here.
-->

<div class="projects">
  <div class="row row-cols-1 row-cols-md-2">
    {% assign software = site.projects | where: "category", "Software" | sort: "importance" %}
    {% for project in software %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>

{% assign software_count = site.projects | where: "category", "Software" | size %}
{% if software_count == 0 %}
  <p>Nothing published here yet.</p>
{% endif %}

---

Everything on this page is released under an open licence, with the source and
the analysis code public. If you use one of these tools in work you publish, a
citation is welcome and a note about what did or did not work for you is more
welcome still.
