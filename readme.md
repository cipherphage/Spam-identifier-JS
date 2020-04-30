# Spam Identification Using JavaScript and Email Bodies

## Structure of the code
- `spam-id.js` brings everything together to check email bodies against known spam.
- `body-decons.js` deconstructs known and unknown string specimens into something easier to check.
- `spam.js` and `emails.js` contain arrays of the known and unknown email bodies.
- `test-runner.html` and `test-spam-id.js` test the code.

## Step 1: naive implementation
Weighted factors:
- Word similarity.
- Word frequency similarity.
- Sentence length similarity.
- Overall length similarity.

Would strongly consider marking as spam (and blocking some content) emails that contain:
- Data URIs (e.g., to prevent [click-jacking][3]).
- Embedded JavaScript ().
- Non-HTTPS links (this one might mark too many non-spam as spam so we could take into account ratio of HTTP to HTTPS or consider anchor tag `href`s which ought to be HTTPS versus image tag `src`s which conceivably could be HTTP without security risk, although it would still be a privacy risk).

Notes:
- Could detect URL [homograph][1] and [typosquatting][2] attacks: seems like this would require a very long blacklist (could be implemented on the server-side though).
- Could use a 3rd party service to check URLs against known spammers/phishers.
- Links containing the `ml` (Mali) and `tk` (Tokelau, New Zealand) domains seem to be associated with my spam mail, but without more data I don't want to assume this is always true.

## Step 2: consider using the `natural` NPM package to perform more robust Natural Language Processing

## Step 3: consider methods to optimize performance (e.g., at least get it off of the main thread)

[1]:https://en.wikipedia.org/wiki/IDN_homograph_attack
[2]:https://en.wikipedia.org/wiki/Typosquatting
[3]: