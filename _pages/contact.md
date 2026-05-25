---
layout: page
permalink: /contact/
title: Contact
/*description: Contact information, message form, and location.*/
nav: true
nav_order: 12
---

{% capture left_column %}
**Name:** Kidanemaryam W. Reta  
**Email:** [kidane.et@gmail.com](mailto:kidane.et@gmail.com)

## Send a message

<form
  action="https://docs.google.com/forms/d/e/1FAIpQLSf4uy5IeJMkgIkLe0b4Vx4S39v57NF449DSuWlu70RP2ZDHLg/formResponse"
  method="POST"
  target="hidden_iframe"
  class="contact-form"
  onsubmit="document.getElementById('contact-thanks').style.display='block';"
>
  <label for="email">Email</label>
  <input id="email" name="entry.572919377" type="email" required>

  <label for="name">First and Last Name</label>
  <input id="name" name="entry.1758920286" type="text" required>

  <label for="subject">Subject <small>(maximum 25 words)</small></label>
  <input id="subject" name="entry.1325711690" type="text" required>

  <label for="message">Description <small>(maximum 200 words)</small></label>
  <textarea id="message" name="entry.1931690262" rows="7" required></textarea>

  <button type="submit">Send</button>
</form>

<iframe name="hidden_iframe" style="display: none;"></iframe>

<p id="contact-thanks" style="display: none;">Thank you. Your message has been submitted.</p>


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

{% endcapture %}

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
  <div>
    {{ left_column | markdownify }}
  </div>

  <div>
    <h2>Map</h2>

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

  </div>
</div>
