class EmailBody {
  constructor(body) {
    this.body = body;
    this.spamCheck = false;
    this.isSpam = false;
  }

  get get_factors() {
    if (this.hasOwnProperty('factors')) {
      return this.factors;
    }
      return this.calcFactors();
  }

  calcFactors() {
    // find words (this is a very naive implementation)
    let ws = this.body.split(' ');

    // create factors object
    this.factors = {
      "num_words": ws.length,
      "num_unique_words": 0,
      "words_object": {},
      "total_length": this.body.length
    };

    // filter out duplicate words and count frequency
    ws.forEach(w => {
      if (this.factors.words_object.hasOwnProperty(w)) {
        // increase freq count
        this.factors.words_object.w = this.factors.words_object.w + 1;
      }
      this.factors.words_object[w] = 1;
    });

    // update number of unique words
    this.factors.num_unique_words = Object.keys(this.factors.words_object).length;
    return this.factors;
  }
}

class Email {
  constructor(emails) {
    this.emails = emails;
  }

  get get_factors() {
    return this.calcFactors();
  }

  get total_spam() {
    let c = 0;
    this.emails.forEach(e => {
      if (e.isSpam) {
        c++;
      }
    });
    return c;
  }

  calcFactors() {
    // give us an array of the spam email's factors
    this.emails = this.emails.map(e => {
      let eb = new EmailBody(e);
      eb.get_factors;
      return eb;
    });
    return this.emails;
  }
}