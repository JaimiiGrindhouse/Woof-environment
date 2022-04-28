


var area = '';
var filtered = [];
var park = ''


function areaClick(areaSelection){
    document.getElementById("AreaMenu").innerHTML = areaSelection;
    var areaSelected = areaSelection;
    area = areaSelected
}

function filterParks(parkObject){
    var filteredParks = [];
    for(let i=0; i<parkObject.length; i++){
        if(parkObject[i].area_name == area){
            filteredParks.push(parkObject[i].park_name)
        }
    }
    console.log(filtered)
    filtered = filteredParks
    createDropdown('Create dropdown called');
    return filteredParks
}

function createDropdown(message){
    console.log(message)
    let dropdown = '<select id="ParkSelection" class="form-control field_choice">'
   
    for(let i=0; i<filtered.length; i++){
        dropdown += '<option value="'+ filtered[i] + '">'+ filtered[i] + '</option>'
    }
    dropdown += '</select>'
    document.getElementById("test").innerHTML = dropdown;
    $(document).ready(function(){
        $(".field_choice").on("change",function(){
            console.log($(this).val());
        });
    });
    console.log(dropdown)
}


function parkselected(selection){
    console.log("You've selected " + selection)
}






















