// helper functions
var calcNumWords = (sf, ef) => {
  if (sf.num_words == ef.num_words) {
    return 0.2;
  } else if (Math.abs(sf.num_words - ef.num_words) < 15) {
    return 0.1;
  } else {
    return 0.0
  }
};

var calcNumUnique = (sf, ef) => {
  if (sf.num_unique_words == ef.num_unique_words) {
    return 0.2;
  } else if (Math.abs(sf.num_unique_words - ef.num_unique_words) < 3) {
    return 0.1;
  } else {
    return 0.0;
  }
};

var calcWordCF = (sf, ef) => {
  let score = 0.0;
  let uCount = 0;
  let fCount = 0;

  for (let w in sf.words_object) {
    if (ef.hasOwnProperty(w)) {
      uCount++;
      if ((ef[w] > 3) && (Math.abs(ef[w] - sf[w]) < 1)) {
        fCount++;
      }
    }
  }

  let uniqueRatio = uCount/sf.num_unique_words;
  let freqRatio = fCount/uCount;

  if (uniqueRatio > 0.95) {
    score = score + 0.2;
  } else if (uniqueRatio > 0.9) {
    score = score + 0.15;
  } else if (uniqueRatio > 0.85) {
    score = score + 0.10;
  } else if (uniqueRatio > 0.8) {
    score = score + 0.05;
  } else {
    score = score + 0.0;
  }

  if (freqRatio > 0.95) {
    score = score + 0.2;
  } else if (freqRatio > 0.9) {
    score = score + 0.15;
  } else if (freqRatio > 0.85) {
    score = score + 0.10;
  } else if (freqRatio > 0.8) {
    score = score + 0.05;
  } else {
    score = score + 0.0;
  }

  return score;
};

var calcLength = (sf, ef) => {
  if (sf.total_length == ef.total_length) {
    return 0.2;
  } else if (Math.abs(sf.total_length - ef.total_length) < 25) {
    return 0.15;
  } else if (Math.abs(sf.total_length - ef.total_length) < 50) {
    return 0.10;
  } else {
    return 0.0
  }
};

// main function, marks spam and returns emails
// spams, emails: array
var spamIdentifier = (spams, emails) => {
  let spamCollection = new Email(spams);
  let emailCollection = new Email(emails);
  let spamf = spamCollection.get_factors;
  let emailf = emailCollection.get_factors;

  let results = emailf.map(ef => {
    let r = 0.0;
    spamf.forEach((sf, i) => {
      r = calcNumWords(sf, ef) + calcNumUnique(sf, ef) +
        calcWordCF(sf, ef) + calcLength(sf, ef);
      return r;
    });
    return r;
  });
  
  emailCollection.emails.forEach((e,i) => {
    e.spamCheck = true;
    if (results[i] > 3.2) {
      e.isSpam = true;
    }
  });
  console.log("spam check");
  console.log(emailCollection);
  return emailCollection;
};