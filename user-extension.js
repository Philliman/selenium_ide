var gotoLabels= {};
var whileLabels = {};
var timeToWait = 20000;
var backendFirstname_locator = "xpath=html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/form/div[5]/table/tbody/tr/td[2]/div[3]/div/div[2]/div/table/tbody/tr[2]/td[2]/input";
var backendLastname_locator = "xpath=html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/form/div[5]/table/tbody/tr/td[2]/div[3]/div/div[2]/div/table/tbody/tr[4]/td[2]/input";
var backendStreet1_locator = "xpath=html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/form/div[5]/table/tbody/tr/td[2]/div[3]/div/div[2]/div/table/tbody/tr[7]/td[2]/div[1]/input";
var backendStreet2_locator = "xpath=html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/form/div[5]/table/tbody/tr/td[2]/div[3]/div/div[2]/div/table/tbody/tr[7]/td[2]/div[2]/input";
var backendSuburb_locator = "xpath=html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/form/div[5]/table/tbody/tr/td[2]/div[3]/div/div[2]/div/table/tbody/tr[8]/td[2]/input";
var backendPostcode_locator = "xpath=html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/form/div[5]/table/tbody/tr/td[2]/div[3]/div/div[2]/div/table/tbody/tr[11]/td[2]/input";
var backendCity_locator = "xpath=html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/form/div[5]/table/tbody/tr/td[2]/div[3]/div/div[2]/div/table/tbody/tr[15]/td[2]/input";
var backendTelephone_locator = "xpath=html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/form/div[5]/table/tbody/tr/td[2]/div[3]/div/div[2]/div/table/tbody/tr[12]/td[2]/input";
var backednCountry_locator ="xpath=html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/form/div[5]/table/tbody/tr/td[2]/div[3]/div/div[2]/div/table/tbody/tr[9]/td[2]/select"
Selenium.prototype.reset = function() {
    this.initialiseLabels();
    this.defaultTimeout = Selenium.DEFAULT_TIMEOUT;
    this.browserbot.selectWindow("null");
    this.browserbot.resetPopups();
}



Selenium.prototype.initialiseLabels = function()
{
    gotoLabels = {};
    whileLabels = { ends: {}, whiles: {} };
    var command_rows = [];
    var numCommands = testCase.commands.length;
    for (var i = 0; i < numCommands; ++i) {
        var x = testCase.commands[i];
        command_rows.push(x);
    }
    var cycles = [];
    var forEachCmds = [];
    for( var i = 0; i < command_rows.length; i++ ) {
        if (command_rows[i].type == 'command')
        switch( command_rows[i].command.toLowerCase() ) {
            case "label":
                gotoLabels[ command_rows[i].target ] = i;
                break;
            case "while":
            case "endwhile":
                cycles.push( [command_rows[i].command.toLowerCase(), i] )
                break;
            case "foreach":
            case "endforeach":
                forEachCmds.push( [command_rows[i].command.toLowerCase(), i] )
                break;
        }
    }
    var i = 0;
    while( cycles.length ) {
        if( i >= cycles.length ) {
            throw new Error( "non-matching while/endWhile found" );
        }
        switch( cycles[i][0] ) {
            case "while":
                if( ( i+1 < cycles.length ) && ( "endwhile" == cycles[i+1][0] ) ) {
                    whileLabels.ends[ cycles[i+1][1] ] = cycles[i][1];
                    whileLabels.whiles[ cycles[i][1] ] = cycles[i+1][1];
                    cycles.splice( i, 2 );
                    i = 0;
                } else ++i;
                break;
            case "endwhile":
                ++i;
                break;
        }
    }

}

Selenium.prototype.continueFromRow = function( row_num )
{
    if(row_num == undefined || row_num == null || row_num < 0) {
        throw new Error( "Invalid row_num specified." );
    }
    testCase.debugContext.debugIndex = row_num;
}

Selenium.prototype.doLabel = function(){};

Selenium.prototype.doGotoLabel = function( label )
{
    if( undefined == gotoLabels[label] ) {
        throw new Error( "Specified label '" + label + "' is not found." );
    }
    this.continueFromRow( gotoLabels[ label ] );
};

Selenium.prototype.doGoto = Selenium.prototype.doGotoLabel;

Selenium.prototype.doGotoIf = function( condition, label )
{
    if( eval(condition) ) this.doGotoLabel( label );
}

Selenium.prototype.doWhile = function( condition )
{
    if( !eval(condition) ) {
        var last_row = testCase.debugContext.debugIndex;
        var end_while_row = whileLabels.whiles[ last_row ];
        if( undefined == end_while_row ) throw new Error( "Corresponding 'endWhile' is not found." );
        this.continueFromRow( end_while_row );
    }
}

Selenium.prototype.doEndWhile = function()
{
    var last_row = testCase.debugContext.debugIndex;
    var while_row = whileLabels.ends[ last_row ] - 1;
    if( undefined == while_row ) throw new Error( "Corresponding 'While' is not found." );
    this.continueFromRow( while_row );
}

Selenium.prototype.doPush= function(value, varName)
{
    if(!storedVars[varName]) {
        storedVars[varName] = new Array();
    }
    if(typeof storedVars[varName] !== 'object') {
        throw new Error("Cannot push value onto non-array " + varName);
    } else {
        storedVars[varName].push(value);
    }
}

//Selenium.prototype.doTest1= function()
//{
//    if this.isVisible("//span[@class='price']")
//    {
//        print test
//    }
//}

Selenium.prototype.doStoreRandom = function(variableName){
    random = Math.floor(Math.random()*10000000);
    storedVars[variableName] = random;
    storedVars["test"] = random;
}


Selenium.prototype.doFillCheckOutForm = function(){
    var firstnameLocator = "id=billing_firstname";
    var regionPresent = this.isElementPresent("id=billing_region_id");

    this.doType("id=billing_firstname", storedVars["firstname"]);
    this.doType("id=billing_lastname", storedVars["lastname"]);
    this.doSelect("id=billing_country_id", storedVars["country"])
    this.doType("id=billing_telephone", storedVars["telephone"]);
    this.doType("id=billing_email", storedVars["email"]);
    if(storedVars['createAccount']=='true') this.doCheck("id=customer_account_create");
    this.doType("id=billing_customer_password", storedVars["password"]);
    this.doType("id=billing_confirm_password", storedVars["password"]);
    this.doClick("//div[@id='register-customer-fields']/div[2]");
    this.doType("id=billing_street1", storedVars["street1"]);
    this.doType("id=billing_street2", storedVars["street2"]);
    this.doType("id=billing_city", storedVars["suburb"]);
    if (regionPresent&& storedVars['region']!=''){
        if (storedVars['region'].indexOf('label=')!=-1){
            this.doSelect("id=billing_region_id", storedVars["region"]);}
        else{
            this.doType("id=billing_region", storedVars["region"]);}
    }
    this.doType("id=billing_town", storedVars["city"]);
    this.doType("css=div.control-group.postcode-standard > div.controls > #billing_postcode", storedVars["postcode"]);
    this.doType("id=customer_comment", "need to add this to xml");
    // selenium.if("javascript{storedVars['shippingMethod']!=''}");
    // this.doWaitForCondition(this.isElementPresent("id=s_method_temando_free_3"), timeToWait)
    // this.doClick("id=s_method_temando_free_3");
}

Selenium.prototype.doPayByCrediCard = function(){
    if (this.isElementPresent("id=p_method_cybersource")){
        this.doEcho("radioPresent to ")
        this.doCheck("id=p_method_cybersource");}
    this.doEcho("test.test.test");
    this.doClick("id=cybersource_cc_owner");
    this.doType("id=cybersource_cc_owner", storedVars['firstname']+storedVars['lastname']);
    this.doSelect("id=cybersource_cc_type", "label=Visa");
    this.doType("id=cybersource_cc_number", "4111111111111111");
    this.doSelect("id=cybersource_expiration", "label=01 - January");
    this.doSelect("id=cybersource_expiration_yr", "label=2017");
    this.doType("id=cybersource_cc_cid", "123");
    this.doClick("id=cybersource_cc_number");
}

Selenium.prototype.doConvertCountryFormat = function(){
    storedVars['currentStore'] = this.getText("xpath=html/body/div[1]/div/div[1]/div[1]/div[1]/div/div[2]/ul/li[1]/a/span");
    if (storedVars['currentStore']=="AUS"){
        storedVars['currentStore'] = "link=Australia";}
    else if (storedVars['currentStore']=="NZ"){
        storedVars['currentStore'] = "link=New Zealand";}
    else if (storedVars['currentStore']=="UK"){
        storedVars['currentStore'] = "link=United Kingdom";}
}

// the below function won't work as the wait functions within the snippet won't work at all. Need to find a solution for it later.  
Selenium.prototype.doEmptyMyCart = function(){
    this.doClick("css=span.cart-total");
    setTimeout(function(){
    console.log('after')}, 10000);
    this.doWaitForCondition(this._isNewPageToLoad, timeToWait);
    this.doWaitForPageToLoad(30000);
    this.doEcho("wait for page to load");
    this.doWaitForCondition((this.isVisible("//span[@class='price']")), timeToWait);
    this.doEcho("");
    var myCartPrice = this.getText("//span[@class='price']");
    this.doEcho("myCartPrice is "+ myCartPrice);
    // System.out.println("price = " + myCartPrice);
    while(this.isElementPresent("link=Remove item")){
        this.doClick("link=Remove item");
        this.doEcho("remove item");
        this.doWaitForPageToLoad(30000);}
        // this.doEcho("In while loop");
        // this.doClick("css=span.cart-total");
        // this.doEcho("clicked on cart total");
        // this.doWaitForPageToLoad(30000);
        // this.doEcho("wait for page to load");
        // if(this.isElementPresent("link=Remove item")) {this.doClick("link=Remove item");
        // this.doEcho("remove item");
        // this.doWaitForPageToLoad(30000);}

        // this.doWaitForCondition(this.isVisible("//span[@class='price']"), timeToWait);
        // myCartPrice = this.getText("//span[@class='price']");
        
}


Selenium.prototype.doVerifyDetailsOnInfoPage = function(){
    this.doClick("css=span.cart-total");
    setTimeout(function(){
    console.log('after')}, 10000);
    this.doWaitForCondition(this._isNewPageToLoad, timeToWait);
    this.doWaitForPageToLoad(30000);
    this.doEcho("wait for page to load");
    this.doWaitForCondition((this.isVisible("//span[@class='price']")), timeToWait);
    this.doEcho("");
    var myCartPrice = this.getText("//span[@class='price']");
    this.doEcho("myCartPrice is "+ myCartPrice);
    // System.out.println("price = " + myCartPrice);
    while(this.isElementPresent("link=Remove item")){
        this.doClick("link=Remove item");
        this.doEcho("remove item");
        this.doWaitForPageToLoad(30000);}
        // this.doEcho("In while loop");
        // this.doClick("css=span.cart-total");
        // this.doEcho("clicked on cart total");
        // this.doWaitForPageToLoad(30000);
        // this.doEcho("wait for page to load");
        // if(this.isElementPresent("link=Remove item")) {this.doClick("link=Remove item");
        // this.doEcho("remove item");
        // this.doWaitForPageToLoad(30000);}

        // this.doWaitForCondition(this.isVisible("//span[@class='price']"), timeToWait);
        // myCartPrice = this.getText("//span[@class='price']");
        
}


Selenium.prototype.doAdminLogin = function(){
    if (this.isElementPresent("id=login")){
        this.doType("id=username", "phil.chang")
        this.doType("id=login", "Feng0919")
        this.doClick("//input[@type='submit']")
    }   
}


Selenium.prototype.doVerifyTextAndClick = function(locator, value){
    var actualValue = this.getText(locator);
    Assert.matches(value, actualValue);

    if (actualValue == value)
        this.doClick(locator);
}


Selenium.prototype.doChangePasswordFrontend = function(oldPassword, NewPassword){
    this.doType("id=current-password", oldPassword);
    this.doType("id=password", NewPassword);
    this.doType("id=confirmation", NewPassword);
    this.doClick("css=div.span6.a-right > button.btn.btn-default");
}

Selenium.prototype.doLoginAsSCM = function(username, password){
    this.doType("id=summit-email", username);
    this.doType("id=summit-pass", password);
    this.doClick("xpath=(//button[@type='submit'])[4]");
}

Selenium.prototype.doEnterDetailsAccInfoPage = function(condition){
    if(condition=="old"){
    this.doType("id=firstname", storedVars["firstname"]);
    this.doType("id=lastname", storedVars["lastname"]);
    this.doType("id=telephone", storedVars["telephone"]);
    this.doType("id=email", storedVars["email"]);
    this.doClick("//button[@title='Save']");
    }
    else if(condition=="new"){
    this.doType("id=firstname", storedVars["_firstname"]);
    this.doType("id=lastname", storedVars["_lastname"]);
    this.doType("id=telephone", storedVars["_telephone"]);
    this.doType("id=email", storedVars["_email"]);
    this.doClick("//button[@title='Save']");
    }
    else this.doEcho("No condition found, condition is required. old or new");
}

Selenium.prototype.doEnterBillingAddressFrontend = function(condition){
    if (condition=="old"){
    this.doSelect("id=country", storedVars["country"]);
    this.doType("id=firstname", storedVars["firstname"]);
    this.doType("id=lastname", storedVars["lastname"]);
    this.doType("id=street_1", storedVars["street1"]);
    this.doType("id=street_2", storedVars["street2"]);
    this.doType("id=city", storedVars["suburb"]);
    this.doType("id=town", storedVars["city"])
    this.doType("id=postcode", storedVars["postcode"]);
    this.doSelect("id=region_id", storedVars["region"]);
    this.doClick("//button[@title='Save Address']");
    }
    else if(condition=="new"){
    this.doSelect("id=country", storedVars["_country"]);
    this.doType("id=firstname", storedVars["_firstname"]);
    this.doType("id=lastname", storedVars["_lastname"]);
    this.doType("id=street_1", storedVars["_street1"]);
    this.doType("id=street_2", storedVars["_street2"]);
    this.doType("id=city", storedVars["_suburb"]);
    this.doType("id=town", storedVars["_city"])
    this.doType("id=postcode", storedVars["_postcode"]);
    this.doSelect("id=region_id", storedVars["_region"]);
    this.doClick("//button[@title='Save Address']");    
    }
    else this.doEcho("No condition found, condition is required. old or new");
}

Selenium.prototype.doVerifyBillingAddressFrontend = function(condition){
    if (condition=="old"){
    Assert.matches(storedVars["country"], this.doConvertCountryFormat(this.getSelectedValue("id=country")));
    Assert.matches(storedVars["firstname"], this.getValue("id=firstname"));
    Assert.matches(storedVars["lastname"], this.getValue("id=lastname"));
    Assert.matches(storedVars["street1"], this.getValue("id=street_1"));
    Assert.matches(storedVars["street2"], this.getValue("id=street_2"));
    Assert.matches(storedVars["suburb"], this.getValue("id=city"));
    Assert.matches(storedVars["city"], this.getValue("id=town"))
    Assert.matches(storedVars["postcode"], this.getValue("id=postcode"));
    // Assert.matches(storedVars["region"], this.getValue("id=region_id"));
    }
    else if(condition=="new"){
    Assert.matches(storedVars["_country"], this.doConvertCountryFormat(this.getSelectedValue("id=country")));
    Assert.matches(storedVars["_firstname"], this.getValue("id=firstname"));
    Assert.matches(storedVars["_lastname"], this.getValue("id=lastname"));
    Assert.matches(storedVars["_street1"], this.getValue("id=street_1"));
    Assert.matches(storedVars["_street2"], this.getValue("id=street_2"));
    Assert.matches(storedVars["_suburb"], this.getValue("id=city"));
    Assert.matches(storedVars["_city"], this.getValue("id=town"))
    Assert.matches(storedVars["_postcode"], this.getValue("id=postcode"));
    // Assert.matches(storedVars["_region"], this.getValue("id=region_id"));
    }
    else this.doEcho("No condition found, condition is required. old or new");
}


Selenium.prototype.doVerifyDetailsOnInfoPage = function(condition){
    if (condition=="old"){
    Assert.matches(storedVars['firstname'], this.getValue("id=firstname"));
    Assert.matches(storedVars['lastname'], this.getValue("id=lastname"));
    Assert.matches(storedVars['email'], this.getValue("id=email"));
    Assert.matches(storedVars['telephone'], this.getValue("id=telephone"));
    }
    else if (condition == "new"){
    Assert.matches(storedVars['_firstname'], this.getValue("id=firstname"));
    Assert.matches(storedVars['_lastname'], this.getValue("id=lastname"));
    Assert.matches(storedVars['_email'], this.getValue("id=email"));
    Assert.matches(storedVars['_telephone'], this.getValue("id=telephone"));
   }
   else this.doEcho("No condition found, condition is required. old or new");
}

Selenium.prototype.doVerifyAccountInfoAtBackend = function(condition){
    if (condition=="old"){
    Assert.matches(storedVars['firstname'], this.getValue("id=_accountfirstname"));
    Assert.matches(storedVars['lastname'], this.getValue("id=_accountlastname"));
    Assert.matches(storedVars['email'], this.getValue("id=_accountemail"));
    Assert.matches(storedVars['SCM'], this.getValue("id=_accountsummit_club_id"));
    Assert.matches(storedVars['telephone'], this.getValue("id=_accounttelephone"));
    }
    else if (condition == "new"){
    Assert.matches(storedVars['_firstname'], this.getValue("id=_accountfirstname"));
    Assert.matches(storedVars['_lastname'], this.getValue("id=_accountlastname"));
    Assert.matches(storedVars['_email'], this.getValue("id=_accountemail"));
    Assert.matches(storedVars['SCM'], this.getValue("id=_accountsummit_club_id"));
    Assert.matches(storedVars['_telephone'], this.getValue("id=_accounttelephone"));
    }
    else this.doEcho("No condition found, condition is required. old or new");
}


Selenium.prototype.doVerifyAddressBookBackend = function(condition){
    if (condition=="old"){
    Assert.matches(storedVars['firstname'], this.getValue(backendFirstname_locator));
    Assert.matches(storedVars['lastname'], this.getValue(backendLastname_locator));
    Assert.matches(storedVars['street1'], this.getValue(backendStreet1_locator));
    Assert.matches(storedVars['street2'], this.getValue(backendStreet2_locator));
    Assert.matches(storedVars['suburb'], this.getValue(backendSuburb_locator));
    Assert.matches(storedVars['postcode'], this.getValue(backendPostcode_locator));
    Assert.matches(storedVars['city'], this.getValue(backendCity_locator));
    Assert.matches(storedVars['telephone'], this.getValue(backendTelephone_locator));
    }
    else if (condition == "new"){
    Assert.matches(storedVars['_firstname'], this.getValue(backendFirstname_locator));
    Assert.matches(storedVars['_lastname'], this.getValue(backendLastname_locator));
    Assert.matches(storedVars['_street1'], this.getValue(backendStreet1_locator));
    Assert.matches(storedVars['_street2'], this.getValue(backendStreet2_locator));
    Assert.matches(storedVars['_suburb'], this.getValue(backendSuburb_locator));
    Assert.matches(storedVars['_postcode'], this.getValue(backendPostcode_locator));
    Assert.matches(storedVars['_city'], this.getValue(backendCity_locator));
    Assert.matches(storedVars['_telephone'], this.getValue(backendTelephone_locator));
    }
    else this.doEcho("No condition found, condition is required. old or new");
}


Selenium.prototype.doEnterAccountInfoAtBackend = function(condition){
    if (condition=="old"){
    this.doType("id=_accountfirstname", storedVars['firstname']);
    this.doType("id=_accountlastname",storedVars['lastname']);
    this.doType("id=_accountemail", storedVars['email']);
    this.doType("id=_accounttelephone",storedVars['telephone']);
    this.doType("id=_accountnew_password",storedVars['password']);
    }
    else if (condition == "new"){
    this.doType("id=_accountfirstname",storedVars['_firstname']);
    this.doType("id=_accountlastname",storedVars['_lastname']);
    this.doType("id=_accountemail", storedVars['_email']);
    this.doType("id=_accounttelephone",storedVars['_telephone']);
    this.doType("id=_accountnew_password",storedVars['_password']);
    }
    else this.doEcho("No condition found, condition is required. old or new DATA");
}

Selenium.prototype.doEnterAddressBookBackend = function(condition){
    if (condition=="old"){
    this.doType(backendFirstname_locator, storedVars['firstname']);
    this.doType(backendLastname_locator, storedVars['lastname']);
    this.doType(backendStreet1_locator, storedVars['street1']);
    this.doType(backendStreet2_locator, storedVars['street2']);
    this.doType(backendSuburb_locator, storedVars['suburb']);
    this.doType(backendPostcode_locator, storedVars['postcode']);
    this.doType(backendCity_locator, storedVars['city']);
    this.doType(backendTelephone_locator, storedVars['telephone']);
    this.doSelect(backednCountry_locator, storedVars['country']);
    }
    else if (condition == "new"){
    this.doType(backendFirstname_locator, storedVars['_firstname']);
    this.doType(backendLastname_locator, storedVars['_lastname']);
    this.doType(backendStreet1_locator, storedVars['_street1']);
    this.doType(backendStreet2_locator, storedVars['_street2']);
    this.doType(backendSuburb_locator, storedVars['_suburb']);
    this.doType(backendPostcode_locator, storedVars['_postcode']);
    this.doType(backendCity_locator, storedVars['_city']);
    this.doType(backendTelephone_locator, storedVars['_telephone']);
    this.doSelect(backednCountry_locator, storedVars['_country']);
    }
    else this.doEcho("No condition found, condition is required. old or new");
}


Selenium.prototype.doConvertCountryFormat = function(country){
    if (country=="AU") return "label=Australia";
    else if (country=="NZ") return "label=New Zealand";
    else if (country=="UK") return "label=United Kingdom";

}

Selenium.prototype.doClickOnVisible= function(locator){
    if(this.isVisible(locator))
        this.doClick(locator);
}


Selenium.prototype.doEnterEvoucherForm = function(condition){
    this.doSelect("id=evoucher-design", storedVars["size"]);
    if(storedVars['quantity'].indexOf('label')==0)  this.doSelect("id=custom_price_preset", storedVars["quantity"]);
    else this.doType("id=custom_price", storedVars['quantity']);
    this.doType("id=evoucher_recipient_name", storedVars["firstname"]+storedVars['lastname']);
    this.doType("id=evoucher_recipient_email", storedVars["email"]);
    this.doType("id=evoucher_sender_name", storedVars["lastname"]+storedVars["firstname"]);
    this.doType("id=evoucher_message", storedVars["testName"]);
}
