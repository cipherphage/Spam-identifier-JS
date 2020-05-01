// known spam is at emailCollection index 7
describe('Testing the validator', () => {
  it('should show accurate spam identification', () => {
    let result = spamIdentifier(spams, emails);
    console.log("spam test");
    console.log(result);

    expect(result.total_spam).toBe(1);

    result.emails.forEach((e, i) => {
      expect(e.spamCheck).toBe(true);
      if (i != 7) {
        expect(e.isSpam).toBe(false);
      } else {
        expect(e.isSpam).toBe(true);
      }
    });
  });
});
