---
layout: page
permalink: /contact/
title: Contact
/*description: Contact information, message form, and location.*/
nav: true
nav_order: 12
---
**Name:** Kidanemaryam W. Reta  
**Email:** [kidane.et@gmail.com](mailto:kidane.et@gmail.com)  


## Send a message

<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <label for="name">First and Last Name</label>
  <input id="name" name="name" type="text" required>

  <label for="subject">Subject <small>(maximum 25 words)</small></label>
  <input id="subject" name="subject" type="text" required>

  <label for="message">Description <small>(maximum 200 words)</small></label>
  <textarea id="message" name="message" rows="7" required></textarea>

  <input type="hidden" name="_subject" value="Website contact form message">

  <button type="submit">Send Message</button>
</form>

<script>
  function limitWords(fieldId, maxWords) {
    const field = document.getElementById(fieldId);

    field.addEventListener("input", function () {
      const words = field.value.trim().split(/\s+/).filter(Boolean);

      if (words.length > maxWords) {
        field.value = words.slice(0, maxWords).join(" ");
      }
    });
  }

  limitWords("subject", 25);
  limitWords("message", 200);
</script>

## Map

<div class="contact-map">
  <iframe
    title="Google Map of exact research location"
    src="https://www.google.com/maps?q=30.854802714948544,34.78294697265252&z=16&output=embed"
    width="100%"
    height="460"
    style="border:0;"
    allowfullscreen=""
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade">
  </iframe>
</div>