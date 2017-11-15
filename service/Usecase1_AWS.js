//var json_obj ;
var request = require('request');
var token = "Jira Token";
var urlRoot = "https://masterbot.atlassian.net/rest/api/2/";
exports.handler = (event, context, callback) => {
    //console.log(event.body);
    payload = decodeURIComponent(event.body);
    json = payload.substring(8);
    json_obj = JSON.parse(json);
    console.log(json_obj);
    callback_id = json_obj.callback_id;
    
    if(callback_id == 'C_no_user'){
        if(json_obj.actions[0].name == 'Create'){
            is_sum_la_arr = json_obj.actions[0].value.split(":");
            issueType = is_sum_la_arr[0];
            summary = process_summary(is_sum_la_arr[1]);
            labels = process_labels(is_sum_la_arr[2]);
            project_id = is_sum_la_arr[3];
            createIssue('admin',callback,issueType,summary,labels,project_id );
            
        }
        else{
            callback(null, { statusCode: 200, body: "Exit succesful" });
        }
        
    }
    else if(callback_id == 'C_user_select'){
        if(json_obj.actions[0].name == 'Exit'){
            callback(null, { statusCode: 200, body: "Exit succesful" });
        }
        else{
      is_sum_la_arr = json_obj.actions[0].value.split(":");
      issueType = is_sum_la_arr[0];
      summary = process_summary(is_sum_la_arr[1]);
      labels = process_labels(is_sum_la_arr[2]);
      project_id = is_sum_la_arr[3];
      names = json_obj.actions[0].name.split("+");
      createIssue(names[2],callback,issueType,summary,labels,project_id );
        }
    }
    else if(callback_id =='issue_selection'){
        //issue_selection(callback);
       callback(null, { statusCode: 200, body:'' }); 
    }
 //callback(null, { statusCode: 200, body:"Issue created and successfully assigned to : " + names[2] });
    
};

function process_summary(summary){
    var retSummary = '';
    summr_arr = summary.split("+");
    for(var i=0; i < summr_arr.length; i++){
      retSummary = retSummary +" "+ summr_arr[i];   
    }
    return retSummary;
}

function process_labels(labels){
    
    return labels.split(",");
    
}


function createIssue(userName, callback,issueType,summary,labels, project_id){
    
    var options = {
      url: urlRoot + 'issue/',
      method: 'POST',
      headers: {
          "content-type": "application/json",
          "Authorization": token
      },
      json: {
      "fields": {
        "project":
            {
              "key": project_id
             },
         "summary": summary,
        "description": "Creating of an issue using project keys and issue type names using the REST API",
         "issuetype": {
            "name": issueType
           },
           "assignee":{"name":userName},
           "labels" : labels
      }
      }
  };
  request(options, function (error, response, body)
    {
        if(body){
          //  var obj = JSON.parse(body);
            console.log(body);
        }
        var url = body.self;
        url = url.substring(0,url.indexOf("/rest")) + "/browse/"+body.key;
        callback(null, { statusCode: 200, body:"Issue created and assigned to: " + userName+". Link: "+ url});
    });
}
