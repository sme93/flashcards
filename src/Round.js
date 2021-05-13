/* eslint-disable no-console */
const Turn = require("./Turn");
const data = require('./data');
const prototypeQuestions = data.prototypeData;
const Card = require('./Card');
const Deck = require('./Deck');

class Round {
  constructor(deck) {
    this.deck = deck;
    this.turns = 0;
    this.incorrectGuesses = [];
  }

  returnCurrentCard() {
    return this.deck.deckCards[this.turns];
  }

  takeTurn(userGuess) {
    const currentCard = this.returnCurrentCard();
    const turn = new Turn(userGuess, currentCard);
    this.turns++;
    turn.evaluateGuess();
    if (turn.evaluateGuess() === false) {
      this.incorrectGuesses.push(turn.card.id);
    }
    return turn.giveFeedback();
  }

  calculatePercentCorrect() {
    const correct = this.turns - this.incorrectGuesses.length;
    const percentCorrect = ((correct / this.turns) * 100);
    return Math.round(percentCorrect); 
  }

  endRound() {
    const message = `**ROUND OVER!**
    You answered ${this.calculatePercentCorrect()}% of the questions correctly!`
    const successMessage = `NICE JOB! YOU GOT THEM ALL RIGHT!`
    
    console.log(message);
    if (this.incorrectGuesses.length) {
      return this.retryRound();
    } 
    
    console.log(successMessage);
    const deck = new Deck([]);
    return new Round(deck);
  }

  retryRound() {
    const retryMessage = `NICE TRY. 
        Try again with the cards you missed the first time!`
    console.log(retryMessage)
    const cards = prototypeQuestions.reduce((acc, question) => {
      if (this.incorrectGuesses.includes(question.id)) {
        acc.push(new Card(
          question.id, 
          question.question, 
          question.answers, 
          question.correctAnswer)
        );
      }
      return acc;
    }, []);
    const deck = new Deck(cards);
    return new Round(deck);
  }
}

module.exports = Round;