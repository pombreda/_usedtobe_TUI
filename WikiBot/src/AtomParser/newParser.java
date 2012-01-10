/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package AtomParser;

import WikiBot.newWikiEditor;

/**
 *
 * 
 */
public class newParser {
    
    private String username;
    private String message;
    private static final String REGEX_TUI = "^(.*)#TUI (TUI:.*)(TUI:.*)";
    private newWikiEditor editor;
    public newParser(String username,String msg)
    {
        this.username = username;
        this.message = msg;
        if(isValidTuiMessage())
        {
            editor = new newWikiEditor(username,this.message);
        }
    }
    
    public boolean isValidTuiMessage() {
        boolean isValid = false;
        message = message.replace(" :", " TUI:");
        if (message.matches(REGEX_TUI)) {
            isValid = true;
        }
        return isValid;
    }
    
}