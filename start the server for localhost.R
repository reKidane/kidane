#In the RStudio Terminal, run: to start localhost server
cd /Users/kidane/Documents/Kidane_Personal_website
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH"
bundle exec jekyll serve

#if it fails run once:
bundle exec jekyll clean
bundle exec jekyll serve


#install prettier message error
cd /Users/kidane/Documents/Kidane_Personal_website
npm install
npx prettier . --write

# check and if all matches it done correctlly.
npx prettier . --check


# run with python cron triggering code for publication fetching run in RStudio terminal
cd /Users/kidane/Documents/Kidane_Personal_website
python3 _scripts/update_publications_openalex.py
npx prettier _pages/publications.md .github/workflows/update-publications-openalex.yml --write
bundle exec jekyll serve