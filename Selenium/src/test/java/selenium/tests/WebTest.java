package selenium.tests;

import static org.junit.Assert.*;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

//https://code.google.com/archive/p/json-simple/downloads
public class WebTest
{
	private static WebDriver driver;
	private String bot_name = "simissuebot";
	private static WebDriverWait wait;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		driver.get("https://se-projecthq.slack.com");

		wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Type in our test user login info.
		email.sendKeys("aarora6@ncsu.edu");
		pw.sendKeys("Ankit3113!");

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();
		
		// Wait until we go to general channel.
		wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("general"));
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}
	
	@Test //Use-Case:2 Sad Path for notification i.e. invalid user app id
	public void altNotification() throws FileNotFoundException, IOException, ParseException
	{	
		// Switch to #selenium-bot channel and wait for it to load.
		driver.get("https://se-projecthq.slack.com/messages/"+ bot_name);
		wait.until(ExpectedConditions.titleContains(bot_name));

		// Type something
		JSONParser parser = new JSONParser();
		String filePath = new File("").getAbsolutePath();
		filePath = filePath + ("/src/test/java/selenium/tests/mock.json");
		Object object = parser.parse(new FileReader(filePath));
		
		JSONObject jsonObject = (JSONObject)object;
		
		JSONArray notification_users = (JSONArray)jsonObject.get("notification_users");
		JSONArray notifications = (JSONArray)jsonObject.get("notifications");
		
		// Fetching invalid user url for notification
		object = parser.parse(notification_users.get(1).toString());
		JSONObject jObject = (JSONObject)object;
		String url = (String) jObject.get("url");
		
		
		// Fetching notification
		String notification = notifications.get(0).toString();
		
		// Sending notification
		
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		 
        // Setting basic post request
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type","application/json");
		 
		// Send post request
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(notification);
		wr.flush();
		wr.close();
		
		int responseCode = con.getResponseCode();
		assertEquals(responseCode, 404);
		
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	@Test //Use Case:2 Happy Path for notifications in the bot channel
	public void notification() throws FileNotFoundException, IOException, ParseException
	{	
		// Switch to #selenium-bot channel and wait for it to load.
		driver.get("https://se-projecthq.slack.com/messages/"+ bot_name);
		wait.until(ExpectedConditions.titleContains(bot_name));
		
		// Loading mock file
		JSONParser parser = new JSONParser();
		String filePath = new File("").getAbsolutePath();
		filePath = filePath + ("/src/test/java/selenium/tests/mock.json");
		Object object = parser.parse(new FileReader(filePath));
		
		JSONObject jsonObject = (JSONObject)object;
		
		JSONArray notification_users = (JSONArray)jsonObject.get("notification_users");
		JSONArray notifications = (JSONArray)jsonObject.get("notifications");
		
		// Fetching url for notification
		object = parser.parse(notification_users.get(0).toString());
		JSONObject jObject = (JSONObject)object;
		String url = (String) jObject.get("url");
		
		// Switch to user channel and wait for it to load.
		driver.get("https://se-projecthq.slack.com/messages/aarora6");
		wait.until(ExpectedConditions.titleContains("aarora6"));
		
		// Fetching notification
		String notification = notifications.get(0).toString();
		
		// Sending notification
		
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		 
        // Setting basic post request
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type","application/json");
		 
		// Send post request
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(notification);
		wr.flush();
		wr.close();
		
		int responseCode = con.getResponseCode();
		assertEquals(responseCode, 200);
		
		wait.withTimeout(10000, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and contains(text(),'UPDATE:')]"));
		assertNotNull(msg);
		
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test //Use Case-3 Happy Path for duplicate
	public void duplicate() throws FileNotFoundException, IOException, ParseException
	{	
		// Switch to #selenium-bot channel and wait for it to load.
		driver.get("https://se-projecthq.slack.com/messages/"+ bot_name);
		wait.until(ExpectedConditions.titleContains(bot_name)); 
		
		
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Duplicate 1");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();		
		
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
        
		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Found following duplicate issues:']"));
		assertNotNull(msg);
		
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	@Test // Use Case-3 Sad case
	public void DuplicateSadCase() throws FileNotFoundException, IOException, ParseException{	
		// Switch to #selenium-bot channel and wait for it to load.
		driver.get("https://se-projecthq.slack.com/messages/"+ bot_name);
		wait.until(ExpectedConditions.titleContains(bot_name)); 
		
		
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Duplicate 4");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
        
		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Cannot find any duplicate issues']"));
		assertNotNull(msg);
		
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Test //Use Case-1 Happy Path for create issue
	public void create() throws FileNotFoundException, IOException, ParseException
	{	
		// Switch to #selenium-bot channel and wait for it to load.
		driver.get("https://se-projecthq.slack.com/messages/"+ bot_name);
		wait.until(ExpectedConditions.titleContains(bot_name)); 
		
		
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		
		
		actions.sendKeys("Create 500");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		List<WebElement> c1 = driver.findElements(By.xpath("//span[.='Create 500']/../.."));
		WebElement lastElement = c1.get(c1.size()-1);
		String lastElementId = lastElement.getAttribute("id");
		wait.until(new ElementCheck(lastElementId, "Please enter issue type? 1) Bug(B) 2) Task(T) 3) Exit(E)",false));
		actions.sendKeys("B");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		wait.until(new ElementCheck(lastElementId, "Please provide summary",false));
		actions.sendKeys("Description for this defect");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		wait.until(new ElementCheck(lastElementId, "Issue 5143: Abhinav",true));
		List<WebElement> btns = driver.findElements(By.xpath("//button[@title='Issue 5143: Abhinav']"));
		WebElement btn = btns.get(btns.size() - 1);
		btn.click();
		wait.until(new ElementCheck(lastElementId, "Issue created and successfully assigned to : Abhinav",false));
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test // Use Case-1 Happy Path for create issue: Exit from bot
	public void createExitCase() throws FileNotFoundException, IOException, ParseException{
		driver.get("https://se-projecthq.slack.com/messages/"+ bot_name);
		wait.until(ExpectedConditions.titleContains(bot_name)); 
		
		
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		
		
		actions.sendKeys("Create 500");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		List<WebElement> c1 = driver.findElements(By.xpath("//span[.='Create 500']/../.."));
		WebElement lastElement = c1.get(c1.size()-1);
		String lastElementId = lastElement.getAttribute("id");
		wait.until(new ElementCheck(lastElementId, "Please enter issue type? 1) Bug(B) 2) Task(T) 3) Exit(E)",false));
		actions.sendKeys("E");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		wait.until(new ElementCheck(lastElementId, "Thanks for talking to me",false));
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test // Use Case-1 Sad Path for create issue No user has worked on similar issue
	public void createSadCase() throws FileNotFoundException, IOException, ParseException{
		driver.get("https://se-projecthq.slack.com/messages/"+ bot_name);
		wait.until(ExpectedConditions.titleContains(bot_name)); 
		
		
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		
		
		actions.sendKeys("Create 600");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		List<WebElement> c1 = driver.findElements(By.xpath("//span[.='Create 600']/../.."));
		WebElement lastElement = c1.get(c1.size()-1);
		String lastElementId = lastElement.getAttribute("id");
		wait.until(new ElementCheck(lastElementId, "Please enter issue type? 1) Bug(B) 2) Task(T) 3) Exit(E)",false));
		actions.sendKeys("T");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		wait.until(new ElementCheck(lastElementId, "Please provide summary",false));
		actions.sendKeys("old issue");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		wait.until(new ElementCheck(lastElementId, "No user has worked on similar issues",false));
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}


class ElementCheck implements ExpectedCondition<Boolean> {		
	  String lastElementId;
	  String message;
	  Boolean isButton;
		
	  public ElementCheck(String lastElementId, String message, Boolean isButton) {
	    this.lastElementId = lastElementId;	
	    this.message = message;
	    this.isButton = isButton;
	   
	  }

	  public Boolean apply(WebDriver arg0) {
		// TODO Auto-generated method stub
		WebDriver driver = (WebDriver)arg0;
		List<WebElement> c2;
		if(isButton){
			 c2 = driver.findElements(By.xpath("//button[@title='"+message+"']/../../../../../../../../.."));
		}
		else{
		 c2 = driver.findElements(By.xpath("//span[.='"+message+"']/../.."));
		}
		if(c2.size()==0){
			return false;
		}
		WebElement latest = c2.get(c2.size()-1);
		int ret = latest.getAttribute("id").compareTo(lastElementId) ;
		return ret >= 1;
		
		
	}
	}
