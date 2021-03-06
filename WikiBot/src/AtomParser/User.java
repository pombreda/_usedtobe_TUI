
package AtomParser;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 *
 * 
 */
public class User {

    private int userIndex;
    private String title;
    private String name;
    private String statusLink;
    private URL url;
    private String published;
    private final static String TITLE = "title";
    private final static String AUTHOR = "author";
    private final static String LINK = "link";
    private final static String PUBLISHED = "published";
    private final static String HREF = "href";

    public User() {
    }

    public void setUser(Element el) {
        title = getTextValue(el, TITLE);
        name = getTextValue(el, AUTHOR);
        statusLink = getTextValue(el, LINK);
        published = getTextValue(el, PUBLISHED);
        try {
            url = new URL(statusLink);

        } catch (MalformedURLException ex) {
            Logger.getLogger(User.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private String getTextValue(Element el, String tagName) {
        String textVal = null;
        NodeList nl = el.getElementsByTagName(tagName);
        if (nl != null && nl.getLength() > 0) {
            Element ele = (Element) nl.item(0);
            if (!tagName.equalsIgnoreCase(AUTHOR)) {
                if (tagName.equalsIgnoreCase(LINK)) {
                    statusLink = ele.getAttribute(HREF);
                    return statusLink;
                } else {
                    textVal = ele.getFirstChild().getNodeValue();
                }
            } else {
                NodeList nlAuthor = ele.getChildNodes();
                String[] author = new String[2];
                if (nlAuthor != null && nlAuthor.getLength() > 0) {
                    for (int i = 0; i < nlAuthor.getLength(); i++) {
                        Element element = (Element) nlAuthor.item(i);
                        author[i] = element.getFirstChild().getNodeValue();
                    }

                    return getNameFromURI(author[1]);
                }
            }
        }
        return textVal;
    }

    private String getNameFromURI(String uri) {
        return uri.substring(uri.lastIndexOf('/') + 1, uri.length());
    }

    public String getUserName() {
        return name;
    }

    public int getUserIndex() {
        return userIndex;
    }

    public String getTitle() {
        return title;
    }

    public URL getStatusUrl() {
        return url;
    }

    public String getPublished() {
        return published;
    }

    public void setUserIndex(int index) {
        userIndex = index;
    }
}
