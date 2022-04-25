
var area = '';
var filtered;

function areaClick(areaSelection){
    document.getElementById("AreaMenu").innerHTML = areaSelection;
    var areaSelected = areaSelection;
    area = areaSelected
}

function filterParks(parkObject){
    var filteredParks = [];
    var dropdownList = '<ul>'
    for(let i=0; i<parkObject.length; i++){
        if(parkObject[i].area_name == area){
            filteredParks.push(parkObject[i].park_name)
        }
    }
    for(let i=0; i<filteredParks.length; i++){
        dropdownList +='<li>' + filteredParks[i] + '</li>'
    }
    dropdownList += '</ul>'
    console.log(dropdownList)
    document.getElementById("test").innerHTML = dropdownList;
}













