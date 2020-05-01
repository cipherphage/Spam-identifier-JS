// global limits
var iLim = 0.59; // individual limit (matches specific spam example >= 60%)
var tLim = 3.2;

// helper functions
var calcNumWords = (sf, ef) => {
  if (sf.num_words == ef.num_words) {
    return 0.2;
  } else if (Math.abs(sf.num_words - ef.num_words) < 100) {
    return 0.2;
  } else {
    return 0.0
  }
};

var calcNumUnique = (sf, ef) => {
  if (sf.num_unique_words == ef.num_unique_words) {
    return 0.2;
  } else if (Math.abs(sf.num_unique_words - ef.num_unique_words) < 50) {
    return 0.2;
  } else {
    return 0.0;
  }
};

var calcWordCF = (sf, ef) => {
  let score = 0.0;
  let uCount = 0;
  let fCount = 0;
  let words = Object.keys(sf.words_object);

  words.forEach(w => {
    if (ef.words_object.hasOwnProperty(w)) {
      uCount++;
      if ((ef[w] > 2) && (Math.abs(ef[w] - sf[w]) < 1)) {
        fCount++;
      }
    }
  });
  
  let uniqueRatio = uCount/sf.num_unique_words;
  let freqRatio = uCount > 0 ? fCount/uCount : 0.0;
  
  if (uniqueRatio < 0.6) {
    score = score + 0.0;
  } else if (uniqueRatio < 0.7) {
    score = score + 0.10;
  } else if (uniqueRatio > 0.8) {
    score = score + 0.15;
  } else if (uniqueRatio > 0.90) {
    score = score + 0.2;
  } 
  
  if (freqRatio < 0.6) {
    score = score + 0.0;
  } else if (freqRatio < 0.7) {
    score = score + 0.10;
  } else if (freqRatio > 0.8) {
    score = score + 0.15;
  } else if (freqRatio > 0.9) {
    score = score + 0.2;
  } 
  
  return score;
};

var calcLength = (sf, ef) => {
  if (sf.total_length == ef.total_length) {
    return 0.2;
  } else if (Math.abs(sf.total_length - ef.total_length) < 250) {
    return 0.2;
  } else if (Math.abs(sf.total_length - ef.total_length) < 500) {
    return 0.2;
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
    spamf.forEach(sf => {
      let rr = calcNumWords(sf.factors, ef.factors) + calcNumUnique(sf.factors, ef.factors) +
        calcWordCF(sf.factors, ef.factors) + calcLength(sf.factors, ef.factors);
      if (rr > iLim) {
        r = tLim + 1;
        return r;
      }
      return r + rr;
    });
    return r;
  });
  
  emailCollection.emails.forEach((e,i) => {
    e.spamCheck = true;
    if (results[i] > tLim) {
      e.isSpam = true;
    }
  });
  
  return emailCollection;
};