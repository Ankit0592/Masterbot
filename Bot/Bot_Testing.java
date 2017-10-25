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
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

//https://code.google.com/archive/p/json-simple/downloads
public class WebTest
{
	private static WebDriver driver;
	private String bot_name = "weather_name";
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
		pw.sendKeys("xxxxxxxx");

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
		object = parser.parse(notification_users.get(1).toString());
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

}
