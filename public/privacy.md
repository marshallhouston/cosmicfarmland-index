# privacy

short version: this site does not collect anything about you.

## what is not collected

there are no analytics scripts, no tracking pixels, no advertising tags, no
session recording, no fingerprinting, and no third-party embeds beyond the web
font stylesheet described below. there is no account system, no login, no
newsletter signup and no contact form, so there is nothing here that asks you
for a name, an email address or a payment method, and nothing that could store
one.

## what is stored on your device

one item in your browser's localStorage, under the key `cf-theme`, remembering
whether you last chose the board (dark) or daylight (light) view. it never
leaves your browser, it is not an identifier, and clearing your site data
removes it.

## what third parties see

- **google fonts.** the pages load typefaces from fonts.googleapis.com and
  fonts.gstatic.com, so google receives the request for those files, including
  your ip address, under its own privacy policy.
- **cloudflare and railway.** the site is served through cloudflare in front of
  railway. both keep standard server request logs, which include ip address,
  user agent and the path requested, for security and operations.

## agents and crawlers

crawling rules are published at [robots.txt](/robots.txt), including content
signals covering search, ai training and ai input. a machine-readable summary of
the whole site is published at [llms.txt](/llms.txt).

## changes

if this policy changes, the updated version is published here and the change
shows up in the public git history of the site repo.
