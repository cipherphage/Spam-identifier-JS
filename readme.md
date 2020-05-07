# Spam Identification By Comparing Email Bodies 
- Comparing email bodies only. No headers, etc.
- Using only vanilla JavaScript (except for Jasmine for testing).

## Structure of the code
- `spam-id.js` brings everything together to check email bodies against known spam.
- `models.js` contains the `EmailBody` and `Email` class definitions.
- `spam.js` and `email.js` contain arrays of the known and unknown (respectively) email bodies.
- `test-runner.html` and `test-spam-id.js` test the code. Simply drag test-runner.html into your browser.
- WARNING: the emails in `spam.js` and `email.js` are actual emails. The URLs in them could be malicious!
- The `spamIdentifier` function in `spam-id.js` is the entry-point. It takes two arrays as arguments: one known spam email array and one unknown email array.  The function returns an email collection with the following structure:
```javascript
    Email {
      "emails": Array [
          EmailBody {
              "body": String,
              "factors": Object {
                  "num_words": Number,
                  "num_unique_words": Number,
                  "total_length": Number,
                  "words_object": Object {
                      <word>: String <frequency>
                  }
              }
              "spamCheck": Boolean,
              "isSpam": Boolean
          }, ...
      ]
   }
```

## Step 1: naive implementation
Currently implemented weighted factors for comparing email body similarity:
- Number of words.
- Number of unique words.
- Word choice.
- Word frequency.
- Overall length (to account for possible issues parsing HTML into words we should consider both word count and total length).

### How it works
These functions and limits that work together to determine how similar two email bodies are (note: they all require manual tweaking because we're not using user feedback):

- There are five comparisons which are weighted roughly equally at 20% of the total.  Each comparison returns a value between 0 and 0.2. The total score is therefore between 0 and 1, inclusive.

- `calcNumWords`:  returns 0.2 if the number of words in each email body are the same or within 100 words. Otherwise, return 0.

- `calcNumUnique`: returns 0.2 if the number of unique words in each email body are the same or within 50 words. Otherwise, return 0.

- `calcWordCF`: returns a more fine-grained score of two comparisons: the unique ratio (how many unique words are shared between the two emails divided by the total number of unique words in the known spam) and the frequency ratio (how many words have a similar frequency divided by the number of shared unique words). Each of these comparisons return between 0 and 0.2.

- `calcLength`: returns 0.2 if the length of the email body string is within 500 characters, otherwise it returns 0.

- `iLim` is the global individual limit (the maximum allowed value for the comparison metric between any two emails) and `tLim` is the global total limit (the maximum allowed value for the comparison metrics between the email of unknown type and the emails of known type spam). Once the total limit is reached an email is marked as spam.

Haven't implemented, but would strongly consider marking as spam (and blocking some content) emails that contain:
- Data URIs (e.g., to prevent [click-jacking][3]).
- Embedded JavaScript.
- Non-HTTPS links (this one might mark too many non-spam as spam so we could take into account ratio of HTTP to HTTPS or consider anchor tag `href`s which ought to be HTTPS versus image tag `src`s which conceivably could be HTTP without security risk, although it would still be a privacy risk).

Notes:
- Some emails are base64 encoded. This code assumes the given email body was decoded.
- Could detect URL [homograph][1] and [typosquatting][2] attacks: seems like this would require a very long blacklist (could be implemented on the server-side though).
- Could use a 3rd party service to check URLs against known spammers/phishers.
- Links containing the `ml` (Mali) and `tk` (Tokelau, New Zealand) domains seem to be associated with my spam mail, but without more data I don't want to assume this is always true.

## Step 2: consider using the [natural][4] NPM package to perform more robust Natural Language Processing
- Ideally, for automatic spam detection based on the email body you'd want to use legitimate NLP/ML with user feedback taken into account.
- We would also consider the HTML and CSS of the email body separately from the text content.
- To implement that you would use Node (or some other backend language) to create a spam detection service. 

## Step 3: consider methods to optimize performance (e.g., at least get it off of the main thread)

[1]:https://en.wikipedia.org/wiki/IDN_homograph_attack
[2]:https://en.wikipedia.org/wiki/Typosquatting
[3]:https://endeneu.blog/2017/03/12/anatomy-of-an-ad-based-clickjacker/
[4]:https://github.com/NaturalNode/natural