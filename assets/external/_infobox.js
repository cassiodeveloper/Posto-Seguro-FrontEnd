function drawInfobox(category, infoboxContent, json, i){

    if(json[i].Bandeira)           { var Bandeira = json[i].Bandeira }
        else                        { Bandeira = '' }
    if( json[i].Penalidades )         { var qtdPenalidades = '<div class="price">' + json[i].Penalidades.length +  '</div>' }
        else                        { qtdPenalidades = '' }
    if(json[i].Id)              { var id = json[i].Id }
        else                        { id = '' }
    if(json[i].Nome)            { var Nome = json[i].Nome }
        else                        { Nome = '' }
    if(json[i].gallery && json[i].gallery[0])     { var gallery = json[i].gallery[0] }
        else                        { json[i].gallery = 'assets/img/default-item.jpg'; gallery = 'assets/img/default-item.jpg'; }

    var ibContent = '';
    
    ibContent =
    '<div class="infobox">' +
        '<div class="inner">' +
            '<div class="image">' +
                '<a href="#" class="description quick-view" data-toggle="modal" data-target="#modal" entityid="' + json[i].Id + '">' +
                    '<div class="meta">' +
                        qtdPenalidades +
                        '<h2>' + Nome +  '</h2>' +
                        '<figure>' + Bandeira +  '</figure>' +
                        '<i class="fa fa-angle-right"></i>' +
                    '</div>' +
                '</a>' +
            '</div>' +
        '</div>' +
    '</div>';

    return ibContent;
}