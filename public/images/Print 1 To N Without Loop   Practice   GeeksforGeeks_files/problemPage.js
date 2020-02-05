var editor = ace.edit("editor");
var Range = ace.require('ace/range').Range;
var _range;
var storedCode = false;
var language = 'cpp';
var testInput = '';
var problemType = pid > 700000 ?  'Function' : 'Full';
var themes = {"Theme Light":"ace/theme/chrome","Dark":"ace/theme/vibrant_ink","Monokai":"ace/theme/monokai","GeeksforGeeks":"ace/theme/gfg"};
var defaultCode = "";
var foldTextLength="", foldTextLengthC="", foldTextLengthCpp="", foldTextLengthJava="", foldTextLengthPython="", foldTextLengthPython3="",foldTextLengthCsharp="";
var oldCodeFoldLength = {};
var userDefaultCode = $('#defaultCodeDiv').text();
var submissionType = '';
var disabledLines = {};
var initialCode = {};
var userFunc = {};
getDefaultCode(problemType, function(systemCode) {
        defaultCode = systemCode;
        });

// function to check code is default code or not
function isCodeDefault(code) {
    for( var key in defaultCode ) {
        if(code == defaultCode[key] ) {
            return true;
        }
    }
    return false;
}

function getDisabledLines ( language, storedCode = 0 ) {
    
    var replacePos = initialCode[language].indexOf("//Position this line where user code will be pasted");
    disabledLines[language] = [];
    if (replacePos != -1) {
        if (language == "python" || language == "python3") {
            var InitialText = "#{ \n#Driver Code Starts" + "\n" +initialCode[language].substr(0,replacePos) + "\n" + " # } Driver Code Ends";
            var afterUserFunc = initialCode[language].substr(replacePos).replace("//Position this line where user code will be pasted","#{ \n#Driver Code Starts") + "\n#} Driver Code Ends";
            userFunc[language] = "\n\n" + userFunc[language] + "\n\n\n";
        } else {
            var InitialText = "// { Driver Code Starts" + "\n" +initialCode[language].substr(0,replacePos) + "\n" + " // } Driver Code Ends";
            var afterUserFunc = initialCode[language].substr(replacePos).replace("//Position this line where user code will be pasted","\n// { Driver Code Starts") + "  // } Driver Code Ends";
            userFunc[language] = "\n" + userFunc[language] + "\n";
        }
//        var afterUserFunc = initialCode[language].substr(replacePos).replace("//Position this line where user code will be pasted","\n// { Driver Code Starts") + "  // } Driver Code Ends";
        var defaultCode = InitialText  + userFunc[language] + afterUserFunc;
        disabledLines[language][0] = InitialText.split(/\r\n|\r|\n/).length;
        var codeBeforeSecondDisable =  InitialText + userFunc[language];
        disabledLines[language][1] = codeBeforeSecondDisable.split(/\r\n|\r|\n/).length;     // starting of line number after user function
        disabledLines[language][2] = defaultCode.split(/\r\n|\r|\n/).length;
    } else {
        if (language == "python" || language== "python3") {
            userFunc[language] = userFunc[language] + "\n\n\n\n";
            if ( storedCode == 0 ) {
                initialCode[language] = "#{ \n#  Driver Code Starts" + "\n" + initialCode[language] + "\n" +  "# } Driver Code Ends";
            }
            var defaultCode = userFunc[language] + initialCode[language];
            disabledLines[language][0] =  userFunc[language].split(/\r\n|\r|\n/).length;
            disabledLines[language][1] =  defaultCode.split(/\r\n|\r|\n/).length;
        } else {
            if ( storedCode == 0 ) {
                initialCode[language] = "// { Driver Code Starts" + "\n" + initialCode[language] + "// } Driver Code Ends";
            }
            var defaultCode = initialCode[language] + "\n" + userFunc[language];
            disabledLines[language][0] = initialCode[language].split(/\r\n|\r|\n/).length;
        }
    }
    return defaultCode;
}


function storedCodeDisabledLines( storedCode, language ) {
    if ( (language == "python" || language == "python3") && disabledLines[language].length !=3 ) {
        disabledLines[language][0] = storedCode.substr(0,storedCode.indexOf("Driver Code Starts")).split(/\r\n|\r|\n/).length-1;    // one new line before text 'Driver Code Starts'        
        disabledLines[language][1] = storedCode.substr(0,storedCode.indexOf("Driver Code Ends")).split(/\r\n|\r|\n/).length;
    } else {
        disabledLines[language][0] = storedCode.substr(0,storedCode.indexOf("Driver Code Ends")).split(/\r\n|\r|\n/).length;
        if (language == "python" || language== "python3") {
            disabledLines[language][1] = storedCode.substr(0,storedCode.lastIndexOf("Driver Code Starts")).split(/\r\n|\r|\n/).length-1;  //one new line before text 'Driver Code Starts'
        } else {
            disabledLines[language][1] = storedCode.substr(0,storedCode.lastIndexOf("Driver Code Starts")).split(/\r\n|\r|\n/).length;
        }
        disabledLines[language][2] = storedCode.substr(0,storedCode.lastIndexOf("Driver Code Ends")).split(/\r\n|\r|\n/).length;
    }
}

// default code  languages based on problem type
function getDefaultCode(problemType, callback) {
    if (problemType == "Full") {
        var defaultC = (def_lang == 'c') ? userDefaultCode : '#include <stdio.h>\n\nint main() {\n\t//code\n\treturn 0;\n}';
        var defaultCPP = (def_lang == 'cpp') ? userDefaultCode : '#include <iostream>\nusing namespace std;\n\nint main() {\n\t//code\n\treturn 0;\n}';
        var defaultJava = (def_lang == 'java') ? userDefaultCode : '/*package whatever //do not write package name here */\n\nimport java.util.*;\nimport java.lang.*;\nimport java.io.*;\n\nclass GFG {\n\tpublic static void main (String[] args) {\n\t\t//code\n\t}\n}';
        var defaultPython = (def_lang == 'python') ? userDefaultCode : '#code';
        var defaultCsharp = (def_lang == 'csharp') ? userDefaultCode : 'using System;\npublic class GFG {\n\tstatic public void Main () {\n\t\tConsole.WriteLine("Hello World!");\n\t}\n}';
        callback( { 'c': defaultC, 'cpp': defaultCPP , 'java': defaultJava , 'python': defaultPython, 'python3': defaultPython, 'csharp': defaultCsharp })

    } else if (problemType == "Function") {

        // below two varibles will be prepended to default code of languges(prependTextOther for c/c++/java and prependTextPython for python) to indicate user that this is a function problem.

        var prependTextPython = "''' "+"This is a function problem.You only need to complete the function given below"+" '''";

        var prependTextOther = "/*This is a function problem.You only need to complete the function given below*/";
        
        $.ajax({
            type:"GET",
            url:"/ajax/getsolution.php",
            data:{ pid : pid },
            async: false,
            success:function(data){
                var response = $.parseJSON(data);
                //var disabledLines = array('cpp'=>new Array())
                if(response[1]!=null && response[1] != '' && response[0]!=null && response[0] != '') {

                    oldCodeFoldLength['cpp'] = response[1].replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split(/\r\n|\r|\n/).length ;
                    initialCode['cpp'] = response[1];
                    userFunc['cpp'] = response[0];
                    var defaultCpp = getDisabledLines("cpp");
                }
                if(response[3]!=null && response[3] != '' && response[2]!=null && response[2] != '') {
                    oldCodeFoldLength['c'] = response[3].replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split(/\r\n|\r|\n/).length ;
                    initialCode['c'] = response[3];
                    userFunc['c'] = response[2];
                    var defaultC = getDisabledLines("c");
                }
                if(response[5]!=null && response[5] != '' && response[4]!=null && response[4] != '') {
                    oldCodeFoldLength['java'] = response[5].replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split(/\r\n|\r|\n/).length ;
                    initialCode['java'] = response[5];
                    userFunc['java'] = response[4];
                    var defaultJava = getDisabledLines("java");
                }
                if(response[7]!=null && response[7] != '' && response[6]!=null && response[6] != ''){
                    oldCodeFoldLength['python'] = response[7].replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split(/\r\n|\r|\n/).length ;
                    initialCode['python'] = response[7];
                    userFunc['python'] = response[6];
                    var defaultPython = getDisabledLines("python");
                }
                if(response[9]!=null && response[9] != '' && response[8]!=null && response[8] != '') {
                    oldCodeFoldLength['python3'] = response[9].replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split(/\r\n|\r|\n/).length ;
                    initialCode['python3'] = response[9];
                    userFunc['python3'] = response[8];
                    var defaultPython3 = getDisabledLines("python3");
                }
                if(response[11]!=null && response[11] != '' && response[10]!=null && response[10] != '') {
                    oldCodeFoldLength['csharp'] = response[11].replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split(/\r\n|\r|\n/).length ;
                    initialCode['csharp'] = response[11];
                    userFunc['csharp'] = response[10];
                    var defaultCsharp = getDisabledLines("csharp");
                }
                callback( {
                    'c': ( typeof defaultC !== 'undefined' && defaultC != '' ) ? defaultC : null,
                    'cpp': ( typeof defaultCpp !== 'undefined' && defaultCpp != '' ) ? defaultCpp : null , 
                    'java': ( typeof defaultJava != 'undefined' && defaultJava != '' ) ? defaultJava : null , 
                    'python': ( typeof defaultPython != 'undefined' && defaultPython != '' ) ? defaultPython : null , 
                    'python3':  ( typeof defaultPython3 != 'undefined' && defaultPython3 != '' ) ? defaultPython3 : null,
                    'csharp':  ( typeof defaultCsharp != 'undefined' && defaultCsharp != '' ) ? defaultCsharp : null,
                })
            },
        });
    }
}

//local storage function to test that local varibale is available in browser or not
function isLocalStorageAvailable(){
    var testString = "test";
    try {
        localStorage.setItem(testString, testString);
        localStorage.removeItem(testString);
        return true;
    }
    catch(e) {
        if(e.name == 'QuotaExceededError'){
            localStorage.clear();
            return true;
        } else{
            return false;
        }
    }
}

// get previous selected theme from local storage if not set default value
function getPreviousTheme () {
    var previousTheme = localStorage.getItem('theme');
    if(previousTheme == "null") {
        previousTheme = "Theme Light";
    }
    return previousTheme;
}

function saveEditorChanges() {

    if(isLocalStorageAvailable()) {
        var dataObject = localStorage.getItem( 'problemsGFG' );
        if(dataObject == null) {
            localStorage.setItem('problemsGFG', JSON.stringify({}));
            dataObject = localStorage.getItem( 'problemsGFG' );
        }
        dataObject = JSON.parse(dataObject);
            
        var code = editor.session.getValue();
        var testInput = '';
        var lang = language;
        if( expectedArea.value != '')
          testInput = expectedArea.value;
        else if (testArea.value != '')
          testInput = testArea.value;
        
        if(dataObject[pid] == null) {
            dataObject[pid] = {};
            localStorage.setItem('problemsGFG', JSON.stringify(dataObject));
            dataObject = JSON.parse(localStorage.getItem( 'problemsGFG' ));
        }
        dataObject[pid]["lang"] = lang;
        dataObject[pid][""+lang] = code;
        dataObject[pid]["testInput"] = testInput; 

        var theme = $(".themeLight").parent().val();   // get current selected theme
        localStorage.setItem('theme', theme);
        if (lang != '' && code != '' && !isCodeDefault(code)) {
            localStorage.setItem('problemsGFG', JSON.stringify(dataObject));
        }
    } else {
        console.log("Local Storage is not available");
    }
}

$(window).on('beforeunload', function() {
    saveEditorChanges();
});

function setEditorMode(language) {

    var mode;
    if(language == 'c') {
        mode = 'c_cpp';
        foldTextLength = foldTextLengthC;
    } else if (language == 'cpp') {
        mode = 'c_cpp';
        foldTextLength = foldTextLengthCpp;
    } else if (language == 'python') {
        mode = 'python';
        foldTextLength = foldTextLengthPython;
    } else if (language == 'python3') {
        mode = 'python';
        foldTextLength = foldTextLengthPython3;
    } else if (language == 'java') {
        mode = 'java';
        foldTextLength = foldTextLengthJava;
    } else if (language == 'csharp') {
        mode = 'csharp';
        foldTextLength = foldTextLengthCsharp;
    }
    if (problemType == 'Full') {
        editor.getSession().setMode("ace/mode/"+mode);
    } else {
        if ( disabledLines[language].length != 3 ) {  // user code either prepended or appended
            var startRange = (language == "python" || language == "python3") ? disabledLines[language][0] : 1;
            var endRange = (language == "python" || language == "python3") ? disabledLines[language][1] : disabledLines[language][0];
            disableRanges(startRange,endRange);
            editor.getSession().addFold("...",new Range(startRange-1, 0, endRange-1, 0));   // editor number starts from zero so subtracting one
        } else {  // user code is added where the text "paste your code here found".
            disableRanges(0,disabledLines[language][0]);
            disableRanges(disabledLines[language][1], disabledLines[language][2]);
            editor.getSession().addFold("...",new Range(0, 0, disabledLines[language][0]-1, 0));   // editor number starts from zero so subtracting one
            editor.getSession().addFold("...",new Range(disabledLines[language][1]-1, 0, disabledLines[language][2]-1, 0));  // editor number starts from zero so subtracting one
        }
        editor.getSession().setMode("ace/mode/"+mode);
    }
}

function disableRanges( startLine, endLine) {
    var editor     = ace.edit("editor")
        , session  = editor.getSession()
        , Range    = ace.require("ace/range").Range
        , range    = new Range(startLine-1, 0,endLine,0)
        , markerId = session.addMarker(range, "ace_selection");
    
    session.setMode("ace/mode/javascript");
    editor.keyBinding.addKeyboardHandler({
        handleKeyboard : function(data, hash, keyString, keyCode, event) {
            if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) return false;
            
            if (intersects(range)) {
                return {command:"null", passEvent:false};
            }
        }
    });
    
    before(editor, 'onPaste', preventReadonly);
    before(editor, 'onCut',   preventReadonly);
    
    range.start  = session.doc.createAnchor(range.start);
    range.end    = session.doc.createAnchor(range.end);
    range.end.$insertRight = true;
    
    function before(obj, method, wrapper) {
        var orig = obj[method];
        obj[method] = function() {
            var args = Array.prototype.slice.call(arguments);
            return wrapper.call(this, function(){
                return orig.apply(obj, args);
            }, args);
        }
        
        return obj[method];
    }
    
    function intersects(range) {
        return editor.getSelectionRange().intersects(range);
    }
    
    function preventReadonly(next, args) {
        if (intersects(range)) return;
        next();
    }
}


$(document).ready(function() {
    var langDropdown = document.getElementById('languageDropdown');
    var testArea = document.getElementById('testArea');
    var expectedArea = document.getElementById('expectedArea');
    ace.require("ace/ext/language_tools");
    editor.$blockScrolling = Infinity;
    editor.setOption("showPrintMargin",false);
    previousTheme = getPreviousTheme();
    editor.setTheme(themes[previousTheme]);
    $('.themes option:contains('+previousTheme+')').prop('selected', true);
    // Function to change sceen size of ace editor
    function toggleFullScreen() {
        var aceEditor = document.getElementById("editor");
        if (aceEditor.requestFullscreen) {
            aceEditor.requestFullscreen();
        } else if (aceEditor.msRequestFullscreen) {
            aceEditor.msRequestFullscreen();
        } else if (aceEditor.mozRequestFullScreen) {
            aceEditor.mozRequestFullScreen();
        } else if (aceEditor.webkitRequestFullscreen) {
            aceEditor.webkitRequestFullscreen();
        }
    }

    // invoke toggleFullScreen if user clicks on full screen button
    $("#zoom").click(function () {
        toggleFullScreen();
    }); 

    $(document).on('keyup',function(evt) {
        if (evt.keyCode == 27 && $(".screen-resize span").hasClass('glyphicon-resize-small')) {
            $(".mainRightDiv").insertAfter($(".editorTop"));
              $(".leftDiv").find($(".problemQuestion")).remove();
              $(".rightDiv").empty();
              $(".fullScreen").hide();
              $(".fullPageDiv").show();
              $("#full span").removeClass('glyphicon-resize-small');
              $("#full span").addClass('glyphicon-resize-full');
              $("body").css('overflow-x','auto');
      } else if(evt.keyCode == 27 && $( "body" ).hasClass( "fullScreen" ) ) {
            toggleFullScreen();
            e.preventDefault();
      }
  });

    $( ".screen-resize" ).click( function() {
       if ( $(window).width() > 768) {
          if ( $("#full span").hasClass('glyphicon-resize-full'))  {
            $(".leftDiv").append($(".problemQuestion").clone());
            $(".rightDiv").append($('.mainRightDiv'));
            $(".fullScreen").show();
            $(".fullPageDiv").hide();
            $("#full span").removeClass('glyphicon-resize-full');
            $("#full span").addClass('glyphicon-resize-small');
            $("body").css('overflow-x','hidden');
        } else if( $("#full span").hasClass('glyphicon-resize-small')) {
            $(".mainRightDiv").insertAfter($(".editorTop"));
            $(".leftDiv").find($(".problemQuestion")).remove();
            $(".rightDiv").empty();
            $(".fullScreen").hide();
            $(".fullPageDiv").show();
            $("#full span").removeClass('glyphicon-resize-small');
            $("#full span").addClass('glyphicon-resize-full');
            $("body").css('overflow-x','auto');
        }
      }
    });



    // reset editor
    $("#resetEditor").click (function() {
        if(confirm('Do you really want to reset your code in the editor?')){
            if (problemType == "Full") {
                editor.getSession().setValue(defaultCode[language]);
                setEditorMode(language);
            } else {
                var results = getDisabledLines (language, 1);
                editor.getSession().setValue(results);
                setEditorMode(language);
            }
        }
    });

    // change theme
    $(".themeLight").parent().change(function(oEvent){
        var currentTheme = $(".themeLight").parent().val();
        switch(currentTheme){
            case "Theme Light":
                editor.setTheme("ace/theme/chrome");
                break;
            case "Dark":
                editor.setTheme("ace/theme/vibrant_ink");
                break;
            case "Monokai":
                editor.setTheme("ace/theme/monokai");
                break;
            case "GeeksforGeeks":
                editor.setTheme("ace/theme/gfg");
                break;
        }
    });

    // if old key exists in local storage
    var oldStoredCode = false;
    var oldData = JSON.parse(localStorage.getItem( 'problems' ));
    var data = JSON.parse(localStorage.getItem( 'problemsGFG' ));

    if ( data == null || data[pid] == null || data[pid]["lang"] == null ) { // if new key is not present for the problem in local storage
        if( oldData != null && oldData[pid] != null && oldData[pid]["lang"] != null) {
            language = oldData[pid]["lang"];
            var oldStoredCode = (oldData[pid][""+language] != null)?oldData[pid][""+language]:oldStoredCode;
            if (oldStoredCode) {
                if ( problemType == "Full") {
                    storedCode = oldStoredCode;
                } else {
                    var lines = oldStoredCode.split("\n");
                    lines.splice(0,oldCodeFoldLength[language]+2);
                    userFunc[language] = lines.join('\n');
                    storedCode =  getDisabledLines(language,1);
                }
            }
            testInput = oldData[pid]["testInput"];
        }
    }
 

    // get local storage data
    //var data = JSON.parse(localStorage.getItem( 'problemsGFG' ));
    if( data != null && data[pid] != null && data[pid]["lang"] != null) {
        language = data[pid]["lang"];
        storedCode = (data[pid][""+language] != null)?data[pid][""+language]:storedCode;
        testInput = data[pid]["testInput"];
    }
    
    if(storedCode) {
        expectedArea.value = testInput;
        testArea.value = testInput;
        langDropdown.value=language;
        if ( problemType != "Full") {
            if ( disabledLines[language].length == 3 || language == "python" || language == "python3") {  // if code is prepended (python and python3) or added in between initial code   
                storedCodeDisabledLines( storedCode, language);
            }
        }
        editor.session.setValue(storedCode);
        setEditorMode(language);
    } else {
        if (displayLang != null && displayLang != '') {
            langDropdown.value = displayLang;
        } else if (isDefaultCode && (defaultCode[def_lang]!='' && defaultCode[def_lang] != null) ) {
            if(def_lang == 'python')
                def_lang = 'python3';
            langDropdown.value = def_lang;
        } else {
            for(var key in defaultCode) {
                if( defaultCode[key] != null ) {
                    langDropdown.value = key;
                    break;
                }
            }
        }
        onChangeLanguageSelected();
    }
    
    autoSave = setInterval(function() { saveEditorChanges() }, 5000)

    document.getElementById("languageDropdown").onchange = function() {
                                                                saveEditorChanges();
                                                                onChangeLanguageSelected()
                                                            };
    function onChangeLanguageSelected() {
        language = langDropdown.options[langDropdown.selectedIndex].value;
        var data = JSON.parse(localStorage.getItem( 'problemsGFG' ));

        if (data !=null && data[pid] != null && data[pid][""+language] != null) {
            expectedArea.value = data[pid]["testInput"];
            editor.session.setValue(data[pid][""+language]);
            storedCodeDisabledLines(data[pid][""+language],language);
        } else {
            editor.session.setValue(defaultCode[language]);
        }
        setEditorMode(language);
    }

    $('#customInputCheckbox').click(function() {
        if ($(this).is(':checked')) {
            $("#customInputTestModal").modal();
        } 
    });

    $('#customInputTestModal').on('hidden.bs.modal', function () {
        $("#customInputCheckbox").click();
    })

    var subResult;
    var isSubmissionQueued = false; 
    $("#run, #testRun, #expectedRun, #customInputTestRun, #customInputExpectedRun").click(function(e) {
        $(".out pre").show();
        e.preventDefault();
        if ( isSubmissionQueued != false ) {
            if ( confirm ("You have one request in queue alraedy. Are you sure you want to make another submission?") ) {
                clearInterval(subResult);
            } else {
                return;
            }
        }
        var requestType = $(this).attr('id');
        var data = {};
        var text = editor.getSession().getValue();
        var lines = text.split('\n');
        var code = lines.join('\n');
            
        data['problemId'] = pid;
        data['utoken'] = $("#utoken").text();
        if(requestType  == "run") {
            data['requestType'] = "solutionCheck";
            data['code'] = code; 
            data['language'] = language;
            data['track'] = track;
            submissionType = 'solutionCheck';            
        } else if (requestType == "testRun" || requestType == "customInputTestRun") {
            data['requestType'] = "testSolution";
            submissionType = 'testSolution';            
            if (requestType == "testRun") {
                data['input'] = sampleTestCases;
            } else {
                data['input'] = testArea.value;
                expectedArea.value = testArea.value;
            }
            data['code'] = code;
            data['language'] = language;
        } else if (requestType == "expectedRun") { 
                $("#customInputExpectedModal").modal();
                return;
        } else if (requestType == "customInputExpectedRun") {
            data['requestType'] = "expectedOutput";
            submissionType = 'expectedOutput';            
            data['input'] = expectedArea.value;
            testArea.value = expectedArea.value;
        }

        $(this).attr( "disabled", "disabled" );
        $( ".out pre" ).html( 'Queuing <i class="fa fa-spinner fa-spin"></i>' );

        
        isSubmissionQueued = true;
        $.ajax({
            type:"POST",
            url:"/ajax/compilerRequest.php",
            data: data,
            success:function(response) {
                response = JSON.parse(response);
                if ( response.hasOwnProperty("errorMessage") ) {
                    isSubmissionQueued = false;
                    $( ".out pre" ).html( response['errorMessage'] );
                } else {
                    if(response['status'] == 'SUCCESS') {
                        $( ".out pre" ).html('Request Queued.<br><span style="color:green">Ready for evaluation &nbsp<i class="fa fa-spin fa-spinner"></i>');
                        subResult = setInterval(function() { getSubmissionsResults(response['id'],submissionType); }, 2000);
                    } else {
                    }
                }
            },
            error: function(jqXHR, exception, errorThrown) {
                $( ".out pre" ).text( 'Error / Run TimeError.\n Try again' );
                $( ".err" ).show().delay(5000).slideUp(200, function() {
                    $(this).hide();
                });
            },
            complete: function() {
                $("#customInputTestModal").modal('hide');
                $("#customInputExpectedModal").modal('hide');
                $("#"+requestType).removeAttr( "disabled" );
            }
        });
    });

    $('body').on('click', '#show-hints', function(event){
        event.preventDefault();
        $('#hintsModal').modal('show');
    });

    var unlockHintsAfterSoln=false;
    $('body').on('click', '.locked-hint-tab', function(event){
        
        var thisTab = $(this);
        $(thisTab).disabled=true;
        var hintNum = ($(thisTab).attr('id')).slice(1); //h1
        var thisHintText = $('#hint'+hintNum).text().trim();
        
        if( unlockHintsAfterSoln || confirm(thisHintText)){
            $.ajax({
                type: "POST",
                url: '/ajax/fetchSolutions.php',
                data: { problemId:pid, requestType:'fetchHints', utoken:$('#utoken').text(), uptoHint:hintNum},
                success: function(response) {

                        if(response['status'] == 'SUCCESS'){

                            var hints = JSON.parse(response['message']);

                            //update hints
                            for(var i in hints){
                               var j = parseInt(i)+1;
                               $('#hint'+j).html(hints[i]); 
                               $('#h'+j).removeClass('locked-hint-tab');
                               $('#h'+j).html($('#h'+j).html().replace('fa-lock', 'fa-unlock'));
                            }
                            PR.prettyPrint();
                        }
                        else{
                            showSnackbarMessage(response['message']);
                        }
                },
                error: function(jqXHR, exception, errorThrown) {
                            showSnackbarMessage('Some Error Occured');
                            $('#fullSoln').html(tempText);
                },
                complete: function(){
                    $(thisTab).disabled=false;
                    //$('#fullSolnTab').html($('#fullSolnTab').html().replace('spin fa-spinner', 'unlock'));
                }
        });

        }

    });
    fullSolutionFetched=false;
    $('body').on('click', '#show-hints', function(event){
        if(userHasSolvedProblemOrViewedSolution == "1" && !fullSolutionFetched){
            $('#fullSolnTab').trigger('click');
        }
    });

    $('body').on('click', '#fullSolnTab', function(event){
        //event.preventDefault();
        if(!fullSolutionFetched){
            if(userHasSolvedProblemOrViewedSolution || confirm('If you see the full solution before solving the problem, then marks for this problem will not be added to your score.')){
                $('#fullSolnTab').html($('#fullSolnTab').html().replace('lock','spin fa-spinner'));
                var tempText = $('#fullSoln').html();
                $('#fullSoln').html('Fetching Solutions <span class="fa fa-spin fa-spinner"></span> ');
                $.ajax({
                    type: "POST",
                    url: '/ajax/fetchSolutions.php',
                    data: { problemId:pid, requestType:'allSolutions', utoken:$('#utoken').text()},
                    success: function(response) {

                            if(response['status'] == 'SUCCESS'){
                                $('#fullSoln').html(response['message']); //html 
                                $('.sol-tabs > li:first >a').trigger('click');  
                                //$('#fullSolnTab').html(' <i class="fa fa-unlock"></i> Full Solution');
                                //$('#fullSolnTab').html($('#fullSolnTab').html().replace('lock','unlock'));
                                fullSolutionFetched=true;
                                unlockHintsAfterSoln =true;
                                PR.prettyPrint();
                                $('ul.hint-tabs  li:nth-last-child(2) > a').trigger('click');
                                setTimeout(function(){$('#hintsModal .modal-body > .tab-content > div:nth-last-child(2)').removeClass('active in')}, 200);
                                //setTimeout(function(){$('ul.hint-tabs  li:nth-last-child(2) > a').trigger('click'); $('ul.hint-tabs  li:nth-last-child(2)').removeClass('active')}, 1200);
                                //setTimeout(function(){$('ul.hint-tabs  li:nth-last-child(2)').removeClass('active')}, 500);
                                //setTimeout(function(){$('#hintsModal > .tab-content  div:nth-last-child(2)').removeClass('active in')}, 500);
                            }
                            else{
                                showSnackbarMessage(response['message']);
                                $('#fullSoln').html(tempText);
                            }
                    },
                    error: function(jqXHR, exception, errorThrown) {
                                showSnackbarMessage('Some Error Occured');
                                $('#fullSoln').html(tempText);
                    },
                    complete: function(){
                        $('#fullSolnTab').html($('#fullSolnTab').html().replace('spin fa-spinner', 'unlock'));
                        setTimeout(function(){$('ul.hint-tabs  li:last-child > a').click()}, 10);
                    }
            });

            }
        }
    });

    function showSnackbarMessage(msg, duration=3000)
    {
        $('#gfg-snackbar').text(msg);
        $('#gfg-snackbar').addClass('show');
        setTimeout(function(){ $('#snackbar').removeClass('show'); }, duration);
    }

    function getSubmissionsResults(id,type) {
         $.ajax({
                type: "POST",
                url: '/ajax/submissionResult.php',
                data: { id:id, requestType:'fetchResults', utoken:$('#utoken').text(), subType:type},
                success: function(response) {
                        if ( response.trim() == "" ) return;
                        response = JSON.parse(response);
                        if(response['status'] == 'SUCCESS'){
                            clearInterval(subResult);
                            isSubmissionQueued = false;
                            $(".out pre").html('');
                            if(response.hasOwnProperty("errorMessage")) {
                                $( ".out pre" ).append( response['errorMessage'] );
                            } else {

                                $( ".out pre" ).append( response['message'] );
                                var pattern = /Correct Answer/;
                                var result = pattern.test( response['message'] );
                                var metaInfo = (response.hasOwnProperty("metaInfo")?response['metaInfo']:false);
                                if(result && metaInfo == 'C') {
                                    if (response['contestScore'] != '') {
                                        $( ".out pre" ).append( "<br><pre>Your Current Contest Score: "+response['contestScore'] +"</pre>");
                                        $("#contestScore").text(response['contestScore']);
                                    }
                                    if(response["sub_status"] == 1 ) {
                                        $('#problem' + pid).css({"color":" #808b96"});
                                        $('#list' + pid).css({"border-left" : "3px solid #4cb96b"});
                                    } else {
                                        $('#problem' + pid).css({"color":" #808b96"});
                                        $('#list' + pid).css({"border-left" : "3px solid #e63900"});
                                    }
                                }
                                if( result ) {
                                    clearInterval(problemTimer);
                                    var hasQueryParam = window.location.href.split("?")[1];
                                    if ( hasQueryParam !== undefined) {
                                        var _href = $("a.nextProblem").attr("href");
                                        $("a.nextProblem").attr("href", _href + "?" +hasQueryParam);
                                    }
                                }
                                if(!result && data['requestType'] == "solutionCheck" && metaInfo!='C') {
                                    if(response.hasOwnProperty("extraInfo")) {
                                         $( ".out pre" ).append(response['extraInfo']);
                                    } else {
                                      $( ".out pre" ).append('<br/><input class="btn btn-sm btn-primary Help" value="Need Help?" style="border-radius:0.3rem;font-size: large;padding-right: 0px;padding-left: 0px;padding-top: 5px;padding-bottom: 5px;"></input>');
                                    }
                                }

                                $('.Help').click(function() {
                                    this.disabled=true;
                                    $(".out pre").append('<br><ul><li>Generate URL of your code using <a href="https://ide.geeksforgeeks.org">ide.geeksforgeeks.org</a> and share in comments.</li>'+"<h4>OR</h4><li>Share this link in comments:<a href='/viewSol.php?subId="+response['id']+"&pid="+pid+"&user="+currentUser+"'>Link</a></li>"+"<h4>OR</h4><li>View Accepted  <a href='/problem_submissions.php?pid="+pid+"'>Solutions.</a></li>");
                                });
                            }
                        } else if ( response['status'] == 'PICKED') {
                            $(".out pre").html("Your submission has been picked for evaluation.<br><span style='color:green'>&nbspEvaluating&nbsp<i class='fa fa-spin fa-spinner'></i><span>");
                        }
                },
                error: function(jqXHR, exception, errorThrown) {
                    clearInterval(subResult);
                    $( ".out pre" ).text( 'Error / Run TimeError.\n Try again' );
                    $( ".err" ).show().delay(5000).slideUp(200, function() {
                    $(this).hide();
                });

                },
                complete: function(){
                     $("#customInputTestModal").modal('hide');
                    $("#customInputExpectedModal").modal('hide');
                }
        });

    }

});

