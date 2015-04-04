package org.fasttrackit.dev.lesson1.numgenerator.emailOperations;


import java.util.*;
import javax.mail.*;

public class ReadEmail implements Runnable{
    private final String relevantSubject = "My guess";

    public void run() {
        Properties props = new Properties();
        props.setProperty("mail.store.protocol", "imaps");
        try {
            Session session = Session.getInstance(props, null);
            Store store = session.getStore();
            store.connect("imap.gmail.com", "echipadragon@gmail.com", "dragonul");
            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);

            int index = inbox.getMessageCount();
            while (!inbox.getMessage(index).getSubject().equals(relevantSubject)){
                index--;
            }
            Message msg = inbox.getMessage(index);

            Object content = msg.getContent();
            String emailBody = (String)content;
            System.out.println("SENT DATE:" + msg.getSentDate());
            System.out.println("SUBJECT:" + msg.getSubject());
            System.out.println("CONTENT:" + emailBody);
        } catch (Exception mex) {
            mex.printStackTrace();
        }
    }
}

