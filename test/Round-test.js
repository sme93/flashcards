const chai = require('chai');
const expect = chai.expect;

const Card = require('../src/Card');
const Turn = require('../src/Turn');
const Deck = require('../src/Deck');
const Round = require('../src/Round');

describe('Round', () => {
  let card1;
  let card2;
  let card3;
  let defaultDeck;
  let defaultRound;

  beforeEach(() => {
    card1 = new Card(1, 'What is Robbie\'s favorite animal',
      ['sea otter', 'pug', 'capybara'], 'sea otter');
    card2 = new Card(14, 'What organ is Khalid missing?', 
      ['spleen', 'appendix', 'gallbladder'], 'gallbladder');
    card3 = new Card(12, 'What is Travis\'s favorite stress reliever?', 
      ['listening to music', 'watching Netflix', 'bubble wrap'], 'bubble wrap');

    defaultDeck = new Deck([card1, card2, card3]);
    defaultRound = new Round(defaultDeck);
  });

  it('should be an instance of Round', () => {
    expect(defaultRound).to.be.an.instanceof(Round); 
  });

  it('should have a deck of cards', () => {
    expect(defaultRound.deck).to.equal(defaultDeck);
  });

  it('should return the current card being played', () => {
    const currentCard = defaultRound.returnCurrentCard();
     
    expect(currentCard).to.equal(card1)
  });

  it('should update the turns count when a turn is played', () => {
    defaultRound.takeTurn('sea otter');

    expect(defaultRound.turns).to.equal(1);
  });

  it('should have the next card become the current card when a turn is made', () => {
    defaultRound.takeTurn('sea otter');

    expect(defaultRound.deck.deckCards[defaultRound.turns])
      .to.equal(defaultRound.deck.deckCards[1]);
  });

  it('should evaluate the player/s guess', () => {
    const newTurn = new Turn('sea otter', card1);
    defaultRound.takeTurn('sea otter');

    expect(newTurn.evaluateGuess()).to.equal(true);
  });

  it('should store incorrect guesses by their id', () => {
    defaultRound.takeTurn('sea otter');
    defaultRound.takeTurn('spleen');

    expect(defaultRound.incorrectGuesses).to.deep.equal([14]);
  });

  it('should give feedback to the player about their guess', () => {
    const badAnswer = defaultRound.takeTurn('incorrect Answer');

    expect(badAnswer).to.equal('Incorrect!');
  });

  it('should calculate the percent correct', () => {
    defaultRound.takeTurn('sea otter');
    defaultRound.takeTurn('gallbladder');
    defaultRound.takeTurn('watching Netflix');

    expect(defaultRound.calculatePercentCorrect()).to.equal(67);
  });

  describe('when creating a new round', function() {
    it('should return a new round instance', function() {

      expect(defaultRound.endRound()).to.be.an.instanceOf(Round);
    });

    it('resets turns to zero', function() {
      const mockRound = new Round(defaultDeck)
      mockRound.takeTurn("capybara");
      mockRound.takeTurn("spleen"); 
      mockRound.takeTurn("bubble wrap");
      const round = mockRound.endRound();

      expect(round.turns).to.equal(0);
    });

    it('creates a new round from incorrect guesses', function() {
      const mockRound = new Round(defaultDeck)
      mockRound.takeTurn("first incorrect guess");
      mockRound.takeTurn("second incorrect guess"); 
      mockRound.takeTurn("third incorrect guess");
      const round = mockRound.endRound();

      expect(round.deck.deckCards.length).to.equal(3);
    });
  });  
});