---
layout: page
permalink: /publications/
title: Publications
description: Peer-reviewed articles, reviews, manuals, thesis outputs, and Google Scholar-indexed work.
nav: true
nav_order: 3
---

<!-- _pages/publications.md -->

Google Scholar profile: [Kidanemaryam W. Reta](https://scholar.google.com/citations?user=0C-PTFgAAAAJ&hl=en), Research areas: metabolomics, physiology, genomics, multi-omics, plant breeding, natural variability, photosynthesis, PAM-fluorometry, network analysis, machine learning, combined stress, stress modeling.

## Citation Report

{% assign metrics = site.data.publication_metrics %}

- **Source:** {{ metrics.source }}
- **Last updated:** {{ metrics.last_updated }}
- **Total publications:** {{ metrics.total_publications }}
- **Total citations:** {{ metrics.total_citations }}
- **Estimated h-index:** {{ metrics.h_index_openalex_estimate }}

Citation counts are fetched from OpenAlex and may differ from Google Scholar or ResearchGate.

## Automatically Updated Publications

{% for paper in site.data.auto_publications %}

<div class="publication-auto-entry">
  <h3>{{ paper.title }}</h3>
  <p>
    <strong>{{ paper.year }}</strong>
    {% if paper.source %} ?? {{ paper.source }}{% endif %}
    {% if paper.citations %} ?? Citations: {{ paper.citations }}{% endif %}
  </p>
  <p>{{ paper.authors | join: ", " }}</p>
  <p>
    {% if paper.doi and paper.doi != "" %}
      <a href="{{ paper.doi }}" target="_blank" rel="noopener noreferrer">DOI</a>
    {% endif %}
    {% if paper.openalex and paper.openalex != "" %}
      ?? <a href="{{ paper.openalex }}" target="_blank" rel="noopener noreferrer">OpenAlex</a>
    {% endif %}
  </p>
</div>

{% endfor %}

## Scientific Publications

14. **Reta K.**, Lupo Y., Persi N.S., Acuna T., Lazarovitch N. and Fait A. (2026). Metabolic network homeostasis and antagonistic stress response drive rootstock-mediated tolerance to combined salinity and water-deficit in grapevine _cv_. Syrah. _Plant Stress_,22,101456. doi: 10.1016/j.stress.2026.101456.
15. **Reta K.**, Lupo Y., Persi N.S., Lazarovitch N. and Fait A. (2025). Modulation of phenology and agronomical performance of Syrah grafted on two rootstocks under combined salinity and water stress conditions: A three-year field study. _Plant Stress_, 18, 101050. doi: 10.1016/j.stress.2025.101050.
16. **Reta K.**, Lazarovitch N. and Fait A. (2025). Metabolic and physiological analysis reveals distinct salinity tipping point in _Vitis vinifera_ _cv_. Syrah to enter a stress response mode. _Plant Stress_, 16, 1-14. doi: 10.1016/j.stress.2025.100864.
17. **Reta K.**, Netzer Y., Lazarovitch N. and Fait A. (2025). Canopy management practices in warm environment vineyards to improve grape yield and quality in a changing climate. A review vademecum to vine canopy management under the challenge of global warming. _Scientia Horticulturae_, 341, 113998. doi: 10.1016/j.scienta.2025.113998.
18. Zohar Y., **Reta K.**, Drori E., Gliksman U., Rauchberger S., Bar E., et al. (2024). Improved berry and wine quality of _Vitis vinifera_ L. cv. Gewurztraminer grown in an arid climate using a Y-shaped training system. _OENO One_, 58(1), 1-15. doi: 10.20870/oeno-one.2024.58.1.7148.
19. **Wagaw K.**, Seyoum A., Tadesse T., Nega A., Gebreyohannes A., Bejiga T., et al. (2021). Distinguishing of stable genotypes and mega environment for grain yield performance of sorghum [*Sorghum bicolor* (L.) Moench] genotypes using spatial analysis. _American Journal of Plant Sciences_, 12(3), 417-431. doi: 10.4236/ajps.2021.123027.
20. Bekana G., Girma E., Abebe A., Sisay A., Alemayehu D., **Wagaw K.**, et al. (2021). Evaluating the genetic variations among improved haricot bean varieties (_Phaseolus vulgaris_ L.) based on their agronomic traits and performing their half diallel cross. _American Journal of BioScience_, 9(5), 168. doi: 10.11648/j.ajbio.20210905.13.
21. **Wagaw K.** and Tadesse T. (2020). Combining ability and heterosis of sorghum (_Sorghum bicolor_ L. Moench) hybrids for grain and biomass yield. _American Journal of Plant Sciences_, 11(12), 2155-2171. doi: 10.4236/AJPS.2020.1112151.
22. Seyoum A., Semahegn Z., Nega A., Siraw S., Gebereyhones A., Solomon H., Legesse T., **Wagaw K.**, et al. (2020). Multi-environment evaluation and genotype x environment interaction analysis of sorghum [*Sorghum bicolor* (L.) Moench] genotypes in highland areas of Ethiopia. _American Journal of Plant Sciences_, 11, 1899-1917. doi: 10.4236/ajps.2020.1112136.
23. **Wagaw K.**, Seyoum A., Nega A., Tadesse T., Nadew D., Nida H., et al. (2020). Multi-environment trial and spatial analysis for yield performance of sorghum [*Sorghum bicolor* (L.) Moench] hybrids in dry lowland sorghum growing areas of Ethiopia. _Journal of Plant Breeding and Crop Science_, 12(4), 275-284. doi: 10.5897/JPBCS2019.0850.
24. **Wagaw K.**, Seyoum A., Tadesse T., Gebreyohannes A. and Tadesse D. (2020). The MET analysis of yield performance of advanced sorghum [*Sorghum bicolor* (L.) Moench] lines under moisture stress areas using spatial analysis. _American Journal of Plant Sciences_, 11(10), 1618-1631. doi: 10.4236/ajps.2020.1110117.
25. Seyoum A., Nega A., **Wagaw K.**, Tadesse T., Tadesse D., et al. (2020). Multi environment and spatial analysis of early maturing sorghum [*Sorghum bicolor* (L.) Moench] genotypes in dry lowland areas of Ethiopia. _African Journal of Agricultural Research_, 15(2), 278-290. doi: 10.5897/ajar2019.14495.
26. **Wagaw K.**, Bantte K. and Tadesse T. (2020). Gene action, combining ability and heterotic performance of Ethiopian sorghum (_Sorghum bicolor_ (L.) Moench) lines under moisture stress areas in Ethiopia. _African Journal of Plant Science_, 14(9), 372-394. doi: 10.5897/AJPS2019.1813.
27. **Wagaw K.** (2019). Review on mechanisms of drought tolerance in sorghum (_Sorghum bicolor_ (L.) Moench) basis and breeding methods. _Academic Research Journal of Agricultural Science and Research_, 7(2), 87-99. doi: 10.14662/ARJASR2019.007.

## Additional Google Scholar Indexed Records

1. **Wagaw K.**, Bantte K. and Tadesse T. (2018). Assessment of heterotic performance and combining ability of Ethiopian elite sorghum (_Sorghum bicolor_ (L.) Moench) lines. Jimma University.
2. **Reta K.**, Lupo Y., Sikron N., Acuna T., Lazarovitch N. and Fait A. (2026). Contrasting metabolic and physiological responses underlie rootstock-mediated tolerance to combined salinity and water-deficit stress in cv. Syrah. _SSRN Electronic Journal_.
3. **Reta K.**, Lupo Y., Sikron N., Lazarovitch N. and Fait A. (2025). Modulation of grafted Syrah grapevine phenology and agronomical performance on two rootstocks under combined salinity and water stress conditions: A three-year field study. Available at SSRN 5291409.
4. **Wagaw K.** and Seyoum T.T.A. (2022). Combining ability and heterosis of locally developed sorghum (_Sorghum bicolor_ L. (Moench)) hybrids for grain yield and forage.
5. **Reta K.**, Lupo Y., Acuna T., Sikron N., Verma P., Lazarovitch N. and Fait A. (2022). Effect of salinity and water regime, mediated by rootstock, on cv. Syrah must metabolite profile and vine physiology. _Julius Kuehn Institute_, 147-147.
6. Seyoum A., Tadesse A.N.T., Tadesse D., Jordan D., Kebede Y., Gebreyohannes A., **Wagaw K.**, et al. (2019). Spatial META analysis methods improve heritability and genetic gain of early maturing sorghum [*Sorghum bicolor* (L.) Moench] genotypes in dry lowland areas of Ethiopia. _Results of Crop Improvement and Management Research 2018_.

## Papers Pending Publication

- **Reta K.**, Caras T., Sikron-Persi N., Bustan A., Lazarovitch N., Paz-Kagan T. and Fait A. Integrative phenotyping, combining metabolomics, molecular biology, and remote sensing, revealed a varietal signature in response to a heatwave event in arid viticulture. Submitted.
- **Reta K.**, Verma P., Gashu K., Bustan A. and Fait A. Identification of high temperature-induced coordinated metabolic and phenological shifts in a varietal collection of wine grapes. Under preparation for submission to _Plant, Cell & Environment_.
- **Reta K.**, Lazarovitch N. and Fait A. Comparative machine learning reveals rootstock-modulated metabolic and temporal signatures in grafted grapevine under combined salinity and water deficit. In preparation for _Horticulture Research_.
- Degu A., Faigenboim A., **Reta K.**, Dynkin I., Fait A. and Reshef N. Functional characterization of grapevine PEPC and cytosolic MDH genes reveals divergent regulation of malate and sugar metabolism. Under review in _Horticulture Research_.
- Javali A., **Reta K.**, Herzberg M. and Fait A. Engineered multi-ionic irrigation reveals cultivar-specific coordination of root architecture, ion partitioning, and metabolism in grapevine. In preparation.

## Research Manuals, Books, Chapters, And Proceedings

- Seyoum A., Nega A., Tadesse T., Zerihun M., **Wagaw K.**, Gebreyohannes A., et al. (2019). _Sorghum Breeding Manual_. Ethiopian Institute of Agricultural Research. ISBN 978999466658.
- **Wagaw K.**, Bantte K. and Tadesse T. (2020). _Heterotic Performance and Combining Ability in Sorghum_. LAMBERT Academic Publishing. ISBN 9786203025965.
- Taye T., Seyoum A., Nega A., Gebreyohannes A., Kebede Y., **Wagaw K.**, Bejiga T., et al. (2019). Major achievements, challenges, and prospects of sorghum and millet research and development. In _Proceedings of the 50th Anniversary of Melkassa Agricultural Research Center_, edited by Gashawbeza Ayalew, 101-124. Ethiopian Institute of Agricultural Research.
- Tadese D., Seyoum A., Tadesse T., Fikadu Y., Nega A., Gebreyohannes A., Tirfessa A., **Wagaw K.**, et al. (2021). Proceedings of the National Conference on Crop Improvement and Management Research. In _Crop Improvement_, edited by Tadesse T., Addis Ababa, Ethiopia: Ethiopian Institute of Agricultural Research.

## Searchable Selected Publications

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% bibliography %}

</div>
