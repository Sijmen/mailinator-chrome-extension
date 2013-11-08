var tablink;
var emailAccounts;
 function getAccount(recreate) {
  chrome.tabs.getSelected(null,function(tab) {
    var account;
    tablink = tab.url;
    var domain = url_domain(tab.url);
    if(recreate || typeof emailAccounts[domain] === 'undefined'){
      account = Math.uuid(8, 16) + '@mailinator.com';
      emailAccounts[domain] = {account:account,domain:domain,date:new Date()};
      chrome.storage.local.set({"email_accounts":emailAccounts},function(){
        console.log("Updated email accounts");
      });
    }
    else{
      account = emailAccounts[domain];
    }
    $('#account').val(account.account);
    var accountName = account.account.split("@")[0];
    // accountName = "kkonijnenberg";
    $.get("http://mailinator.com/inbox.jsp?to="+ accountName,function(data,status,xhr){
      console.log("Loaded mailinator");
      $.getJSON("http://mailinator.com/unsub?box="+accountName+"&time="+(new Date()).getTime(),function(data){
        console.log("resultaat van box beschrijving");
        console.log(data);
        $.getJSON("http://mailinator.com/pubsub?inbox="+accountName+"&address="+data.address+"&time="+(new Date()).getTime(),function(data){
        console.log("resultaat van inbox");
          console.log(data);
          $.each(data["maildir"],function(index,mail){
            addMailToList(mail);
          });
          // $('.mailinator_inbox .list').append('<tr><td>'+data.from+'</td><td>'+data.subject+'</td><td>'+data.seconds_ago+'</td></tr>');
        });
      });
      //getmailbox data
      // http://mailinator.com/unsub?box=66d5a01f&time=1383930773903
      //get mailbox messages
      //get mail from mailbox
      // http://mailinator.com/rendermail.jsp?msgid=1383928425-52294176-66d5a01f&time=1383931072728
      // $(data).find('.inbox').appendTo($('#mailinator_inbox'));
    });
    // inbox.attr('src', 'http://mailinator.com/inbox.jsp?to=' + account.account.split("@")[0]);
    // inbox.load(function(){
    //   // console.log("iframe loaded");
    //   mailinator_inbox = console.log(inbox.contents().find(".inbox"));
    // });
  });
  console.log(account);
}

function addMailToList(email){
  $('.mailinator_inbox .list').append('<tr><td><a target="_blank" href="http://mailinator.com/rendermail.jsp?msgid='+email.id+'&time='+(new Date()).getTime()+'">'+email.from+'</a></td><td><a target="_blank" href="http://mailinator.com/rendermail.jsp?msgid='+email.id+'&time='+(new Date()).getTime()+'">'+email.subject+'</a></td><td>'+email.seconds_ago+'</td></tr>');
}

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}

function refresh() {
  chrome.storage.local.get("email_accounts",function(items){
    emailAccounts = items["email_accounts"];
    console.log(emailAccounts);
    getAccount(false);
  });

}
var inbox;
function bootstrap() {
  // inbox = $('<iframe id="inbox" marginwidth="0" marginheight="0" border="0" scrolling="no" frameborder="0" />').appendTo(document.body);

  $('#random_account').click(function() {
    getAccount(true);
    return false;
  });

  refresh();
}
$(bootstrap);


// function refreshView() {
//     buildTables(getOptionsByGroup());
// }
// $(window).load(refreshView);
// function refreshSelected() {
//     chrome.extension.sendRequest({action: "hotlist_index"}, function(a) {
//         $("td").removeClass("popup_selected");
//         if (a && a.ua_index) {
//             $("td#ua_row_" + a.ua_index).addClass("popup_selected");
//             var b = getOptions();
//             $("td#ua_row_" + getUserAgentGroup(b[a.ua_index])).addClass("popup_selected")
//         }
//     })
// }
// function setCurrent(a) {
//     chrome.extension.sendRequest({action: "set",user_agent_index: a}, function(b) {
//     });
//     refreshSelected()
// }
// function addPermanentSpoof() {
//     chrome.extension.sendRequest({action: "add_preset"}, function(a) {
//     });
//     refreshSelected()
// }
// function _newRow(h, g, c, e) {
//     var i = document.createElement("td");
//     var b = document.createElement("a");
//     i.setAttribute("class", "popup_item");
//     b.appendChild(document.createTextNode(h));
//     i.setAttribute("id", "ua_row_" + e);
//     i.appendChild(b);
//     var f = document.createElement("tr");
//     f.appendChild(i);
//     if (c) {
//         i = document.createElement("td");
//         var d = document.createElement("img");
//         d.setAttribute("src", c);
//         i.appendChild(d);
//         f.appendChild(i)
//     }
//     return f
// }
// function showSubTable(b) {
//     var a = $("#sub_table_" + b);
//     a.addClass("visible");
//     a.removeClass("invisible");
//     var c = $("#group_table");
//     c.addClass("invisible");
//     c.removeClass("visible")
// }
// function buildTables(e) {
//     var a = $("#options_table");
//     a.empty();
//     var g = document.createElement("table");
//     g.setAttribute("id", "group_table");
//     a.append(g);
//     g = $("#group_table");
//     g.addClass("popup_group_table");
//     var d = 0;
//     for (var h in e) {
//         g.append(_newRow((h == "" ? "Default" : h), h, "Chevron-right.png", d));
//         var b = document.createElement("table");
//         b.setAttribute("id", "sub_table_" + d);
//         a.append(b);
//         $("#ua_row_" + d).click((function(i) {
//             return function() {
//                 showSubTable(i)
//             }
//         })(d));
//         b = $("#sub_table_" + d);
//         b.addClass("popup_sub_table");
//         var c = e[h];
//         for (var f = 0; f < c.length; f++) {
//             b.append(_newRow(c[f].title, c[f].index, null, "" + d + "_" + f));
//             b.addClass("invisible");
//             $("#ua_row_" + d + "_" + f).click((function(i) {
//                 return function() {
//                     setCurrent(i)
//                 }
//             })(c[f].index))
//         }
//         d++
//     }
//     if (d == 1) {
//         showSubTable(0)
//     }
//     chrome.extension.sendRequest({action: "show_permanent_option"}, function(i) {
//         if (i && i.show && i.show == "true") {
//             $("#group_table").append(getAddOptionRow());
//             $("#add_spoof").click(function() {
//                 addPermanentSpoof();
//                 refreshSelected()
//             })
//         }
//         $("#group_table").append(getShowOptionsRow())
//     });
//     refreshSelected()
// }
// function getAddOptionRow() {
//     var d = document.createElement("td");
//     d.setAttribute("class", "popup_item");
//     var b = document.createElement("a");
//     b.appendChild(document.createTextNode("Add Permanent Spoof"));
//     b.setAttribute("id", "add_spoof");
//     b.setAttribute("href", "#");
//     d.appendChild(b);
//     var c = document.createElement("tr");
//     c.appendChild(d);
//     return c
// }
// function getShowOptionsRow() {
//     var d = document.createElement("td");
//     d.setAttribute("class", "popup_item");
//     var b = document.createElement("a");
//     b.appendChild(document.createTextNode("Settings"));
//     b.setAttribute("href", "options.html");
//     b.setAttribute("target", "_new");
//     d.appendChild(b);
//     var c = document.createElement("tr");
//     c.appendChild(d);
//     return c
// }
// ;
