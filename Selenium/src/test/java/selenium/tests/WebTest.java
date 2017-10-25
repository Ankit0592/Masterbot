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
	
	@Test // Sad Path for notification i.e. invalid user app id
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
		
		object = parser.parse(notification_users.get(0).toString());
		jObject = (JSONObject)object;
		url = (String) jObject.get("url");
		
		obj = new URL(url);
		con = (HttpURLConnection) obj.openConnection();
		notification = "{'text': 'Invalid user has been assigned a task'}";
		 
        // Setting basic post request
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type","application/json");
		 
		// Send post request
		con.setDoOutput(true);
		wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(notification);
		wr.flush();
		wr.close();
		
		responseCode = con.getResponseCode();
		assertEquals(responseCode, 200);
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and contains(text(),'Invalid user')]"));
		assertNotNull(msg);
		
	}
	
	@Test // Happy Path for notifications in the bot channel
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
	}
	
	@Test // Happy Path for duplicate
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
		actions.sendKeys("Duplicate [10]");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//String query= "token=xoxb-260819033494-edR6l1FRV6NNbxKxwu0ZC7AN&channel=@weather_name&text=Hellooo";
		
		//String path=  "/api/chat.postMessage?"+ query;
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Found following duplicate issues']"));
		assertNotNull(msg);
	}

	@Test // Happy Path for duplicate
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
		//wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[.='Software Changes Survey']/../../div/div/span/img[@src = '/media/amazongc-micro.jpg']")));
		//1) Bug(B) 2) Task(T) 3) Exit(E)
		wait.until(new PageLoaded(lastElementId, "Please enter issue type? 1) Bug(B) 2) Task(T) 3) Exit(E)",false));
		//List<WebElement> c2 = driver.findElements(By.xpath("//ts-message[@id = '"+lastElementId+"']"));
		//System.out.println("Hi");
		/*
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		*/
		//List<WebElement> c3 = driver.findElements(By.xpath("//span[.='Please enter issue type?']"));
		//List<WebElement> c1 = driver.findElements(By.xpath("//ts-message"));
		//Issue 5143: Abhinav
		//wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(@class,'message_body') and text() = 'Please enter issue type?']")));
		//Object o= By.className("message_body");
		actions.sendKeys("B");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		wait.until(new PageLoaded(lastElementId, "Please provide summary",false));
		/*
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		*/
/*"ok, I found these issues similar to one you are creating. Click on create against most relevant issue:

	
	"*/
		actions.sendKeys("Description for this defect");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		wait.until(new PageLoaded(lastElementId, "Issue 5143: Abhinav",true));
		/*
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/

		List<WebElement> btns = driver.findElements(By.xpath("//button[@title='Issue 5143: Abhinav']"));
		WebElement btn = btns.get(btns.size() - 1);
		btn.click();
		wait.until(new PageLoaded(lastElementId, "Issue created and successfully assigned to : Abhinav",false));
		/*try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		/*wait.withTimeout(100, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
        
		WebElement msg = driver.findElement(
				By.xpath("//span[@class='msg_inline_attachment_row attachment_flush_text' and text() = 'Click the most relevant user']"));
		assertNotNull(msg);*/
	}
	
	@Test
	public void createSad() throws FileNotFoundException, IOException, ParseException{
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
		wait.until(new PageLoaded(lastElementId, "Please enter issue type? 1) Bug(B) 2) Task(T) 3) Exit(E)",false));
		actions.sendKeys("E");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		wait.until(new PageLoaded(lastElementId, "Thanks for talking to me",false));
	}
}


class PageLoaded implements ExpectedCondition<Boolean> {		
	  String lastElementId;
	  String message;
	  Boolean isButton;
		
	  public PageLoaded(String lastElementId, String message, Boolean isButton) {
	    this.lastElementId = lastElementId;	
	    this.message = message;
	    this.isButton = isButton;
	   
	  }

	  public Boolean apply(WebDriver arg0) {
		// TODO Auto-generated method stub
		WebDriver driver = (WebDriver)arg0;
		//List<WebElement> c1 = driver.findElements(By.xpath("//span[.='Create 500']/../.."));
		//List<WebElement> c2 = driver.findElements(By.xpath("//span[.='Please enter issue type?']"));
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
