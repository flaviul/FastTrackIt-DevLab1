package org.fasttrackit.dev.lesson1.numgenerator;

import org.fasttrackit.dev.lesson1.numgenerator.emailOperations.SendEmail;

/**
 * Created by condor on 29/11/14.
 * FastTrackIT, 2015
 */


/* didactic purposes

Some items are intentionally not optimized or not coded in the right way

FastTrackIT 2015

*/

public class NumGeneratorBusinessLogic {

    public static final int MIN_ALLOWED_NUMBER = 2;
    public static final int MAX_ALLOWED_NUMBER = 40;
    public static final int DEFAULT_ALLOWED_NUMBER = 20;

    private boolean isFirstTime = true;
    private boolean successfulGuess;
    private int numberOfGuesses;
    private int generatedNumber;
    private int maxNumber = DEFAULT_ALLOWED_NUMBER;
    private String hint;

    public int getMaxNumber() {
        return maxNumber;
    }

    public void setMaxNumber(int maxNumber) {
        this.maxNumber = maxNumber;
    }

    public NumGeneratorBusinessLogic(){
        resetNumberGenerator();
    }

    public boolean getSuccessfulGuess(){
        return successfulGuess;
    }

    public String getHint(){
        return hint;
    }

    public int getNumGuesses(){
        return numberOfGuesses;
    }

    public boolean isFirstTime(){
        return isFirstTime;
    }

    public void resetNumberGenerator(){
        isFirstTime = true;
        numberOfGuesses = 0;
        hint = "";
    }

    public boolean determineGuess(int guessNumber){
        if (isFirstTime) {
            generatedNumber = NumGenerator.generate(maxNumber);
            System.out.println("gennr:"+generatedNumber);
            isFirstTime = false;
        }
        numberOfGuesses++;
        if (guessNumber == generatedNumber) {
            hint="";
            successfulGuess = true;

            // Starting a new thread to send the confirmation email in parallel
            SendEmail sendEmail = new SendEmail("You won!", "Congratulations! \nYou guessed the right number after " + getNumGuesses() + " guesses!" , "echipadragon@gmail.com");
            Thread thread = new Thread(sendEmail);
            thread.start();

        } else if (guessNumber < generatedNumber) {
            hint = "higher";
            successfulGuess = false;
        } else if (guessNumber > generatedNumber) {
            hint = "lower";
            successfulGuess = false;
        }
        return successfulGuess;
    }


}