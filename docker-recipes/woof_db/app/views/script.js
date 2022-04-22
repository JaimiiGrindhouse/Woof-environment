
var area = '';
var filtered;

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
    filtered = filteredParks;
    console.log(filtered)
}










