/*---------------------------------Start of Programme Search 2017-18 Created and Commented By : Ritesh Tandon--------------------------------------------*/

//Fixed the issue of old url where the stream or other program does not exists for new search : Ritesh Tandon (13 March 2018)

/*---------------------------------Define Web Service Path and Local Variables-------------------------*/
//Set the webservice path for programsearch
var path = "//services.lpu.in/";

//path="http://localhost:64383/";

//set if running from local
//path="http://172.17.60.9/lpuservice/";

//Get the default tab coming from another page
var ta = "Details";
if (window.location.href.indexOf('#') != -1) {
    ta = window.location.href.substring(window.location.href.indexOf('#') + 1);
}
else if (sessionStorage.pagetab != undefined) {
    ta = sessionStorage.pagetab;
}
else {
    ta = "Details";
}

//Global Variables
var isScholarship=false,standing_id = 0, discipline_id = 0, stream_id = 0, officialcode = "",program_id="", programname = "",qualname="",discname="",streamname="",curl="", applynowlink = "", plist = "", pagetab = ta, filter = "all", search_clicked = false, no_stream = false, onlysearchbar = false, isMobile = false;

//For dynamic url store the parameters in this array
var rurl = new Array();
/*---------------------------------End of Define Web Service Path and Local Variables-------------------------*/
/*---------------------------------Define Functions Which are Major Functions-------------------------*/

//--------------------------------Start of SplitUrl Function----------------------------------------------------
//The spliturl method is called when the document is loaded to check the dynamic url
function spliturl() 
{	
			//alert('called spliturl');
			//Get the window url
			var major = window.document.URL;
			
			//--------------------Dry Run--------------------------------------
			//For testing i am adding static url and parameters
			//major="www.lpu.in/engineering/diploma-in-computer-science";

			if(major.indexOf("172.17.60.93")!=-1){
				//curl="/engineering/diploma-in-computer-science";
				//curl="http://172.17.60.93/lpu2016/international/newlpu/programmes/management/bba"
				curl=major.substr(major.indexOf("/programmes"));
				curl=curl.replace('/programmes','');
				//console.log(curl);
			}
			else if(major.indexOf("dev.lpu.in")!=-1){
				//curl="/lpu2016/newlpu/engineering/diploma-in-computer-science";
				//curl="http://dev.lpu.in/international/programmes/management/mba"
				curl=major.substr(major.indexOf("/programmes"));
				curl=curl.replace('/programmes','');
				//console.log(curl);
			}
			else if(major.indexOf("lpu.in")!=-1){
				//curl="/lpu2016/newlpu/engineering/diploma-in-computer-science";
				//curl="http://lpu.in/international/programmes/management/mba"
				curl=major.substr(major.indexOf("/programmes"));
				curl=curl.replace('/programmes','');
				//console.log(curl);
			}
			
			if(curl.indexOf("program-details-dev.php")==-1 && curl.indexOf("program-details.php")==-1){
			//Call the webservice which passes url and sends back json data
			$.get(path + "api/programsearch/GetPerameterfromInternationalUrl?url="+curl).done(
                function (data) {
                    if (data != null && data.length>0) {
						
						//alert('Url Found');
						//Get the data form webservice
						filter="All";//This is not coming from webservice
						officialcode=data[0].OfficialCode;
						programname=data[0].ProgramName.trim();
						program_id=data[0].ProgramId;
						standing_id = data[0].StandingId;
						qualname=data[0].Qualification;
						discipline_id =data[0].DisciplineId;
						discname=data[0].Discipline;
						stream_id = data[0].StreamId;
						streamname = data[0].Stream;
						
						//generate the rurl array from the above parameters
						rurl[0]=filter;
						rurl[1]=qualname.trim();
						rurl[2]=discname.trim();
						if(streamname!="" && streamname!=null)
							rurl[3]=streamname.trim();
						rurl[4]=programname.trim();
						rurl[5]="Details";
						//alert('calling getresult based on details '+rurl);
						
						//Bind the search bar based on the parameters
						//Bind type
						$("#seltype input[title='"+filter+"']").prop('checked',true);
						typeclicked();
						$("#selstanding > div > input[title='"+qualname+"']").prop('checked',true);
						if(streamname!=""){
							$("#stream > div[class='ps-content pb5']").text(streamname);
						}
						getresult();
					}
					else{
						//this is for custom url which is like all/10th now split
						var a = major.substr(major.indexOf("programmes/")+11);						
						if(a.indexOf('#')!=-1)
							a=a.substr(0,a.indexOf('#')).split('/');
						else
							a=a.split('/');

						//logic for old url
						var k = 0;
						for (i = 0; i < a.length; i++) {
							if (a.length > 4 && a.length == 6 && k == 4) {
							//alert(a[i-1]);
							if (a[i - 1] != "Engineering" && a[i - 1] != "Sciences" && a[i - 1] != "Design") {
								//alert('I got no stream');
								//console.clear();
								//console.log('a.length is '+a.length+' Setting it  as null '+a[i] + " --- " + i+' a[k] is '+a[k]);
								rurl.push('');
								k++;
								i--;
							}
							else {
								rurl.push(decodeURIComponent(a[i].trim()).trim());
								//console.log(a[i] + " --- " + i);
								k++;
							}
							}
							else {
							rurl.push(decodeURIComponent(a[i].trim()).trim());
							//console.log(a[i] + " --- " + i);
							k++;
							}
						}
						
						if(rurl.length>=1){
							if($("#seltype > div > input[value='"+rurl[0]+"']")!=null && $("#seltype > div > input[value='"+rurl[0]+"']")!=undefined){
								$("#seltype > div > input[value='"+rurl[0]+"']").prop('checked',true);
								//alert('type clicked '+rurl[0]);
								typeclicked();
							}
						}
						
						
						if(rurl.length>3){
							//alert(rurl[3]);
							rurl[2] = rurl[2].replace(/_/g,' ');
							if(rurl[4]!=undefined){
								rurl[3] = rurl[3].replace(/_/g,' ');
								rurl[4] = rurl[4].replace(/_/g,' ');
							}
							else{
								rurl[4] = rurl[3].replace(/_/g,' ');
							}
							rurl[5] = "Details";
						}
						
						
						
						//ProcessAjax
						var response = {};
						var stateObj = {};
						if(major.indexOf("172.17.60.93")!=-1){
							curl="/lpu2016/newlpu/international/programmes/ProgramSearch.php";
							//alert('making url as '+curl);	
						}
						else{
							curl="/international/programmes/ProgramSearch.php";
							//alert('making url as '+curl);							
						}
						//dynamic url
						processAjaxData(response, stateObj,curl);
					}
				});
			}
			//----------------------End of Dry Run---------------------------------
}
//--------------------------------End of SplitUrl Function----------------------------------------------------

function showwhich(p){
	
	//$("#CourseType").addClass('hide');
	//$("#Qualification").addClass('hide');
	//$("#Discipline").addClass("hide");
	//$("#Stream").addClass('hide');
	//$("#Programme").addClass('hide');
	$("#resultpanels .tabs-panel").removeClass("is-active");
	$("#Programme").hide();
	$('.tabs-panel').css({padding:'0 0'});
	
	if(isMobile){
		$("#seldiscipline").css('float','none');
	}
	else{
		$("#seldiscipline").css('float','left');
	}
	
	if(p=="type"){
		$("#CourseType").removeClass("hide");
		$("#CourseType").addClass("is-active");
		$("#CourseType > div").show();
		$("#litype").attr('aria-expanded',true);
		$("#litype").attr('aria-selected',true);
		$("a[href='#CourseType']").attr('aria-expanded',true);
		$("a[href='#CourseType']").attr('aria-selected',true);
		$("#CourseType").show();

		//hide all previous opened panels
		$("#Qualification").hide();
		$("#Discipline").hide();
		$("#Stream").hide();
		$("#Programme").hide();
	}
	else if(p=="qual"){
		//Now show the qualification and activate its 
		$("#CourseType").removeClass("is-active");
		$("#CourseType > div").hide();
		$("#Qualification").removeClass("hide");
		$("#Qualification").addClass("is-active");
		$("#Qualification > div[class='col-md-12 ps-bar-details']").show();
		
		//For mobile version
		$("#litype").attr('aria-expanded',false);
		$("#litype").attr('aria-selected',false);
		$("#litype").removeClass('is-active');
		$("#CourseType").removeClass('is-active');
		$("#CourseType").attr('aria-hidden',true);
		$("#CourseType").hide();
		$("a[href='#CourseType']").attr('aria-expanded',false);
		$("a[href='#CourseType']").attr('aria-selected',false);
		//mobile version show qualification
		$("#liqual").attr('aria-expanded',true);
		$("#liqual").attr('aria-selected',true);
		$("#liqual").addClass('is-active');
		$("#Qualification").attr('aria-hidden',false);
		$("#Qualification").show();
		$("a[href='#Qualification']").attr('aria-expanded',true);
		$("a[href='#Qualification']").attr('aria-selected',true);
		
		if($("#lidisc").hasClass('ps-text')){
			$("#litype").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text2");
			$("#liqual").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text1");
		}
		else{
			$("#litype").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text2");
			$("#liqual").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text2");
		}
		
		//hide previously opened panels
		$("#Discipline").hide();
		$("#Stream").hide();
		$("#Programme").hide();
	}
	else if(p=="discipline"){
		
		//remove float:left from disciplinebox class
		
		$("#Qualification").removeClass("is-active");
		$("#Qualification > div").hide();
		$("#Stream").removeClass("is-active");
		$("#Stream > div").hide();
		
		//alert('isMobile is '+isMobile);
		if(!isMobile){
			//alert($("#Discipline").css('display'));
			$("#Discipline").toggle();
			$("#Discipline").removeClass("hide");
			$("#Discipline").addClass("is-active");
			$("#Discipline > div[class='col-md-12 ps-bar-details']").show();
		}
		else{
			$("#Discipline").removeClass("hide");
			$("#Discipline").addClass("is-active");	
			$("#Discipline").show();
			$("#Discipline > div[class='col-md-12 ps-bar-details']").show();
			
			//For mobile version
			$("#liqual").attr('aria-expanded',false);
			$("#liqual").attr('aria-selected',false);
			$("#liqual").removeClass('is-active');
			$("#Qualification").removeClass('is-active');
			$("#Qualification").attr('aria-hidden',true);
			$("#Qualification").hide();
			$("a[href='#Qualification']").attr('aria-expanded',false);
			$("a[href='#Qualification']").attr('aria-selected',false);
			//mobile version show qualification
			$("#lidisc").attr('aria-expanded',true);
			$("#lidisc").attr('aria-selected',true);
			$("#lidisc").addClass('is-active');
			$("#Discipline").attr('aria-hidden',false);
			$("a[href='#Discipline']").attr('aria-expanded',true);
			$("a[href='#Discipline']").attr('aria-selected',true);
		}

		if($("#liqual").hasClass('ps-text1')){
			$("#liqual").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text2");
			$("#lidisc").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text1");
		}
		
		if($("#licourse").hasClass('ps-text')){
			$("#lidisc").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text1");
		}
		

	}
	else if(p=="stream"){
		
		//change the classes of top boxes to col-md-3
		$("#litype").removeClass('col-md-4').removeClass('col-md-3').addClass('col-md-2');
		$("#liqual").removeClass('col-md-4').removeClass('col-md-3').addClass('col-md-2');
		$("#lidisc").removeClass('col-md-4').removeClass('col-md-3').addClass('col-md-2');
		$("#listream").removeClass('col-md-4').removeClass('col-md-3').addClass('col-md-3');
		$("#licourse").removeClass('col-md-4').removeClass('col-md-3').addClass('col-md-3');
		
		if(!isMobile){
			$("#Discipline").removeClass("is-active");
			$("#Discipline >div").hide();
			$("#Stream").removeClass("hide");
			$("#Stream").addClass("is-active");
			$("#Stream").show();
			$("#Stream > div").toggle();
		}
		else{
			$("#Discipline").removeClass("is-active");
			$("#Discipline >div").hide();
			$("#Stream").removeClass("hide");
			$("#Stream").addClass("is-active");
			$("#Stream").show();
			$("#Stream > div").show();
			//For mobile version
			$("#lidisc").attr('aria-expanded',false);
			$("#lidisc").attr('aria-selected',false);
			$("#lidisc").removeClass('is-active');
			$("#Discipline").removeClass('is-active');
			$("#Discipline").attr('aria-hidden',true);
			$("#Discipline").hide();
			$("a[href='#Discipline']").attr('aria-expanded',false);
			$("a[href='#Discipline']").attr('aria-selected',false);
			//mobile version show discipline
			$("#listream").attr('aria-expanded',true);
			$("#listream").attr('aria-selected',true);
			$("#listream").addClass('is-active');
			$("#Stream").attr('aria-hidden',false);
			$("#Stream").show();
			$("a[href='#Stream']").attr('aria-expanded',true);
			$("a[href='#Stream']").attr('aria-selected',true);
		}
		
		$("#lidisc").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text2");
		$("#listream").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text1");
		if($("#licourse").hasClass('ps-text')){
			$("#licourse").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text");	
		}
	}
	else if(p=="course"){
		
		if($("#listream").hasClass('hide')){
			$("#litype").removeClass('col-md-4').removeClass('col-md-2').addClass('col-md-3');
			$("#liqual").removeClass('col-md-4').removeClass('col-md-2').addClass('col-md-3');
			$("#lidisc").removeClass('col-md-4').removeClass('col-md-2').addClass('col-md-3');
			$("#licourse").removeClass('col-md-4').removeClass('col-md-2').addClass('col-md-3');
		}
		else{
			
		}
			//stream was opened
			$("#listream").attr('aria-expanded',false);
			$("#listream").attr('aria-selected',false);
			$("#listream").removeClass('is-active');
			$("#Stream").removeClass('is-active');
			$("#Stream").attr('aria-hidden',true);
			$("#Stream").hide();
			$("a[href='#Stream']").attr('aria-expanded',false);
			$("a[href='#Stream']").attr('aria-selected',false);

			//discipline was opened
			$("#lidisc").attr('aria-expanded',false);
			$("#lidisc").attr('aria-selected',false);
			$("#lidisc").removeClass('is-active');
			$("#Discipline").removeClass('is-active');
			$("#Discipline").attr('aria-hidden',true);
			$("#Discipline").hide();
			$("a[href='#Discipline']").attr('aria-expanded',false);
			$("a[href='#Discipline']").attr('aria-selected',false);

		//mobile version show discipline
		$("#licourse").attr('aria-expanded',true);
		$("#licourse").attr('aria-selected',true);
		$("#licourse").addClass('is-active');
		$("#Programme").attr('aria-hidden',false);
		$("#Programme").show();
		$("a[href='#Programme']").attr('aria-expanded',true);
		$("a[href='#Programme']").attr('aria-selected',true);
		
		if(!$("#listream").hasClass('hide')){
			if($("#listream").hasClass('ps-text1')){
				//stream is visible
				//alert('stream is visible');
				$("#listream").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text2");
				$("#licourse").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text1");
			}
			if($("#listream").hasClass('ps-text2')){
				//stream is visible
				//alert('stream is visible');
				$("#listream").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text2");
				$("#licourse").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text1");
			}
		}
		else{
			//stream is hidden
			//alert('stream is hidden');
			$("#lidisc").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text2");
			//changed class from pas-text2 to ps-text1
			$("#licourse").removeClass("ps-text").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text1");	
		}
		
		$("#Discipline").removeClass("is-active");
		$("#Programme").removeClass("hide");
		$("#Programme").addClass("is-active");
		$("#Programme > div[class='col-md-12 ps-bar-details']").show();
	}
}

//---------------------------------------function typechanged which tells which type was selected------------

//---------------------------------------end of function typechanged which tells which type was selected-----

//---------------------------------------Bind all the parameters of search bar--------------------------------
//When type in the top searchbar is clicked
$("#litype").click(function(){
	if(!$(this).hasClass('ps-text')){
		showwhich("type");
	}
	else{
		return false;
	}
});

//When qualification in the top searchbar is clicked
$("#liqual").click(function(){
	if(!$(this).hasClass('ps-text')){
	showwhich("qual");
	}
	else{
		return false;
	}
});

//When discipline in the top searchbar is clicked
$("#lidisc").click(function(){
	if(!$(this).hasClass('ps-text')){
		showwhich("discipline");
	}
	else{
		return false;
	}
});

//When stream in the top searchbar is clicked
$("#listream").click(function(){
	if(!$(this).hasClass('ps-text')){
	showwhich("stream");
	}
	else{
		return false;
	}
});

//When course in the top searchbar is clicked
$("#licourse").click(function(){
	if(!$(this).hasClass('ps-text')){
	showwhich("course");
	}
	else{
		return false;
	}
});
//----------------------------------------End of binding of all the search bar parameters---------------------

//Bind specialisation tabs like specialisation,electives
$("#elect > ul > li > a").click(function(){
	var t=$(this).attr('data-name');
	getelectivecourses(t);
});

//---------------------------------slide function--------------------------------------------------------------
function slide(el) {
    /*if (el != undefined && el != "") {
        if (isMobile)
            $('html, body').animate({ scrollTop: $("#" + el).offset().top - ($("#header-wrap").height()) }, 800);
        else
            $('html, body').animate({ scrollTop: $("#" + el).offset().top - ($("#header-wrap").height() * 3) - ($(".label-heading").height() * 4) }, 800);
    }*/
}
//---------------------------------end of slide function-------------------------------------------------------

//-------------------------------------gettype function----------------------------------------------
function gettype(){
			
			$("#seltype").html('');

			//Load all types
			var html="";
			html+="<div>";
				html+='<input title="All" data-name="All" id="tAll" class="radio-style" name="types" value="all" type="radio">';
				html+='<label title="All" data-name="All" for="tAll" class="radio-style-2-label radio-small">All</label>';
			html+="</div>";
				
			html+="<div>";
				html+='<input title="Standard or Regular" data-name="regular" id="tregular" class="radio-style" name="types" value="regular" type="radio">';
				html+='<label title="Standard or Regular" data-name="Standard or Regular" for="tregular" class="radio-style-2-label radio-small">Standard or Regular</label>';
			html+="</div>";
			
			html+="<div>";
				html+='<input title="Hons" data-name="Hons" id="thons" class="radio-style" name="types" value="hons" type="radio">';
				html+='<label title="Hons" data-name="Hons" for="thons" class="radio-style-2-label radio-small">Hons.</label>';
			html+="</div>";
			
			html+="<div>";
				html+='<input title="Integrated" data-name="Integrated" id="tintegrated" class="radio-style" name="types" value="integrated" type="radio">';
				html+='<label title="Integrated" data-name="Integrated" for="tintegrated" class="radio-style-2-label radio-small">Integrated</label>';
			html+="</div>";
			
			html+="<div>";
				html+='<input title="Dual Degree" data-name="Dual" id="tdual" class="radio-style" name="types" value="dual" type="radio">';
				html+='<label title="Dual Degree" data-name="Dual" for="tdual" class="radio-style-2-label radio-small">Dual Degree</label>';
			html+="</div>";
			
			html+="<div>";
				html+='<input title="Lateral Entry" data-name="Lateral" id="tlateral" class="radio-style" name="types" value="lateral" type="radio">';
				html+='<label title="Lateral Entry" data-name="Lateral" for="tlateral" class="radio-style-2-label radio-small">Lateral Entry</label>';
			html+="</div>";
			
			html+="<div>";
				html+='<input title="Part Time" data-name="PartTime" id="tparttime" class="radio-style" name="types" value="parttime" type="radio">';
				html+='<label title="Part Time" data-name="PartTime" for="tparttime" class="radio-style-2-label radio-small">Part Time</label>';
			html+="</div>";
			
			$("#seltype").html(html);
			
			//Bind the event 
			$("#seltype input[type='radio']").click(function (){
				clearall('type');
				rurl.length=0;
				typeclicked();
			});		
			
			//Bind the type and call the qualification
			if(rurl.length>1){
				$("#seltype > div > input[title='"+rurl[0]+"']").prop('checked',true);
				//alert('type clicked '+rurl[0]);
				typeclicked();
			}
}
//--------------------------------------end of gettype function--------------------------------------

function typeclicked(){
	
	filter = $("#seltype > div > input[type='radio']:checked").val();
	var t=$("#seltype > div > input[type='radio']:checked").attr('id');
	//Get the text of selected type
	var typetext=$("#seltype > div > label[for='"+t+"']").text();
	//alert('typetext is '+typetext);
	$("#type > div[class='ps-content pb5']").text(typetext);
	//for mobile
	$("#litype > div[class='ps-content pb5']").text(typetext);
	
	//show tick
	$("#ticktype").removeClass('hide');
	
	if(filter!=""){
		getstanding(filter);
	}
}

function toTitleCase(str)
{
    return str.replace(/\b\w/g, function (txt) { return txt.toUpperCase(); });
}

//------------------------------------getstanding function-------------------------------------------------------
//Set the standing based on the parameter
//Replace all seltype with Qualification
function getstanding(f) {
	//alert('inside getstanding filter is '+f);
	
    if (f != undefined) {
		if(f!="")
			filter = f;
        
		$("#seltype > div > input[value='" + filter + "']").prop('checked', true);
		//$("#type .ps-content").html(toTitleCase(f));
    }
    else {
        filter = $("#seltype > div > input[type='radio']:checked").val();
    }
    if (filter != "" && filter != undefined) {
        $.get(path + "api/programsearch/GetInternationalStanding/" + filter, function (data) {

			showwhich('qual');
            //$("#standingpanel").show();
            var html = "";
            for (i = 0; i < data.length; i++) {
				html += "<div>";
				html += "<input title='" + data[i].Standing.trim() + "' id='Q"+data[i].Id+"' value='" + data[i].Id + "' class='radio-style' name='radio-qual' type='radio'>";
				html += "<label data-name='" + data[i].Id + "' for='Q"+data[i].Id+"' class='radio-style-2-label radio-small'>"+data[i].Standing.trim()+"</label>";
				html += "</div>";
			}
            $("#selstanding").html(html);
			
			//Bind the click event
			$("#selstanding input[type='radio']").click(function (){
				//alert('standing clicked');
				clearall('standing');
				rurl.length=0;
				standingclicked();
			});
			
            if (rurl.length >= 2){
				//alert('standing clicked '+rurl[1]);
				$("#selstanding > div > input[title='" + rurl[1] + "']").prop("checked", true);
                standingclicked();
			}

        });
    }//if(filter!="" && filter!=undefined)
}
//-------------------------------------end of getstanding function-----------------------------------------------

function standingclicked(){
	standing_id = $("#selstanding > div > input[type='radio']:checked").val();
	//alert('standing id is '+standing_id);
	if(standing_id!=undefined && standing_id!="")
	{
		var t=$("#selstanding > div > input[type='radio']:checked").attr('id');
		//Get the text of selected type
		var typetext=$("#selstanding > div > label[for='"+t+"']").text();
		//alert('var typetext is '+typetext);
		$("#qual > div[class='ps-content pb5']").text(typetext);
		//for mobile
		$("#liqual > div[class='ps-content pb5']").text(typetext);		
		//show tick
		$("#tickqual").removeClass('hide');
		getdiscipline(typetext, standing_id);
	}
}

//-------------------------------------get discipline function-------------------------------------------------------
//Get all the disciplines based on the qualification
function getdiscipline(value, id) {
	//alert('you called getdiscipline with value '+value+' id is '+id);
    if (id != undefined) {
        
		discipline_id=id;
		
        $.get(path + "api/programsearch/GetInternationalDiscipline/" + id + "/" + filter, function (data) {
            if (data != null) {
				showwhich("discipline");

                //console.log(data);
                var html = "<ul>";
                for (i = 0; i < data.length; i++) {
                    if (data[i].IsStream == "True") {
                        html += "<li style='cursor:pointer' title='" + data[i].Discipline.trim() + "' data-name='" + data[i].Id + "' class='col-sm-4 pa0 hastream' value='" + data[i].Id + "'>" + data[i].Discipline + "</li>";
                    }
                    else {
                        html += "<li style='cursor:pointer' title='" + data[i].Discipline.trim() + "' data-name='" + data[i].Id + "' class='col-sm-4 pa0 nostream' value='" + data[i].Id + "'>" + data[i].Discipline + "</li>";
                    }
                }
                html += "</ul>";
                $("#seldiscipline").html(html);
				
				$("#seldiscipline li").click(function (){
					clearall('discipline');
					rurl.length=0;
					disciplineclicked($(this).text());
				});
				
				if(rurl.length>=2){
					discipline_id=$("#seldiscipline > ul > li[title='"+rurl[2]+"']").attr('data-name');
					if(discipline_id!=undefined){
						//alert('discipline clicked '+rurl[2]);
						disciplineclicked(rurl[2]);
					}
				}
				
                //Slide to discipline panel
                slide('disciplinepanel');
            }
            else {
                no_stream = true;
            }
        });
    }//if(id==undefined)
    else {
        //Open the panel
        //11 may
        $('.dropdown-inner').slideToggle("slow");
        slide();
    }
}
//-------------------------------------end of discipline function----------------------------------------------------

function disciplineclicked(discname){
	//Bind discipline with hasstream class
	if($("#seldiscipline > ul > li[title='"+discname+"']").hasClass('hastream')){
		$("#disc > div[class='ps-content pb5']").text(discname);
		//for mobile
		$("#lidisc > div[class='ps-content pb5']").text(discname);
		
		discipline_id=$("#seldiscipline > ul > li[title='"+discname+"']").attr('data-name');
		//alert('calling getstream from hasstream');
		getstream();
					
		//$("#stream").removeClass('ps-text').addClass('ps-text2');
		$("#listream").removeClass('hide');
					
		//$("#course").removeClass('ps-text').addClass('ps-text2');
		$("#course").removeClass('hide');		
		
		//show tick
		$("#tickdisc").removeClass('hide');
		
	}//Bind discipline with nostream class
	else if($("#seldiscipline > ul > li[title='"+discname+"']").hasClass('nostream')){		
		$("#disc > div[class='ps-content pb5']").text(discname);
		//for mobile
		$("#lidisc > div[class='ps-content pb5']").text(discname);
		
		discipline_id=$("#seldiscipline > ul > li[title='"+discname+"']").attr('data-name');
		//alert('calling getstream from nostream');
		getprogrammelist();
					
		//$("#course").removeClass('ps-text').addClass('ps-text2');
		$("#course").removeClass('hide');
					
		$("#listream").addClass('hide');
		
		//show tick
		$("#tickdisc").removeClass('hide');
	}
}

//-------------------------------------getstream function------------------------------------------------------------
function getstream() {
	//alert('getstream called');
	//showwhich('stream');
    $.post(path + "api/programsearch/GetInternationalStream", { StandingId: standing_id, DisciplineId: discipline_id, Filter: filter }).done(function (data) {
        if (data != null) {
			
			showwhich('stream');
			
            var html = "", name = "";
            html += "<ul>";
            for (i = 0; i < data.length; i++) {
                name = data[i].Stream;
                name = name.trim();
				html+="<li style='cursor:pointer' title='" + name + "' data-name='" + data[i].Id + "' class='col-md-4 pa0'>"+ name +"</li>";
            }
            html += "</ul>";
            $("#selstream").html(html);

			//Bind the click event
			$("#selstream li").click(function (){
				clearall('stream');
				rurl.length=0;
				streamclicked($(this).text());
			});
			
            //Only bind this event when the user directly loads the page from predefined url.
            if (rurl.length >= 3) {
				stream_id=$("#selstream > ul > li[title='"+rurl[3]+"']").attr('data-name');
				if (stream_id != undefined){
					//alert('stream clicked '+rurl[3]);
					streamclicked(rurl[3]);
				}
            }
        }//if(data!=null)
    });
}
//-------------------------------------end of getstream function-----------------------------------------------------

function streamclicked(stream){
	stream_id=$("#selstream > ul > li[title='"+stream+"']").attr('data-name');
	stream=$("#selstream > ul > li[title='"+stream+"']").attr('title');
	$("#stream > div[class='ps-content pb5']").text(stream);
	//for mobile version
	$("#listream > div[class='ps-content pb5']").text(stream);
	//alert('inside streamclicked '+stream);
	getprogrammelist();
	showwhich('course');
	//show tick
	$("#tickstream").removeClass('hide');	
}

//--------------------------------------get list of programmes after the parameters are selected---------------
function getprogrammelist(){
	
			$("#section-courses").hide();
			
			if (stream_id == undefined){
				stream_id = 0;
			}
			
			//alert('now calling getprogram StandingId: '+standing_id+', DisciplineId: '+discipline_id+', StreamId: '+stream_id+', Filter: '+filter);
			$("#programs").html('');
	        $.post(path + "api/programsearch/GetInternationalProgram", { StandingId: standing_id, DisciplineId: discipline_id, StreamId: stream_id, Filter: filter }).done(
                function (data) {
                    if (data != null) {
						
						//Logic for breaking program class
						var count=data.length,cls="";
						if(count<=2)
						cls="col-md-"+12/count;
						else 
						cls="col-md-4";
						
						showwhich('course');
                        var html = "",html1="",prevparent="";
                        $.each(data, function (i, val) {
                            //html += '<li onclick="pagetab=\'Details\';selecttab(\'' + data[i].OfficialCode.trim() + '\');$(\'#ddlProgram\').html(\'' + data[i].ProgramName + '\')" data-name="' + data[i].OfficialCode.trim() + '" title="' + data[i].ProgramName.trim() + '" ' + ((i == 0) ? "class='active'" : "") + '><a href="#b" data-toggle="tab">' + data[i].ProgramName + '<br/><span class="duration">' + data[i].DegreeDuration + '</span><i class="icon-ok pull-right"></i></a></li>';
							
							if(i==0 || (prevparent!=data[i].ParentProgram.trim() && prevparent!="")){
								//&& data[i].ParentProgram.trim()!=""
								//alert('prevparent is '+prevparent+' parent program is '+data[i].ParentProgram);
								
								html += "<div class='clearfix pt10'></div>";
								
								if(i!=0)
								html += "<div style='height:10px;width: 95%;' class='divider ma10'></div>";
								
								html += "<div class='phead'>"+data[i].ParentProgram+"</div>";

								//list on the right side in the search page
								html1+='<h4 class="hidden-sm mb10 font-weight300">'+data[i].ParentProgram+'</h4>';
							}						
							prevparent=data[i].ParentProgram.trim();
							
							if(data[i].ParentProgram.trim()!="")
							{
								html += "<div class='"+cls+" pcount'>";
							}
							else
							{
								html += "<div class='"+cls+" pcount pl0'>";
							}
							
							html += "<input title='"+data[i].ProgramName.trim()+"' data-name='"+data[i].OfficialCode.trim()+"' id='r"+data[i].OfficialCode.trim()+"' class='radio-style' name='courses' type='radio'>";
							html += "<label data-name='"+data[i].ProgramName.trim()+"' for='r"+data[i].OfficialCode.trim()+"' class='radio-style-2-label radio-small'><span id='s"+data[i].OfficialCode.trim()+"'>"+data[i].ProgramName.trim()+"</span><br><span class='pduration' id='pd"+data[i].OfficialCode.trim()+"'>"+data[i].DegreeDuration+"</span></label>";
							html += "</div>";
							
							html1 += '<li><a class="plst" style="cursor:pointer" title="'+data[i].ProgramName.trim()+'" data-name="'+data[i].OfficialCode.trim()+'">'+data[i].ProgramName.trim()+'<span class="duration">Duration : '+data[i].DegreeDuration+'</span></a></li>';
                        });
                        $("#programs").html(html);
                        plist = html;
						$("#op-desktop").html(html1);
						
						$("#op-mobile").html(html1);
						$(".op-mobile").hide();

						$("#toggle_value").text($("#listream > div[class='ps-content pb5']").text());
						
						//Bind the program listStyleType
						$(".plst").click(function(){
							var p=$(this).attr('title');
							var o=$(this).attr('data-name');
							programclicked(p,o);
							clearall('course');
						});
						
						//Bind the click event
						$("#programs > div > input[type='radio']").click(function (){
							clearall('course');
							rurl.length=0;
							var p=$(this).attr('title');
							var o=$(this).attr('data-name');
							//alert('p is '+p+' o is '+o);
							
							programclicked(p,o);
						});
						
						if(rurl.length>=4){
							//alert('program clicked '+rurl[4]);
							var p=$("#programs > div > input[title='" + rurl[4] + "']").attr('title');
							var o=$("#programs > div > input[title='" + rurl[4] + "']").attr('data-name');
							$("#programs > div > input[title='" + rurl[4] + "']").prop("checked", true);
							programclicked(p,o);
						}
						
					}
				});
}
//---------------------------------end of list of programmes after the parameters are selected-----------------

function programclicked(p,o){
	programname=p;
	officialcode=o;
	pagetab="Details";
	$("#course > div[class='ps-content pb5']").text(programname);
	//for mobile version
	$("#licourse > div[class='ps-content pb5']").text(programname);
	
	//alert('before calling getresult() programname is '+programname+'  officialcode is '+officialcode);
	getresult();
	$(".op-mobile").hide();
	//show tick
	$("#tickcourse").removeClass('hide');
}

//-------------------------------------get active function-----------------------------------------------
function getactive(id, li_id) {

	showwhich('course');

    $(".disp").removeClass("active");
    $("#seldiscipline li").removeClass().addClass('col-sm-4');
    $(li_id).addClass("active");
    discipline_id = id;
    clearall('discipline');
    $("#streampanel").hide();
    $("#selecteddiscipline").html($(li_id).attr('title'));
    $("#search_button").show();

    //Slide to program panel
    getprogrammelist();

    //var h=$("#streampanel").offset().top+150-$(document).scrollTop;
    //$('html,body').animate({scrollTop:h},1000);	
}
//-------------------------------------end of get active function----------------------------------------



//-----------------------------------------getresult function to show the programme details-------------------------
//This function is invoked when we get the result in the result div
function getresult() {
	//alert('called getresult');
	$("#section-courses").show();
	$("#resultpanels .tabs-panel").removeClass("is-active");	
	$("#Programme").removeClass('is-active');
	$("#section-courses").removeClass('hide');
	
    if (!onlysearchbar) {
        if (stream_id == undefined)
            stream_id = 0;

		//alert(officialcode);
		
		$(".ps-bar-details").hide();
		if(officialcode!=undefined){
		$.post(path+"api/programsearch/GetInternationalProgram", { StandingId: standing_id, DisciplineId: discipline_id, StreamId: stream_id, Filter:filter }).done(
		//$.post(path + "api/programsearch/GetInternationalProgram", { "OfficialCode": officialcode }).done(
                function (data) {
					
                    if (data != null) {
						for(n = 0; n < data.length; n++)
						{
							if(data[n].OfficialCode.trim()==officialcode.trim()){
								var d=new Array();
								d.push(data[n]);
								data=d;
								//data = data[n];	
							}
								
						}
						if(data.length==0){
							$("#section-courses").hide();
							$("#searchresult").hide();
							return;
						}
						
						//console.log(data);
						
						$("#ps-float-apply").show();
                        //Added on 25 March 2016 to show the result panel
                        $("#section-courses").show();					
						$('.ps-slider').show(function () {
							var x=$('.standard-logo').attr('data-dark-logo');
							
							//$('#vcenter').addClass('vertical-middle');
							SEMICOLON.initialize.verticalMiddle();							
							$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '//www.lpu.in/css/ps.css') );
							$('#ps').addClass('ps');
							var pWidth = $( window ).width();
							if ( pWidth > 992 ) {	
							$('.standard-logo img').attr('src',x)
							}
						});
						
                        if (data.length == 0) {
                            $("#section-courses").hide();
                            $('.dropdown-inner').slideToggle("slow");
                            slide();
                            return false;
                        }
						
						
						
						//Bind all the details of Details Tab
                        sethtmlforprogram(data);
						
						//Bind all schemes Minor/Electives/Specialisation
						showscheme();
						
						//Scholarship tab
						isScholarship=data[0].IsScholarship50;
						getscholarship(data);
						
						//Career tab
						getsalientfeatures();

                        slide('divFind');

                        //Set the active class to year scheme
                        $("#year_scheme_button").addClass('active');

                        $("#searchresult").show();

                        geteligibility(data);
						
						$("#course-filter > li").removeClass('active');		
						
                        if(pagetab=="Details"){
							$("a[ddl='#ps-details']").parent().addClass("active");
						}
						else if(pagetab=="Fee"){
							$("a[ddl='#ps-fee']").parent().addClass("active");
						}
						else if(pagetab=="Scholarship"){
							$("a[ddl='#ps-scholarships']").parent().addClass("active");
						}
						else if(pagetab=="Features"){
							$("a[ddl='#ps-career-prospects']").parent().addClass("active");
						}
						else if(pagetab=="Apply"){
							$("a[ddl='#ps-how-to-apply']").parent().addClass("active");
						}


                        //Added on 04 April 2016
                        if (search_clicked) {
                            rurl.length = 0;
                        }

                        hideshowdetails(data);
						
						//for mobile version hide the opened panel
						$("#licourse").attr('aria-expanded',false);
						$("#licourse").attr('aria-selected',false);
						$("#licourse").removeClass('is-active');
						$("#Programme").removeClass('is-active');
						$("#Programme").attr('aria-hidden',true);
						$("#Programme").hide();
						$("a[href='#Programme']").attr('aria-expanded',false);
						$("a[href='#Programme']").attr('aria-selected',false);	
						$("#op-mobile").show();
					
						//ProcessAjax
						//ProcessAjax
						var response = {};
						var stateObj = {};
						response.pageTitle = "India's Largest Best Private University in Punjab - LPU | "+programname;
						var ma=window.document.URL;
						if(data.length>0){
							if(ma.indexOf('/international/programmes')!=-1 && data.length>0){
							
								if(data[0].ProgramUrlonWeb!=null && data[0].ProgramUrlonWeb!=undefined){
									//back slash in url
									if(ma.indexOf('www.lpu.in')!=-1 || ma.indexOf('www.lpu.in')!=-1){
										curl='/international/programmes'+data[0].ProgramUrlonWeb;
									}
									else if(ma.indexOf('172.17.60.93')!=-1){
										curl='/lpu2016/newlpu/international/programmes'+data[0].ProgramUrlonWeb;	
									}
									else if(ma.indexOf('172.17.60.100')!=-1){
										curl='/international/programmes'+data[0].ProgramUrlonWeb;	
									}
								}
							}
							else if(ma.indexOf('\international\programmes')!=-1 && data.length>0){
								if(data[0].ProgramUrlonWeb!=null && data[0].ProgramUrlonWeb!=undefined){
									//forward slash in url
									if(ma.indexOf('www.lpu.in')!=-1 || ma.indexOf('www.lpu.in')!=-1){
										curl='\international\programmes'+data[0].ProgramUrlonWeb;
									}
									else if(ma.indexOf('172.17.60.93')!=-1){
										curl='\lpu2016\newlpu\international\programmes'+data[0].ProgramUrlonWeb;	
									}
									else if(ma.indexOf('172.17.60.100')!=-1){
										curl='\international\programmes'+data[0].ProgramUrlonWeb;	
									}
								}
							}
						}
						
						/*var response = {};
						var stateObj = {};
						response.pageTitle = "India's Largest Best Private University in Punjab - LPU | "+programname;
						var ma=window.document.URL;

						if(ma.indexOf('\international\programmes')!=-1 && data.length>0){
							if(data[0].ProgramUrlonWeb!=null && data[0].ProgramUrlonWeb!=undefined){
							//back slash in url
								if(ma.indexOf('lpu.in')!=-1 || ma.indexOf('dev.lpu.in')!=-1)
									curl='/international/programmes'+data[0].ProgramUrlonWeb;
								else
									curl='/lpu2016/newlpu/international/programmes'+data[0].ProgramUrlonWeb;	
							}
						}
						else{
							if(data.length>0)
							{
								if(data[0].ProgramUrlonWeb!=null && data[0].ProgramUrlonWeb!=undefined)
								{
									//forward slash in url
									if(ma.indexOf('lpu.in')!=-1 || ma.indexOf('dev.lpu.in')!=-1)
										curl='\international\programmes'+data[0].ProgramUrlonWeb;
									else
										curl='\lpu2016\newlpu\international\programmes'+data[0].ProgramUrlonWeb;	
								}
							}
						}*/
					
						//window.location.href="#";
						//dynamic url
						processAjaxData(response, stateObj,curl);
						

                    } //if(data!=null)
                    else{
						//console.log('hiding searchresult panel');
						$("#section-courses").hide();
						$("#searchresult").hide();
					}//if(data!=null)					
                });
		}
		else{
			//console.log('hiding searchresult panel');
			$("#section-courses").hide();
            $("#searchresult").hide();
		}
    }//if(!onlysearchbar)
    else {
       
	   //call the webservice which gets the url based on the parameters officialcode
	    $.post(path + "api/programsearch/GetInternationalProgramDetail", { "OfficialCode": officialcode }).done(function (data) {
			var url = "";
			url += window.location.protocol + "//" + window.document.domain + "/international/programmes";
			url+=data[0].ProgramUrlonWeb;
			window.location.href = url;
		});
    }
}
//-------------------------------------------end of getresult function----------------------------------------------
$(".cdetail").click(function(){
	$("#course-filter > li").removeClass('active');	
	$(this).parent().addClass('active');
});
//--------------------------------------------function sethtmlforprogram-------------------------------------------
function sethtmlforprogram(data){
	if (data != null) {
        if (data.length > 0) {
            //console.log(data[0]);
			
			//Set Program Id
			program_id=data[0].ProgramId;
			
			if(data[0].MetaTitle!=null && data[0].MetaTitle!=undefined){
				//Set title
				document.title=data[0].MetaTitle;
			}			
			
			if(data[0].metadesc!=null && data[0].metadesc!=undefined){
				//Set meta description
				$("#metadesc").attr('content',data[0].metadesc);
			}
			
			//set banner heading
			$("#schoolname").text(data[0].BannerHeading);
			//console.log(data);
			
			//set tagline
			$("#schooltagline").text(data[0].tagLine);
			
            //Set Program Name
            programname = data[0].ProgramName;
			
			$("#program_interested").val(programname);
			
            //Set official code
            officialcode = data[0].OfficialCode;
            applynowlink = data[0].ApplyNow;
            $("#pname").html(programname+'<span class="duration">Duration : '+data[0].DegreeDuration);
			$("#pdesc").html(data[0].ProgramDesc);
			$("#peligibility").html(data[0].indianeligibilitycomments);
			$("#peligibilityadmission").html(data[0].admissionindian);
			
			//Set The backgroud image as per programme
			$("#slider").css('background-image',"url('"+ data[0].PageHeaderImage + "')");
			
			//Check if the acbsp logo is to be displayed
            if (data[0].IsACBSP == "True" || data[0].IsACBSP ==1) {
                $("#div_acbsp").show();
				$("#pdesc").addClass("col-md-11 pa0");
            }
            else {
                $("#div_acbsp").hide();
				$("#pdesc").removeClass("col-md-11 pa0");
            }
			
			//Curriculum Years Binding
			$("#degree_year > li").addClass('hide');
			for (i = 1; i <= data[0].DegreeYear; i++) {
				$("#year"+i+"-label").parent().removeClass('hide');
			}
			
			//Bind the event
			$("#degree_year > li > a").click(function(){
				var i=$(this).attr('data-name');
				getyearlycourses(officialcode,i);
			});
			
			//Get all the scheme for this programme
			showscheme();
			
			//Show Additional Curriculum
			//Bind the tabs of additional curriculum
			$("#select > ul > li > a").click(function(){
				var tab=$(this).attr('data-name');
				getelectivecourses(tab);
			});

			//How to apply
			if(data[0].IsApply==true || data[0].IsApply=="True"){
				$("a[ddl='#ps-how-to-apply']").removeClass("hide");
				gethowtoapply();
			}
			else{
				$("#Apply").addClass('hide');
				$("a[ddl='#ps-how-to-apply']").addClass("hide");				
			}
			
            //Check if B.Tech is the program select popup radio button as btech or others
            if (programname.indexOf('B.Tech') == -1) {
                $(".radio_others").click();
                //$(".radio_others").prop("checked", true)
            }
            else {
                $(".radio_btech").click();
                //$(".radio_btech").prop("checked", true);
            }

            //Set the default tab as Details tab
            setDefaultTab();
			changedynamicurl();

            //Set Program description
            $("#pdesc").html(data[0].ProgramDesc);

            //$("#apply_now").html("<a class='apply-button' href='"+data[0].ApplyNow+"' target='_blank'>Apply Now</a><a id='Launch' href='#LoginModal1' data-lightbox='inline' class='apply-button simple-ajax-popup'>Apply Now!</a>");
            if(data[0].OfficialCode!='P570-NN1-D' && data[0].OfficialCode!='P570-NN2-D' && data[0].OfficialCode!='P570-NN9-D' && data[0].OfficialCode!='P6F1-NM' && data[0].OfficialCode!='P6A1' && data[0].OfficialCode!='P6A1-NN1'){
	    	    //$("#pdesc").append("<div><a target='_blank' id='Launch' href='http://www.lpu.in/contact_us/contact-us.php' class='btn btn-primary'>Enquire Now!</a></div>");
			}

            //Get eligibility
            geteligibility(data);

			//Bind Fee & Scholarship Data
			programfeescholarship();
			
			//Scholarship Tab
			getscholarship(data);
			
            hideshowdetails(data);
        }//if(data.length>0)
    }//if(data!=null)
}
//-----------------------------------------end of function sethtmlforprogram---------------------------------------


//---------------------------------------function getsalientfeatures() for career prospects tab-------------------------------------------------
function getsalientfeatures() {
    var html = "";

    $("#FeaturesData").html('');
    $.get(path + "api/programsearch/GetProgramSalientFeature/" + officialcode, function (data) {
        if (data != null) {

            // New features
            html += '<div class="col-md-12 pa0 mt10">';
            for (i = 0; i < data.length; i++) {
				html += '<h4 class="mb5">' + data[i].Heading + '</h4>';
				html +=	'<ul>'+data[i].Description+'</li></ul>';
            }
            html += '</div>';

            //Setting the tab variable to Features so that the new url created can be updated
            pagetab = "Features";
            changedynamicurl();
            $("#FeaturesData").html(html);
            //getcareerprospects();
        }
    });
}
//---------------------------------------end of function getsalientfeatures()------------------------------------------------------------------

//15B-301

//-----------------------------------------get howtoapply() function-----------------------------------------------------------------
var step = 1;
function gethowtoapply() {
    $.post(path + "api/programsearch/GetInternationalHowToApply", { OfficialCode: officialcode }).done(
		function (data) {
		    if (data != null) {
				
				//$("#Apply").html("");
				
		        var h = "";
		        h += '<div id="processTabs">';

		        var cl = "";
		        if (data.length - 1 == 3)
		            cl = "col-md-4 pa0 ma0";
		        else if (data.length - 1 == 4)
		            cl = "col-md-3 pa0 ma0";
		        else if (data.length - 1 == 5)
		            cl = "col-md-2 pa0 ma0";

		        h += '<ul class="process-steps process-5 bottommargin clearfix">';
		        for (i = 0; i < data.length - 1; i++) {
		            h += '<li>';
					h += '<a href="#ptab'+(i + 1)+'" class="i-circled i-bordered i-alt divcenter"><i class="fa fa-check" aria-hidden="true"></i></a>';
					h += '<h5>Step ' + (i + 1) + '<br/>'+ data[i].StepName +'</h5>';
		            h += '</li>';
		        }
		        h += '</ul>';
				
				h+='<div class="col-md-12 pa0 text-right">';
					h += "<a id='Launchh' target='_blank' href='" + applynowlink + "' class='applynow'>Apply Now <i class='fa fa-caret-right'></i></a>";
				h+='</div>';
				
				
		        h += "<div class='apply_content'>";
				//For tab content
		        for (i = 0; i < data.length - 1; i++) {
					h += "<div id='ptab" + (i + 1) + "' aria-labelledby='ui-id-"+(i + 1)+"' class='ui-tabs-panel ui-widget-content ui-corner-bottom' role='tabpanel' aria-expanded='"+((i==0)?"true":"false")+"' aria-hidden='"+((i==0)?"false":"true")+"'>";
		            //h+='<h4>Step ' + (i + 1) + ' - '+ data[i].StepName +'</h4>';
					h += data[i].StepHtml;

					
					//h+='<div class="col-md-12 pa0 text-center">';
		            if (i == data.length - 2) {
		                //For refund case
		                h += '<div class="col-md-12 pl0 pt25">' + data[data.length - 1].StepHtml + '</div>';
		            }

		            if (i > 0)
		                h += '<a href="#" class="tab-linker fleft" rel="'+(i)+'"><i class="fa fa-caret-left" aria-hidden="true"></i> Back</a>';

		            if (i < data.length - 2)
		                h += '<a href="#" class="fright tab-linker" rel="'+(i+2)+'">Next <i class="fa fa-caret-right" aria-hidden="true"></i></a>';
					
					//h += "</div>"; //closed div for next/prev buttons
					
		            h += "</div>";//closed div for ptab
		        }
		        h += "</div>";//closing apply_content
		        h += "</div>";//closing of processtabg

				$("#Apply").html(h);		        
				initsteps();
		        //Setting the tab variable to Career so that the new url created can be updated
		        pagetab = "Apply";
				
		        changedynamicurl();

		    }
		});
}

//----------------------------------------end of function gethowtoapply() function---------------------------------------------------

function initsteps() {
    $("#processTabs").tabs({ show: { effect: "fade", duration: 400 } });
    $(".tab-linker").click(function () {
        $("#processTabs").tabs("option", "active", $(this).attr('rel') - 1);
        return false;
    });
}

function changedynamicurl(){
}

function geteligibility(data){
	    $(".eligibilityindian").html(data[0].eligibilityindian);
        $(".indianeligibilitycomments").html((data[0].indianeligibilitycomments == null || data[0].indianeligibilitycomments == "") ? "" : data[0].indianeligibilitycomments);
        $(".eligibilityinternational").html((data[0].indianeligibilitycomments == null || data[0].indianeligibilitycomments == "") ? "" : data[0].eligibilityinternational);
        $(".admissionindian").html(data[0].admissionindian);
        $(".EntranceTestName").html(data[0].EntranceTestName);
}

function setlpunestscholarship(data){
	
	//Check if 1st tab is active by default
	if((data[0].openfeetab==0 && data[0].isphase4==1) || (data[0].openfeetab==0 && data[0].isphase4==0)){
		$("#lpunestph1").addClass('is-active');
		$("#lpunestph1 > a").html(data[0].p1t);
		$("#lpunestph1 > a").attr('aria-selected',true);
	}
	else{
		$("#lpunestph1").removeClass('is-active');
		$("#lpunestph1 > a").attr('aria-selected',false);
	}
	//Check if 2nd tab is active by default
	if((data[0].openfeetab==1 && data[0].isphase4==1)){
		$("#lpunestph4").addClass('is-active');
		$("#lpunestph4 > a").html(data[0].p4t);
		$("#lpunestph4 > a").attr('aria-selected',true);
	}
	else{
		$("#lpunestph4").removeClass('is-active');
		$("#lpunestph4 > a").attr('aria-selected',false);
	}	
	//Check if 3rd tab is active by default
	if((data[0].openfeetab==2 && data[0].isphase4==1) || (data[0].openfeetab==1 && data[0].isphase4==0)){
		$("#lpunestph2").addClass('is-active');
		$("#lpunestph2 > a").html(data[0].p2t);
		$("#lpunestph2 > a").attr('aria-selected',true);
	}
	else{
		$("#lpunestph2").removeClass('is-active');
		$("#lpunestph2 > a").attr('aria-selected',false);
	}
	//Check if 4th tab is active by default 
	if((data[0].openfeetab==3 && data[0].isphase4==1) || (data[0].openfeetab==2 && data[0].isphase4==0)){
		$("#lpunestph3").addClass('is-active');
		$("#lpunestph2 > a").html(data[0].p3t);
		$("#lpunestph3 > a").attr('aria-selected',true);
	}
	else{
		$("#lpunestph3").removeClass('is-active');
		$("#lpunestph3 > a").attr('aria-selected',false);
	}

	//Tab1 
	$("#lpunestp981").html(data[0].p981);
	$("#lpunestp901").html(data[0].p901);
	$("#lpunestp801").html(data[0].p801);
	$("#lpunestp701").html(data[0].p701);
	
	//Show hide the links inside the li
	if(data[0].isphase4==1){
		$("#lpunestph4").removeClass('hide');
		$("#lpunestpanel2").removeClass('hide');

		//Tab2 
		$("#lpunestp984").html(data[0].p984);
		$("#lpunestp904").html(data[0].p904);
		$("#lpunestp804").html(data[0].p804);
		$("#lpunestp704").html(data[0].p704);
	}
	else{
		$("#lpunestph4").addClass('hide');
		$("#lpunestpanel4").addClass('hide');
	}
	
	if(data[0].isphase2==1){
		$("#lpunestph2").removeClass('hide');
		$("#lpunestpanel3").removeClass('hide');
		
		//Tab3 
		$("#lpunestp982").html(data[0].p982);
		$("#lpunestp902").html(data[0].p902);
		$("#lpunestp802").html(data[0].p802);
		$("#lpunestp702").html(data[0].p702);
	}
	else{
		$("#lpunestph2").addClass('hide');
		$("#lpunestpanel3").removeClass('hide');
	}
	
	if(data[0].isphase3==1){
		$("#lpunestph3").removeClass('hide');
		$("#lpunestpanel4").removeClass('hide');
		//Tab4
		$("#lpunestp983").html(data[0].p983);
		$("#lpunestp903").html(data[0].p903);
		$("#lpunestp803").html(data[0].p803);
		$("#lpunestp703").html(data[0].p703);
	}
	else{
		$("#lpunestph3").addClass('hide');
		$("#lpunestpanel4").removeClass('hide');
	}
}

function setqescholarship(data){
	
	$(".scholarship_qualification").html(data[0].scholarship_qualification);

	if(data[0].scholarship_qualification=="10th"){
		$(".is10th").removeClass('hide');
	}
	else{
		$(".is10th").addClass('hide');
	}
	
	//Check if 1st tab is active by default
	if((data[0].openfeetab==0 && data[0].isphase4==1) || (data[0].openfeetab==0 && data[0].isphase4==0)){
		$("#qeph1").addClass('is-active');
		$("#qeph1 > a").html(data[0].p1t);
		$("#qeph1 > a").attr('aria-selected',true);
	}
	else{
		$("#qeph1").removeClass('is-active');
		$("#qeph1 > a").attr('aria-selected',false);
	}
	//Check if 2nd tab is active by default
	if((data[0].openfeetab==1 && data[0].isphase4==1)){
		$("#qeph4").addClass('is-active');
		$("#qeph4 > a").html(data[0].p4t);
		$("#qeph4 > a").attr('aria-selected',true);
	}
	else{
		$("#qeph4").removeClass('is-active');
		$("#qeph4 > a").attr('aria-selected',false);
	}	
	//Check if 3rd tab is active by default
	if((data[0].openfeetab==2 && data[0].isphase4==1) || (data[0].openfeetab==1 && data[0].isphase4==0)){
		$("#qeph2").addClass('is-active');
		$("#qeph2 > a").html(data[0].p2t);
		$("#qeph2 > a").attr('aria-selected',true);
	}
	else{
		$("#qeph2").removeClass('is-active');
		$("#qeph2 > a").attr('aria-selected',false);
	}
	//Check if 4th tab is active by default 
	if((data[0].openfeetab==3 && data[0].isphase4==1) || (data[0].openfeetab==2 && data[0].isphase4==0)){
		$("#qeph3").addClass('is-active');
		$("#qeph2 > a").html(data[0].p3t);
		$("#qeph3 > a").attr('aria-selected',true);
	}
	else{
		$("#qeph3").removeClass('is-active');
		$("#qeph3 > a").attr('aria-selected',false);
	}

	//Tab1 
	$("#qep981").html(data[0].p981);
	$("#qep901").html(data[0].p901);
	$("#qep801").html(data[0].p801);
	$("#qep701").html(data[0].p701);
	
	//Show hide the links inside the li
	if(data[0].isphase4==1){
		$("#qeph4").removeClass('hide');
		$("#qepanel2").removeClass('hide');

		//Tab2 
		$("#qep984").html(data[0].p984);
		$("#qep904").html(data[0].p904);
		$("#qep804").html(data[0].p804);
		$("#qep704").html(data[0].p704);
	}
	else{
		$("#qeph4").addClass('hide');
		$("#qepanel4").addClass('hide');
	}
	
	if(data[0].isphase2==1){
		$("#qeph2").removeClass('hide');
		$("#qepanel3").removeClass('hide');
		
		//Tab3 
		$("#qep982").html(data[0].p982);
		$("#qep902").html(data[0].p902);
		$("#qep802").html(data[0].p802);
		$("#qep702").html(data[0].p702);
	}
	else{
		$("#qeph2").addClass('hide');
		$("#qepanel3").removeClass('hide');
	}
	
	if(data[0].isphase3==1){
		$("#qeph3").removeClass('hide');
		$("#qepanel4").removeClass('hide');
		//Tab4
		$("#qep983").html(data[0].p983);
		$("#qep903").html(data[0].p903);
		$("#qep803").html(data[0].p803);
		$("#qep703").html(data[0].p703);
	}
	else{
		$("#qeph3").addClass('hide');
		$("#qepanel4").removeClass('hide');
	}
}

function setdtestcriteriascholarship(data){
	
	//Check if 1st tab is active by default
	if((data[0].openfeetab==0 && data[0].isphase4==1) || (data[0].openfeetab==0 && data[0].isphase4==0)){
		$("#testcriteriaph1").addClass('is-active');
		$("#testcriteriaph1 > a").html(data[0].p1t);
		$("#testcriteriaph1 > a").attr('aria-selected',true);
	}
	else{
		$("#testcriteriaph1").removeClass('is-active');
		$("#testcriteriaph1 > a").attr('aria-selected',false);
	}
	//Check if 2nd tab is active by default
	if((data[0].openfeetab==1 && data[0].isphase4==1)){
		$("#testcriteriaph4").addClass('is-active');
		$("#testcriteriaph4 > a").html(data[0].p4t);
		$("#testcriteriaph4 > a").attr('aria-selected',true);
	}
	else{
		$("#testcriteriaph4").removeClass('is-active');
		$("#testcriteriaph4 > a").attr('aria-selected',false);
	}	
	//Check if 3rd tab is active by default
	if((data[0].openfeetab==2 && data[0].isphase4==1) || (data[0].openfeetab==1 && data[0].isphase4==0)){
		$("#testcriteriaph2").addClass('is-active');
		$("#testcriteriaph2 > a").html(data[0].p2t);
		$("#testcriteriaph2 > a").attr('aria-selected',true);
	}
	else{
		$("#testcriteriaph2").removeClass('is-active');
		$("#testcriteriaph2 > a").attr('aria-selected',false);
	}
	//Check if 4th tab is active by default 
	if((data[0].openfeetab==3 && data[0].isphase4==1) || (data[0].openfeetab==2 && data[0].isphase4==0)){
		$("#testcriteriaph3").addClass('is-active');
		$("#testcriteriaph2 > a").html(data[0].p3t);
		$("#testcriteriaph3 > a").attr('aria-selected',true);
	}
	else{
		$("#testcriteriaph3").removeClass('is-active');
		$("#testcriteriaph3 > a").attr('aria-selected',false);
	}

	$(".testtype").html(data[0].testtype);
	$(".above98").html(data[0].above98);
	$(".above90").html(data[0].above90);
	$(".above80").html(data[0].above80);
	$(".above70").html(data[0].above70);
	
	//Tab1 
	$("#testcriteriap981").html(data[0].p981);
	$("#testcriteriap901").html(data[0].p901);
	$("#testcriteriap801").html(data[0].p801);
	$("#testcriteriap701").html(data[0].p701);
	
	//Show hide the links inside the li
	if(data[0].isphase4==1){
		$("#testcriteriaph4").removeClass('hide');
		$("#testcriteriapanel2").removeClass('hide');

		//Tab2 
		$("#testcriteriap984").html(data[0].p984);
		$("#testcriteriap904").html(data[0].p904);
		$("#testcriteriap804").html(data[0].p804);
		$("#testcriteriap704").html(data[0].p704);
	}
	else{
		$("#testcriteriaph4").addClass('hide');
		$("#testcriteriapanel4").addClass('hide');
	}
	
	if(data[0].isphase2==1){
		$("#testcriteriaph2").removeClass('hide');
		$("#testcriteriapanel3").removeClass('hide');
		
		//Tab3 
		$("#testcriteriap982").html(data[0].p982);
		$("#testcriteriap902").html(data[0].p902);
		$("#testcriteriap802").html(data[0].p802);
		$("#testcriteriap702").html(data[0].p702);
	}
	else{
		$("#testcriteriaph2").addClass('hide');
		$("#testcriteriapanel3").removeClass('hide');
	}
	
	if(data[0].isphase3==1){
		$("#testcriteriaph3").removeClass('hide');
		$("#testcriteriapanel4").removeClass('hide');
		//Tab4
		$("#testcriteriap983").html(data[0].p983);
		$("#testcriteriap903").html(data[0].p903);
		$("#testcriteriap803").html(data[0].p803);
		$("#testcriteriap703").html(data[0].p703);
	}
	else{
		$("#testcriteriaph3").addClass('hide');
		$("#testcriteriapanel4").removeClass('hide');
	}
}

function setdmbascholarship(data){
	//Check if 1st tab is active by default
	if((data[0].openfeetab==0 && data[0].isphase4==1) || (data[0].openfeetab==0 && data[0].isphase4==0)){
		$("#mbaph1").addClass('is-active');
		$("#mbaph1 > a").html(data[0].p1t);
		$("#mbaph1 > a").attr('aria-selected',true);
	}
	else{
		$("#mbaph1").removeClass('is-active');
		$("#mbaph1 > a").attr('aria-selected',false);
	}
	//Check if 2nd tab is active by default
	if((data[0].openfeetab==1 && data[0].isphase4==1)){
		$("#mbaph4").addClass('is-active');
		$("#mbaph4 > a").html(data[0].p4t);
		$("#mbaph4 > a").attr('aria-selected',true);
	}
	else{
		$("#mbaph4").removeClass('is-active');
		$("#mbaph4 > a").attr('aria-selected',false);
	}	
	//Check if 3rd tab is active by default
	if((data[0].openfeetab==2 && data[0].isphase4==1) || (data[0].openfeetab==1 && data[0].isphase4==0)){
		$("#mbaph2").addClass('is-active');
		$("#mbaph2 > a").html(data[0].p2t);
		$("#mbaph2 > a").attr('aria-selected',true);
	}
	else{
		$("#mbaph2").removeClass('is-active');
		$("#mbaph2 > a").attr('aria-selected',false);
	}
	//Check if 4th tab is active by default 
	if((data[0].openfeetab==3 && data[0].isphase4==1) || (data[0].openfeetab==2 && data[0].isphase4==0)){
		$("#mbaph3").addClass('is-active');
		$("#mbaph2 > a").html(data[0].p3t);
		$("#mbaph3 > a").attr('aria-selected',true);
	}
	else{
		$("#mbaph3").removeClass('is-active');
		$("#mbaph3 > a").attr('aria-selected',false);
	}

	$(".TestType2").html(data[0].testtype);
	$(".mbaabove98").html(data[0].above98);
	$(".mbaabove90").html(data[0].above90);
	$(".mbaabove80").html(data[0].above80);
	$(".mbaabove70").html(data[0].above70);
	
	//Tab1 
	$("#mbap981").html(data[0].p981);
	$("#mbap901").html(data[0].p901);
	$("#mbap801").html(data[0].p801);
	$("#mbap701").html(data[0].p701);
	
	//Show hide the links inside the li
	if(data[0].isphase4==1){
		$("#mbaph4").removeClass('hide');
		$("#mbapanel2").removeClass('hide');

		//Tab2 
		$("#mbap984").html(data[0].p984);
		$("#mbap904").html(data[0].p904);
		$("#mbap804").html(data[0].p804);
		$("#mbap704").html(data[0].p704);
	}
	else{
		$("#mbaph4").addClass('hide');
		$("#mbapanel4").addClass('hide');
	}
	
	if(data[0].isphase2==1){
		$("#mbaph2").removeClass('hide');
		$("#mbapanel3").removeClass('hide');
		
		//Tab3 
		$("#mbap982").html(data[0].p982);
		$("#mbap902").html(data[0].p902);
		$("#mbap802").html(data[0].p802);
		$("#mbap702").html(data[0].p702);
	}
	else{
		$("#mbaph2").addClass('hide');
		$("#mbapanel3").removeClass('hide');
	}
	
	if(data[0].isphase3==1){
		$("#mbaph3").removeClass('hide');
		$("#mbapanel4").removeClass('hide');
		//Tab4
		$("#mbap983").html(data[0].p983);
		$("#mbap903").html(data[0].p903);
		$("#mbap803").html(data[0].p803);
		$("#mbap703").html(data[0].p703);
	}
	else{
		$("#mbaph3").addClass('hide');
		$("#mbapanel4").removeClass('hide');
	}
}

function getscholarship(data){
	var h='';
	h+='<h4>LPU SCHOLARSHIP UPTO 50%</h4>';
	h+='<p>AT LPU we understand to remain the Best University, we need to attract the Best Students around the globe. Every year top international students of highest calibre and with outstanding achievements get LPU SCHOLARSHIPS on tuition fee for complete duration of the regular programme. <br/><br/>Follow the link and know the maximum scholarship you may get: - <a target="_blank" href="http://www.lpu.in/international/scholarship.php">http://www.lpu.in/international/scholarship.php</a></p>';
	$("#scholarship_content").html(h);	
}

function hideshowdetails(data){
	//Show hide whole curriculum details
    if (data[0].Spl == 0 && data[0].Free == 0 && data[0].Hons == 0 && data[0].Minor == 0 && data[0].Core == 0) {
        $("#curr").hide();
		$("#divelectiveoff").hide();
    }
    else {
        $("#curr").show();
		$("#divelectiveoff").show();
    }

    //Show hide tabs
    if (data[0].Spl == 0 && data[0].Free == 0 && data[0].Hons == 0 && data[0].Minor == 0) {
        $("#divelectiveoff").hide();
        $("#electivebtn").hide();
    }
    else {
        $("#divelectiveoff").show();
        $("#electivebtn").show();
    }

    var e = "", t = "";
    //Buttons for Electives
    if (data[0].Spl > 0) {
        $("#spcialization_button").parent().removeClass('hide');
		$("#tab_spcialization_button").removeClass('hide');
		
        if (e == "")
            e = "li_spcialization_button";
        if (t == "")
            t = "spe";
    }
    else {
        $("#spcialization_button").parent().addClass('hide');
		$("#tab_spcialization_button").addClass('hide');
    }

    if (data[0].Hons > 0) {
		$("#honours_button").parent().removeClass('hide');
		$("#tab_honours_button").removeClass('hide');
        if (e == "")
            e = "li_honours_button";
        if (t == "")
            t = "honours";
    }
    else {
        $("#honours_button").parent().addClass('hide');
		$("#tab_honours_button").addClass('hide');
    }

    if (data[0].Minor > 0) {
		$("#minor_button").parent().removeClass('hide');
		$("#tab_minor_button").removeClass('hide');
        if (e == "")
            e = "li_minor_button";
        if (t == "")
            t = "minor";
    }
    else {
		$("#minor_button").parent().addClass('hide');
		$("#tab_minor_button").addClass('hide');
    }

    if (data[0].Free > 0) {
       $("#free_button").parent().removeClass('hide');
	   $("#tab_free_button").removeClass('hide');
        if (e == "")
            e = "li_free_button";
        if (t == "")
            t = "minor";
    }
    else {
		$("#free_button").parent().addClass('hide');
		$("#tab_free_button").addClass('hide');
    }

    $("#" + e).addClass('active');
    getelectivecourses(t);

    //Tabs
    if (data[0].Salient > 0) {
        $("#tabNav li a[href='#Features']").show();
    }
    else {
        $("#tabNav li a[href='#Features']").hide();
    }

    if (data[0].Carrer > 0) {
		//alert('career tab should be visible');
        //$("#tabNav li a[href='#Career']").show();
		$("a[ddl='#ps-career-prospects']").removeClass('hide');
		$("#ps-career-prospects").removeClass('hide');
    }
    else {
        //alert('career tab should be hidden');
		//$("#tabNav li a[href='#Career']").hide();
		$("a[ddl='#ps-career-prospects']").addClass('hide');
		$("#ps-career-prospects").addClass('hide');
    }

    //Check if the semester buttons are to be displayed?
    if (data[0].Core > 0) {
        $("#semesterbuttons").show();
        $("#schemebtn").show();
    }
    else {
        $("#semesterbuttons").hide();
        $("#schemebtn").hide();
    }

    if (data[0].Core > 0) {
        //Get Yearly courses
        //getyearlycourses(data[0].OfficialCode, 1);
        $("#semesterbuttons").show();
    }
    else {
        $("#semesterbuttons").hide();
    }

    //Hide Tab Apply
    if (data[0].IsApply == "True") {
        $("#tabNav li a[href='#Apply']").show();
        $("#apply_now").show();
    }
    else {
        $("#tabNav li a[href='#Apply']").hide();
        $("#apply_now").hide();
    }
}

function getelectivecourses(type) {

    var html = "", url = "";
    if (type == "honours") {
        //#tab_elective_2
        url = path + "api/programsearch/GetProgramHounsCourse/" + officialcode;
    }
    else if (type == "elective") {
        //#tab_elective_4
        url = path + "api/programsearch/GetProgramElectiveCourse/" + officialcode;
    }
    else if (type == "spe") {
        //#tab_elective_1
        url = path + "api/programsearch/GetProgramSpecialCourse/" + officialcode;
    }
    else if (type == "minor") {
        //#tab_elective_3
        url = path + "api/programsearch/GetProgramMinorCourse/" + officialcode;
    }
	
	if(type!="" && type!=undefined){
		$.get(url, function (data) {
			generateelectives(data, type);
		});
	}
}

function generateelectives(data, type) {
	$("#electivecourse").html("");
	$("#elect > ul > li").removeClass('is-active');
	var pid=$("#elect > ul > li > a[data-name="+type+"]").attr('href');
	$("#elect > ul > li > a[data-name="+type+"]").parent().addClass('is-active');
	
    if (data != null) {
        if (data.length > 0) {
            var h = "";
			var c="";
            var s = data[0].AreaName, n = false;
            h += '<div class="col-md-12 pa0">';
            for (i = 0; i < data.length; i++) {
                if(i==0){
					h += '<div class="col-md-12 pl0 pb20 note" id="msgtop"></div>';
					h += '<div class="col-md-6">';
					h+='<h4>'+data[i].AreaName+'</h4>';
				}
				else {
					if (data[i].AreaName != data[i - 1].AreaName) {
						h += '</div>';

						if(i==4){
							c="right";
						}else{
							if(c=="right"){
								h+='<div class="clearfix"></div>';
								c="left";
							}
							else{
								c="right";
							}
						}
						h += '<div class="col-md-6">';
						h+='<h4>'+data[i].AreaName+'</h4>';						
					}
				 }
				h += '<div class="toggle toggle-border">';
				
					h += '<div class="togglet">';
						h += '<div>' + data[i].CourseName+"</div>";
						h += '<i class="toggle-closed fa fa-chevron-down"></i>';
						h += '<i class="toggle-open fa fa-chevron-up" aria-hidden="true"></i>';
					h += '</div>';
			
					h += '<div class="togglec" style="display: none;">';
						h += data[i].CourseDesc;
					h += '</div>';
					
				h += '</div>';//end of div class="toggle"

				
                n = false;
            }

            h += '</div>';//end of div col-md-12 pa0

			$("#electivecourses .tabs-panel").removeClass('is-active');
			$(pid).html(h);
			$(pid).addClass('is-active');

            if (type == 'minor') {
                $("#msgtop").show();
                $("#msgtop").html('Note: Four Courses contributes towards a minor elective area.');
                $("#msgapply").html('Note: This is University wide exhaustive list of minors that may be offered in a particular area. The minors are subject to change from time to time.Offering of a minor elective area is subject to filling of minimum number of seats in that minor area as prescribed by the University.');
            }
            else {
                $("#msgtop").html('');
                $("#msgtop").hide();
                $("#msgapply").html('');
            }
			
			//set the toggles
			$( '#elect.mtoggle .toggle .togglet' ).click( function () {
				if ( $( this ).hasClass( 'togglet' ) ) {
					$( ".togglet" ).each( function () {
						$(this).removeClass('toggleta');
					});
					$( this ).addClass('toggleta');
					$( '.togglec' ).not( $( this ).next( '.togglec' ) ).hide();
					$(this).next('.togglec').toggle();
				}
			});
			$( '#elect.mtoggle .toggle .togglet' ).click( function () {
				$( '.togglec' ).not( $( this ).next( '.togglec' ) ).hide();
			});
			
			
        }
    }//if(data.length>0)
}

//---------------------------------------function setdefaulttab------------------------------------------------
function setDefaultTab() {
    if (rurl.length > 4) {
        $("#tabNav li a[href='#" + rurl[5] + "']").click();
        $("#tabNav li a[href='#" + rurl[5] + "']").parent().removeClass().addClass('ui-tabs-active ui-state-active');
    }
    else {
        //Set the program details tab as default tab
        $("#tabNav li a[href='#" + pagetab + "']").click();
        $("#tabNav li a[href='#" + pagetab + "']").parent().removeClass().addClass('ui-tabs-active ui-state-active');
    }
    $("#year_scheme_button").addClass('active');
    $("#elective_offered_button").removeClass('active');
    showscheme();
}
//---------------------------------------end of function setDefaultTab-----------------------------------------

//--------------------------------------function showscheme-----------------------------------------------------
function showscheme() {
    
	$("#year_scheme_button").addClass('active');
    $("#elective_offered_button").removeClass('active');
    
	//new code as on 09 April 2016
    $("#div_yearly").show();
    $("#div_scheme").show();
    getyearlycourses(officialcode, 1);
	$("#y1").addClass("is-active");
}
//--------------------------------------end of function showscheme----------------------------------------------

//--------------------------------------function getyearlycourses------------------------------------------------
function getyearlycourses(officialcode, year) {
    $.post(path + "api/programsearch/GetProgramCourseYearly", { OfficialCode: officialcode, DegreeYear: year }).done(
            function (data) {
                if (data != null) {
                    $("#msgtop").html('');
                    $("#msgapply").html('');
                    //console.log(data.length);
                    generatecourses(data, year);
                }
    });
}
//-------------------------------------end of function getyearlycourses------------------------------------------

//-----------------------------------function generatecourses----------------------------------------------------
function generatecourses(data, year) {
	
    if (data != null && data.length>0) {
        var h = "";
		var s = data[0].Semester, n = false;

        for (i = 0; i < data.length; i++) {

            if (i == 0) {
					//h += '<div id="panel'+(i+1)+'" class="tabs-panel is-active" role="tabpanel" aria-labelledby="panel1-label">';
						h += '<div class="col-md-6">';
							h += '<h4 class="mt30">' + ((data[i].Semester % 2 == 0) ? "Spring Term" : "Autumn Term")+"</h4>";
							h += '<p>' +((data[i].Semester % 2 == 0) ? "Spring Term is the second/even semester of an academic session/year." : "Autumn Term is the first/odd semester of an academic session/year.") + '</p>';
            }

            if (i > 0) {
                if (data[i].Semester != data[i - 1].Semester) {
                    h += '</div>';
                    h += '<div class="col-md-6">';
                    h += '<h4 class="mt30">' + ((data[i].Semester % 2 == 0) ? "Spring Term" : "Autumn Term")+"</h4>";
                    h += '<p>' + ((data[i].Semester % 2 == 0) ? "Spring Term is the second/even semester of an academic session/year." : "Autumn Term is the first/odd semester of an academic session/year.") + '</p>';
                    n = true;
                }
            }
		
				h += '<div class="toggle toggle-border">';
				
					h += '<div class="togglet">';
						h += '<div>' + data[i].CourseName+"</div>";
						h += '<i class="toggle-closed fa fa-chevron-down"></i>';
						h += '<i class="toggle-open fa fa-chevron-up" aria-hidden="true"></i>';
					h += '</div>';
			
					h += '<div class="togglec" style="display: none;">';
						h += data[i].CourseDesc;
					h += '</div>';
					
				h += '</div>';
			
			
            n = false;
        }

        h += '</div>';
		//h += '</div>'; //closed panel
		
		$("#corecourse .tabs-panel").removeClass('is-active');
		$("#year"+year).html(h);
		$("#year"+year).addClass('is-active');

		//set the toggles
		$( '#curr.mtoggle .toggle .togglet').click( function () {
			if ( $( this ).hasClass( 'togglet' ) ) {
				$( ".togglet" ).each( function () {
					$(this).removeClass('toggleta');
				});
				$( this ).addClass('toggleta');
				$( '.togglec' ).not( $( this ).next( '.togglec' ) ).hide();
				$(this).next('.togglec').toggle();
			}
		});
		$( '#curr.mtoggle .toggle .togglet' ).click( function () {
			$( '.togglec' ).not( $( this ).next( '.togglec' ) ).hide();
		});
		
        $("#msgapply").html('Note: The Curriculum is subject to changes and/or review as and when prescribed by the University');
    }
}
//---------------------------------end of function generatecourses-----------------------------------------------


//----------------------------------get fees and scholarship of the programme----------------------------------------------------
//Get the fee and scholarship details
function programfeescholarship() {
    $.post(path + "api/programsearch/GetProgramFeeDetail", { OfficialCode: officialcode }).done(
		function (data) {
		
			var h1='<div class="col-lg-12 col-md-12 pa0 col-sm-12" id="internationaltutionfeepanel"> \
					  <h4>Programme Fee(for International applicants Except Sri Lanka, Bhutan, Nepal and Bangladesh)<hr class="ma10 ml0 mr0"></h4> \
					  <div class="col-lg-12 col-md-12 col-sm-12 pa0  mt15 mb15 clearfix"> \
					    <div class="col-lg-6 col-md-6 col-sm-6 pa0 fees-heading"> Tuition Fee </div> \
					    <div class="col-lg-6 col-md-6 col-sm-6 pa0"><div class="col-lg-6 col-md-6 col-sm-6 pa0 pull-left"> \
					      ("internationaltutionfee") </div></div> \
					  </div> \
					</div> \
					<div class="col-lg-12 col-md-12 pa0 col-sm-12" id="internationaltutionfeeSplPanel"> \
					  <h4>Programme Fee(for International applicants from Sri Lanka, Bhutan, Nepal \
					    and Bangladesh)<hr class="ma10 ml0 mr0"></h4> \
					  <div class="col-lg-12 col-md-12 col-sm-12 pa0  mt15 mb15 clearfix"> \
					    <div class="col-lg-6 col-md-6 col-sm-6 pa0 fees-heading"> Tuition Fee </div> \
					    <div class="col-lg-6 col-md-6 col-sm-6 pa0"><div class="col-lg-6 col-md-6 col-sm-6 pa0 pull-left"> \
					      <span class="rupee">`</span>("internationalfee_Srl_npl_etc") (Per Semester) </div></div> \
					  </div> \
					</div>';

			h1=h1.replace('("internationaltutionfee")',data[0].internationaltutionfee);
			h1=h1.replace('("internationalfee_Srl_npl_etc")',data[0].internationalfee_Srl_npl_etc);

			$('#test').html(h1);
		});
}
//---------------------------------end of get fees for the programme---------------------------------------------


//----------------------------------hide or show fee data-------------------------------------------------------
//Show hide fee tabs/panes based on the dynamic conditions
function hideshowfee(data) {
	
    //Phase 1 Hide/Show
    (data[0].above95ph1 == null) ? $("#above95").hide() : $("#above95").show();
    (data[0].above90_phase1 == null) ? $("#above90").hide() : $("#above90").show();
    (data[0].above80_phase1 == null) ? $("#above80").hide() : $("#above80").show();
    (data[0].above70_phase1 == null) ? $("#above70").hide() : $("#above70").show();
    (data[0].Below70validNSTscore_phase1 == null) ? $("#below70").hide() : $("#below70").show();

    //Phase 4 Hide/Show
    (data[0].above95ph4 == null) ? $("#above95_4").hide() : $("#above95_4").show();
    (data[0].above90_phase4 == null) ? $("#above90_4").hide() : $("#above90_4").show();
    (data[0].above80_phase4 == null) ? $("#above80_4").hide() : $("#above80_4").show();
    (data[0].above70_phase4 == null) ? $("#above70_4").hide() : $("#above70_4").show();
    (data[0].Below70validNSTscore_phase4 == null) ? $("#below70_4").hide() : $("#below70_4").show();

    //Phase 2 Hide/Show
    (data[0].above95ph2 == null) ? $("#Tr9").hide() : $("#Tr9").show();
    (data[0].above90_phase2 == null) ? $("#Tr1").hide() : $("#Tr1").show();
    (data[0].above80_phase2 == null) ? $("#Tr2").hide() : $("#Tr2").show();
    (data[0].above70_phase2 == null) ? $("#Tr3").hide() : $("#Tr3").show();
    (data[0].Below70validNSTscore_phase2 == null) ? $("#Tr4").hide() : $("#Tr4").show();

    //Phase 3 Hide/Show
    (data[0].above95ph3 == null) ? $("#Tr10").hide() : $("#Tr10").show();
    (data[0].above90_phase3 == null) ? $("#Tr5").hide() : $("#Tr5").show();
    (data[0].above80_phase3 == null) ? $("#Tr6").hide() : $("#Tr6").show();
    (data[0].above70_phase3 == null) ? $("#Tr7").hide() : $("#Tr7").show();
    (data[0].Below70validNSTscore_phase3 == null) ? $("#Tr8").hide() : $("#Tr8").show();


    //Hide/Show Tab
    (data[0].isPhase2 == false) ? $("#ph2").hide() : $("#ph2").show();
    //(data[0].isPhase2==false)?$("#phase2").hide():$("#phase2").show();
    (data[0].isPhase2 == false) ? $("#Table1").hide() : $("#Table1").show();
    (data[0].IsNestTestApplicable == false) ? $("#td4").hide() : $("#td4").show();
    (data[0].IsNestTestApplicable == false) ? $("#t5").hide() : $("#t5").show();

    (data[0].isPhase3 == false) ? $("#ph3").hide() : $("#ph3").show();
    //(data[0].isPhase3==false)?$("#phase3").hide():$("#phase3").show();
    (data[0].isPhase3 == false) ? $("#Table2").hide() : $("#Table2").show();

    (data[0].indianexaminationfee == null) ? $("#indianexaminationfeepanel").hide() : $("#indianexaminationfeepanel").show();
    (data[0].internationaltutionfee == null) ? $("#internationaltutionfeepanel").hide() : $("#internationaltutionfeepanel").show();
    (data[0].internationalEDBDollar == null) ? $("#edb").hide() : $("#edb").show();
    (data[0].internationalEDBDollar == null) ? $("#edb1").hide() : $("#edb1").show();
    (data[0].internationalfee_Srl_npl_etc == null) ? $("#internationaltutionfeeSplPanel").hide() : $("#internationaltutionfeeSplPanel").show();
    (data[0].internationalEDBSPL == null) ? $("#edbspl").hide() : $("#edbspl").show();
    (data[0].internationalEDBSPL == null) ? $("#edbspl1").hide() : $("#edbspl1").show();

    (data[0].IsEntranceTestApplicable == null || data[0].IsEntranceTestApplicable == false) ? $(".EligibilityTest").hide() : $(".EligibilityTest").show();
    (data[0].Requisites == null) ? $(".Highlights").hide() : $(".Highlights").show();
    (data[0].Comment == null) ? $(".CommentPanel").hide() : $(".CommentPanel").show();

    //Eligibility Indian
    (data[0].eligibilityindian == null) ? $(".eligibilityindian").hide() : $(".eligibilityindian").show();
    (data[0].isACBSP == true) ? $("#lblEligibilityIndian").addClass('eligibility-content') : "";
    (data[0].eligibilityindian == null || data[0].eligibilityindian == "") ? $(".indianeligibilitycomments").hide() : $(".indianeligibilitycomments").show();
    (data[0].eligibilityinternational == null || data[0].eligibilityinternational == "") ? $(".eligibilityinternational").hide() : $(".eligibilityinternational").show();

    //Hide Show EDB Text
    if (data[0].IsEDB == true) {
        $("#EdbText").html(data[0].EDBText);
        $("#EdbText").show();
    }
    else {
        $("#EdbText").html('');
        $("#EdbText").hide();
    }

    //as emailed on 17 july 2017, edb details should be hidden
    $("#EdbText").hide();

    //Hide Show Phase Table
    if (data[0].indiantutionfee_Phase1 == null) {
        $("#scholarship").css("display", "none");
        $("#tutionfee_phase1").html('As per Association');
    }
    else {
        $("#scholarship").css("display", "block");
        $("#tutionfee_phase1").show();
    }

    if (data[0].indiantutionfee_Phase2 == null) {
        $("#Table1").css("display", "none");
        $("#tutionfee_phase2").html('As per Association');
    }
    else {
        $("#Table1").css("display", "block");
        $("#tutionfee_phase2").show();
    }

    if (data[0].indiantutionfee_Phase3 == null) {
        $("#Table2").css("display", "none");
        $("#tutionfee_phase3").html('As per Association');
    }
    else {
        $("#Table2").css("display", "block");
        $("#tutionfee_phase3").show();
    }

    if (data[0].indiantutionfee_Phase4 == null) {
        $("#scholarship_4").css("display", "none");
        $("#tutionfee_phase4").html('As per Association');
    }
    else {
        $("#scholarship_4").css("display", "block");
        $("#tutionfee_phase4").show();
    }

    if (data[0].isScholarship == false || data[0].isScholarship == 0 || data[0].isScholarship == "False") {
        $("#scholarship").css("display", "none");
		$(".notefee").css("display","none");
        $("#Fees").append("(per semester)");
    }
    else {
        $("#scholarship").css("display", "block");
		
		if(programname.indexOf("Ph.D.")!=-1 || programname.indexOf("M.Phil.")!=-1){
		$(".notefee").css("display","none");
		}
		else{
		$(".notefee").css("display","block");
		}
    }

    //Set the default phase tab
    $("#FeeTab li").removeClass();
    
    if (data[0].isPhase4) {
        if (data[0].OpenFEETab == "1") {
            $("#ph4").addClass("active");
            $("#phase4").addClass("in active");
            hidetab('phase4');
        }
        else {
            $("#ph" + parseInt((data[0].OpenFEETab))).addClass("active");
            $("#phase" + parseInt((data[0].OpenFEETab))).addClass("in active");
            hidetab('phase' + parseInt((data[0].OpenFEETab)));
        }
    }
    else {
        $("#ph" + parseInt((data[0].OpenFEETab) + 1)).addClass("active");
        $("#phase" + parseInt((data[0].OpenFEETab) + 1)).addClass("in active");
        hidetab('phase' + parseInt((data[0].OpenFEETab) + 1));
    }
}
//-------------------------------------end of hide or show fee data---------------------------------------------

//-------------------------------------Hidetab(Can be discarded, no use)------------------------------------------------------------------
function hidetab(el) {
    $("#phase1").addClass("hide");
    $("#phase2").addClass("hide");
    $("#phase3").addClass("hide");
    $("#phase4").addClass("hide");
    $("#phase5").addClass("hide");
    $("#" + el).removeClass("hide");
}
//-------------------------------------end of HideTab-----------------------------------------------------------


//-----------------------------------------clearall function to clear -------------------------------------------
function clearall(sel) {

    if (sel == "standing") {	
        discipline_id = 0;
		$("a[id='lidisc'] > div[class='ps-content pb5']").html('Select Discipline');
        $("#disc > div[class='ps-content pb5']").html('Select Discipline');
		$("#seldiscipline").html('');
		//$("#disc").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text");

        stream_id = 0;
        $("a[id='listream'] > div[class='ps-content pb5']").html('Select Stream');
		$("#stream > div[class='ps-content pb5']").html('Select Stream');
        $('#selectedstreams').html('');
		//$("#stream").removeClass("ps-text1").removeClass("ps-text2").addClass("ps-text");

		officialcode="";
		programme="";
		program_id=0;
		$("a[id='licourse'] > div[class='ps-content pb5']").html('Select Course');
		$("#course > div[class='ps-content pb5']").html('Select Course');
		$("#programs").html('');
		
		$("#lidisc").removeClass('ps-text').removeClass('ps-text2').addClass('ps-text1');
		$("#listream").removeClass('ps-text1').removeClass('ps-text2').addClass('ps-text');
		$("#licourse").removeClass('ps-text1').removeClass('ps-text2').addClass('ps-text');
		
		//hide tick
		$("#tickqual").addClass('hide');
		$("#tickdisc").addClass('hide');
		$("#tickstream").addClass('hide');
		$("#tickcourse").addClass('hide');
    }
    else if (sel == "type") {
        standing_id = 0;
        $("#selstanding").html('');
		$("a[id='liqual'] > div[class='ps-content pb5']").html('Select Qualification');
        $("#qual > div[class='ps-content']").html('Select Qualification');

        discipline_id = 0;
        $("#seldiscipline").html('');
		$("a[id='lidisc'] > div[class='ps-content pb5']").html('Select Discipline');
        $("#disc > div[class='ps-content']").html('Select Discipline');
        $("#disciplinepanel").hide();
		
        stream_id = 0;
		$("a[id='listream'] > div[class='ps-content pb5']").html('Select Stream');
        $("#stream > div[class='ps-content pb5']").html('Select Stream');
        $('#selectedstreams').html('');
		
		officialcode="";
		programme="";
		program_id=0;
		$("a[id='licourse'] > div[class='ps-content pb5']").html('Select Course');
		$("#course > div[class='ps-content pb5']").html('Select Course');
		$("#programs").html('');

		$("#liqual").removeClass('ps-text').removeClass('ps-text2').addClass('ps-text1');
		$("#lidisc").removeClass('ps-text1').removeClass('ps-text2').addClass('ps-text');
		$("#listream").removeClass('ps-text1').removeClass('ps-text2').addClass('ps-text');
		$("#licourse").removeClass('ps-text1').removeClass('ps-text2').addClass('ps-text');
		
		//hide tick
		$("#ticktype").addClass('hide');
		$("#tickqual").addClass('hide');
		$("#tickdisc").addClass('hide');
		$("#tickstream").addClass('hide');
		$("#tickcourse").addClass('hide');
		
    }
    else if (sel == "discipline") {
        //Clear streams
        stream_id = 0;
		$("a[id='listream'] > div[class='ps-content pb5']").html('Select Stream');
        $("#stream > div[class='ps-content pb5']").html('Select Stream');
        $('#selectedstreams').html('');
		
		program_id=0;
		$("a[id='licourse'] > div[class='ps-content pb5']").html('Select Course');
		$("#course > div[class='ps-content pb5']").html('Select Course');
		$("#programs").html('');
		
		$("#listream").removeClass('ps-text').removeClass('ps-text2').addClass('ps-text1');
		$("#licourse").removeClass('ps-text1').removeClass('ps-text2').addClass('ps-text');
		
		//hide tick
		$("#tickdisc").addClass('hide');
		$("#tickstream").addClass('hide');
		$("#tickcourse").addClass('hide');
		
    }
    else if (sel == "stream") {
		program_id=0;
		$("a[id='licourse'] > div[class='ps-content pb5']").html('Select Course');
		$("#course > div[class='ps-content pb5']").html('Select Course');
		$("#programs").html('');
		$("#licourse").removeClass('ps-text').removeClass('ps-text2').addClass('ps-text1');
		//hide tick
		$("#tickstream").addClass('hide');
		$("#tickcourse").addClass('hide');
    }
	else if(sel=="course"){
		//$("#programs").html('');
	}
    else if (sel == undefined || sel == "") {
        //Clear all
        standing_id = 0;
        discipline_id = 0;
        stream_id = 0;
        $('#selectedstreams').html('');
        $('#searchresult').hide();
    }
}
//--------------------------------------end of clearall function to clear----------------------------------------

function processAjaxData(response, stateObj, urlPath) {
    //document.title = response.pageTitle;
    if (urlPath!="" && urlPath!=undefined) {
       window.history.pushState(null, response.pageTitle, curl);
    }
}

//--------------------------------Document Ready Function-----------------------------------------------------
$(document).ready(function () {
    $('.dropdown-show').click(function () {
        $('.dropdown-inner').slideToggle("fast");
    });	
	//Added this line on 05 May 2017
	mobileResponsive();
	gettype();
	spliturl();
});

$(window).resize(function () {
    mobileResponsive();
});

function mobileResponsive() {
    var width = $(window).width();
    var height = $(window).height();
    if (width <= 768) {
		isMobile=true;
	}
	else{
		isMobile=false;
	}
}

//Search By Text Functionality
$('#exampleInputAmount').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        event.preventDefault();
        SearchByText();
    }
});

//-------------------------------------For Text Search--------------------------------------------------------
function SearchByText() {
    var key = $("#exampleInputAmount").val();
    if (key.trim() != "") {
        //alert('called by SearchByText()');
        $("#SearchTextResultArea").removeClass("hidden");
        $("#SearchingFor").html(" for <b>" + key + "</b> ");
        $.post(path + "api/programsearch/SearchByKeyword", { Key: key, IsInternational:true }).done(
            function (data) {
                if (data.length == 0) {
                    $("#SearchResultText").html("<h2 class='text-center'>Sorry! No Result Found</h2>");
                    return;
                }

                var count = data.length, cls = "", html = "", prevparent = "";
                if (count <= 2)
                    cls = "col-md-" + 12 / count;
                else
                    cls = "col-md-6";

                $.each(data, function (i, val) {
                    if (i == 0 || (prevparent != data[i].Qualification.trim() && prevparent != "")) {
                        html += "<div class='clearfix pt10'></div>";

                        if (i != 0)
                            html += "<div style='height:10px;width: 95%;' class='divider ma10'></div>";

                        html += "<div class='phead'>After " + data[i].Qualification + "</div>";
                    }

                    prevparent = data[i].Qualification.trim();

                    if (data[i].Qualification.trim() != "") {
                        html += "<div class='" + cls + " pcount'>";
                    }
                    else {
                        html += "<div class='" + cls + " pcount pl0'>";
                    }

                    html += "<input data-value='" + data[i].ProgramUrlonWeb.trim() + "' title='" + data[i].ProgramName.trim() + "' data-name='" + data[i].OfficialCode.trim() + "' id='r" + data[i].OfficialCode.trim() + "' class='radio-style' name='courses' type='radio'>";

                    html += "<label data-name='" + data[i].ProgramName.trim() + "' for='r" + data[i].OfficialCode.trim() + "' class='radio-style-2-label radio-small'><span id='s" + data[i].OfficialCode.trim() + "'>" + data[i].ProgramName.trim() + "</span><br><span class='pduration' id='pd" + data[i].OfficialCode.trim() + "'>" + data[i].Duration + "</span></label>";

                    html += "</div>";

                });
                $("#SearchResultText").html(html);

                /*$('#SearchResultText label span').wrapInTag({
                    tag: 'span',
                    words: ['Dual Degree', 'Integrated', 'Dual Programme']
                });*/

                //Bind the click event
                $("#SearchResultText .pcount").click(function () {
                    var el = $(this).children("input");
                    clearall('course');
                    rurl.length = 0;
                    var p = $(el).attr('title');
                    var o = $(el).attr('data-name');
                    var u = $(el).attr('data-value');

                    $.get(path + "api/programsearch/GetPerameterfromInternationalUrl?url=" + u).done(
                    function (data) {
                        if (data != null && data.length > 0) {

                            //Get the data form webservice
                            filter = "All";//This is not coming from webservice
                            officialcode = data[0].OfficialCode;
                            programname = data[0].ProgramName.trim();
                            program_id = data[0].ProgramId;
                            standing_id = data[0].StandingId;
                            qualname = data[0].Qualification;
                            discipline_id = data[0].DisciplineId;
                            discname = data[0].Discipline;
                            stream_id = data[0].StreamId;
                            streamname = data[0].Stream;

                            //generate the rurl array from the above parameters
                            rurl[0] = filter;
                            rurl[1] = qualname.trim();
                            rurl[2] = discname.trim();
                            if (streamname != "" && streamname != null)
                                rurl[3] = streamname.trim();
                            rurl[4] = programname.trim();
                            rurl[5] = "Details";

                            pagetab = "Details";
                            //console.log('calling getresult for officialcode '+officialcode+' based on details '+rurl);

                            //Bind the search bar based on the parameters
                            //Bind type
                            $("#seltype input[title='" + filter + "']").prop('checked', true);
                            typeclicked();
                            $("#selstanding > div > input[title='" + qualname + "']").prop('checked', true);
                            if (streamname != "") {
                                $("#stream > div[class='ps-content pb5']").text(streamname);
                            }
                            //alert('invoking getresult from 3805');
                            getresult();

                            $("#fpnew li:nth-child(1)").addClass("is-active");
                            $("#fp-btn1").addClass("is-active");
                            $("#fp-btn1").css('display', 'block');
                            $("#fp-btn1").removeAttr('aria-hidden');

                            $("#fpnew li:nth-child(2)").removeClass("is-active");
                            $("#fp-btn2").removeClass("is-active");
                            $("#fp-btn2").css('display', 'none');
                            $("#fp-btn2").attr('aria-hidden', true);

                            $("#SearchTextResultArea").addClass("hidden");
                            $("#SearchResultText").html("");
                            $("#exampleInputAmount").val("");
                            $("#SearchingFor").html("");
                        }
                    });
                });
            });
    }
}
//-----------------------------------End of function for Text Search------------------------------------------

//---------------------------------End Of Document Ready Function---------------------------------------------

/*---------------------------------End of Define Web Service Path and Local Variables-------------------------*/

/*---------------------------------Finished Programme Search 2017-18--------------------------------------------*/