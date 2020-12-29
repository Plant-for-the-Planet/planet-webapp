import webdriver, { By, until, Key} from 'selenium-webdriver';
import {
  driver,
} from './helper';
import {
  donateButton, header, donateContinue, firstName,
} from './Pages/homePage';
import { load } from './Pages/index';

describe('hompage', () => {
  beforeEach(async () => {
    await load();
  });
  // let testStatus = false;
  // afterEach(() => {
  //   if (testStatus) {
  //     driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Yaay! my sample test passed"}}');
  //   } else {
  //     driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Test failed!"}}');
  //   }
  //   testStatus = false;
  // });
  // // });
  // it('should load homepage', () => {
  //   // driver.get('https://www.trilliontreecampaign.org/').then(() => {
  //     driver.getTitle().then((title) => {
  //       expect(title).toBe("Plant trees around the world - Plant-for-the-Planet");
  //       testStatus = true;
  //       // driver.quit();
  //     });
  //   // });
  // });
  it('should click on donate', async () => {
    // load().then(async () => {
      // const val = await donateButton();
      // await val.click();
      await driver.wait(until.elementLocated(By.className('donateButton'))).click();
      await driver.switchTo().activeElement();
      await driver.wait(until.elementLocated(By.id('treeDonateContinue')), 20000).click();
      await driver.findElement(By.name('firstName')).sendKeys('Bright');
      await driver.findElement(By.name('lastName')).sendKeys('Amidiagbe');
      await driver.findElement(By.name('email')).sendKeys('captainamiedi1@gmail.com');
      await driver.findElement(By.name('address')).sendKeys('43 block');
      await driver.findElement(By.name('city')).sendKeys('surulere');
      const country = await driver.findElement(By.name('countrydropdown'));
      await country.click();
      await country.clear();
      await country.sendKeys(Key.CONTROL + "a");;
      await country.sendKeys(Key.DELETE);
      await country.sendKeys('United States of America');
      await country.sendKeys(Key.RETURN);
      await driver.findElement(By.name('zipCode')).sendKeys('85001'); // for netherland 6176 ZG
      const val1 = await driver.findElement(By.xpath("//*[text()='Continue']"));
      await val1.click();
      await driver.switchTo().activeElement();
      (await driver).sleep(100);

      await driver.switchTo().frame(driver.findElement(By.xpath("//*[@id='cardNumber']/div/iframe")));
      const cardNumber = await driver.findElement(By.name('cardnumber'));
      const cardEnabled = await driver.wait(until.elementIsEnabled(cardNumber));
      await cardEnabled.sendKeys('4242424242424242');      
      await driver.switchTo().defaultContent();

      await driver.switchTo().frame(driver.findElement(By.xpath("//*[@id='expiry']/div/iframe"))); 
      const expiryDate = await driver.findElement(By.name('exp-date'));
      const expiryDateEnabled = await driver.wait(until.elementIsEnabled(expiryDate));
      await expiryDateEnabled.sendKeys('424');
      await driver.switchTo().defaultContent();
      
      await driver.switchTo().frame(driver.findElement(By.xpath("//*[@id='cvc']/div/iframe"))); 
      const cvc = await driver.findElement(By.name('cvc'));
      const cvcEnabled = await driver.wait(until.elementIsEnabled(cvc));
      await cvcEnabled.sendKeys('242');
      await driver.switchTo().defaultContent();

      (await driver).sleep(100);
      await driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF')), 10000).click();
      await driver.wait(until.elementLocated(By.xpath("//*[text()='Thank You']")), 50000).getText().then((title) => {
        expect(title).toBe('Thank You');
        if (title.includes('Thank You')) {
          driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains header!"}}');
        } else {
          driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain header!"}}');
        }
      });
      await driver.quit();
  });
});
