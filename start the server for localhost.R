#In the RStudio Terminal, run:
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